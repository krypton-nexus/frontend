import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import "../CSS/ChatBot.css";
import logo2 from "../Images/logo2.png";
import helpIcon from "../Images/help.png";
import { FaTimes, FaTrash, FaPaperPlane } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

const INITIAL_BOT_MESSAGE = {
  sender: "bot",
  text: "Hi! How may I assist you?",
};
const parseBotResponse = (data) => {
  let result = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  result = result.trim();

  if (result.startsWith("{") && result.endsWith("}")) {
    result = result.substring(1, result.length - 1).trim();
  }

  if (result.startsWith('"') && result.endsWith('"')) {
    result = result.substring(1, result.length - 1).trim();
  }

  result = result
    .replace(/^text":\s*"/, "")
    .replace(/"$/, "")
    .trim();

  return result;
};

const ChatBot = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatbotHistory");
    const refreshed = sessionStorage.getItem("refreshed");
    let initialMessages;
    if (refreshed) {
      sessionStorage.removeItem("refreshed");
      initialMessages = [INITIAL_BOT_MESSAGE];
    } else {
      initialMessages = savedMessages
        ? JSON.parse(savedMessages)
        : [INITIAL_BOT_MESSAGE];
    }
    return initialMessages.map((msg) =>
      msg.sender === "bot" && typeof msg.text !== "string"
        ? { ...msg, text: parseBotResponse(msg.text) }
        : msg
    );
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("chatbotHistory", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("refreshed", "true");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleChatbot = useCallback(() => {
    setIsChatbotOpen((prev) => !prev);
  }, []);

  const clearChatHistory = useCallback(() => {
    localStorage.removeItem("chatbotHistory");
    setMessages([INITIAL_BOT_MESSAGE]);
  }, []);

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const userMessage = { sender: "user", text: trimmedInput };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const userMessagesOnly = updatedMessages.filter(
        (msg) => msg.sender === "user"
      );
      const response = await axios.post(
        "http://43.205.202.255:5000/chat",
        {
          question: trimmedInput,
          history: userMessagesOnly,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      const rawResponse = response.data.text
        ? response.data.text
        : response.data;
      const botText = parseBotResponse(rawResponse || "Sorry, no response.");
      setMessages((prev) => [...prev, { sender: "bot", text: botText }]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "An error occurred. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Help button to toggle chatbot */}
      <div
        className="help"
        onClick={toggleChatbot}
        role="button"
        aria-label="Open Chatbot"
      >
        <img src={helpIcon} alt="Help Icon" className="helpImage" />
        <h6>Get Help</h6>
      </div>

      {isChatbotOpen && (
        <>
          {/* Overlay */}
          <div
            className="chatbot-overlay"
            onClick={toggleChatbot}
            aria-hidden="true"
          ></div>
          {/* Chatbot container */}
          <aside className="chatbot-container" aria-label="Chatbot">
            <header className="chatbot-header">
              <img src={logo2} alt="ChatBot Logo" className="chatbot-logo" />
              <h3>Chat with Us!</h3>
              <div className="chatbot-header-icons">
                <button
                  className="chatbot-btn chatbot-bin-icon"
                  onClick={clearChatHistory}
                  title="Clear Chat"
                  aria-label="Clear Chat"
                >
                  <FaTrash />
                </button>
                <button
                  className="chatbot-btn chatbot-close-btn"
                  onClick={toggleChatbot}
                  title="Close"
                  aria-label="Close Chatbot"
                >
                  <FaTimes />
                </button>
              </div>
            </header>

            <main className="chatbot-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chatbot-message ${
                    message.sender === "user" ? "user-message" : "bot-message"
                  }`}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {message.sender === "bot" ? (
                    <ReactMarkdown>
                      {typeof message.text === "string"
                        ? message.text
                        : parseBotResponse(message.text)}
                    </ReactMarkdown>
                  ) : (
                    message.text
                  )}
                </div>
              ))}
              {loading && (
                <div
                  className="chatbot-message bot-message"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  <ReactMarkdown>thinking.....</ReactMarkdown>
                </div>
              )}
              <div ref={messagesEndRef} />
            </main>

            <footer className="chatbot-input-container">
              <input
                type="text"
                className="chatbot-input"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Chat input"
              />
              <button
                type="button"
                className="message-send-button"
                onClick={sendMessage}
                disabled={loading}
                aria-label="Send message"
              >
                <FaPaperPlane />
              </button>
            </footer>
          </aside>
        </>
      )}
    </>
  );
};

export default ChatBot;
