import React, { ReactNode, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useChat } from "../contexts/ChatContext";
import { useOutsideClick } from "../hooks/useOutsideClick";
import ServerSidebar from "./ServerSidebar";
import ChannelSidebar from "./ChannelSidebar";
import StatusSelector, {
  getStatusColor,
} from "../components/status/StatusSelector";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { logout, username, currentUser, userStatus, profileImageUrl } =
    useAuth();
  const { onlineUsers } = useChat();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [inServer] = useState(true);

  /*----- Use custom hook for outside click -----*/

  useOutsideClick(dropdownRef as React.RefObject<HTMLElement>, () =>
    setDropdownOpen(false)
  );

  console.log(
    "MainLayout rendered, username:",
    username,
    "currentUser:",
    currentUser
  );

  async function handleLogout(): Promise<void> {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }

  /*----- Generate initials from username or use default -----*/
  const getInitials = () => {
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    return "GV";
  };

  /*----- Generate initials from username or use default -----*/

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-sm border-b border-purple-900/30 sticky top-0 z-10 py-4">
        <div className="container mx-auto px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-10">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Nexus
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

              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center space-x-3 cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden border border-gray-700 relative shadow-md">
                    {profileImageUrl ? (
                      <img
                        src={profileImageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                        <span className="text-sm font-bold">
                          {getInitials()}
                        </span>
                      </div>
                    )}
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                        currentUser && onlineUsers[currentUser.uid]
                          ? "bg-green-500"
                          : getStatusColor(userStatus)
                      } border border-gray-800`}
                    ></div>
                  </div>
                  <span className="hidden md:inline text-base font-medium">
                    {username || "Guest"}
                  </span>
                </div>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-20">
                    {/* User Info */}
                    <div className="px-6 py-4 border-b border-gray-700">
                      <div className="flex flex-col items-center text-center mb-2">
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden border border-gray-700 shadow-md mb-3 relative">
                          {profileImageUrl ? (
                            <img
                              src={profileImageUrl}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                              <span className="text-xl font-bold">
                                {getInitials()}
                              </span>
                            </div>
                          )}
                          <div
                            className={`absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-4 h-4 rounded-full ${
                              currentUser && onlineUsers[currentUser.uid]
                                ? "bg-green-500"
                                : getStatusColor(userStatus)
                            } border-2 border-gray-800`}
                          ></div>
                        </div>
                        <div>
                          <div className="text-xl font-medium">
                            {username || "Guest"}
                          </div>
                          <div className="flex items-center justify-center text-sm text-gray-400 mt-1">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                currentUser && onlineUsers[currentUser.uid]
                                  ? "bg-green-500"
                                  : getStatusColor(userStatus)
                              } mr-2`}
                            ></span>
                            <span>
                              {currentUser && onlineUsers[currentUser.uid]
                                ? "Online"
                                : userStatus}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {currentUser?.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Options */}
                    <div className="px-4 py-2 border-b border-gray-700">
                      <div className="text-xs text-gray-400 mb-2">
                        SET STATUS
                      </div>
                      <StatusSelector
                        variant="dropdown"
                        onStatusChange={() => setDropdownOpen(false)}
                      />
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm hover:bg-gray-700"
                      >
                        Profile
                      </a>
                      <a
                        href="/settings"
                        className="block px-4 py-2 text-sm hover:bg-gray-700"
                      >
                        Settings
                      </a>
                      <a
                        href="/preferences"
                        className="block px-4 py-2 text-sm hover:bg-gray-700"
                      >
                        User Preferences
                      </a>
                      <a
                        href="/help"
                        className="block px-4 py-2 text-sm hover:bg-gray-700"
                      >
                        Help & Support
                      </a>
                      <a
                        href="/about"
                        className="block px-4 py-2 text-sm hover:bg-gray-700"
                      >
                        About (v1.0.0)
                      </a>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-5rem)] relative">
        {/* Main content with sidebars */}
        <ServerSidebar />
        {inServer && <ChannelSidebar />}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>

        {/* Mobile bottom navigation - visible only on small screens */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around p-3 z-10">
          <a
            href="/"
            className="flex flex-col items-center text-gray-400 hover:text-cyan-400"
          >
            <i className="fas fa-home text-lg"></i>
            <span className="text-xs mt-1">Home</span>
          </a>
          <a
            href="/browse"
            className="flex flex-col items-center text-gray-400 hover:text-cyan-400"
          >
            <i className="fas fa-compass text-lg"></i>
            <span className="text-xs mt-1">Browse</span>
          </a>
          <a
            href="/library"
            className="flex flex-col items-center text-gray-400 hover:text-cyan-400"
          >
            <i className="fas fa-gamepad text-lg"></i>
            <span className="text-xs mt-1">Library</span>
          </a>
          <a
            href="/friends"
            className="flex flex-col items-center text-gray-400 hover:text-cyan-400"
          >
            <i className="fas fa-users text-lg"></i>
            <span className="text-xs mt-1">Friends</span>
          </a>
          <a
            href="/profile"
            className="flex flex-col items-center text-gray-400 hover:text-cyan-400"
          >
            <i className="fas fa-user text-lg"></i>
            <span className="text-xs mt-1">Profile</span>
          </a>
        </div>
      </div>
    </div>
  );
}
