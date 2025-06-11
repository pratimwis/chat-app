"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
exports.getSocketIdByUserId = getSocketIdByUserId;
exports.registerSocket = registerSocket;
const socket_io_1 = require("socket.io");
//use to store online users
const userSocketMap = {}; //{userId: socketId}
//helper function to get socket id by userId
function getSocketIdByUserId(userId) {
    return userSocketMap[userId];
}
function registerSocket(server) {
    exports.io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });
    exports.io.on("connection", (socket) => {
        console.log("A user connected", socket.id);
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap[userId] = socket.id;
        }
        // Emit the current online users
        exports.io.emit("onlineUsers", Object.keys(userSocketMap));
        socket.on("disconnect", () => {
            console.log("A user disconnected", socket.id);
            // Remove the user from the online users list
            delete userSocketMap[userId];
            exports.io.emit("onlineUsers", Object.keys(userSocketMap));
        });
    });
}
