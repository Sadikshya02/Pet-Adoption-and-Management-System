import "dotenv/config";

import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import authRouter      from "./routes/authRoutes.js";
import petRouter       from "./routes/petRoutes.js";
import adoptionRouter  from "./routes/adoptionRoutes.js";
import userRouter      from "./routes/userRoutes.js";
import matchRouter     from "./routes/matchRoutes.js";
import notifRouter     from "./routes/notificationRoutes.js";
import savedPetRouter  from "./routes/savedPetRoutes.js";
import reviewRouter    from "./routes/reviewRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import reportsRouter   from "./routes/reportRoutes.js";
import petTipRoutes    from "./routes/petTipRoutes.js";
import shelterAuthRouter         from "./routes/shelterAuthRoutes.js";
import shelterRouter             from "./routes/shelterRoutes.js";
import adminShelterRouter        from "./routes/adminShelterRoutes.js";
import shelterNotificationRouter from "./routes/shelterNotificationRoutes.js";
import setupSocket               from "./socket/socketSetup.js";  // ← NEW
import { fileURLToPath } from "url";
import { dirname, join }  from "path";

connectDB();

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",          authRouter);
app.use("/api/pets",          petRouter);
app.use("/api/adoptions",     adoptionRouter);
app.use("/api/users",         userRouter);
app.use("/api/matches",       matchRouter);
app.use("/api/notifications", notifRouter);
app.use("/api/saved-pets",    savedPetRouter);
app.use("/api/reviews",       reviewRouter);
app.use("/api/dashboard",     dashboardRouter);
app.use("/api/reports",       reportsRouter);
app.use("/api/pet-tips",      petTipRoutes);
app.use("/api/shelter-auth",              shelterAuthRouter);
app.use("/api/shelters",                  shelterRouter);
app.use("/api/admin/shelters",            adminShelterRouter);
app.use("/api/shelter-notifications",     shelterNotificationRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
app.use("/uploads", express.static(join(__dirname, "uploads")));

app.get("/", (req, res) => res.json({ message: "FureverHome API running 🐾" }));

process.on("uncaughtException",  (err) => console.error("UNCAUGHT EXCEPTION:", err));
process.on("unhandledRejection", (err) => console.error("UNHANDLED REJECTION:", err));

// ── Wrap in http.Server and attach Socket.IO ──────────────────────────────
const httpServer = http.createServer(app);
setupSocket(httpServer, app);                // ← attaches io to app

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));