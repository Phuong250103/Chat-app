import { Server } from 'socket.io';
import http from 'http';
import express from 'express';


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

const userSocketMap = {}; // lưu id socket của người dùng

io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);
    const userId = socket.handshake.query.userId; // lấy id người dùng từ query params
    if (userId) {
        userSocketMap[userId] = socket.id; // lưu id socket của người dùng
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // gửi danh sách người dùng đang online cho tất cả client

    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
        delete userSocketMap[userId]; // xóa id socket của người dùng khi ngắt kết nối
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // gửi danh sách người dùng đang online cho tất cả client
    });
});

export { io, app, server };