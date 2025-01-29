
import { UserModel } from "../model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    res
      .status(200)
      .json({
        success: true,
        message: "User logged in successfully",
        token,
        user,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const signUp = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      mobileNumber,
      bio,
      availabilityTime,
      role,
    } = req.body;

    let user = await UserModel.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
      bio,
      availabilityTime,
      role,
    });

    res
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        userData: user,
      });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const logout = (req, res) => {
  res.status(200).json({success: true, message: "User logged out successfully" });
};
