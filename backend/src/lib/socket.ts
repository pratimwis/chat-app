import { Server as SocketIOServer } from "socket.io";
import type { Server as HTTPServer } from "http";

export let io: SocketIOServer;

//use to store online users
const userSocketMap: Record<string, string> = {}; //{userId: socketId}

//helper function to get socket id by userId
export function getSocketIdByUserId(userId: string): string | undefined {
  return userSocketMap[userId];
}

export function registerSocket(server: HTTPServer) {
  io = new SocketIOServer(server, {
    cors: {
      origin: `${process.env.CLIENT_URL}`,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    const userId = socket.handshake.query.userId as string;
    if (userId) {
      userSocketMap[userId] = socket.id;
    }
    // Emit the current online users
    io.emit("onlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);

      // Remove the user from the online users list
      delete userSocketMap[userId];
      io.emit("onlineUsers", Object.keys(userSocketMap));
    });
  });
}
