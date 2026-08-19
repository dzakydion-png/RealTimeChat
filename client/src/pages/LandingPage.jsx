import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "../context/ChatContext";
import Swal from "sweetalert2";

/**
 * WHAT: Landing page for user authentication and profile setup
 * INPUT: None (initial entry point)
 * OUTPUT: Renders login form with username input, redirects to chat on submit
 */
export default function LandingPage() {
  const navigate = useNavigate();

  // Get user and setUser method from Context
  const { user, setUser } = useChatContext();

  // Local form state
  const [username, setUsername] = useState("");

  // Redirect to chat if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/chat");
    }
  }, [user, navigate]);

  /**
   * WHAT: Handles form submission to join the chat
   * INPUT: e - Form submit event
   * OUTPUT: Validates input, creates user in database, saves to context, navigates to chat
   */
  const handleJoinChat = async (e) => {
    e.preventDefault();

    // Validate username is not empty
    if (!username.trim()) {
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Please enter a username.",
      });
      return;
    }

    try {
      // Create or get user from database
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });

      if (!response.ok) throw new Error("Failed to create user");

      const user = await response.json();

      // Save user data to global context with userId
      setUser(user);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: `Welcome to the chat, ${user.username}!`,
        timer: 1500,
        showConfirmButton: false,
      });

      // Navigate to chat page
      navigate("/chat");
    } catch (error) {
      console.error("Error creating user:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to join chat. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-md border border-white/20 transform hover:scale-[1.02] transition-transform duration-300">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg transform hover:rotate-6 transition-transform duration-300">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Real-Time Chat
          </h1>
          <p className="text-gray-600 text-lg">Join the conversation now!</p>
        </div>

        {/* Form */}
        <form onSubmit={handleJoinChat} className="space-y-6">
          {/* Username Input */}
          <div className="group">
            <label
              htmlFor="username"
              className="block text-sm font-bold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"></div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800 placeholder-gray-400 hover:border-gray-300"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group"
          >
            <span className="relative z-10">Join Chat</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <p>Connect with people from around the world</p>
          </div>
        </div>
      </div>
    </div>
  );
}
