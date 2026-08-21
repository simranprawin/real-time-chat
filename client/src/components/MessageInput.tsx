import { useState, useRef, useCallback } from "react";

interface MessageInputProps {
  onSend: (content: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
}

export function MessageInput({
  onSend,
  onTypingStart,
  onTypingStop,
}: MessageInputProps) {
  const [value, setValue] = useState("");
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const isTypingRef = useRef(false);

  const handleTyping = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTypingStart();
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      onTypingStop();
    }, 1500);
  }, [onTypingStart, onTypingStop]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setValue("");

    clearTimeout(typingTimeoutRef.current);
    isTypingRef.current = false;
    onTypingStop();
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          handleTyping();
        }}
        placeholder="Type a message..."
        autoFocus
      />
      <button type="submit" disabled={!value.trim()}>
        Send
      </button>
    </form>
  );
}
