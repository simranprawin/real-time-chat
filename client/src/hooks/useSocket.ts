import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { Message, User, Room } from "../types";

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || `http://${window.location.hostname}:3001`;

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(
    new Map()
  );
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("rooms", (roomList: Room[]) => setRooms(roomList));

    socket.on("roomMessages", (msgs: Message[]) => setMessages(msgs));

    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("onlineUsers", (users: User[]) => setOnlineUsers(users));

    socket.on("userJoined", (user: User) => {
      console.log(`${user.username} joined`);
    });

    socket.on("userLeft", (user: User) => {
      console.log(`${user.username} left`);
    });

    socket.on(
      "typingStart",
      (data: { userId: string; username: string }) => {
        setTypingUsers((prev) => {
          const next = new Map(prev);
          next.set(data.userId, data.username);
          return next;
        });
      }
    );

    socket.on("typingStop", (data: { userId: string }) => {
      setTypingUsers((prev) => {
        const next = new Map(prev);
        next.delete(data.userId);
        return next;
      });
    });

    socket.on("error", (err: string) => setError(err));

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinRoom = useCallback(
    (username: string, room: string) => {
      socketRef.current?.emit("joinRoom", { username, room });
      setCurrentRoom(room);
      setCurrentUser(username);
      setError(null);
    },
    []
  );

  const leaveRoom = useCallback(() => {
    socketRef.current?.emit("leaveRoom");
    setCurrentRoom(null);
    setCurrentUser(null);
    setMessages([]);
    setOnlineUsers([]);
    setTypingUsers(new Map());
  }, []);

  const sendMessage = useCallback((content: string) => {
    socketRef.current?.emit("sendMessage", content);
  }, []);

  const startTyping = useCallback(() => {
    socketRef.current?.emit("typingStart");
  }, []);

  const stopTyping = useCallback(() => {
    socketRef.current?.emit("typingStop");
  }, []);

  return {
    messages,
    onlineUsers,
    rooms,
    typingUsers,
    connected,
    error,
    currentRoom,
    currentUser,
    joinRoom,
    leaveRoom,
    sendMessage,
    startTyping,
    stopTyping,
  };
}
