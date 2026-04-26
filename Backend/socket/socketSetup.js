import { Server } from "socket.io";

const setupSocket = (httpServer, app) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  app.set("io", io);

  io.on("connection", (socket) => {
    console.log(`[Socket] connected: ${socket.id}`);
    socket.on("shelter:join", (id) => socket.join(`shelter:${id}`));
    socket.on("shelter:leave", (id) => socket.leave(`shelter:${id}`));
    socket.on("disconnect", () => console.log(`[Socket] disconnected: ${socket.id}`));
  });

  return io;
};

export default setupSocket;