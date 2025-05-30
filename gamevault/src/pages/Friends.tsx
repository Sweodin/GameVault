import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../contexts/AuthContext";

// Mock friend data
interface Friend {
  id: string;
  username: string;
  status: "Online" | "Away" | "Busy" | "Invisible" | "Offline";
  avatarUrl: string | null;
  lastActive: Date;
  currentGame?: string;
}

interface FriendRequest {
  id: string;
  username: string;
  avatarUrl: string | null;
  sentAt: Date;
}

const Friends: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterParam = queryParams.get("filter");
  const { currentUser } = useAuth();
  
  const [activeFilter, setActiveFilter] = useState<string>(filterParam || "all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  // Simulate fetching friends
  useEffect(() => {
    // In a real app, you would fetch friends from Firebase
    const mockFriends: Friend[] = [
      {
        id: "1",
        username: "GamerPro",
        status: "Online",
        avatarUrl: null,
        lastActive: new Date(),
        currentGame: "Cyberpunk 2077"
      },
      {
        id: "2",
        username: "NightOwl",
        status: "Away",
        avatarUrl: null,
        lastActive: new Date(Date.now() - 15 * 60000), // 15 minutes ago
        currentGame: "The Witcher 3"
      },
      {
        id: "3",
        username: "PixelWarrior",
        status: "Busy",
        avatarUrl: null,
        lastActive: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      },
      {
        id: "4",
        username: "QuestMaster",
        status: "Offline",
        avatarUrl: null,
        lastActive: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 days ago
      },
      {
        id: "5",
        username: "LootHunter",
        status: "Online",
        avatarUrl: null,
        lastActive: new Date(),
        currentGame: "Destiny 2"
      }
    ];

    const mockRequests: FriendRequest[] = [
      {
        id: "101",
        username: "DragonSlayer",
        avatarUrl: null,
        sentAt: new Date(Date.now() - 1 * 24 * 60 * 60000), // 1 day ago
      },
      {
        id: "102",
        username: "ShadowNinja",
        avatarUrl: null,
        sentAt: new Date(Date.now() - 3 * 24 * 60 * 60000), // 3 days ago
      },
      {
        id: "103",
        username: "CosmicVoyager",
        avatarUrl: null,
        sentAt: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      }
    ];

    setFriends(mockFriends);
    setFriendRequests(mockRequests);
  }, [currentUser]);

  // Filter friends based on the active filter and search query
  const filteredFriends = friends.filter(friend => {
    // First apply the search filter if any
    if (searchQuery && !friend.username.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Then apply the tab filter
    switch (activeFilter) {
      case "online":
        return friend.status === "Online";
      case "all":
        return true;
      default:
        return true;
    }
  });

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    // Update URL without reloading the page
    const newUrl = filter === "all" 
      ? "/friends" 
      : `/friends?filter=${filter}`;
    window.history.pushState({}, "", newUrl);
  };

  // Get status color based on status
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Online":
        return "bg-green-500";
      case "Away":
        return "bg-yellow-500";
      case "Busy":
        return "bg-red-500";
      case "Invisible":
      case "Offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  // Render friend request section
  const renderFriendRequests = () => {
    if (activeFilter !== "requests") return null;
    
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-white">Friend Requests</h2>
        {friendRequests.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {friendRequests.map(request => (
              <div key={request.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 overflow-hidden border border-gray-700 mr-4">
                    {request.avatarUrl ? (
                      <img src={request.avatarUrl} alt={request.username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                        <span className="text-sm font-bold">{request.username.substring(0, 2).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-white">{request.username}</div>
                    <div className="text-sm text-gray-400">
                      Sent {request.sentAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md text-sm font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors">
                    Accept
                  </button>
                  <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md text-sm font-medium hover:bg-gray-600 transition-colors">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-800/50 rounded-lg">
            <p className="text-gray-400">No pending friend requests</p>
          </div>
        )}
      </div>
    );
  };

  // Render add friend section
  const renderAddFriend = () => {
    if (activeFilter !== "add") return null;
    
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-white">Add Friend</h2>
        <div className="bg-gray-800 rounded-lg p-6">
          <p className="text-gray-400 mb-4">
            You can add a friend with their Nexus username.
          </p>
          <div className="flex">
            <input
              type="text"
              placeholder="Enter a username"
              className="flex-1 bg-gray-900 border border-gray-700 focus:border-cyan-500 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
            <button className="ml-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors">
              Send Request
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Friends</h1>
            <p className="text-sm sm:text-base text-gray-400">
              Manage your friends and requests
            </p>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search friends..."
                className="bg-gray-800 border border-gray-700 focus:border-cyan-500 text-white rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <i className="fas fa-search"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap mb-8 border-b border-gray-700">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeFilter === "all"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => handleFilterChange("all")}
          >
            All Friends
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeFilter === "online"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => handleFilterChange("online")}
          >
            <i className="fas fa-circle text-green-500 text-xs mr-2"></i>
            Online
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeFilter === "requests"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => handleFilterChange("requests")}
          >
            <i className="fas fa-user-plus mr-2"></i>
            Requests
            <span className="ml-2 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-xs text-white flex items-center justify-center">
              {friendRequests.length}
            </span>
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeFilter === "add"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => handleFilterChange("add")}
          >
            <i className="fas fa-plus mr-2"></i>
            Add Friend
          </button>
        </div>

        {/* Render friend requests if that tab is active */}
        {renderFriendRequests()}
        
        {/* Render add friend if that tab is active */}
        {renderAddFriend()}
        
        {/* Only show friends list if we're not on requests or add tabs */}
        {(activeFilter === "all" || activeFilter === "online") && (
          <>
            {filteredFriends.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFriends.map(friend => (
                  <div key={friend.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 overflow-hidden border border-gray-700 mr-4 relative">
                        {friend.avatarUrl ? (
                          <img src={friend.avatarUrl} alt={friend.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                            <span className="text-sm font-bold">{friend.username.substring(0, 2).toUpperCase()}</span>
                          </div>
                        )}
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${getStatusColor(friend.status)} border border-gray-800`}></div>
                      </div>
                      <div>
                        <div className="font-medium text-white flex items-center">
                          {friend.username}
                          <span className={`ml-2 w-2 h-2 rounded-full ${getStatusColor(friend.status)}`}></span>
                          <span className="text-sm text-gray-400 ml-1">{friend.status}</span>
                        </div>
                        {friend.currentGame && (
                          <div className="text-sm text-cyan-400">
                            Playing {friend.currentGame}
                          </div>
                        )}
                        {!friend.currentGame && friend.status !== "Online" && (
                          <div className="text-sm text-gray-400">
                            Last online {friend.lastActive.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors">
                        <i className="fas fa-comment-alt"></i>
                      </button>
                      <button className="p-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors">
                        <i className="fas fa-ellipsis-h"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-2xl font-bold text-gray-300 mb-2">No friends found</h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? "No friends match your search query" 
                    : activeFilter === "online" 
                      ? "None of your friends are currently online" 
                      : "You haven't added any friends yet"}
                </p>
                {!searchQuery && activeFilter === "all" && (
                  <button 
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors"
                    onClick={() => handleFilterChange("add")}
                  >
                    Add Friends
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Friends;
