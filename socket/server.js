require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const SOCKET_PORT = process.env.SOCKET_PORT || 4000;

const server = http.createServer(); // no express app here
const allowedOrigins = [
  "http://localhost:3000",
  "https://yourwebsite.com",
  "https://partner-site.com"
];
const io = new Server(server, {
  cors: {
    origin:allowedOrigins, // React app URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("message", (data) => {
    console.log("Message received:", data);
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(SOCKET_PORT, () => {
  console.log(`Socket server running on port ${SOCKET_PORT}`);
});
