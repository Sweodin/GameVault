import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { MessageType } from "../../contexts/ChatContext";

interface ForumChannelProps {
  forumId: string;
  gameName: string;
  channelName: string;
}

const ForumChannel: React.FC<ForumChannelProps> = ({
  forumId,
  gameName,
  channelName,
}) => {
  const { currentUser } = useAuth();
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate mock forum messages based on the forumId
  useEffect(() => {
    if (!forumId) return;

    setLoading(true);

    // Simulate loading delay
    const timer = setTimeout(() => {
      // Generate mock messages for this forum
      const mockMessages: MessageType[] = [
        {
          id: '1',
          content: `Welcome to the #${channelName} discussion forum for ${gameName}! This is a public channel for all players to discuss ${channelName}-related topics.`,
          senderId: 'system',
          senderName: 'GameVault System',
          timestamp: { toDate: () => new Date(Date.now() - 86400000) } as any, // 1 day ago
          read: true,
        },
        {
          id: '2',
          content: `I've been playing ${gameName} for a while now and I'm really enjoying the ${channelName} aspect of it!`,
          senderId: 'user1',
          senderName: 'GamerPro42',
          timestamp: { toDate: () => new Date(Date.now() - 43200000) } as any, // 12 hours ago
          read: true,
        },
        {
          id: '3',
          content: `Has anyone found any secrets in the ${channelName} area? I heard there's a hidden easter egg.`,
          senderId: 'user2',
          senderName: 'QuestHunter',
          timestamp: { toDate: () => new Date(Date.now() - 21600000) } as any, // 6 hours ago
          read: true,
        },
        {
          id: '4',
          content: `I'm stuck on the ${channelName} level. Any tips?`,
          senderId: 'user3',
          senderName: 'NewPlayer99',
          timestamp: { toDate: () => new Date(Date.now() - 7200000) } as any, // 2 hours ago
          read: true,
        },
      ];

      setMessages(mockMessages);
      setLoading(false);
    }, 1000); // 1 second delay to simulate loading

    return () => clearTimeout(timer);
  }, [forumId, channelName, gameName]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Add a message to the mock forum
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !currentUser) return;

    // Create a new mock message
    const newMessage: MessageType = {
      id: `user-message-${Date.now()}`,
      content: messageText,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || "You",
      senderProfileImage: currentUser.photoURL || undefined,
      timestamp: { toDate: () => new Date() } as any, // Current time
      read: true,
    };

    // Add the message to the local state
    setMessages(prev => [...prev, newMessage]);
    setMessageText("");
  };

  return (
    <div className="flex flex-col h-[500px]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="text-4xl mb-3">👋</div>
            <p className="mb-1">No messages yet in this forum</p>
            <p className="text-sm">Be the first to start the discussion!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${
                  message.senderId === currentUser?.uid
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.senderId === currentUser?.uid
                      ? "bg-cyan-800"
                      : "bg-gray-700"
                  } rounded-lg p-3`}
                >
                  {message.senderId !== currentUser?.uid && (
                    <div className="font-medium text-sm text-cyan-400 mb-1">
                      {message.senderName}
                    </div>
                  )}
                  <div className="text-white">{message.content}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {message.timestamp?.toDate().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={`Message #${channelName}`}
            className="flex-1 bg-gray-700 rounded-l-md px-4 py-2 text-white focus:outline-none"
          />
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-r-md transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForumChannel;
