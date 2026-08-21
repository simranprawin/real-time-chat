import { useState } from "react";
import type { Room } from "../types";

interface JoinScreenProps {
  rooms: Room[];
  onJoin: (username: string, room: string) => void;
  connected: boolean;
}

export function JoinScreen({ rooms, onJoin, connected }: JoinScreenProps) {
  const [username, setUsername] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("general");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onJoin(username.trim(), selectedRoom);
    }
  };

  return (
    <div className="join-screen">
      <div className="join-card">
        <h1>Real-Time Chat</h1>
        <p className="subtitle">Join a room to start chatting</p>

        {!connected && (
          <div className="connection-status disconnected">
            Connecting to server...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              maxLength={20}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="room">Room</label>
            <select
              id="room"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
            >
              {rooms.map((room) => (
                <option key={room.name} value={room.name}>
                  {room.name} — {room.description}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={!connected || !username.trim()}>
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
}
