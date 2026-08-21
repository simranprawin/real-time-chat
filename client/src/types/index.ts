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
