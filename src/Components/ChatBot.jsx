import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import "../CSS/ChatBot.css";
import logo2 from "../Images/logo2.png";
import helpIcon from "../Images/help.png";
import { FaTimes, FaTrash, FaPaperPlane } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

const BASE_URL = process.env.REACT_APP_BASE_URL;

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

    const initialMessages = refreshed
      ? [INITIAL_BOT_MESSAGE]
      : savedMessages
      ? JSON.parse(savedMessages)
      : [INITIAL_BOT_MESSAGE];

    if (refreshed) sessionStorage.removeItem("refreshed");

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    if (!trimmedInput || loading) return;

    const userMessage = { sender: "user", text: trimmedInput };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/chat`,
        {
          question: trimmedInput,
          history: updatedMessages.map(({ sender, text }) => ({
            sender,
            text,
          })),
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const rawResponse = response.data?.text || response.data;
      const botText = parseBotResponse(rawResponse || "Sorry, no response.");
      setMessages((prev) => [...prev, { sender: "bot", text: botText }]);
    } catch (error) {
      console.error("ChatBot Error:", error);

      let errorMsg = "An error occurred. Please try again.";

      if (error.response) {
        errorMsg =
          error.response.data?.message ||
          `Error ${error.response.status}: Something went wrong.`;
      } else if (error.request) {
        errorMsg = "Server unreachable. Please check your internet connection.";
      }

      setMessages((prev) => [...prev, { sender: "bot", text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  

  return (
    <>
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
          <div
            className="chatbot-overlay"
            onClick={toggleChatbot}
            aria-hidden="true"
          />

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
                  style={{ whiteSpace: "normal" }}
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
                  style={{ whiteSpace: "normal" }}
                >
                  <div className="chatbot-typing-indicator">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </div>
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
                disabled={loading}
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
