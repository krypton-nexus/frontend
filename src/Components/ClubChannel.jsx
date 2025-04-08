// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import "../CSS/ClubChannel.css";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// const ClubChannel = () => {
//   const { clubId } = useParams();
//   const navigate = useNavigate();

//   const [newMessage, setNewMessage] = useState("");
//   const [userEmail, setUserEmail] = useState("");
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("access_token");

//   useEffect(() => {
//     const validateToken = () => {
//       if (!token) {
//         alert("Please log in to access the communication channel.");
//         navigate("/login");
//         return false;
//       }

//       try {
//         const decoded = jwtDecode(token);
//         const currentTime = Date.now() / 1000;
//         if (decoded.exp < currentTime) {
//           alert("Session expired. Please log in again.");
//           localStorage.removeItem("access_token");
//           navigate("/login");
//           return false;
//         }

//         setUserEmail(decoded.email);
//         return true;
//       } catch (error) {
//         console.error("Invalid token:", error);
//         alert("Invalid session. Please log in again.");
//         localStorage.removeItem("access_token");
//         navigate("/login");
//         return false;
//       }
//     };

//     if (validateToken()) {
//       setLoading(false);
//     } else {
//       setLoading(false);
//     }
//   }, [navigate, token]);

//   useEffect(() => {
//     if (!userEmail || !token) return;

//     const verifyMembership = async () => {
//       try {
//         const response = await fetch(
//           `${BASE_URL}/membership/list?club_id=${clubId}`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           console.error("Failed to fetch memberships:", response.status);
//           return;
//         }

//         const data = await response.json();
//         const isMember = data.memberships.some(
//           (member) => member.student_email === userEmail
//         );

//         setIsAuthorized(isMember);
//       } catch (error) {
//         console.error("Error verifying membership:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyMembership();
//   }, [clubId, userEmail, token]);

//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) {
//       alert("Message cannot be empty.");
//       return;
//     }

//     if (!token) {
//       alert("You need to log in to send a message.");
//       navigate("/login");
//       return;
//     }

//     try {
//       console.log("Sending message:", newMessage);
//       alert("Message sent (not really, just console logged).");

//       setNewMessage(""); 
//     } catch (error) {
//       console.error("Error sending message:", error);
//       alert("Failed to send message.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="club-channel-container">
//         <h2>Loading...</h2>
//       </div>
//     );
//   }

//   if (!isAuthorized) {
//     return (
//       <div className="club-channel-container">
//         <h2>Unauthorized</h2>
//         <p>You are not authorized to access this club's channel.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="club-channel-container">
//       <h2>Club Communication Channel</h2>

//       <div className="messages-container">
//         <p>Messages are not yet loaded from the server (placeholder).</p>
//       </div>

//       <div className="message-input-container">
//         <textarea
//           placeholder="Type your message here..."
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//         />
//         <button onClick={handleSendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default ClubChannel;
