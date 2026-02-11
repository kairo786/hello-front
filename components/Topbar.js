"use client"

import { UserButton } from "@clerk/clerk-react";

export default function TopBar() {
  return (
    <div className="flex justify-between items-center px-6 py-3 bg-gray-900">
      <h2 className="text-xl font-semibold text-white">Meeting with Kero Gang</h2>
      <span className="text-sm text-green-400">🔴 Live</span>
      <UserButton/>
    </div>
  );
}
