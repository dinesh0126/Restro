
import orderModel from "../models/order.model.js";
import ApiError from "../utils/ApiError.js";
import paymentmodel from '../models/payment.model.js'
export const allorders = async(req,res,next)=>{
    try {
        const order = await orderModel.find()  // populate user info
            .populate({
                path: "items.food", // populate food inside items array
                model: "FoodItem"
            }); // todo we populate the data 
        
         res.status(200).json({success:true,message:"Fetch order successfully",data:order})
    } catch (error) {
        next(error)
    }
}

export const updatorderstatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 
    
    const validateStatus = ["pending", "confirmed", "delivered", "canceled"];
    if (!validateStatus.includes(status.toLowerCase())) {
      throw new ApiError(400, "Invalid status value");
    }

    const order = await orderModel.findById(id);
    if (!order) {
      throw new ApiError(400, "Order not found");
    }

    order.status = status.toLowerCase();
    await order.save();

    res.status(200).json({ success: true, message: 'Order status updated successfully', data: order });
  } catch (error) {
    next(error);
  }
};

// fetch payment api
export const fetchpaymentstatus = async(req,res,next)=>{
   try {
     const paymentdata = await paymentmodel.find().populate("userId", "name email").sort({ createdAt: -1 })
    res.status(200).json({success:true,message:'Fetch order successfully',data:paymentdata})
   } catch (error) {
     next(error)
   }
 
}
