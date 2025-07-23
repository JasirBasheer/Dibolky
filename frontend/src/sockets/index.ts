import { io, Socket } from "socket.io-client";

const socket: Socket = io(import.meta.env.VITE_BACKEND || "http://localhost:5050", {
  withCredentials: true,
  transports: ["polling", "websocket"],
});

export default socket;
