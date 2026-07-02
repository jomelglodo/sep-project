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
    socket.on("join-staff", () => {
      socket.join("staff");
      console.log(`${socket.id} joined room staff`);
    });
    socket.on("disconnect", () => {
      console.log(`Client disconnected : ${socket.id}`);
    });

    //Optional: for staff room
    socket.on("join-admin", () => {
      socket.join("admin");
      console.log(`${socket.id} joined room admin`);
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
