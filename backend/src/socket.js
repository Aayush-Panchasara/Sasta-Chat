import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// use to store the online users
const userSocket = {};

export function getReceiverSocketId(userId) {
  return userSocket[userId];
}

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocket[userId] = socket.id;
  }
  
  //emit() is use send message to all connected users
  io.emit("getAllOnlineUsers",Object.keys(userSocket))

  socket.on("disconnect",() => {
    console.log("User Disconnected:",socket.id);
    delete userSocket[userId]
    io.emit("getAllOnlineUsers",Object.keys(userSocket));
    
  })

});

export { app, server, io };
