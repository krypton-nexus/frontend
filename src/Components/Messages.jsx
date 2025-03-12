import React, { useState, useEffect, useCallback } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { jwtDecode } from "jwt-decode";
import "../CSS/Messages.css";

const Messages = ({ clubId }) => {
  const [messages, setMessages] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [userNames, setUserNames] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch and decode the JWT token
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

  // Fetch user names based on emails, only when needed
  const fetchUserNames = useCallback(async (emails) => {
    const namesMapping = {};
    for (const email of emails) {
      if (!email) continue;

      // Avoid unnecessary API calls for already fetched users
      if (namesMapping[email]) continue;

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
              Authorization: `Bearer ${token}`, // Pass token in the Authorization header
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

  // Fetch messages from Firebase and update user names
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

      // Fetch names only for new unique emails
      const namesMapping = await fetchUserNames(uniqueEmails);
      setUserNames((prev) => ({ ...prev, ...namesMapping }));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [clubId, fetchUserNames]);

  // If no messages, show the "No messages" message
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

  return (
    <div className="messages-container">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`message ${
            msg.sendersEmail === userEmail ? "message-right" : "message-left"
          }`}
        >
          <div className="message-sender">
            {userNames[msg.sendersEmail] || "Loading..."}
          </div>
          {msg.sendersEmail !== userEmail && (
            <div className="message-avatar">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  userNames[msg.sendersEmail] || "User"
                )}&background=random`}
                alt="avatar"
              />
            </div>
          )}
          <div className="message-bubble">
            <p className="message-text">{msg.text}</p>
            <span className="message-timestamp">
              {msg.timestamp?.seconds
                ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : ""}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
