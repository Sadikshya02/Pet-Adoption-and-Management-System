import Adoption from "../models/Adoption.js";
import Pet from "../models/Pet.js";
import User from "../models/User.js";

export default function dashboardSocket(io) {
  io.on("connection", async (socket) => {
    console.log("New dashboard client connected:", socket.id);

    const sendDashboardData = async () => {
      try {
        // 1️⃣ Stats
        const applied = await Adoption.countDocuments({});
        const approved = await Adoption.countDocuments({ status: "approved" });
        const pending = await Adoption.countDocuments({ status: "pending" });
        const saved = await Pet.countDocuments({ savedByUsers: { $exists: true, $ne: [] } });

        socket.emit("dashboard_stats", { applied, approved, pending, saved });

        // 2️⃣ Monthly adoption trends
        const adoptions = await Adoption.aggregate([
          {
            $group: {
              _id: { $month: "$createdAt" },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id": 1 } },
        ]);

        const adoptionTrends = adoptions.map((item) => ({
          month: new Date(0, item._id - 1).toLocaleString("en-US", { month: "short" }),
          adoptions: item.count,
        }));

        socket.emit("adoption_trends", adoptionTrends);

        // 3️⃣ Pet categories
        const petCats = await Pet.aggregate([
          { $group: { _id: "$type", count: { $sum: 1 } } },
        ]);

        const petCategories = petCats.map((item) => ({
          name: item._id,
          value: item.count,
        }));

        socket.emit("pet_categories", petCategories);
      } catch (err) {
        console.error("Error sending dashboard data:", err.message);
      }
    };

    // Send initial data immediately
    await sendDashboardData();

    // Refresh every 10 seconds
    const interval = setInterval(sendDashboardData, 10000);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      clearInterval(interval);
    });
  });
}
