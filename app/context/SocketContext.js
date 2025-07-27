"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

// 1️⃣ Create context
const SocketContext = createContext(null);

// 2️⃣ Provider component
export const SocketProvider = ({ children, userData }) => {
  const socketRef = useRef(null);

  // Initialize socket only once
  // if (!socketRef.current) {
  //   socketRef.current = io("http://localhost:3001", {
  //     withCredentials: true,
  //     autoConnect: false, // connect manually later
  //   });
  // }
  // frontend (localhost:3000)

  if (!socketRef.current) {
socketRef.current = io("https://hello-backend-project.onrender.com/", {
  withCredentials: true,
  autoConnect: false,
});
  }
   
  useEffect(() => {
    const socket = socketRef.current;

    if (!socket || !userData) return;

    // 🔁 Join only once after socket connects
    const handleConnect = () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("join-user", userData);
    };

    if (socket.connected) {
      // if already connected, emit directly
      handleConnect();
    } else {
      // else, connect and wait for event
      socket.connect();
      socket.once("connect", handleConnect);
    }

    // 🔌 Cleanup on unmount
    return () => {
      if (socket.connected) {
        socket.disconnect();
        console.log("🔌 Socket disconnected");
      }
    };
  }, [userData]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

// 3️⃣ Custom hook to access socket
export const useSocket = () => useContext(SocketContext);
