// context/ButtonContext.js
"use client";
import { createContext, useContext, useState } from "react";

const ButtonContext = createContext();

export const useButton = () => useContext(ButtonContext);

export const ButtonProvider = ({ children }) => {
  // 🟢 Object format for full call state
  const [callState, setCallState] = useState({
    clicked: false,
    from: null,
    to: null,
  });

  return (
    <ButtonContext.Provider value={{ callState, setCallState }}>
      {children}
    </ButtonContext.Provider>
  );
};
