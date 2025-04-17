// src/layouts/UserBar.tsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";

export default function UserBar() {
  const { currentUser } = useAuth();

  return (
    <div className="h-14 bg-gray-700 px-3 flex items-center">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-2">
          {currentUser?.email?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <div className="text-sm font-medium">
            {currentUser?.email?.split("@")[0] || "User"}
          </div>
          <div className="text-xs text-gray-400">Online</div>
        </div>
      </div>

      <div className="ml-auto flex space-x-2">
        <button className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center hover:bg-gray-500">🎤</button>
        <button className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center hover:bg-gray-500">🎧</button>
        <button className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center hover:bg-gray-500">⚙️</button>
      </div>
    </div>
  );
}
