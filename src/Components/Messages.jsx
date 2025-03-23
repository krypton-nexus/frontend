import React, { useState, useEffect, useCallback, useRef } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { jwtDecode } from "jwt-decode";
import "../CSS/Messages.css";

const Messages = ({ clubId }) => {
  const [messages, setMessages] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [userNames, setUserNames] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Reference to the bottom of the messages container
  const messagesEndRef = useRef(null);

  // Decode user email from JWT token
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserEmail(decodedToken.email || null);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Fetch user names based on emails
  const fetchUserNames = useCallback(async (emails) => {
    const namesMapping = {};
    for (const email of emails) {
      if (!email) continue;
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("Authorization token is missing.");
          return;
        }
        const response = await fetch(
          `http://43.205.202.255:5000/student/${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          namesMapping[email] = `${data.first_name || "Anonymous"} ${
            data.last_name || ""
          }`.trim();
        } else {
          console.error(`Failed to fetch user details for ${email}`);
        }
      } catch (error) {
        console.error(`Error fetching user details for ${email}`, error);
      }
    }
    return namesMapping;
  }, []);

  // Helper function to determine the date label for a message
  const getDateLabel = (date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    // Determine the start and end of the current week (assuming week starts on Sunday)
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay());
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
    if (date >= currentWeekStart && date <= currentWeekEnd) {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    }
    // For messages older than the current week, show date in "March 16, 2025" format
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Group messages by date label
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((msg) => {
      if (msg.timestamp?.seconds) {
        const date = new Date(msg.timestamp.seconds * 1000);
        const label = getDateLabel(date);
        if (!groups[label]) {
          groups[label] = [];
        }
        groups[label].push(msg);
      }
    });
    return groups;
  };

  // Fetch messages from Firebase
  useEffect(() => {
    const q = query(
      collection(db, "messages", clubId, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);

      const uniqueEmails = [
        ...new Set(messagesData.map((msg) => msg.sendersEmail).filter(Boolean)),
      ];
      const namesMapping = await fetchUserNames(uniqueEmails);
      setUserNames((prev) => ({ ...prev, ...namesMapping }));
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [clubId, fetchUserNames]);

  // After messages load, scroll to the bottom so latest messages are visible
  useEffect(() => {
    if (!isLoading && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  if (isLoading) {
    return (
      <div className="messages-container">
        <p>Loading messages...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="messages-container">
        <p>No messages are available.</p>
      </div>
    );
  }

  // Group messages by date label
  const groupedMessages = groupMessagesByDate(messages);
  // Get the group labels in the order of first occurrence in messages array
  const orderedLabels = [];
  messages.forEach((msg) => {
    if (msg.timestamp?.seconds) {
      const date = new Date(msg.timestamp.seconds * 1000);
      const label = getDateLabel(date);
      if (!orderedLabels.includes(label)) {
        orderedLabels.push(label);
      }
    }
  });

  return (
    <div className="messages-container">
      {orderedLabels.map((label) => (
        <div key={label}>
          <div className="date-separator">
            <span className="date-label">{label}</span>
          </div>
          {groupedMessages[label].map((msg) => {
            const isSent = msg.sendersEmail === userEmail;
            return (
              <div
                key={msg.id}
                className={`message ${
                  isSent ? "message-right" : "message-left"
                }`}
              >
                {!isSent && (
                  <img
                    className="message-avatar"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      userNames[msg.sendersEmail] || "User"
                    )}&background=random`}
                    alt="Avatar"
                  />
                )}
                <div
                  className={`message-bubble ${isSent ? "sent" : "received"}`}
                >
                  {/* For received messages, show the sender's full name */}
                  {!isSent && (
                    <div className="message-sender-name">
                      {userNames[msg.sendersEmail] || "User"}
                    </div>
                  )}
                  <div className="message-text">
                    <div className="message-content">{msg.text}</div>
                    <div className="message-timestamp">
                      {msg.timestamp?.seconds
                        ? new Date(
                            msg.timestamp.seconds * 1000
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      {/* This empty div is used as the reference point for scrolling */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
