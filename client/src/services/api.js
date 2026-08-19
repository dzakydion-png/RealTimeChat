import { serverApi as api } from "../helpers/http-server";
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});


/**
 * WHAT: API service module for chat-related HTTP requests
 * INPUT: None (module exports functions)
 * OUTPUT: Exports functions for fetching messages and AI summarization
 */

/**
 * WHAT: Fetches all chat messages from the server
 * INPUT: None (uses authenticated API instance)
 * OUTPUT: Returns array of message objects or throws error
 */
export const fetchMessages = async () => {
  try {
    const response = await api.get("/messages");
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

/**
 * WHAT: Requests AI summarization of chat history from server
 * INPUT: None (server fetches messages from database)
 * OUTPUT: Returns AI-generated summary object or throws error
 */
export const summarizeChat = async () => {
  try {
    const response = await api.post("/ai/summarize");
    return response.data;
  } catch (error) {
    console.error("Error summarizing chat:", error);
    throw error;
  }
};

export default api;
