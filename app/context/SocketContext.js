"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

// ✅ 1. Create Socket Context
const SocketContext = createContext(null);

// ✅ 2. Provider Component
export const SocketProvider = ({ children, userData }) => {
  const socketRef = useRef(null);

  // ✅ Initialize socket only once
  if (!socketRef.current) {
    socketRef.current = io("https://hello-backend-project.onrender.com", {
      // socketRef.current = io("http://localhost:3001", { // for local dev
      withCredentials: true,
      autoConnect: false,
    });
  }

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !userData) return;

    // ✅ Join user after successful connection
    const handleConnect = () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("join-user", userData);
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
      socket.once("connect", handleConnect);
    }
  }, [userData]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

// ✅ 3. Custom Hook for Easy Socket Access
export const useSocket = () => useContext(SocketContext);
