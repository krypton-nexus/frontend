import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/ChatBot.css";
import helpIcon from "../Images/help.png";
import { RiImageAddLine } from "react-icons/ri";
import { createWorker } from "tesseract.js";

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
  const [image, setImage] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);

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

  const extractTextFromImage = async (imageFile) => {
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(imageFile);
    await worker.terminate();
    return text;
  };

  const sendMessage = async () => {
    const messageText = input.trim();

    if (!messageText && !image) return;

    if (!image && messageText.toLowerCase().includes("image")) {
      const clarificationMessage = {
        sender: "bot",
        text: "It seems like there's a bit of confusion as there's no image attached to your message. Could you please provide more details, describe the image, or rephrase your question?",
      };
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: messageText },
        clarificationMessage,
      ]);
      setInput("");
      return;
    }
    const userMessage = {
      sender: "user",
      text: messageText || "Image attached",
      image: image ? URL.createObjectURL(image) : null,
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    let extractedTextFromImage = "";
    if (image) {
      setOcrLoading(true);
      try {
        extractedTextFromImage = await extractTextFromImage(image);
      } catch (err) {
        console.error("OCR error: ", err);
      }
      setOcrLoading(false);

      if (!messageText && extractedTextFromImage.trim() === "") {
        const clarificationMessage = {
          sender: "bot",
          text: "It seems like there's no clear text in the attached image. Could you please provide more details or rephrase your question?",
        };
        setMessages((prevMessages) => [...prevMessages, clarificationMessage]);
        setImage(null);
        return;
      }
    }
    setImage(null);

    try {
      const response = await axios.post(
        "http://43.205.202.255:5000/chat",
        {
          question: messageText,
          history: updatedMessages,
          extractedText: extractedTextFromImage,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const botMessage = {
        sender: "bot",
        text: response.data.text || "I couldn't understand that.",
      };

      if (response.data.image) {
        botMessage.image = response.data.image;
      }
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      const botErrorMessage = {
        sender: "bot",
        text: "An error occurred. Please try again.",
      };
      setMessages((prevMessages) => [...prevMessages, botErrorMessage]);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
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
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attached"
                    className="chatbot-image"
                  />
                )}
              </div>
            ))}
            {ocrLoading && (
              <div className="ocr-loading">
                <div className="spinner"></div>
                <span>Processing image...</span>
              </div>
            )}
          </div>

          <div className="chatbot-input-container">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
              id="image-upload"
            />
            <label htmlFor="image-upload" className="chatbot-upload-btn">
              <RiImageAddLine className="upload-icon" />
            </label>
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

          <button className="clear-history-btn" onClick={clearChatHistory}>
            Clear History
          </button>
        </div>
      )}
    </>
  );
};

export default ChatBot;
