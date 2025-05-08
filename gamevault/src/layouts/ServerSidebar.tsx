import { useState, useEffect } from "react";
export default function ServerSidebar() {
  /*----- Mock data for server/game categories -----*/

  const categories = [
    {
      id: "home",
      name: "Home",
      icon: "🏠",
      description: "Dashboard and activity feed",
    },
    {
      id: "action",
      name: "Action",
      icon: "🔥",
      description: "Fast-paced action games",
    },
    {
      id: "rpg",
      name: "RPG",
      icon: "⚔️",
      description: "Role-playing adventures",
    },
    {
      id: "strategy",
      name: "Strategy",
      icon: "🧠",
      description: "Tactical and strategic games",
    },
    {
      id: "sports",
      name: "Sports",
      icon: "🏀",
      description: "Sports and racing games",
    },
    {
      id: "indie",
      name: "Indie",
      icon: "🎮",
      description: "Independent game titles",
    },
  ];

  // State for active tab and sidebar collapse
  const [activeTab, setActiveTab] = useState("home");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className={`bg-gray-900 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Sidebar header with collapse toggle */}
      <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4">
        {!isCollapsed && (
          <h2 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Categories
          </h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-white p-1 rounded"
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      {/* Tab navigation */}
      <div className="flex-1 overflow-y-auto">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => setActiveTab(category.id)}
            className={`
              flex items-center p-3 cursor-pointer transition-all duration-200
              ${
                activeTab === category.id
                  ? "bg-gradient-to-r from-purple-900/50 to-transparent border-l-4 border-purple-500"
                  : "hover:bg-gray-800/50"
              }
            `}
          >
            <div
              className={`
              ${
                activeTab === category.id ? "text-purple-400" : "text-gray-400"
              } 
              text-xl mr-3
            `}
            >
              {category.icon}
            </div>

            {!isCollapsed && (
              <div>
                <div
                  className={`font-medium ${
                    activeTab === category.id ? "text-white" : "text-gray-300"
                  }`}
                >
                  {category.name}
                </div>
                {activeTab === category.id && (
                  <div className="text-xs text-gray-400 mt-1">
                    {category.description}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add category button */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-800">
          <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center">
            <span className="mr-2">+</span> Add Category
          </button>
        </div>
      )}

      {/* Mobile bottom navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around p-2 z-10">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`p-2 rounded-full ${
                activeTab === category.id
                  ? "bg-purple-900/50 text-purple-400"
                  : "text-gray-400"
              }`}
              title={category.name}
            >
              <span className="text-xl">{category.icon}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/*  const servers = [
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
 */
