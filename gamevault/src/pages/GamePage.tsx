import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { mockGames } from "../data/mockGames";
import { Game } from "../types/game";
import { ArrowLeft } from "lucide-react";
import ForumChannel from "../components/forum";

export default function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [activeForumId, setActiveForumId] = useState<string | null>(null);
  const [activeForumName, setActiveForumName] = useState<string | null>(null);
  const [isLoadingForum, setIsLoadingForum] = useState(false);

  useEffect(() => {
    // Find the game in mockGames
    const foundGame = mockGames.find((g) => g.id === gameId);
    if (foundGame) {
      setGame(foundGame);
      // Don't store in localStorage to avoid affecting the sidebar
    }
  }, [gameId]);

  // Handle selecting a forum channel
  const handleJoinChannel = (channelName: string) => {
    if (!game) {
      console.error("Cannot join channel: No game selected");
      return;
    }

    setIsLoadingForum(true);
    console.log(`Selecting channel ${channelName} for game ${game.name}`);
    
    // Instead of creating a channel, just set the channel name and a mock ID
    // This simulates selecting a pre-existing channel
    const mockForumId = `${game.id}-${channelName.toLowerCase().replace(/\s+/g, '-')}`;
    
    // Set the active forum with the mock ID
    setActiveForumId(mockForumId);
    setActiveForumName(channelName);
    
    setTimeout(() => {
      setIsLoadingForum(false);
    }, 500); // Short delay to simulate loading
  };

  // Handle returning to the channel list
  const handleBackToChannels = () => {
    setActiveForumId(null);
    setActiveForumName(null);
  };

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
              {/* Channels Section or Active Forum */}
              <div className="md:col-span-2">
                {activeForumId ? (
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="flex items-center p-4 border-b border-gray-700">
                      <button
                        onClick={handleBackToChannels}
                        className="mr-3 p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                      >
                        <ArrowLeft size={18} />
                      </button>
                      <div>
                        <h2 className="text-xl font-bold text-white flex items-center">
                          <span className="text-cyan-400 mr-2">#</span>
                          {activeForumName}
                        </h2>
                        <p className="text-gray-400 text-sm">
                          Discussion forum for {game.name}
                        </p>
                      </div>
                    </div>

                    {isLoadingForum ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
                      </div>
                    ) : (
                      <ForumChannel
                        forumId={activeForumId}
                        gameName={game.name}
                        channelName={activeForumName || ""}
                      />
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4">
                      Discussion Forums
                    </h2>
                    <p className="text-gray-400 text-sm mb-4">
                      Join these community forums to discuss various aspects of{" "}
                      {game.name} with other players
                    </p>
                    <div className="space-y-3">
                      {game.popularChannels.map((channel) => (
                        <div
                          key={channel}
                          className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer group"
                          onClick={() => handleJoinChannel(channel)}
                        >
                          <div className="text-cyan-400 mr-3 text-lg font-bold">
                            #
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                              {channel}
                            </div>
                            <div className="text-xs text-gray-400">
                              Join the {channel} discussion forum
                            </div>
                          </div>
                          <div className="bg-cyan-900/30 text-cyan-400 text-xs px-2 py-1 rounded-md border border-cyan-800 opacity-0 group-hover:opacity-100 transition-opacity">
                            Join Forum
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
