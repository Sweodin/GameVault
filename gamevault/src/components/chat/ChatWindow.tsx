import { useRef, useEffect } from "react";
import { useChat } from "../../contexts/ChatContext";
import { useAuth } from "../../contexts/AuthContext";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatWindow() {
  const { activeChat, messages, loading, typingUsers } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Get chat display name
  const getChatName = () => {
    if (!activeChat) return "";

    if (activeChat.isGroupChat && activeChat.name) {
      return activeChat.name;
    }

    if (!activeChat.isGroupChat && currentUser) {
      const otherParticipantId = activeChat.participants.find(
        (id) => id !== currentUser.uid
      );

      if (otherParticipantId && activeChat.participantNames) {
        return activeChat.participantNames[otherParticipantId];
      }
    }

    return "Chat";
  };

  // Get typing indicator text
  const getTypingIndicator = () => {
    if (!typingUsers || Object.keys(typingUsers).length === 0) return null;
    
    const typingUserIds = Object.keys(typingUsers);
    
    if (typingUserIds.length === 1 && activeChat?.participantNames) {
      const typingUserName = activeChat.participantNames[typingUserIds[0]];
      return `${typingUserName} is typing...`;
    }
    
    return "Multiple people are typing...";
  };

  // If no active chat, show placeholder
  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 text-gray-400">
        <div className="text-6xl mb-4">💬</div>
        <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
        <p className="text-sm">Choose an existing conversation or start a new one</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      {/* Chat header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center">
        {/* Chat avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
          {activeChat.isGameChannel ? (
            <span className="text-cyan-400 font-medium">#</span>
          ) : activeChat.isGroupChat ? (
            <span className="text-white font-medium">
              {(activeChat.name || "G").charAt(0).toUpperCase()}
            </span>
          ) : (
            <span className="text-white font-medium">
              {getChatName().substring(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        {/* Chat info */}
        <div className="flex-1">
          <h3 className="font-medium text-white">{getChatName()}</h3>
          <div className="text-xs text-gray-400">
            {activeChat.isGameChannel ? (
              `Game forum channel • ${activeChat.participants.length} members`
            ) : activeChat.isGroupChat ? (
              `${activeChat.participants.length} members`
            ) : (
              "Direct Message"
            )}
          </div>
        </div>
        
        {/* Game channel badge */}
        {activeChat.isGameChannel && (
          <div className="bg-cyan-900/30 text-cyan-400 text-xs px-2 py-1 rounded-md border border-cyan-800">
            Game Channel
          </div>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="text-4xl mb-3">👋</div>
            <p className="mb-1">No messages yet</p>
            <p className="text-sm">Send a message to start the conversation</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Typing indicator */}
      {getTypingIndicator() && (
        <div className="px-4 py-2 text-sm text-gray-400 italic">
          {getTypingIndicator()}
        </div>
      )}

      {/* Chat input */}
      <ChatInput />
    </div>
  );
}
