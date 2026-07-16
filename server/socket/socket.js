import { Server } from "socket.io";

let io;

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [process.env.CLIENT_URL, process.env.LOCALHOST_URL],
      methods: ["GET", "POST", "PUT"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected server/"socket.js": ${socket.id}`);

    //join a room based on the logged in user
    socket.on("join-user", (userId) => {
      socket.join("users"); // room for all users
      socket.join(`user:${userId}`);
      console.log(`${socket.id} joined room user:${userId}`);
    });

    //Optional: for staff room
    socket.on("join-staff", (userId) => {
      socket.join(`user:${userId}`);
      socket.join("staff");
      console.log(`${socket.id} joined room staff:${userId}`);
    });
    socket.on("disconnect", () => {
      console.log(`Client disconnected : ${socket.id}`);
    });

    //Optional: for staff room
    socket.on("join-admin", (userId) => {
      socket.join(`user:${userId}`);
      socket.join("admin");
      console.log(`${socket.id} joined room admin:${userId}`);
    });

    socket.on("join-ticket", (ticketId) => {
      socket.join(`ticket:${ticketId}`);
      console.log(`${socket.id} joined ticket:${ticketId}`);
    });

    socket.on("leave-ticket", (ticketId) => {
      socket.leave(`ticket:${ticketId}`);
      console.log(`${socket.id} left ticket ${ticketId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected : ${socket.id}`);
    });
  });
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }
  return io;
}
