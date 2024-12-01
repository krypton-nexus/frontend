import React, { useState } from "react";
import axios from "axios";
import "../CSS/ChatBot.css";
import helpIcon from "../Images/help.png";

const ChatBot = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Toggles the visibility of the chatbot
  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to the chat
    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput(""); // Clear the input field

    try {
      // Send the user's message to the server
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        message: input.trim(),
        //history: messages,
        system_message: "You are a friendly chatbot.",
      });

      // Extract the bot's response from the API
      const botResponse = response?.data || "I couldn't understand that.";

      // Add bot response to the chat
      const botMessage = { sender: "bot", text: botResponse };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching bot response:", error);

      // Add error message to the chat
      const botErrorMessage = {
        sender: "bot",
        text: "An error occurred. Please try again.",
      };
      setMessages((prevMessages) => [...prevMessages, botErrorMessage]);
    }
  };

  return (
    <>
      <div className="help" onClick={toggleChatbot}>
        <img src={helpIcon} alt="Help Icon" className="helpImage" />
        <h6>Get Help</h6>
      </div>

      {isChatbotOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h3>Chat with Us!</h3>
            <button onClick={toggleChatbot} className="chatbot-close-btn">
              X
            </button>
          </div>

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

          <div className="chatbot-input-container">
            <input
              type="text"
              className="chatbot-input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="chatbot-send-btn" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
