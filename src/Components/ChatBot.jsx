// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../CSS/ChatBot.css";
// import helpIcon from "../Images/help.png";
// import { RiImageAddLine } from "react-icons/ri";

// const ChatBot = () => {
//   const [isChatbotOpen, setIsChatbotOpen] = useState(false);

//   const [messages, setMessages] = useState(() => {
//     // Check if the page was refreshed
//     const savedMessages = localStorage.getItem("chatbotHistory");
//     const refreshed = sessionStorage.getItem("refreshed");

//     if (refreshed) {
//       // Clear saved messages if the page was refreshed
//       localStorage.removeItem("chatbotHistory");
//       sessionStorage.removeItem("refreshed");
//       return [{ sender: "bot", text: "Hi! How may I assist you?" }];
//     }

//     return savedMessages
//       ? JSON.parse(savedMessages)
//       : [{ sender: "bot", text: "Hi! How may I assist you?" }];
//   });

//   // const [messages, setMessages] = useState(() => {
//   //   // Load chat history from localStorage
//   //   const savedMessages = localStorage.getItem("chatbotHistory");
//   //   return savedMessages ? JSON.parse(savedMessages) : [];
//   // });
//   const [input, setInput] = useState("");

//   // Effect to save messages to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem("chatbotHistory", JSON.stringify(messages));
//   }, [messages]);

//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       sessionStorage.setItem("refreshed", "true");
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, []);

//   // Toggles the visibility of the chatbot
//   const toggleChatbot = () => {
//     setIsChatbotOpen((prev) => !prev); // Simply toggle visibility
//   };
//   const [image, setImage] = useState(null);
//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = { sender: "user", text: input.trim() };
//     const updatedMessages = [...messages, userMessage];

//     setMessages(updatedMessages); // Update state with the new message
//     setInput(""); // Clear input field
//     setImage(null); // Reset image after sending

//     const formData = new FormData();
//     formData.append("message", input.trim());
//     if (image) {
//       formData.append("image", image); // Append image if selected
//     }
//     formData.append("history", JSON.stringify(updatedMessages));

//     try {
//       const response = await axios.post("http://127.0.0.1:8000/chat", {
//         message: input.trim(),
//         history: updatedMessages, // Send the updated history to the backend
//         system_message: "You are a friendly chatbot.",
//       });

//       // const botResponse = response?.data || "I couldn't understand that.";
//       // const botMessage = { sender: "bot", text: botResponse };
//       const botMessage = {
//         sender: "bot",
//         text: response?.data || "I couldn't understand that.",
//       };
//       // If the response contains an image URL, include it in the message
//       if (response?.data.image) {
//         botMessage.image = response?.data.image; // Image response from the backend
//         botMessage.text = "Here is the image you requested:";
//       }

//       setMessages((prevMessages) => [...prevMessages, botMessage]); // Update messages with bot's response
//     } catch (error) {
//       console.error("Error fetching bot response:", error);
//       const botErrorMessage = {
//         sender: "bot",
//         text: "An error occurred. Please try again.",
//       };
//       setMessages((prevMessages) => [...prevMessages, botErrorMessage]);
//     }
//   };
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file); // Store the selected image
//     }
//   };

//   // const sendMessage = async () => {
//   //   if (!input.trim()) return;

//   //   const userMessage = { sender: "user", text: input.trim() };
//   //   setMessages((prevMessages) => [...prevMessages, userMessage]);
//   //   setInput("");

//   //   try {
//   //     const response = await axios.post("http://127.0.0.1:8000/chat", {
//   //       message: input.trim(),
//   //       system_message: "You are a friendly chatbot.",
//   //     });

//   //     const botResponse = response?.data || "I couldn't understand that.";
//   //     const botMessage = { sender: "bot", text: botResponse };
//   //     setMessages((prevMessages) => [...prevMessages, botMessage]);
//   //   } catch (error) {
//   //     console.error("Error fetching bot response:", error);
//   //     const botErrorMessage = {
//   //       sender: "bot",
//   //       text: "An error occurred. Please try again.",
//   //     };
//   //     setMessages((prevMessages) => [...prevMessages, botErrorMessage]);
//   //   }
//   // };

//   const clearChatHistory = () => {
//     // Clear history in localStorage and reset messages to the initial bot prompt
//     localStorage.removeItem("chatbotHistory");
//     setMessages([{ sender: "bot", text: "Hi! How may I assist you?" }]);
//   };

//   return (
//     <>
//       <div className="help" onClick={toggleChatbot}>
//         <img src={helpIcon} alt="Help Icon" className="helpImage" />
//         <h6>Get Help</h6>
//       </div>

//       {isChatbotOpen && (
//         <div className="chatbot-container">
//           <div className="chatbot-header">
//             <h3>Chat with Us!</h3>
//             <button onClick={toggleChatbot} className="chatbot-close-btn">
//               X
//             </button>
//           </div>

//           <div className="chatbot-messages">
//             {messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={`chatbot-message ${
//                   message.sender === "user" ? "user-message" : "bot-message"
//                 }`}
//               >
//                 {message.text}
//                 {message.image && (
//                   <img
//                     src={message.image}
//                     alt="Requested visual"
//                     className="chatbot-image"
//                   />
//                 )}
//               </div>
//             ))}
//           </div>

//           <div className="chatbot-input-container">
//             {/* Image Upload Button with RiImageAddLine icon */}
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               style={{ display: "none" }}
//               id="image-upload"
//             />
//             <label htmlFor="image-upload" className="chatbot-upload-btn">
//               <RiImageAddLine className="upload-icon" />
//             </label>
//             <input
//               type="text"
//               className="chatbot-input"
//               placeholder="Type a message..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             />

//             <button className="chatbot-send-btn" onClick={sendMessage}>
//               Send
//             </button>
//           </div>
//           <button className="clear-history-btn" onClick={clearChatHistory}>
//             Clear History
//           </button>
//         </div>
//       )}
//     </>
//   );
// };

// export default ChatBot;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/ChatBot.css";
import helpIcon from "../Images/help.png";
import { RiImageAddLine } from "react-icons/ri";

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
    if (!input.trim() && !image) return;

    const userMessage = { sender: "user", text: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput(""); // Clear input
    setImage(null); // Reset image selection

    const formData = new FormData();
    formData.append("message", input.trim());
    formData.append("history", JSON.stringify(updatedMessages));
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/chat",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const botMessage = {
        sender: "bot",
        text: response.data.text || "I couldn't understand that.",
      };

      // Add image if the backend provides an image URL
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
                    alt="Requested visual"
                    className="chatbot-image"
                  />
                )}
              </div>
            ))}
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
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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