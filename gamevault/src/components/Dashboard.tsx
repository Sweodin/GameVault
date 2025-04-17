import React from "react";
import MainLayout from "../layouts/MainLayout";

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="p-6 bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured Game */}
          <div className="md:col-span-2 lg:col-span-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-purple-900/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://placehold.co/1200x400')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center text-cyan-300">
                <span className="mr-2">⚔️</span> Featured Game
              </h2>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="aspect-video md:w-1/2 bg-black/50 rounded-xl overflow-hidden border border-purple-900/30">
                  <img
                    src="https://placehold.co/800x450"
                    alt="Elden Ring"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Elden Ring
                  </h3>
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded-full border border-purple-700/50">
                      RPG
                    </span>
                    <span className="px-2 py-1 bg-cyan-900/50 text-cyan-300 text-xs rounded-full border border-cyan-700/50">
                      Open World
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">
                    An action RPG that takes place in the Lands Between, a realm
                    designed by Hidetaka Miyazaki and George R. R. Martin.
                  </p>
                  <button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-purple-900/30">
                    Play Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Game Cards */}
          {[1, 2, 3, 4, 5, 6].map((game) => (
            <div
              key={game}
              className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-700/50 hover:border-cyan-500/30 transition-all group"
            >
              <div className="aspect-video bg-black/50 relative overflow-hidden">
                <img
                  src={`https://placehold.co/400x225?text=Game+${game}`}
                  alt={`Game ${game}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Game Title {game}
                </h3>
                <p className="text-sm text-gray-400">Action, RPG</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-green-400 font-medium">Free</span>
                  <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                    Play
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
