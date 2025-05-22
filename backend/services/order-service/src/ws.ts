import { Server } from "socket.io";

export const io = new Server(3007, {
  cors: {
    origin: "*", // adjust in production!
    methods: ["GET", "POST"]
  }
});

const userSocketMap = new Map<string, any>();

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;
  if (userId) {
    userSocketMap.set(userId, socket);
    console.log(`🔌 User ${userId} connected`);

    socket.on("disconnect", () => {
      userSocketMap.delete(userId);
      console.log(` User ${userId} disconnected`);
    });
  }
  else {
    console.error("User ID not provided in socket connection");
  }
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  })
});

// Helper to send notifications to specific users
export function notifyUser(userId: string, data: any) {
  const socket = userSocketMap.get(userId);
  console.log("Sending notification to user:", userId, "Data:", data);
  if (socket) {
    socket.emit("order-update", data);
  }
  else {
    console.error(`Socket not found for user ${userId}`);
  }
}
