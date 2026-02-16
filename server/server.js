import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import adoptionRouter from "./routes/adoptionRoutes.js"; // adoption routes
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173", // your frontend
  })
);

// Test API
app.get("/", (req, res) => res.send("API Working"));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/adoptions", adoptionRouter); // adoption routes

// TEMPORARY DASHBOARD TEST API
app.get("/api/dashboard", (req, res) => {
  const stats = {
    applied: 5,
    approved: 3,
    pending: 2,
    saved: 7,
  };

  const adoptionTrends = [
    { month: "Jan", adoptions: 5 },
    { month: "Feb", adoptions: 8 },
    { month: "Mar", adoptions: 4 },
    { month: "Apr", adoptions: 10 },
    { month: "May", adoptions: 6 },
  ];

  const petCategories = [
    { name: "Dogs", value: 12 },
    { name: "Cats", value: 8 },
    { name: "Rabbits", value: 3 },
    { name: "Birds", value: 2 },
  ];

  res.json({ stats, adoptionTrends, petCategories });
});

// SOCKET.IO SETUP
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Send initial data
  const stats = {
    applied: 5,
    approved: 3,
    pending: 2,
    saved: 7,
  };
  const adoptionTrends = [
    { month: "Jan", adoptions: 5 },
    { month: "Feb", adoptions: 8 },
    { month: "Mar", adoptions: 4 },
    { month: "Apr", adoptions: 10 },
    { month: "May", adoptions: 6 },
  ];
  const petCategories = [
    { name: "Dogs", value: 12 },
    { name: "Cats", value: 8 },
    { name: "Rabbits", value: 3 },
    { name: "Birds", value: 2 },
  ];

  socket.emit("dashboard_stats", stats);
  socket.emit("adoption_trends", adoptionTrends);
  socket.emit("pet_categories", petCategories);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
httpServer.listen(port, () => {
  console.log(`Server started on PORT: ${port}`);
});
