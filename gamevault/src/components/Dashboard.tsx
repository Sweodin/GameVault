import MainLayout from "../layouts/MainLayout";
import { GameCard } from "./game/GameCard";
import { useGameFilters } from "../hooks/useGameFilters";
import { mockGames, genres } from "../data/mockGames";

export default function Dashboard() {
  const {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    filteredGames,
    trendingGames,
    regularGames,
    clearFilters,
  } = useGameFilters(mockGames);

  return (
    <MainLayout>
      <div className="p-6 bg-gray-900">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-white">Discover Games</h1>
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 focus:border-cyan-500 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Genre Filters */}
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedGenre === genre
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Trending Games Section */}
        {trendingGames.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-cyan-300">
              <span className="mr-2">🔥</span> Trending Games
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        )}

        {/* All Games Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white">All Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {regularGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {/* No Results */}
          {filteredGames.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-400 text-lg">
                No games found matching your criteria
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-gray-800 text-cyan-400 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
