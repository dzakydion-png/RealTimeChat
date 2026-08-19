import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "../context/ChatContext";
import useSocket from "../hooks/useSocket";
import Navbar from "../components/NavBar";
import Sidebar from "../components/SideBar";
import ChatBubble from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";

/**
 * WHAT: ChatPage component - Main chat interface for real-time messaging
 * INPUT: None (uses authenticated session from ChatContext)
 * OUTPUT: Renders chat interface with messages, input, and real-time updates
 */
export default function ChatPage() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Get chat data and methods from Context (single source of truth)
  const {
    user,
    messages,
    addMessage,
    fetchMessages,
    sendMessage,
    summarizeChat,
    loading,
  } = useChatContext();
  /**
   * WHAT: Handles incoming real-time messages from socket
   * INPUT: message - Message object received from socket server
   * OUTPUT: Adds message to global state via context
   */
  const handleReceiveMessage = (message) => {
    addMessage(message);
  };

  // Initialize socket event listeners with message handler
  const { sendMessage: socketSendMessage } = useSocket(handleReceiveMessage);

  // Check authentication on mount
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  // Fetch chat history when user is authenticated
  useEffect(() => {
    if (user) {
      fetchMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * WHAT: Scrolls chat container to the bottom to show latest messages
   * INPUT: None (uses messagesEndRef)
   * OUTPUT: Smooth scroll animation to bottom of messages
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * WHAT: Sends a new message through socket
   * INPUT: content - Message text, imageUrl - Optional image URL
   * OUTPUT: Emits message via socket to server
   */
  const handleSendMessage = (content, imageUrl) => {
    const messageData = sendMessage(content, imageUrl);

    if (messageData) {
      // Send message through socket to server
      socketSendMessage(messageData);
    }
  };

  /**
   * WHAT: Triggers AI summarization of chat history
   * INPUT: None (button click)
   * OUTPUT: Shows loading modal then displays AI summary in SweetAlert
   */
  const handleSummarize = () => {
    summarizeChat();
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <Navbar onSummarize={handleSummarize} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar key={user.id} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div
                className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-3 text-gray-600">Loading messages...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Navbar */}
      <Navbar onSummarize={handleSummarize} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-8 space-y-2 bg-gradient-to-b from-transparent to-white/50">
            {loading ? (
              // Loading State
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-700 font-bold text-lg">
                    Loading messages...
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Please wait a moment
                  </p>
                </div>
              </div>
            ) : !Array.isArray(messages) || messages.length === 0 ? (
              // Empty State
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full animate-pulse"></div>
                    <svg
                      className="relative w-24 h-24 text-blue-500 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-800 text-2xl font-bold mb-3">
                    No messages yet
                  </p>
                  <p className="text-gray-600 text-base mb-6">
                    Be the first to start the conversation!
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                    Type a message below to get started
                  </div>
                </div>
              </div>
            ) : (
              // Messages List
              <>
                {Array.isArray(messages) &&
                  messages.map((message, index) => (
                    <ChatBubble
                      key={`${message.username}-${message.created_at}-${index}`}
                      message={message}
                      isCurrentUser={message.username === user.username}
                    />
                  ))}
                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Chat Input */}
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
