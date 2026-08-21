import { JoinScreen } from "./components/JoinScreen";
import { ChatWindow } from "./components/ChatWindow";
import { useSocket } from "./hooks/useSocket";

function App() {
  const {
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
  } = useSocket();

  if (error && !currentRoom) {
    alert(error);
  }

  if (!currentRoom) {
    return <JoinScreen rooms={rooms} onJoin={joinRoom} connected={connected} />;
  }

  return (
    <ChatWindow
      messages={messages}
      onlineUsers={onlineUsers}
      rooms={rooms}
      typingUsers={typingUsers}
      currentRoom={currentRoom}
      currentUser={currentUser}
      onSendMessage={sendMessage}
      onTypingStart={startTyping}
      onTypingStop={stopTyping}
      onLeaveRoom={leaveRoom}
    />
  );
}

export default App;
