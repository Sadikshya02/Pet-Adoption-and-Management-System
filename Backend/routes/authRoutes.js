import express from "express";
import {
  register,
  login,
  logout,
  sendOtp,
  verifyOtp,
  resetPassword,
  adminRegister, 
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

// OTP routes
authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);

// Reset password
authRouter.post("/reset-password", resetPassword);

// Admin signup 
authRouter.post("/admin-signup", adminRegister);

export default authRouter;