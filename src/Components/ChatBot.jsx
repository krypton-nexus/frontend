import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/ChatBot.css";
import logo2 from "../Images/logo2.png";
import helpIcon from "../Images/help.png";
import { FaTimes, FaTrash } from "react-icons/fa";

const ChatBot = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatbotHistory");
    const refreshed = sessionStorage.getItem("refreshed");

    if (refreshed) {
      localStorage.removeItem("chatbotHistory");
      sessionStorage.removeItem("refreshed");
      return [{ sender: "bot", text: "Hi! How may I assist you?" }];
    }
    return savedMessages
      ? JSON.parse(savedMessages)
      : [{ sender: "bot", text: "Hi! How may I assist you?" }];
  });

  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem("chatbotHistory", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("refreshed", "true");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev);
  };
  const sendMessage = async () => {
    const messageText = input.trim();
    if (!messageText) return;

    const userMessage = { sender: "user", text: messageText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      const userMessagesOnly = updatedMessages.filter(
        (msg) => msg.sender === "user"
      );

      const response = await axios.post(
        "http://43.205.202.255:5000/chat",
        {
          question: messageText,
          history: userMessagesOnly,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Raw API Response:", response.data);

      let botText = "I couldn't process your request. Please try again.";
      let parsedData;

      if (typeof response.data === "string") {
        try {
          const sanitizedResponse = response.data.replace(
            /[\u0000-\u001F]/g,
            ""
          );

          parsedData = JSON.parse(sanitizedResponse);
        } catch (parseError) {
          console.error("Error parsing response JSON:", parseError);
        }
      } else {
        parsedData = response.data;
      }

      if (parsedData && parsedData.text) {
        botText = parsedData.text.replace(/\\n/g, "\n");
      }

      setMessages((prev) => [...prev, { sender: "bot", text: botText }]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "An error occurred. Please try again." },
      ]);
    }
  };

  const clearChatHistory = () => {
    localStorage.removeItem("chatbotHistory");
    setMessages([{ sender: "bot", text: "Hi! How may I assist you?" }]);
  };

  return (
    <>
      <div className="help" onClick={toggleChatbot}>
        <img src={helpIcon} alt="Help Icon" className="helpImage" />
        <h6>Get Help</h6>
      </div>

      {isChatbotOpen && (
        <div className="chatbot-overlay" onClick={toggleChatbot}></div>
      )}

      {isChatbotOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <img src={logo2} alt="ChatBot Logo" className="chatbot-logo" />
            <h3>Chat with Us!</h3>
            <div className="chatbot-header-icons">
              <FaTrash
                className="chatbot-bin-icon"
                onClick={clearChatHistory}
                title="Clear Chat"
              />
              <FaTimes
                className="chatbot-close-btn"
                onClick={toggleChatbot}
                title="Close"
              />
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chatbot-message ${
                  message.sender === "user" ? "user-message" : "bot-message"
                }`}
                style={{ whiteSpace: "pre-wrap" }}>
                {message.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input-container">
            <input
              type="text"
              className="chatbot-input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button className="chatbot-send-btn" onClick={sendMessage}>
              Send
            </button>
          </div>

          {/* <button className="clear-history-btn" onClick={clearChatHistory}>
            Clear History
          </button> */}
        </div>
      )}
    </>
  );
};

export default ChatBot;
