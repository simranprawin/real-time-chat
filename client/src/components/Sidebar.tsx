import type { Room, User } from "../types";

interface SidebarProps {
  rooms: Room[];
  currentRoom: string | null;
  onlineUsers: User[];
  currentUser: string | null;
  onSelectRoom: (room: string) => void;
  onLeave: () => void;
}

export function Sidebar({
  rooms,
  currentRoom,
  onlineUsers,
  currentUser,
  onLeave,
}: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h3>Rooms</h3>
        <ul className="room-list">
          {rooms.map((room) => (
            <li
              key={room.name}
              className={room.name === currentRoom ? "active" : ""}
            >
              <span className="room-name">#{room.name}</span>
              <span className="room-desc">{room.description}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-section">
        <h3>Online ({onlineUsers.length})</h3>
        <ul className="user-list">
          {onlineUsers.map((user) => (
            <li key={user.id} className={user.username === currentUser ? "self" : ""}>
              <span className="user-dot" />
              {user.username}
              {user.username === currentUser && " (you)"}
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <button className="leave-btn" onClick={onLeave}>
          Leave Room
        </button>
      </div>
    </div>
  );
}
