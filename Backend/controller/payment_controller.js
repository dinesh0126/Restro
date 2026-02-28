import Razorpay from "razorpay";
import ApiError from "../utils/ApiError.js";
import paymentmodel from "../models/payment.model.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import crypto from "crypto";

const getErrorMessage = (error, fallback) => {
  return (
    error?.error?.description ||
    error?.message ||
    error?.description ||
    fallback
  );
};

const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_ID?.trim();
  const keySecret = process.env.RAZORPAY_SECREAT?.trim();

  if (!keyId || !keySecret) {
    throw new ApiError(500, "Razorpay credentials are not configured");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

export const createorder = async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized user");
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      throw new ApiError(400, "Valid amount is required");
    }

    const localOrderId = orderId || `ORDER_${Date.now()}`;
    const options = {
      amount: Math.round(numericAmount * 100),
      currency: "INR",
      receipt: `receipt_${localOrderId}`.slice(0, 40),
    };

    const razorpayInstance = getRazorpayInstance();
    const order = await razorpayInstance.orders.create(options);
    const payment = await paymentmodel.create({
      userId,
      orderId: localOrderId,
      razorpay_orderId: order.id,
      amount: numericAmount,
      status: "created",
    });

    res.status(201).json({
      success: true,
      message: "Order Created successfully",
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment._id,
      key: process.env.RAZORPAY_ID?.trim(),
    });
  } catch (error) {
    const message = error?.statusCode === 401
      ? "Razorpay authentication failed. Check RAZORPAY_ID and RAZORPAY_SECREAT in Backend/.env"
      : getErrorMessage(error, "Unable to create payment order");
    console.error("Error while creating order:", error);
    res.status(error?.statusCode || 500).json({ success: false, message });
  }
};

export const verifypayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
    } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required Razorpay fields" });
    }
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECREAT)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      let paymentverify = null;
      if (paymentId) {
        paymentverify = await paymentmodel.findById(paymentId);
      }
      if (!paymentverify) {
        paymentverify = await paymentmodel.findOne({ razorpay_orderId: razorpay_order_id });
      }
      if (!paymentverify) {
        throw new ApiError(404, "Payment record not found");
      }
      if (paymentverify.status === "paid") {
        return res.status(200).json({ success: true, message: "Payment already verified" });
      }

      paymentverify.razorpay_paymentId = razorpay_payment_id;
      paymentverify.razorpay_signature = razorpay_signature;
      paymentverify.status = "paid";
      await paymentverify.save();

      const user = await User.findById(req.user._id).populate("cart.food");
      if (!user) {
        throw new ApiError(404, "User not found");
      }
      if (!user.cart?.length) {
        throw new ApiError(400, "Cart is empty");
      }

      const orderItems = user.cart.map((item) => ({
        food: item.food?._id || item.food,
        quantity: item.quantity,
        option: item.options || "",
      }));
      const totalPrice = user.cart.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

      await Order.create({
        user: req.user._id,
        items: orderItems,
        totalPrice,
        status: "confirmed",
      });

      user.cart = [];
      await user.save();

      return res
        .status(200)
        .json({ success: true, message: "Pyment verify successfully" });
    } else {
      if (paymentId) {
        await paymentmodel.findByIdAndUpdate(paymentId, {
          status: "failed",
        });
      } else {
        await paymentmodel.findOneAndUpdate(
          { razorpay_orderId: razorpay_order_id },
          { status: "failed" }
        );
      }
      return res
        .status(500)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    const message = getErrorMessage(error, "Unable to verify payment");
    console.error("Error while verifying order:", error);
    res.status(error?.statusCode || 500).json({ success: false, message });
  }
};
