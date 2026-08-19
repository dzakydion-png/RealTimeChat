import { useChatContext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import userIcon from "../assets/user-icon.png";

/**
 * WHAT: Sidebar component displaying online users and logout functionality
 * INPUT: None (uses data from ChatContext)
 * OUTPUT: Renders list of unique users with avatars, online status, and logout button
 */
export default function Sidebar() {
  const navigate = useNavigate();

  // Get user and messages from Context
  const { user, messages, setUser } = useChatContext();

  /**
   * WHAT: Extracts unique users from all messages
   * INPUT: None (uses messages from context)
   * OUTPUT: Array of unique user objects with username only
   */
  const getUniqueUsers = () => {
    const usersMap = new Map();

    messages.forEach((message) => {
      const username = message.User?.username || message.username;
      if (username && !usersMap.has(username)) {
        usersMap.set(username, {
          username: username,
        });
      }
    });

    // Add current user if not in the list
    if (user && !usersMap.has(user.username)) {
      usersMap.set(user.username, { username: user.username });
    }

    return Array.from(usersMap.values());
  };

  /**
   * WHAT: Handles logout confirmation and navigation
   * INPUT: None (button click)
   * OUTPUT: Shows confirmation dialog, navigates to home on confirm
   */
  const handleLogout = () => {
    Swal.fire({
      title: "Logout",
      text: "Are you sure you want to leave the chat?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    }).then((result) => {
      if (result.isConfirmed) {
        setUser(null);
        navigate("/");
      }
    });
  };

  const uniqueUsers = getUniqueUsers();

  return (
    <div className="w-72 bg-gradient-to-b from-gray-50 to-white border-r-2 border-gray-200 flex flex-col h-full shadow-xl">
      {/* Sidebar Header */}
      <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Online Users</h2>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-sm text-gray-600 font-bold">
            {uniqueUsers.length} user{uniqueUsers.length !== 1 ? "s" : ""}{" "}
            active
          </p>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {uniqueUsers.map((u) => (
          <div
            key={u.username}
            className={`group flex items-center gap-4 p-3 rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
              user && u.username === user.username
                ? "bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300 shadow-md"
                : "bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-2 border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-md"
            }`}
          >
            {/* User Avatar */}
            <div className="relative">
              <img
                src={userIcon}
                alt={`${u.username}'s avatar`}
                className="w-12 h-12 rounded-full object-cover border-3 border-white shadow-lg ring-2 ring-gray-200 group-hover:ring-blue-400 transition-all duration-300"
              />
              {/* Online Indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
            </div>

            {/* Username */}
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                {u.username}
              </p>
              {user && u.username === user.username && (
                <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-bold mt-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  You
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="p-5 border-t-2 border-gray-200 bg-gradient-to-r from-red-50 to-pink-50">
        <button
          onClick={handleLogout}
          className="group w-full px-5 py-3.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Leave Chat
        </button>
      </div>
    </div>
  );
}
