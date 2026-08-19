import { useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { serverApi } from "../helpers/http-server";

/**
 * WHAT: ChatInput component providing message input with image upload to Cloudinary
 * INPUT: onSendMessage - Callback function to handle message submission
 * OUTPUT: Renders form with text input and image upload, sends data on submit
 */
export default function ChatInput({ onSendMessage }) {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  /**
   * WHAT: Uploads image file to Cloudinary via backend API
   * INPUT: file - Image file object from file input
   * OUTPUT: Returns Cloudinary URL string or null if upload fails
   */
  const uploadImageToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await serverApi.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.imgUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Failed to upload image. Please try again.",
      });
      return null;
    }
  };

  /**
   * WHAT: Handles form submission and sends message with optional image
   * INPUT: e - Form submit event
   * OUTPUT: Uploads image if present, validates input, calls onSendMessage callback, resets form
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that there's content to send
    if (!content.trim() && !imageFile) {
      return;
    }

    let imageUrl = null;

    // Upload image to Cloudinary if file is selected
    if (imageFile) {
      setUploading(true);
      imageUrl = await uploadImageToCloudinary(imageFile);
      setUploading(false);

      // If upload failed, don't send the message
      if (!imageUrl) {
        return;
      }
    }

    // Call the parent callback with message data
    onSendMessage(content.trim(), imageUrl);

    // Reset form fields
    setContent("");
    setImageFile(null);
    // Reset file input
    const fileInput = document.getElementById("image-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  /**
   * WHAT: Handles Enter key press for quick message send
   * INPUT: e - Keyboard event
   * OUTPUT: Submits form on Enter (without Shift), prevents default behavior
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  /**
   * WHAT: Handles file input change event
   * INPUT: e - Change event from file input
   * OUTPUT: Validates file type and size, sets imageFile state
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please select an image file (JPG, PNG, GIF, etc.)",
      });
      e.target.value = "";
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Please select an image smaller than 5MB",
      });
      e.target.value = "";
      return;
    }

    setImageFile(file);
  };

  return (
    <div className="bg-gradient-to-t from-gray-50 to-white border-t-2 border-gray-200 p-5 shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload Input */}
        <div className="flex items-center gap-3 bg-blue-50/50 rounded-xl p-3 border border-blue-100">
          <label
            htmlFor="image-upload"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
              Attach Image
            </span>
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {imageFile && (
            <div className="flex items-center gap-2 ml-auto bg-green-100 px-3 py-1.5 rounded-lg border border-green-200 animate-fade-in">
              <svg
                className="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs text-green-700 font-bold truncate max-w-[150px]">
                {imageFile.name}
              </span>
            </div>
          )}
        </div>

        {/* Message Input and Send Button */}
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows="1"
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 resize-none text-base transition-all duration-200 hover:border-gray-300 placeholder-gray-400 bg-white shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={(!content.trim() && !imageFile) || uploading}
            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none flex items-center gap-2"
          >
            {uploading ? (
              <>
                <span
                  className="inline-block w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <span>Send</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
};
