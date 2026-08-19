import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";

/**
 * Main App Component
 * Sets up routing and global context providers
 */
function App() {
  return (
    <ChatProvider>
      <Router>
        <Routes>
          {/* Landing Page - Entry point for users */}
          <Route path="/" element={<LandingPage />} />

          {/* Chat Page - Main chat interface */}
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </Router>
    </ChatProvider>
  );
}

export default App;
