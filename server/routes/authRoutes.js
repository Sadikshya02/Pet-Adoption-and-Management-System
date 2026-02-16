import express from "express";
import {
  register,
  login,
  logout,
  sendOtp,
  verifyOtp,
  resetPassword,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

// OTP routes
authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);

// RESET PASSWORD
authRouter.post("/reset-password", resetPassword);

export default authRouter;
