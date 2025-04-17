import { useState, useMemo } from "react";
import { Game, GameGenre } from "../types/game";

export function useGameFilters(games: Game[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<GameGenre>("All");

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesSearch = game.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesGenre =
        selectedGenre === "All" || game.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [games, searchQuery, selectedGenre]);

  const trendingGames = useMemo(() => {
    return filteredGames.filter((game) => game.trending);
  }, [filteredGames]);

  const regularGames = useMemo(() => {
    return filteredGames.filter((game) => !game.trending);
  }, [filteredGames]);

  return {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    filteredGames,
    trendingGames,
    regularGames,
    clearFilters: () => {
      setSearchQuery("");
      setSelectedGenre("All");
    },
  };
}
