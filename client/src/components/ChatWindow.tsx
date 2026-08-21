import { Sidebar } from "./Sidebar";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import type { Message, User, Room } from "../types";

interface ChatWindowProps {
  messages: Message[];
  onlineUsers: User[];
  rooms: Room[];
  typingUsers: Map<string, string>;
  currentRoom: string | null;
  currentUser: string | null;
  onSendMessage: (content: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  onLeaveRoom: () => void;
}

export function ChatWindow({
  messages,
  onlineUsers,
  rooms,
  typingUsers,
  currentRoom,
  currentUser,
  onSendMessage,
  onTypingStart,
  onTypingStop,
  onLeaveRoom,
}: ChatWindowProps) {
  return (
    <div className="chat-layout">
      <Sidebar
        rooms={rooms}
        currentRoom={currentRoom}
        onlineUsers={onlineUsers}
        currentUser={currentUser}
        onLeave={onLeaveRoom}
      />
      <div className="chat-main">
        <div className="chat-header">
          <h2>#{currentRoom}</h2>
          <span className="member-count">{onlineUsers.length} online</span>
        </div>
        <MessageList
          messages={messages}
          currentUser={currentUser}
          typingUsers={typingUsers}
        />
        <MessageInput
          onSend={onSendMessage}
          onTypingStart={onTypingStart}
          onTypingStop={onTypingStop}
        />
      </div>
    </div>
  );
}
