import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import socketIO from "./socket/socket.js";

// Express 애플리케이션 생성
const app = express();
const server = createServer(app);

// Socket.IO 서버 생성
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
socketIO(io);

// HTTP 서버 실행 (리다이렉트 전용)
server.listen(3000, () => {
  console.log("HTTP Server running on port 3000");
});
