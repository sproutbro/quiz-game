import express from "express";
import http from "http";
import { Server } from "socket.io";
import { handler } from "./build/handler.js";
import socketIO from "./socket/socket.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

socketIO(io);

app.use(handler);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server ${PORT}`);
});
