import React, { useState } from "react";
import "../CSS/ChatBot.css"; // Ensure this file exists for styling
import helpIcon from "../Images/help.png";

const ChatBot = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // State to manage chatbot visibility
  const [messages, setMessages] = useState([]); // Chat messages
  const [inputValue, setInputValue] = useState(""); // User input

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev);
  };

  // Handle message submission
  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: inputValue },
      ]);
      setInputValue("");

      // Simulate a bot response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "bot",
            text: "Thank you for your message! How can I help?",
          },
        ]);
      }, 1000);
    }
  };

  return (
    <>
      {/* Help Icon */}
      <div className="help" onClick={toggleChatbot}>
        <img src={helpIcon} alt="Help Icon" className="helpImage" />
        <h6>Get Help</h6>
        <br />
      </div>

      {/* Chatbot Popup */}
      {isChatbotOpen && (
        <div className="chatbot-container">
          {/* Chatbot Header */}
          <div className="chatbot-header">
            <h3>Chat with Us!</h3>
            <button onClick={toggleChatbot} className="chatbot-close-btn">
              X
            </button>
          </div>

          {/* Chat Messages */}
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chatbot-message ${
                  message.sender === "user" ? "user-message" : "bot-message"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="chatbot-input-container">
            <input
              type="text"
              className="chatbot-input"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button className="chatbot-send-btn" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;