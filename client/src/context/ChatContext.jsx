import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  fetchMessages as apiFetchMessages,
  summarizeChat as apiSummarizeChat,
} from "../services/api";
import Swal from "sweetalert2";

/**
 * WHAT: Chat Context for global state management
 * INPUT: None (context creation)
 * OUTPUT: Context object for sharing chat state across components
 */
const ChatContext = createContext(null);

/**
 * WHAT: Custom hook to access Chat Context
 * INPUT: None (hook usage in components)
 * OUTPUT: Chat context value with state and methods
 */
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
};

/**
 * WHAT: ChatProvider component wrapping the app with global chat state
 * INPUT: children - Child components to wrap
 * OUTPUT: Provides user, messages, and chat methods to all children
 */
export const ChatProvider = ({ children }) => {
  // User state: stores username and id
  const [user, setUserState] = useState(() => {
    // Restore user from localStorage on initial mount
    const savedUser = localStorage.getItem("chat-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Messages state: stores all chat messages
  const [messages, setMessages] = useState([]);

  // Loading state for async operations
  const [loading, setLoading] = useState(false);

  /**
   * WHAT: Sets user data in global state and localStorage
   * INPUT: userData - Object with username and id
   * OUTPUT: Updates user state and saves to localStorage
   */
  const setUser = useCallback((userData) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem("chat-user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("chat-user");
    }
  }, []);

  /**
   * WHAT: Fetches chat history from server
   * INPUT: None (uses API endpoint)
   * OUTPUT: Updates messages state or shows error alert
   */
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetchMessages();
      // Ensure messages is always an array
      setMessages(Array.isArray(data) ? data : data?.messages || []);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setMessages([]); // Reset to empty array on error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load chat history. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * WHAT: Adds a new message to the messages array
   * INPUT: message - Message object with username, content, timestamp, etc.
   * OUTPUT: Appends message to messages state
   */
  const addMessage = useCallback((message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  /**
   * WHAT: Prepares message data for sending
   * INPUT: content - Message text, imageUrl - Optional image URL
   * OUTPUT: Returns formatted message object or null if not authenticated
   */
  const sendMessage = useCallback(
    (content, imageUrl = null) => {
      if (!user) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "You must be logged in to send messages.",
        });
        return null;
      }

      const messageData = {
        userId: user.id,
        username: user.username,
        content,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
      };

      return messageData;
    },
    [user],
  );

  /**
   * WHAT: Generates AI summary of chat messages
   * INPUT: None (uses messages from state)
   * OUTPUT: Shows loading modal, then displays AI summary or error
   */
  const summarizeChat = useCallback(async () => {
    if (!Array.isArray(messages) || messages.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Messages",
        text: "There are no messages to summarize.",
      });
      return;
    }

    try {
      // Show loading state
      Swal.fire({
        title: "Generating Summary...",
        text: "Please wait while AI summarizes the chat.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await apiSummarizeChat();

      // Show the summary in a modal
      Swal.fire({
        icon: "success",
        title: "Chat Summary",
        html: `<div class="text-left"><p>${response.summary || response.data?.summary || "No summary available."}</p></div>`,
        confirmButtonText: "Close",
        width: "600px",
      });
    } catch (error) {
      console.error("Failed to summarize chat:", error);

      // Determine error message
      let errorMessage = "Failed to generate summary. Please try again.";

      if (error.response) {
        // Server responded with error
        if (error.response.status === 500) {
          errorMessage =
            "Server error occurred. Please check if the AI service is configured correctly.";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage =
          "Cannot connect to server. Please check your connection.";
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  }, [messages]);

  /**
   * Context value object containing all state and methods
   */
  const value = {
    user,
    setUser,
    messages,
    setMessages,
    addMessage,
    fetchMessages,
    sendMessage,
    summarizeChat,
    loading,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
