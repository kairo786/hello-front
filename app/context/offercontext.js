"use client"
import { createContext, useContext, useState } from "react";

const OfferContext = createContext();
export const useOffer = () => useContext(OfferContext);

export const OfferProvider = ({ children }) => {
  const [incomingOffer, setIncomingOffer] = useState(null);
  return (
    <OfferContext.Provider value={{ incomingOffer, setIncomingOffer}}>
      {children}
    </OfferContext.Provider>
  );
};
