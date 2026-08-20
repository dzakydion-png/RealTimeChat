import axios from "axios";
import { io } from "socket.io-client";

/**
 * WHAT: Centralized server configuration
 * INPUT: Hardcoded Ngrok URL to bypass Vercel env cache issues
 * OUTPUT: Base URL for all HTTP and WebSocket connections
 */
export const BASE_URL = "https://progeny-ogle-bakery.ngrok-free.dev";

export const serverApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
});

export const socket = io(BASE_URL, {
  transports: ["polling", "websocket"],
  extraHeaders: {
    "ngrok-skip-browser-warning": "69420",
  },
  autoConnect: true,
});