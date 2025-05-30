import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { GameList } from "../components/game/GameList";
import { GenreFilter } from "../components/common/GenreFilter";
import { SearchBar } from "../components/common/SearchBar";
import { Game } from "../types/game";
import { mockGames } from "../data/mockGames";

const Browse: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category");
  
  const [filteredGames, setFilteredGames] = useState<Game[]>(mockGames);
  const [selectedGenre, setSelectedGenre] = useState<string>(categoryParam || "all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter games based on selected genre and search query
  useEffect(() => {
    let result = mockGames;
    
    // Filter by genre if not "all"
    if (selectedGenre && selectedGenre !== "all") {
      result = result.filter(game => 
        game.genre.toLowerCase() === selectedGenre.toLowerCase()
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(game => 
        game.name.toLowerCase().includes(query)
      );
    }
    
    setFilteredGames(result);
  }, [selectedGenre, searchQuery]);

  // Handle genre selection
  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
              Browse Games
              {selectedGenre !== "all" && (
                <span className="text-cyan-400 ml-2">
                  • {selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)}
                </span>
              )}
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Discover new games and experiences
            </p>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <SearchBar onSearch={handleSearch} placeholder="Search games..." />
          </div>
        </div>

        <div className="mb-8">
          <GenreFilter 
            selectedGenre={selectedGenre} 
            onGenreChange={handleGenreChange} 
          />
        </div>

        {filteredGames.length > 0 ? (
          <GameList games={filteredGames} />
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">No games found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Browse;
