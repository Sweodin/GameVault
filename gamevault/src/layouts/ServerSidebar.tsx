// src/layouts/ServerSidebar.tsx

export default function ServerSidebar() {
  // Mock data for server/game categories
  const servers = [
    { id: "home", name: "Home", icon: "🏠" },
    { id: "action", name: "Action Games", icon: "🔥" },
    { id: "rpg", name: "RPG", icon: "⚔️" },
    { id: "strategy", name: "Strategy", icon: "🧠" },
    { id: "sports", name: "Sports", icon: "🏀" },
    { id: "indie", name: "Indie", icon: "🎮" },
  ];

  return (
    <div className="w-18 bg-gray-900 flex flex-col items-center py-3 space-y-3 overflow-y-auto">
      {servers.map((server) => (
        <div
          key={server.id}
          className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl hover:bg-indigo-500 cursor-pointer transition-all duration-200"
          title={server.name}
        >
          {server.icon}
        </div>
      ))}

      <div className="w-12 h-12 rounded-full bg-gray-700 hover:bg-green-500 flex items-center justify-center text-xl cursor-pointer mt-4">
        +
      </div>
    </div>
  );
}
