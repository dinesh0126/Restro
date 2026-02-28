import express from 'express';
import { login, logout, register } from '../controller/userregister.js';
import { addcategory, additem, deletecategory, deleteitem, getcategory, getfooditem, singlefooditem, updateitem } from '../controller/fooditems.js';
import upload from '../middleware.js/multer.js';
import { authmiddleware,authroizeRole } from '../middleware.js/auth.js';
import { allorders, updatorderstatus,fetchpaymentstatus } from '../controller/orderadmin.js';
import { addcart, getcart, removecart, userprofile, clearCart } from '../controller/usercart.js';
import { createorder, verifypayment } from '../controller/payment_controller.js';
import { adminDashboardStats } from '../controller/dashboard.controller.js';
const router = express.Router();

router.post('/register', register);
router.post('/login',login)
router.post('/logout',logout)
router.post('/addcategory',upload.single("coverimage"),addcategory)
router.get("/getcategory",getcategory)
router.get('/getfooditems',getfooditem)
router.get("/singlefood/:id",singlefooditem)
router.post('/additem',upload.single("image"),additem)

router.delete("/deletecategory/:id",authmiddleware,deletecategory)
router.delete("/fooditem/:id",authmiddleware,deleteitem)
router.put("/updteitem/:id",upload.single("image"),updateitem)
router.get("/allorders",allorders)
router.put("/updateorder/:id",updatorderstatus)
router.get("/admin/dashboard-stats",authmiddleware,authroizeRole(["admin"]),adminDashboardStats)

// cart api 
router.post('/addcart',authmiddleware,authroizeRole(["user"]),addcart)
router.post('/clearcart',authmiddleware, clearCart)
router.get("/getcart",authmiddleware,authroizeRole(["user"]),getcart)
router.delete("/removecart/:cartItemId",authmiddleware,authroizeRole(["user"]),removecart)

router.get('/profile',authmiddleware,userprofile)

//  payment routes
router.post('/createorder',authmiddleware,createorder)
router.post('/verify-payment',authmiddleware,verifypayment)
router.get('/fetchorderstatus',authmiddleware,authroizeRole(["admin"]),fetchpaymentstatus)
export default router;
