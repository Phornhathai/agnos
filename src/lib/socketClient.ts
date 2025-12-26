import { io, Socket } from "socket.io-client"; // Socket IO client

let socket: Socket | null = null; // Keep one instance to reuse and avoid reconnect

// Summary  Return the same socket instance every time
export const getSocket = () => {
  // Get or create socket client
  if (socket) return socket; // Reuse existing socket

  const url = process.env.NEXT_PUBLIC_WS_URL as string; // Read WebSocket URL from env
  console.log("WS URL", process.env.NEXT_PUBLIC_WS_URL);

  socket = io(url, { transports: ["websocket"] }); // Connect and force websocket transport

  return socket; // Return socket instance
};

// Summary  Join a room by sessionId so patient and staff share the same data
export const joinSession = (sessionId: string) => {
  // Join a session room
  const s = getSocket(); // Get socket instance
  s.emit("session:join", sessionId); // Ask server to join this session room
  return s; // Return socket for later use
};
