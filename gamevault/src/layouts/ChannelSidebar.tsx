// src/layouts/ChannelSidebar.tsx

export default function ChannelSidebar() {
  // Mock data for channels
  const categories = [
    {
      id: "general",
      name: "GENERAL",
      channels: [
        { id: "welcome", name: "welcome", type: "text" },
        { id: "announcements", name: "announcements", type: "text" },
      ],
    },
    {
      id: "games",
      name: "GAMES",
      channels: [
        { id: "popular", name: "popular-games", type: "text" },
        { id: "new-releases", name: "new-releases", type: "text" },
        { id: "recommendations", name: "recommendations", type: "text" },
      ],
    },
    {
      id: "community",
      name: "COMMUNITY",
      channels: [
        { id: "chat", name: "chat", type: "text" },
        { id: "voice-chat", name: "voice-chat", type: "voice" },
        { id: "game-night", name: "game-night", type: "voice" },
      ],
    },
  ];

  return (
    <div className="w-60 bg-gray-800 flex flex-col">
      {/* Server header */}
      <div className="h-12 border-b border-gray-900 flex items-center px-4 shadow-sm">
        <h2 className="font-bold">GameVault</h2>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {categories.map((category) => (
          <div key={category.id}>
            <h3 className="text-xs font-semibold text-gray-400 px-2 mb-1">{category.name}</h3>
            <div className="space-y-1">
              {category.channels.map((channel) => (
                <div key={channel.id} className="flex items-center px-2 py-1 rounded hover:bg-gray-700 cursor-pointer group">
                  <span className="text-gray-400 mr-1">
                    {channel.type === "text" ? "#" : "🔊"}
                  </span>
                  <span className="text-gray-400 group-hover:text-white">{channel.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
