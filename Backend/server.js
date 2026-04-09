import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import adoptionRouter from "./routes/adoptionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import petRouter from "./routes/petRoutes.js";
import matchRouter from "./routes/matchRoutes.js";
import savedPetsRouter from "./routes/savedPets.js";
import notificationsRouter from "./routes/notifications.js";
import reviewsRouter from "./routes/reviews.js";
import { createServer } from "http";
import { Server } from "socket.io";

import Adoption from "./models/Adoption.js";
import userModel from "./models/userModel.js";
import Pet from "./models/Pet.js";

const app = express();
const port = process.env.PORT || 4000;

connectDB();

//  MIDDLEWARES 
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

//  DEBUG MIDDLEWARE 
app.use("/api/auth", (req, res, next) => {
  console.log("REQ BODY DEBUG:", req.body);
  next();
});

app.get("/", (req, res) => res.send("API Working"));

//  ROUTES 
app.use("/api/auth",          authRouter);
app.use("/api/adoptions",     adoptionRouter);
app.use("/api/users",         userRoutes);
app.use("/api/pets",          petRouter);
app.use("/api/matches",       matchRouter);
app.use("/api/saved-pets",    savedPetsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/reviews",       reviewsRouter);

//  DASHBOARD API 
app.get("/api/dashboard", async (req, res) => {
  try {
    const totalRequests = await Adoption.countDocuments();
    const approved      = await Adoption.countDocuments({ status: "approved" });
    const pending       = await Adoption.countDocuments({ status: "pending" });
    const rejected      = await Adoption.countDocuments({ status: "rejected" });
    const totalUsers    = await userModel.countDocuments();
    const totalPets     = await Pet.countDocuments();

    const adoptionTrends = await Adoption.aggregate([
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
      { $sort: { "_id": 1 } },
    ]);

    const petCategories = await Pet.aggregate([
      { $group: { _id: "$species", count: { $sum: 1 } } },
    ]);

    res.json({
      stats: { totalRequests, approved, pending, rejected, totalUsers, totalPets },
      adoptionTrends,
      petCategories,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard", error: err.message });
  }
});

//  REPORTS API 
app.get("/api/reports", async (req, res) => {
  try {
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const trends = await Adoption.aggregate([
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
      { $sort: { "_id": 1 } },
    ]);

    const adoptionTrends = trends.map(t => ({ month: monthNames[t._id - 1], count: t.count }));

    const approved   = await Adoption.countDocuments({ status: "approved" });
    const pending    = await Adoption.countDocuments({ status: "pending" });
    const rejected   = await Adoption.countDocuments({ status: "rejected" });
    const totalPets  = await Pet.countDocuments();
    const totalUsers = await userModel.countDocuments();

    const metrics = [
      { label: "Total Pets",       value: totalPets },
      { label: "Total Users",      value: totalUsers },
      { label: "Total Adoptions",  value: approved },
      { label: "Pending Requests", value: pending },
    ];

    const breedData = await Pet.aggregate([
      { $group: { _id: "$breed", species: { $first: "$species" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const rateClasses = [
      "bg-green-100 text-green-800",
      "bg-blue-100 text-blue-800",
      "bg-yellow-100 text-yellow-800",
      "bg-orange-100 text-orange-800",
      "bg-red-100 text-red-800",
    ];

    const topBreeds = breedData.map((b, i) => ({
      rank:  i + 1,
      breed: b._id,
      type:  b.species,
      count: b.count,
      rate:  `${Math.round((b.count / (totalPets || 1)) * 100)}%`,
      cls:   rateClasses[i] || rateClasses[4],
    }));

    res.json({ adoptionTrends, requestStatus: { Approved: approved, Pending: pending, Rejected: rejected }, metrics, topBreeds });
  } catch (err) {
    res.status(500).json({ message: "Error fetching reports", error: err.message });
  }
});

//  SOCKET.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

io.on("connection", async (socket) => {
  console.log("Client connected:", socket.id);
  try {
    const totalRequests = await Adoption.countDocuments();
    const approved      = await Adoption.countDocuments({ status: "approved" });
    const pending       = await Adoption.countDocuments({ status: "pending" });
    const totalUsers    = await userModel.countDocuments();

    const adoptionTrends = await Adoption.aggregate([
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
      { $sort: { "_id": 1 } },
    ]);

    const petCategories = await Pet.aggregate([
      { $group: { _id: "$species", count: { $sum: 1 } } },
    ]);

    socket.emit("dashboard_stats", { totalRequests, approved, pending, totalUsers });
    socket.emit("adoption_trends", adoptionTrends);
    socket.emit("pet_categories", petCategories);
  } catch (err) {
    console.log("Socket dashboard error:", err.message);
  }

  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

//  START SERVER 
httpServer.listen(port, () => console.log(`Server started on PORT: ${port}`));