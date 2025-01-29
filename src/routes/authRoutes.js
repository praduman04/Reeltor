import express from "express";
import { signUp,login } from "../controllers/auth.js";

const authRouter=express.Router();
authRouter.post("/signUp",signUp);
authRouter.post("/login",login);

export default authRouter;