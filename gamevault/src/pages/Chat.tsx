import React, { useState } from "react";
import { Users, Search, Plus, X } from "lucide-react";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import { useAuth } from "../contexts/AuthContext";
import MainLayout from "../layouts/MainLayout";

export default function Chat() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const { currentUser } = useAuth();

  // Mock friends data - in a real app, this would come from a database
  const friends = [
    { id: "friend1", name: "Alex Johnson", status: "online" },
    { id: "friend2", name: "Jamie Smith", status: "offline" },
    { id: "friend3", name: "Taylor Wilson", status: "online" },
    { id: "friend4", name: "Jordan Lee", status: "away" },
  ];

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="flex h-full bg-gray-900 text-white">
        {/* Chat sidebar */}
        <div 
          className={`${
            showSidebar ? "w-80" : "w-0"
          } bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300`}
        >
          {showSidebar && (
            <>
              {/* Sidebar header */}
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="font-bold text-lg">Messages</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setShowNewChatModal(true)}
                    className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
                    title="New message"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white md:hidden"
                    title="Close sidebar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="p-3 border-b border-gray-700">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full bg-gray-700 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                </div>
              </div>

              {/* Chat list */}
              <ChatList />
            </>
          )}
        </div>

        {/* Chat window */}
        <div className="flex-1 flex flex-col">
          {/* Toggle sidebar button (mobile only) */}
          {!showSidebar && (
            <button
              onClick={() => setShowSidebar(true)}
              className="absolute top-4 left-4 p-2 bg-gray-800 rounded-md text-gray-400 hover:text-white md:hidden z-10"
            >
              <Users className="w-5 h-5" />
            </button>
          )}

          <ChatWindow />
        </div>

        {/* New chat modal */}
        {showNewChatModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg w-full max-w-md">
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h3 className="font-bold">New Message</h3>
                <button
                  onClick={() => setShowNewChatModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search for friends..."
                    className="w-full bg-gray-700 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {filteredFriends.length === 0 ? (
                    <div className="text-center text-gray-400 py-4">
                      No friends found
                    </div>
                  ) : (
                    filteredFriends.map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center p-2 hover:bg-gray-700 rounded-md cursor-pointer"
                        onClick={() => {
                          // In a real app, this would create a chat with the friend
                          // For now, just close the modal
                          setShowNewChatModal(false);
                        }}
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                          <span>{friend.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-medium">{friend.name}</div>
                          <div className="text-xs text-gray-400">
                            {friend.status === "online" ? (
                              <span className="text-green-400">● Online</span>
                            ) : friend.status === "away" ? (
                              <span className="text-yellow-400">● Away</span>
                            ) : (
                              <span className="text-gray-400">● Offline</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-gray-700 flex justify-end">
                <button
                  onClick={() => setShowNewChatModal(false)}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md ml-2"
                  onClick={() => setShowNewChatModal(false)}
                >
                  Create Group Chat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
