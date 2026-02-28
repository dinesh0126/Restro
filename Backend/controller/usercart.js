import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import FoodItem from "../models/fooditem.model.js";


export const getcart = async(req,res,next)=>{
  try {
      const userId = req.user._id;
     const cartitem = await User.findById(userId).populate({path:'cart.food',select:'name price image'}).select("-password")
     if(!cartitem){
      throw new ApiError(404,"user not found")
     }
     res.status(200).json({success:true,message:"Fetching the cart item successfully",data:cartitem})
  } catch (error) {
    next(error)
  }
}

export const removecart = async(req,res,next)=>{
  try {
    const { cartItemId } = req.params;
    
    if(!cartItemId){
      throw new ApiError(400,"item id is required")
    }
    const userId = req.user._id;
    const user = await User.findById(userId)
    
    if(!user){
      throw new ApiError(400,"User not found")
    }
    const item = user.cart.id(cartItemId)
    
     if (!item) throw new ApiError(404, "Cart item not found");
     

      const initialLength = user.cart.length;
      user.cart = user.cart.filter(item => item._id.toString() !== cartItemId);

      if (user.cart.length === initialLength) {
      throw new ApiError(404, "Cart item not found");
    }

     await user.save()
     res.status(200).json({success:true,message:'item delete successfully'})
  } catch (error) {
     next(error)
  }
 

}

export const clearCart = async(req,res,next)=>{
  try {
     const userId = req.user._id;
     const user = await User.findById(userId)
     if(!user){
      throw new ApiError(400,"User is not found")
     }
      user.cart = []
      user.save()
      res.status(200).json({success:true,message:'Clear cart successfully'})
  } catch (error) {
    next(error)
  }
}

export const addcart = async (req, res, next) => {
  try {
    const { foodId, quantity } = req.body; 
    console.log("Food ID:", foodId, "Quantity:", quantity);

    const userId = req.user;

    // Validate input
    if (!foodId || quantity == null) {
      throw new ApiError(400, "All fields are required");
    }

    // Find the user
    const user = await User.findById(userId).populate("cart.food");
    if (!user) throw new ApiError(404, "User not found");

    // Find the food item
    const food = await FoodItem.findById(foodId);
    if (!food) throw new ApiError(404, "Food item does not exist");

    const itemPrice = food.price;
    if (typeof itemPrice !== "number") {
      throw new ApiError(400, "Price not available for this item");
    }

    // Check if item already exists in cart
    const existingItem = user.cart.find(
      (item) => item.food._id.toString() === foodId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += Number(quantity);

      // Prevent negative quantity
      if (existingItem.quantity < 0) existingItem.quantity = 0;

      existingItem.totalPrice = itemPrice * existingItem.quantity;
    } else {
      // Add new item only if quantity > 0
      if (quantity > 0) {
        user.cart.push({
          food: foodId,
          quantity,
          totalPrice: itemPrice * quantity
        });
      }
    }

    // Save the cart
    await user.save();

    res.status(200).json(user.cart);

  } catch (error) {
    next(error);
  }
};

export const userprofile = async(req,res)=>{
  try {
     const user = await User.findById(req.user.id).select("-password")
     if(!user){
       throw new ApiError(404,"User not found")
     }
     else{
      res.status(200).json({success:true,message:"User data fetch successfully",data:user})
     }
  } catch (error) {
    console.log('Error while fetching the user info',error)
  }
}
