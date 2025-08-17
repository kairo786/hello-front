"use client";
import { useUser } from "@clerk/nextjs";
import { SocketProvider } from "./SocketContext";

export default function SocketProviderWrapper({ children }) {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return <div className="text-white p-4">Loading...</div>; // Ya spinner dede
  }

  if (user?.fullName && user?.imageUrl) {
    const userData = { username: user.fullName, imgurl: user.imageUrl ,email :user.primaryEmailAddress.emailAddress};
    return <SocketProvider userData={userData}>{children}</SocketProvider>;
  }

  return <div className="text-white p-4">User not signed in</div>;
}
