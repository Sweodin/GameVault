import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { mockGames } from "../data/mockGames";
import { Game } from "../types/game";

export default function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    // Find the game in mockGames
    const foundGame = mockGames.find((g) => g.id === gameId);
    if (foundGame) {
      setGame(foundGame);
      // Don't store in localStorage to avoid affecting the sidebar
    }
  }, [gameId]);

  return (
    <MainLayout>
      <div className="p-6 bg-gray-900 min-h-screen">
        {game ? (
          <div>
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{game.name}</h1>
                <div className="flex items-center text-gray-400 mt-1">
                  <span className="text-cyan-400 mr-1">{game.genre}</span>
                  <span className="mx-2">•</span>
                  <span className="text-cyan-400 mr-1">
                    {game.activeServers}
                  </span>{" "}
                  Servers
                  <span className="mx-2">•</span>
                  <span className="text-cyan-400 mr-1">
                    {game.onlinePlayers.toLocaleString()}
                  </span>{" "}
                  Online
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Channels Section */}
              <div className="md:col-span-2">
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Popular Channels
                  </h2>
                  <div className="space-y-3">
                    {game.popularChannels.map((channel) => (
                      <div
                        key={channel}
                        className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                      >
                        <div className="text-cyan-400 mr-3">#</div>
                        <div>
                          <div className="font-medium text-white">
                            {channel}
                          </div>
                          <div className="text-xs text-gray-400">
                            Join the conversation
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Game Info Section */}
              <div>
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Game Info
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">
                        GENRE
                      </h3>
                      <p className="text-white">{game.genre}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">
                        ACTIVE SERVERS
                      </h3>
                      <p className="text-white">{game.activeServers}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">
                        ONLINE PLAYERS
                      </h3>
                      <p className="text-white">
                        {game.onlinePlayers.toLocaleString()}
                      </p>
                    </div>
                    <button className="w-full py-2 mt-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all">
                      Join Server
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg">Game not found</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
