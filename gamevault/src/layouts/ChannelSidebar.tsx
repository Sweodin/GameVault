import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Hash,
  Volume2,
  Star,
  Gamepad2,
  Trophy,
  Users,
  MessageSquare,
} from "lucide-react";

export default function ChannelSidebar() {
  // State for collapsed sections
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});

  // Toggle section collapse
  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /*----- Game content sections -----*/
  const gameSections = [
    {
      id: "discover",
      name: "DISCOVER",
      icon: <Star className="w-4 h-4" />,
      items: [
        {
          id: "featured",
          name: "Featured Games",
          type: "featured",
          icon: <Trophy className="w-4 h-4" />,
        },
        {
          id: "new-releases",
          name: "New Releases",
          type: "new",
          icon: <Gamepad2 className="w-4 h-4" />,
        },
        {
          id: "popular",
          name: "Popular Now",
          type: "popular",
          icon: <Star className="w-4 h-4" />,
        },
      ],
    },
    {
      id: "community",
      name: "COMMUNITY",
      icon: <Users className="w-4 h-4" />,
      items: [
        {
          id: "discussions",
          name: "Game Discussions",
          type: "text",
          icon: <Hash className="w-4 h-4" />,
        },
        {
          id: "tournaments",
          name: "Tournaments",
          type: "event",
          icon: <Trophy className="w-4 h-4" />,
        },
        {
          id: "voice-lounges",
          name: "Voice Lounges",
          type: "voice",
          icon: <Volume2 className="w-4 h-4" />,
        },
        {
          id: "chat",
          name: "Chat Messages",
          type: "chat",
          icon: <MessageSquare className="w-4 h-4" />,
          path: "/chat",
        },
      ],
    },
    {
      id: "my-games",
      name: "MY GAMES",
      icon: <Gamepad2 className="w-4 h-4" />,
      items: [
        {
          id: "library",
          name: "Game Library",
          type: "library",
          icon: <Gamepad2 className="w-4 h-4" />,
        },
        {
          id: "wishlist",
          name: "Wishlist",
          type: "wishlist",
          icon: <Star className="w-4 h-4" />,
        },
        {
          id: "achievements",
          name: "Achievements",
          type: "achievements",
          icon: <Trophy className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <div className="w-64 bg-gray-800 flex flex-col">
      {/* Category header */}
      <div className="h-14 border-b border-gray-900 flex items-center px-4 shadow-sm">
        <h2 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          Nexus
        </h2>
      </div>

      {/* Game sections */}
      <div className="flex-1 overflow-y-auto py-4 space-y-2">
        {gameSections.map((section) => (
          <div key={section.id} className="px-2">
            {/* Section header */}
            <div
              className="flex items-center justify-between px-2 py-2 text-xs font-semibold text-gray-400 cursor-pointer hover:text-gray-300"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center space-x-2">
                {section.icon}
                <span>{section.name}</span>
              </div>
              {collapsedSections[section.id] ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>

            {/* Section items */}
            {!collapsedSections[section.id] && (
              <div className="mt-1 space-y-1 pl-2">
                {section.items.map((item) =>
                  item.path ? (
                    <Link
                      key={item.id}
                      to={item.path}
                      className="flex items-center px-2 py-2 rounded-md hover:bg-gray-700 cursor-pointer group transition-colors"
                    >
                      <div className="text-gray-400 mr-2">{item.icon}</div>
                      <span className="text-gray-400 group-hover:text-white text-sm">
                        {item.name}
                      </span>
                    </Link>
                  ) : (
                    <div
                      key={item.id}
                      className="flex items-center px-2 py-2 rounded-md hover:bg-gray-700 cursor-pointer group transition-colors"
                    >
                      <div className="text-gray-400 mr-2">{item.icon}</div>
                      <span className="text-gray-400 group-hover:text-white text-sm">
                        {item.name}
                      </span>
                    </div>
                  )
                )}

                {/* Add item button */}
                <div className="flex items-center px-2 py-2 text-xs text-gray-500 hover:text-gray-300 cursor-pointer">
                  <span className="mr-1">+</span>
                  <span>Add {section.name.toLowerCase()} item</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Game info panel */}
      <div className="p-4 border-t border-gray-900 bg-gray-850">
        <div className="bg-gray-900 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-lg mr-3">
              🎮
            </div>
            <div>
              <div className="font-medium text-white">Current Game</div>
              <div className="text-xs text-gray-400">Select a game to view</div>
            </div>
          </div>

          <div className="flex justify-between mt-2 text-xs">
            <button className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 transition-colors">
              Details
            </button>
            <button className="px-2 py-1 bg-purple-700 hover:bg-purple-600 rounded text-white transition-colors">
              Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* export default function ChannelSidebar() { */
/*----- Mock data for channels -----*/
/* const categories = [
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
    <div className="w-60 bg-gray-800 flex flex-col"> */
{
  /* Server header */
}
{
  /* <div className="h-12 border-b border-gray-900 flex items-center px-4 shadow-sm">
        <h2 className="font-bold">GameVault</h2>
      </div> */
}

{
  /* Channels */
}
{
  /* <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {categories.map((category) => (
          <div key={category.id}>
            <h3 className="text-xs font-semibold text-gray-400 px-2 mb-1">
              {category.name}
            </h3>
            <div className="space-y-1">
              {category.channels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center px-2 py-1 rounded hover:bg-gray-700 cursor-pointer group"
                >
                  <span className="text-gray-400 mr-1">
                    {channel.type === "text" ? "#" : "🔊"}
                  </span>
                  <span className="text-gray-400 group-hover:text-white">
                    {channel.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
  */
}
