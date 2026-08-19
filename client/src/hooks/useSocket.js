import { useEffect } from "react";
import { socket } from "../helpers/http-server";

/**
 * WHAT: Custom hook to manage socket.io event listeners
 * INPUT: onReceiveMessage - Callback function when a new message is received
 * OUTPUT: Object with sendMessage function for emitting messages
 */
export default function useSocket(onReceiveMessage) {
  useEffect(() => {
    /**
     * WHAT: Listen for incoming messages from the server
     * INPUT: Message object from server
     * OUTPUT: Calls onReceiveMessage callback with the message
     */
    const handleMessage = (message) => {
      console.log("Received message:", message);
      if (onReceiveMessage) {
        onReceiveMessage(message);
      }
    };

    /**
     * WHAT: Handle socket connection event
     * INPUT: None (triggered by socket connection)
     * OUTPUT: Logs connection status with socket ID
     */
    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
    };

    /**
     * WHAT: Handle socket disconnection event
     * INPUT: None (triggered by socket disconnection)
     * OUTPUT: Logs disconnection status
     */
    const handleDisconnect = () => {
      console.log("Socket disconnected");
    };

    /**
     * WHAT: Handle socket connection errors
     * INPUT: error - Error object from socket connection
     * OUTPUT: Logs error details
     */
    const handleError = (error) => {
      console.error("Socket connection error:", error);
    };

    // receive-message - Listen for broadcasted messages
    socket.on("receive-message", handleMessage);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);

    // Cleanup function to remove event listeners on unmount
    return () => {
      socket.off("receive-message", handleMessage);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
    };
  }, [onReceiveMessage]);

  /**
   * WHAT: Send a message through the socket
   * INPUT: messageData - The message object to send to the server
   * OUTPUT: Emits 'send-message' event or logs error if disconnected
   */
  const sendMessage = (messageData) => {
    if (socket && socket.connected) {
      // send-message - Emit message event to server
      socket.emit("send-message", messageData);
      console.log("Message sent:", messageData);
    } else {
      console.error("Socket is not connected");
    }
  };

  return {
    sendMessage,
  };
}
