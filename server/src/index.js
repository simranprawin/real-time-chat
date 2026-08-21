const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "*", methods: ["GET", "POST"] },
});

const DEFAULT_ROOMS = [
  { name: "general", description: "General discussion" },
  { name: "random", description: "Off-topic chat" },
  { name: "tech", description: "Technology talk" },
  { name: "gaming", description: "Gaming discussions" },
];

const rooms = new Map();
const userSocketMap = new Map();
const typingUsers = new Map();

DEFAULT_ROOMS.forEach((r) => rooms.set(r.name, { ...r, users: new Map() }));

function getUsersInRoom(roomName) {
  const room = rooms.get(roomName);
  if (!room) return [];
  return Array.from(room.users.values());
}

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.emit("rooms", DEFAULT_ROOMS);

  socket.on("joinRoom", ({ username, room }) => {
    if (!rooms.has(room)) {
      socket.emit("error", `Room "${room}" does not exist.`);
      return;
    }

    socket.data = { username, room };
    const roomData = rooms.get(room);
    const user = { id: socket.id, username, room };

    roomData.users.set(socket.id, user);
    userSocketMap.set(socket.id, user);

    socket.join(room);

    socket.emit("roomMessages", roomData.messages || []);
    io.to(room).emit("userJoined", user);
    io.to(room).emit("onlineUsers", getUsersInRoom(room));

    console.log(`${username} joined room: ${room}`);
  });

  socket.on("sendMessage", (content) => {
    const user = userSocketMap.get(socket.id);
    if (!user) return;

    const message = {
      id: `${Date.now()}-${socket.id}`,
      userId: socket.id,
      username: user.username,
      content,
      room: user.room,
      timestamp: Date.now(),
    };

    const roomData = rooms.get(user.room);
    if (!roomData.messages) roomData.messages = [];
    roomData.messages.push(message);

    if (roomData.messages.length > 100) {
      roomData.messages = roomData.messages.slice(-100);
    }

    io.to(user.room).emit("message", message);

    typingUsers.delete(socket.id);
    io.to(user.room).emit("typingStop", { userId: socket.id });
  });

  socket.on("typingStart", () => {
    const user = userSocketMap.get(socket.id);
    if (!user) return;
    typingUsers.set(socket.id, user.username);
    socket.to(user.room).emit("typingStart", {
      userId: socket.id,
      username: user.username,
    });
  });

  socket.on("typingStop", () => {
    const user = userSocketMap.get(socket.id);
    if (!user) return;
    typingUsers.delete(socket.id);
    socket.to(user.room).emit("typingStop", { userId: socket.id });
  });

  socket.on("leaveRoom", () => handleLeave(socket));
  socket.on("disconnect", () => {
    handleLeave(socket);
    console.log(`User disconnected: ${socket.id}`);
  });

  function handleLeave(sock) {
    const user = userSocketMap.get(sock.id);
    if (!user) return;

    const roomData = rooms.get(user.room);
    roomData.users.delete(sock.id);
    userSocketMap.delete(sock.id);
    typingUsers.delete(sock.id);

    sock.leave(user.room);
    io.to(user.room).emit("userLeft", user);
    io.to(user.room).emit("onlineUsers", getUsersInRoom(user.room));
    io.to(user.room).emit("typingStop", { userId: sock.id });

    console.log(`${user.username} left room: ${user.room}`);
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
