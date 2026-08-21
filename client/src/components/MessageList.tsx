import { useEffect, useRef } from "react";
import type { Message } from "../types";

interface MessageListProps {
  messages: Message[];
  currentUser: string | null;
  typingUsers: Map<string, string>;
}

export function MessageList({
  messages,
  currentUser,
  typingUsers,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const typingList = Array.from(typingUsers.values());

  return (
    <div className="message-list">
      {messages.length === 0 && (
        <div className="no-messages">
          No messages yet. Start the conversation!
        </div>
      )}

      {messages.map((msg) => {
        const isOwn = msg.userId === currentUser;
        return (
          <div
            key={msg.id}
            className={`message ${isOwn ? "own" : "other"}`}
          >
            <div className="message-header">
              <span className="message-username">{msg.username}</span>
              <span className="message-time">{formatTime(msg.timestamp)}</span>
            </div>
            <div className="message-content">{msg.content}</div>
          </div>
        );
      })}

      {typingList.length > 0 && (
        <div className="typing-indicator">
          {typingList.length === 1
            ? `${typingList[0]} is typing...`
            : `${typingList.join(", ")} are typing...`}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
