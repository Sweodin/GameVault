import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { GameList } from "../components/game/GameList";
import { Game } from "../types/game";
import { mockGames } from "../data/mockGames";
import { useAuth } from "../contexts/AuthContext";

const Library: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterParam = queryParams.get("filter");
  const { currentUser } = useAuth();
  
  const [games, setGames] = useState<Game[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>(filterParam || "all");

  // Simulate fetching user's library
  useEffect(() => {
    // In a real app, you would fetch the user's library from Firebase
    // For now, we'll use mock data and simulate different filters
    
    // Simulate user's library with some of the mock games
    const userLibrary = mockGames.slice(0, 8).map(game => ({
      ...game,
      lastPlayed: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 604800000) : null, // Random last played within a week
      isFavorite: Math.random() > 0.7, // 30% chance of being a favorite
      isInstalled: Math.random() > 0.4, // 60% chance of being installed
    }));
    
    setGames(userLibrary);
  }, [currentUser]);

  // Filter games based on the active filter
  const filteredGames = games.filter(game => {
    switch (activeFilter) {
      case "recent":
        return game.lastPlayed !== null;
      case "favorites":
        return game.isFavorite;
      case "installed":
        return game.isInstalled;
      default:
        return true;
    }
  });

  // Sort recent games by last played date
  if (activeFilter === "recent") {
    filteredGames.sort((a, b) => {
      if (a.lastPlayed && b.lastPlayed) {
        return b.lastPlayed.getTime() - a.lastPlayed.getTime();
      }
      return 0;
    });
  }

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    // Update URL without reloading the page
    const newUrl = filter === "all" 
      ? "/library" 
      : `/library?filter=${filter}`;
    window.history.pushState({}, "", newUrl);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Your Library</h1>
          <p className="text-sm sm:text-base text-gray-400">
            Access your games collection
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex mb-8 border-b border-gray-700">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeFilter === "all"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => handleFilterChange("all")}
          >
            All Games
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeFilter === "recent"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => handleFilterChange("recent")}
          >
            <i className="fas fa-clock mr-2"></i>
            Recently Played
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeFilter === "favorites"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => handleFilterChange("favorites")}
          >
            <i className="fas fa-star mr-2"></i>
            Favorites
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeFilter === "installed"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => handleFilterChange("installed")}
          >
            <i className="fas fa-download mr-2"></i>
            Installed
          </button>
        </div>

        {filteredGames.length > 0 ? (
          <GameList games={filteredGames} />
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">No games found</h3>
            <p className="text-gray-500">
              {activeFilter === "all" 
                ? "Your library is empty. Browse games to add some!" 
                : `You don't have any ${activeFilter === "recent" ? "recently played" : activeFilter} games.`}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Library;
