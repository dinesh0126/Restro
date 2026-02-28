import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import user from "../models/user.model.js";

export const authmiddleware = async(req,res,next)=>{
   try {
    const authHeader = req.headers.authorization || req.headers.Authorization
    const tokenFromHeader = typeof authHeader === "string"
      ? authHeader.replace(/^Bearer\s+/i, "").trim()
      : null
    const token = req.cookies?.accessToken || tokenFromHeader

    if(!token){
        throw new ApiError(401,"Unauthorize : No token provided")
    }
    const decode = jwt.verify(token,process.env.ACCESS_TOKEN_KEY)

    const myuser = await user.findById(decode._id).select("-password")
    if(!myuser){
        throw new ApiError(401,"Unauthorize Invalid token")
    }
    req.user = myuser
    next()
   } catch (error) {
      next(error)
   }
}

export const authroizeRole = (allowedroles)=>{
    try {
        return (req,res,next)=>{
            const user = req.user;
            if(!user){
                return res.status(401).json({success:false,message:"Unauthorize"})
            }
            if(!allowedroles.includes(user.role)){
                return res.status(403).json({success:false,message:"Access Deniad"})
            }
            next()
        }
    } catch (error) {
        console.log('error in authrole',error)
    }
}
