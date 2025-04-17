import { GameCardProps } from "../../types/game";

export function GameCard({ game }: GameCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-purple-900/30 shadow-xl hover:shadow-purple-900/20 hover:border-purple-800/50 transition-all duration-300">
      {/* Game Image */}
      <div className="relative">
        <img
          src={game.image}
          alt={game.name}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-0 right-0 m-2 px-2 py-1 bg-gray-900/80 rounded-lg text-xs font-medium text-cyan-400">
          {game.genre}
        </div>
        {game.trending && (
          <div className="absolute top-0 left-0 m-2 px-2 py-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg text-xs font-bold text-white flex items-center">
            <span className="mr-1">🔥</span> Trending
          </div>
        )}
      </div>

      {/* Game Info */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>

        <div className="flex justify-between mb-3">
          <div className="text-sm text-gray-400">
            <span className="text-cyan-400 font-medium">
              {game.activeServers}
            </span>{" "}
            Servers
          </div>
          <div className="text-sm text-gray-400">
            <span className="text-cyan-400 font-medium">
              {game.onlinePlayers.toLocaleString()}
            </span>{" "}
            Online
          </div>
        </div>

        {/* Popular Channels */}
        <div className="mt-4">
          <div className="text-xs text-gray-500 mb-2">POPULAR CHANNELS</div>
          <div className="flex flex-wrap gap-2">
            {game.popularChannels.slice(0, 3).map((channel) => (
              <span
                key={channel}
                className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
              >
                #{channel}
              </span>
            ))}
          </div>
        </div>

        {/* Join Button */}
        <button className="w-full mt-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-purple-900/30">
          Join Server
        </button>
      </div>
    </div>
  );
}
