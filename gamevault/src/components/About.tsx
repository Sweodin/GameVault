import React from "react";
import MainLayout from "../layouts/MainLayout";

export default function About() {
  const version = "1.0.0";
  const releaseDate = "May 2025";
  
  // Team members
  const teamMembers = [
    {
      name: "Sweodin",
      role: "Lead Developer",
      avatar: "/assets/team/placeholder-avatar.jpg"
    },
    {
      name: "Cascade AI",
      role: "AI Assistant",
      avatar: "/assets/team/placeholder-avatar.jpg"
    }
  ];

  // Features list
  const features = [
    "Game discovery and recommendations",
    "Social gaming with friends",
    "Game library management",
    "Real-time chat and messaging",
    "Customizable user profiles",
    "Game activity tracking",
    "Server creation and management"
  ];

  // Tech stack
  const techStack = [
    { name: "React", icon: "fab fa-react" },
    { name: "TypeScript", icon: "fas fa-code" },
    { name: "Firebase", icon: "fas fa-fire" },
    { name: "Tailwind CSS", icon: "fas fa-paint-brush" },
    { name: "Vite", icon: "fas fa-bolt" }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 p-6 text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Nexus
            </h1>
            <p className="text-gray-300 mt-2">
              The next generation gaming platform
            </p>
            <div className="mt-3 text-gray-400">
              Version {version} • Released {releaseDate}
            </div>
          </div>

          <div className="p-6">
            {/* Platform Description */}
            <div className="mb-10 text-center">
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Nexus is a modern gaming platform designed to connect gamers,
                provide a seamless gaming experience, and build communities
                around the games you love.
              </p>
            </div>

            {/* Key Features */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-white mb-4 text-center">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 p-3 rounded-lg flex items-center"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mr-3">
                      <i className="fas fa-check text-cyan-400"></i>
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-white mb-4 text-center">
                Built With
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {techStack.map((tech, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 px-4 py-2 rounded-lg flex items-center"
                  >
                    <i className={`${tech.icon} text-cyan-400 mr-2`}></i>
                    <span className="text-gray-300">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Team */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-white mb-4 text-center">
                Team
              </h2>
              <div className="flex flex-wrap justify-center gap-6">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 p-4 rounded-lg flex flex-col items-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden border-2 border-cyan-500/30 mb-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://via.placeholder.com/200x200";
                        }}
                      />
                    </div>
                    <h3 className="font-medium text-white">{member.name}</h3>
                    <p className="text-sm text-gray-400">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal & Credits */}
            <div className="text-center text-gray-400 text-sm">
              <p className="mb-2">
                © 2025 Nexus Gaming Platform. All rights reserved.
              </p>
              <p>
                Game images and content are property of their respective owners.
              </p>
            </div>

            {/* Version History */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                Version History
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-white">Version 1.0.0</h3>
                    <span className="text-sm text-gray-400">{releaseDate}</span>
                  </div>
                  <p className="text-gray-300 mb-2">Initial Release</p>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li>Core platform features</li>
                    <li>User authentication and profiles</li>
                    <li>Game library and discovery</li>
                    <li>Social features and chat</li>
                    <li>Server creation and management</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
