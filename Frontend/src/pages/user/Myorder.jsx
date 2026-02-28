import React, { useEffect, useState } from "react";
import { getcartapi, removecartApi, createorderApi, verifypaymentApi } from "../../api/productapi";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";

const MyOrder = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const result = await getcartapi();
        setCartItems(result?.data?.cart || []);
      } catch (error) {
        console.log("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const removeItem = async (id) => {
    try {
      await removecartApi(id);
      setCartItems((prev) => prev.filter((elem) => elem._id !== id));
      toast.success("Item removed successfully");
    } catch (error) {
      console.log("Error while removing cart", error);
      toast.error("Failed to remove item");
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0);

  const handleCheckout = async () => {
    try {
      if (cartItems.length === 0) {
        toast.error("Cart is empty");
        return;
      }

      const result = await createorderApi({
        amount: totalPrice,
        orderId: `ORDER_${Date.now()}`,
      });

      if (!result?.orderId) {
        toast.error("Failed to create order");
        return;
      }

      if (!window.Razorpay) {
        toast.error("Payment SDK failed to load. Refresh and try again.");
        return;
      }

      const options = {
        key: result.key,
        amount: result.amount,
        currency: result.currency,
        name: "Restro",
        description: "Food order payment",
        order_id: result.orderId,
        // Disable card flow to avoid international-card restriction errors.
        method: {
          card: false,
          upi: true,
          netbanking: true,
          wallet: true,
          emi: false,
          paylater: false,
        },
        handler: async (response) => {
          try {
            const verify = await verifypaymentApi({
              paymentId: result.paymentId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verify?.success) {
              toast.success("Payment successful");
              setCartItems([]);
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.log("Error verifying payment:", error);
            toast.error("Payment verification failed");
          }
        },
        theme: {
          color: "#0f766e",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on("payment.failed", (response) => {
        const razorpayError = response?.error || {};
        const isInternationalBlocked =
          razorpayError?.reason === "international_transaction_not_allowed";
        const message =
          isInternationalBlocked
            ? "Cards are disabled for this merchant in test mode. Please use UPI or netbanking."
            :
          razorpayError.description ||
          razorpayError.reason ||
          "Payment failed";
        toast.error(message);
        console.error("Payment error details:", {
          code: razorpayError.code,
          description: razorpayError.description,
          source: razorpayError.source,
          step: razorpayError.step,
          reason: razorpayError.reason,
          metadata: razorpayError.metadata,
        });
      });
    } catch (error) {
      console.log("Error in Razorpay checkout:", error);
      toast.error(error?.response?.data?.message || "Something went wrong during checkout");
    }
  };

  if (loading) return <p className="text-white text-center mt-12">Loading Cart...</p>;

  return (
    <div className="bg-gray-900 min-h-screen px-4 sm:px-6 md:px-12 py-8 text-white">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 text-orange-400 text-center md:text-left">
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-lg md:text-xl text-gray-300 mt-10">Your cart is empty!</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center sm:items-start justify-between p-4 sm:p-6 bg-gray-800 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform gap-4 w-full"
              >
                <img
                  src={item.food.image}
                  alt={item.food.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded-xl flex-shrink-0"
                />

                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full text-center sm:text-left">
                  <div className="flex-1 flex flex-col gap-1">
                    <h2 className="text-lg sm:text-2xl font-semibold text-white">{item.food.name}</h2>
                    <p className="text-gray-300 text-sm sm:text-base">Option: {item.options}</p>
                    <p className="text-gray-300 text-sm sm:text-base">Quantity: {item.quantity}</p>
                    <p className="text-green-400 font-bold text-lg sm:text-2xl mt-2">Rs {item.totalPrice}</p>
                  </div>

                  <div className="flex-shrink-0 w-full sm:w-auto mt-3 sm:mt-0 flex justify-center sm:justify-end">
                    <button
                      className="flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-red-600 text-sm sm:text-base rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto"
                      onClick={() => removeItem(item._id)}
                    >
                      <FaTrash /> <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 bg-gray-800 rounded-2xl shadow-lg gap-4">
            <p className="text-xl sm:text-2xl font-bold text-white text-center sm:text-left">
              Total: <span className="text-green-400">Rs {totalPrice}</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyOrder;
