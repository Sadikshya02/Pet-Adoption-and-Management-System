import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "user", enum: "user", "shelter"},
});

export default mongoose.model("User", userSchema);
