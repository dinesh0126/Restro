import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDb from './db/connection.js'
import userroute from './routes/user.routes.js'
import globalErrorHandler from './middleware.js/errorHandler.js'
import cookieParser from 'cookie-parser'
const app = express()
dotenv.config()
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,               
}));
app.use(express.json())
app.use("/api/v1",userroute)
app.use(globalErrorHandler)
app.listen(process.env.PORT,()=>{
    console.log("App listen on port number ",process.env.PORT)
})
connectDb()


