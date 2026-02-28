import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDb from './db/connection.js'
import userroute from './routes/user.routes.js'
import globalErrorHandler from './middleware.js/errorHandler.js'
import cookieParser from 'cookie-parser'
const app = express()
dotenv.config()

const corsOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cookieParser())
app.use(cors({
  origin: corsOrigins.length ? corsOrigins : true,
  credentials: true,               
}));
app.use(express.json())
app.use("/api/v1",userroute)
app.use(globalErrorHandler)

connectDb().catch((error) => {
  console.error("Database connection failed:", error.message);
});

if (!process.env.VERCEL) {
  const port = process.env.PORT || 4000;
  app.listen(port,()=>{
      console.log("App listen on port number ",port)
  })
}

export default app;


