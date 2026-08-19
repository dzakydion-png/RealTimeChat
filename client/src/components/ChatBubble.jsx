import PropTypes from "prop-types";
import userIcon from "../assets/user-icon.png";

/**
 * WHAT: ChatBubble component displaying a single message in the chat
 * INPUT: message - Message object with user data, content, and timestamp
 *        isCurrentUser - Boolean indicating if message is from current user
 * OUTPUT: Renders message bubble with avatar, username, content, optional image, and timestamp
 */
export default function ChatBubble({ message, isCurrentUser }) {
  const username = message.User?.username || message.username;
  const content = message.content;
  const image_url = message.imgUrl || message.image_url;
  const created_at = message.createdAt || message.created_at;

  /**
   * WHAT: Formats ISO timestamp to readable time
   * INPUT: timestamp - ISO date string
   * OUTPUT: Formatted time string (e.g., "02:45 PM")
   */
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex items-start gap-4 mb-6 animate-fade-in ${
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="relative group">
          <img
            src={userIcon}
            alt={`${username}'s avatar`}
            className="w-11 h-11 rounded-full object-cover border-3 border-white shadow-lg ring-2 ring-gray-200 group-hover:ring-blue-400 transition-all duration-300 transform group-hover:scale-110"
          />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
        </div>
      </div>

      {/* Message Content */}
      <div
        className={`flex flex-col max-w-xs lg:max-w-md ${
          isCurrentUser ? "items-end" : "items-start"
        }`}
      >
        {/* Username */}
        <p
          className={`text-xs font-bold mb-2 ${
            isCurrentUser ? "text-blue-600" : "text-gray-700"
          }`}
        >
          {username}
        </p>

        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-5 py-3 shadow-lg transform hover:scale-[1.02] transition-all duration-200 ${
            isCurrentUser
              ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-tr-sm"
              : "bg-white text-gray-800 rounded-tl-sm border border-gray-200"
          }`}
        >
          {/* Text Content */}
          {content && (
            <p className="text-base break-words whitespace-pre-wrap leading-relaxed">
              {content}
            </p>
          )}

          {/* Optional Image */}
          {image_url && (
            <div className={content ? "mt-3" : ""}>
              <img
                src={image_url}
                alt="Message attachment"
                className="rounded-xl max-w-full h-auto max-h-64 object-cover shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border-2 border-white/20"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <svg
            className="w-3 h-3 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-xs text-gray-500 font-medium">
            {formatTime(created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}

ChatBubble.propTypes = {
  message: PropTypes.shape({
    username: PropTypes.string.isRequired,
    content: PropTypes.string,
    image_url: PropTypes.string,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
};
