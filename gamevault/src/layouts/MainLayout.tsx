// src/layouts/MainLayout.tsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ServerSidebar, ChannelSidebar, UserBar } from "./index";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout(): Promise<void> {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-sm border-b border-purple-900/30 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Game Vault
              </h1>

              <nav className="hidden md:flex space-x-6">
                <a
                  href="/"
                  className="text-white hover:text-cyan-300 transition-colors"
                >
                  Home
                </a>
                <a
                  href="/browse"
                  className="text-gray-400 hover:text-cyan-300 transition-colors"
                >
                  Browse
                </a>
                <a
                  href="/library"
                  className="text-gray-400 hover:text-cyan-300 transition-colors"
                >
                  Library
                </a>
                <a
                  href="/friends"
                  className="text-gray-400 hover:text-cyan-300 transition-colors"
                >
                  Friends
                </a>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-900/70 border border-gray-700 focus:border-cyan-500 text-white rounded-lg pl-10 pr-4 py-2 w-40 md:w-60 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <i className="fas fa-search"></i>
                </div>
              </div>

              <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg text-gray-300">
                <i className="fas fa-bell"></i>
              </button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                  <span className="text-xs font-bold">JD</span>
                </div>
                <span className="hidden md:inline text-sm font-medium">
                  JohnDoe
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto py-6">{children}</main>
    </div>
  );
}
