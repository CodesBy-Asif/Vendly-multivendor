const app = require("./app");
require("dotenv").config();
const connectDatabase = require("./config/db");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;

// Create HTTP server from express app
const server = http.createServer(app);

// Attach socket.io to the server
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN, // your React app
    methods: ["GET", "POST"],
    credentials: true, // if you need cookies/auth headers
  },
});


connectDatabase().then(() => {
  // Start server only after DB connection
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Error connecting to database:", err);
  process.exit(1);
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("message", (data) => {
    console.log("Message received:", data);
    // broadcast to all clients
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

