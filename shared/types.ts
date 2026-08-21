export interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  room: string;
  timestamp: number;
}

export interface User {
  id: string;
  username: string;
  room: string;
}

export interface Room {
  name: string;
  description: string;
}

export interface ServerToClientEvents {
  message: (message: Message) => void;
  roomMessages: (messages: Message[]) => void;
  userJoined: (user: User) => void;
  userLeft: (user: User) => void;
  onlineUsers: (users: User[]) => void;
  typingStart: (data: { userId: string; username: string }) => void;
  typingStop: (data: { userId: string }) => void;
  rooms: (rooms: Room[]) => void;
  error: (error: string) => void;
}

export interface ClientToServerEvents {
  joinRoom: (data: { username: string; room: string }) => void;
  leaveRoom: () => void;
  sendMessage: (content: string) => void;
  typingStart: () => void;
  typingStop: () => void;
}
