import express from "express";
import { verifyToken } from "../middleware/authorizationMiddleware.js";
import { sendNotification, updateUser } from "../controllers/user.js";
const userRoutes=express.Router();
userRoutes.patch("/update",verifyToken,updateUser);
userRoutes.post("/sendNotification",verifyToken,sendNotification)
export default userRoutes