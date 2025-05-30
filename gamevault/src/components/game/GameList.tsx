import React from 'react';
import { Game } from '../../types/game';
import { Link } from 'react-router-dom';

interface GameListProps {
  games: Game[];
}

export const GameList: React.FC<GameListProps> = ({ games }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {games.map((game) => (
        <Link to={`/game/${game.id}`} key={game.id}>
          <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-lg border border-gray-700 hover:border-cyan-500/50">
            <div className="relative">
              <img 
                src={game.image} 
                alt={game.name} 
                className="w-full h-48 object-cover"
              />
              {game.trending && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Trending
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-1">{game.name}</h3>
              <div className="flex items-center text-gray-400 text-sm mb-3">
                <span className="bg-gray-700 rounded-full px-2 py-0.5">{game.genre}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <div>
                  <i className="fas fa-server mr-1"></i>
                  {game.activeServers} Servers
                </div>
                <div>
                  <i className="fas fa-users mr-1"></i>
                  {game.onlinePlayers.toLocaleString()} Online
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default GameList;