import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import Otp from "../models/Otp.js";

// REGISTER
export const register = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ success: false, message: "Request body is missing" });
    }

    const { name, email, password, address, phoneNumber } = req.body || {};

    if (!name || !email || !password || !address || !phoneNumber) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      address,
      phoneNumber,
      isAccountVerified: true,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Signup successful!",
      user: {
        _id:                    user._id,
        name:                   user.name,
        email:                  user.email,
        phoneNumber:            user.phoneNumber,
        role:                   user.role,
        questionnaireCompleted: user.questionnaireCompleted,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ success: false, message: "Request body is missing" });
    }

    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id:                    user._id,
        name:                   user.name,
        email:                  user.email,
        phoneNumber:            user.phoneNumber,
        role:                   user.role,
        questionnaireCompleted: user.questionnaireCompleted,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// SEND OTP
export const sendOtp = async (req, res) => {
  try {
    if (!req.body || !req.body.email)
      return res.status(400).json({ message: "Email is required" });

    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Pet Adoption Center - OTP Verification",
      html: `<h3>Your OTP is:</h3><h2>${otp}</h2><p>Valid for 5 minutes</p>`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Send OTP error:", error.message);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.otp)
      return res.status(400).json({ message: "Email and OTP required" });

    const { email, otp } = req.body;
    const record = await Otp.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: "Invalid OTP" });

    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    await Otp.deleteOne({ _id: record._id });

    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error.message);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

//  RESET PASSWORD — fixed to use .save() instead of findOneAndUpdate
export const resetPassword = async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.newPassword)
      return res.status(400).json({ message: "Email and new password required" });

    const { email, newPassword } = req.body;

    //  Find user first
    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    //  Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //  Directly set and save — most reliable way
    user.password = hashedPassword;
    await user.save();

    console.log("Password reset for:", email);
    console.log("New hashed password saved:", user.password);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password error:", error.message);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

// ADMIN REGISTER
export const adminRegister = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ success: false, message: "Request body is missing" });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      isAccountVerified: true,
    });

    await user.save();

    res.status(201).json({ success: true, message: "Admin account created successfully" });
  } catch (error) {
    console.error("Admin register error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
