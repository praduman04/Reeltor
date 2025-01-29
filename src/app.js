import express from "express";
import dotenv from "dotenv"
import { connectDB } from "./utils/connectDB.js";
import authRouter from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import processPendingNotifications from "./utils/notificationScheduler.js";

dotenv.config()
const app=express();
app.use(express.json());
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/user",userRoutes)
processPendingNotifications();

connectDB()
app.listen(3000,()=>{
    console.log("server started")
})