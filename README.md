# Real-Time Chat App

A full-stack real-time chat application with rooms, typing indicators, and online user tracking.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Backend:** Node.js, Express, Socket.io
- **Communication:** WebSockets (Socket.io)

## Features

- Multiple chat rooms (General, Random, Tech, Gaming)
- Real-time messaging with WebSocket
- Typing indicators
- Online user list per room
- Message history (last 100 messages)
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18+

### Install Dependencies

```bash
# Server
cd server && npm install

# Client
cd client && npm install
```

### Run in Development

Open two terminals:

```bash
# Terminal 1 — Server
cd server && npm run dev

# Terminal 2 — Client
cd client && npm run dev
```

Open http://localhost:5173 in your browser.

## Project Structure

```
├── client/          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Socket.io hook
│   │   ├── types/        # TypeScript types
│   │   ├── App.tsx       # Root component
│   │   ├── main.tsx      # Entry point
│   │   └── index.css     # Global styles
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── server/          # Express + Socket.io backend
│   └── src/
│       └── index.js
├── shared/          # Shared type definitions
│   └── types.ts
└── README.md
```
