import axios from "axios";
import { io } from "socket.io-client";

/**
 * WHAT: Centralized server configuration
 * INPUT: Environment variable VITE_SERVER_URL
 * OUTPUT: Base URL for all HTTP and WebSocket connections
 */
export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
/**
 * WHAT: Axios instance with pre-configured base URL
 * INPUT: None
 * OUTPUT: Configured axios instance for all API calls
 */
export const serverApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * WHAT: Socket.IO client instance for real-time communication
 * INPUT: BASE_URL from centralized configuration
 * OUTPUT: Connected socket instance for event-based messaging
 */
export const socket = io(BASE_URL, {
  transports: ["websocket", "polling"],
  autoConnect: true,
});
