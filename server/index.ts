import express from "express"; // Create an HTTP app for the server
import cors from "cors"; // Allow requests from the frontend origin
import { createServer } from "node:http"; // Create an HTTP server from the Express app
import { Server } from "socket.io"; // Create a Socket IO server

type PatientPayload = {
  // Payload sent from Patient and shown on Staff
  sessionId: string; // Room id for grouping users in the same session
  draft: Record<string, unknown>; // Latest form data can be partial or full
  status: "FILLING" | "INACTIVE" | "SUBMITTED"; // Current patient status
  lastActiveAt: number; // Last activity time in milliseconds
};

const app = express(); // Create an Express app
app.use(cors()); // Enable CORS for development

const httpServer = createServer(app); // Wrap Express with an HTTP server
const io = new Server(httpServer, {
  // Create Socket IO on top of the HTTP server
  cors: { origin: "*" }, // Allow all origins in dev restrict this in production
});

io.on("connection", (socket) => {
  // Run when a client connects patient or staff
  socket.on("session:join", (sessionId: string) => {
    // Client asks to join a session room
    socket.join(sessionId); // Join the room to receive room events
  });

  socket.on("patient:update", (payload: PatientPayload) => {
    // Patient sends updates while typing
    io.to(payload.sessionId).emit("staff:update", payload); // Send the latest data to staff in the same room
  });

  socket.on("patient:submit", (payload: PatientPayload) => {
    // Patient submits the final form
    io.to(payload.sessionId).emit("staff:update", payload); // Send the submitted data to staff in the same room
  });
});

httpServer.listen(4000, () => {
  // Start the server on port 4000
  console.log("WebSocket server listening on http://localhost:4000"); // Print the server URL
});
