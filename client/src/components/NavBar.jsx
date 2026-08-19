import { useChatContext } from "../context/ChatContext";
import PropTypes from "prop-types";
import userIcon from "../assets/user-icon.png";

/**
 * WHAT: Navbar component displaying app header with user info and actions
 * INPUT: onSummarize - Callback function when AI Summarize button is clicked
 * OUTPUT: Renders navigation bar with logo, AI summarize button, and user info
 */
export default function Navbar({ onSummarize }) {
  // Get user data from Context
  const { user } = useChatContext();

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white shadow-xl border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center gap-3 group">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
              <svg
                className="w-7 h-7"
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
            <h1 className="text-2xl font-bold tracking-tight">
              Real-Time Chat
            </h1>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                {/* AI Summarize Button */}
                <button
                  onClick={onSummarize}
                  className="group px-5 py-2.5 bg-white/90 backdrop-blur-sm text-blue-600 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 font-bold text-sm flex items-center gap-2 border border-white/20 hover:scale-105 transform"
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
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  AI Summarize
                </button>

                {/* User Avatar and Name */}
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <img
                    src={userIcon}
                    alt={`${user.username}'s avatar`}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-lg"
                  />
                  <span className="font-bold text-lg">{user.username}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  onSummarize: PropTypes.func,
};

Navbar.defaultProps = {
  onSummarize: () => {},
};
