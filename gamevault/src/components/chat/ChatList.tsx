import React from "react";
import { format } from "date-fns";
import { useChat, ChatType } from "../../contexts/ChatContext";
import { useAuth } from "../../contexts/AuthContext";

export default function ChatList() {
  const { chats, activeChat, setActiveChat, loading, onlineUsers } = useChat();
  const { currentUser } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
        <div className="mb-2 text-3xl">💬</div>
        <p className="mb-2">No conversations yet</p>
        <p className="text-sm">Start a new chat with friends or join a game discussion</p>
      </div>
    );
  }

  // Get chat display name based on participants
  const getChatDisplayName = (chat: ChatType) => {
    if (chat.isGroupChat && chat.name) {
      return chat.name;
    }
    
    // For direct messages, show the other participant's name
    if (!chat.isGroupChat && currentUser) {
      const otherParticipantId = chat.participants.find(
        (id) => id !== currentUser.uid
      );
      
      if (otherParticipantId && chat.participantNames) {
        return chat.participantNames[otherParticipantId];
      }
    }
    
    return "Chat";
  };

  // Get avatar for chat (profile image for direct messages, first letter for group chats)
  const getChatAvatar = (chat: ChatType) => {
    if (chat.isGroupChat) {
      // Group chat avatar (first letter of group name)
      return (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <span className="text-white font-medium">
            {(chat.name || "G").charAt(0).toUpperCase()}
          </span>
        </div>
      );
    } else if (currentUser) {
      // Direct message avatar (other user's profile image)
      const otherParticipantId = chat.participants.find(
        (id) => id !== currentUser.uid
      );
      
      if (otherParticipantId && chat.participantImages && chat.participantImages[otherParticipantId]) {
        return (
          <div className="relative">
            <img
              src={chat.participantImages[otherParticipantId]}
              alt={chat.participantNames?.[otherParticipantId] || "User"}
              className="w-12 h-12 rounded-full object-cover"
            />
            {/* Online status indicator */}
            <div 
              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${
                onlineUsers[otherParticipantId] ? 'bg-green-500' : 'bg-gray-500'
              }`}
            ></div>
          </div>
        );
      } else {
        // Fallback avatar with initials
        const userName = otherParticipantId && chat.participantNames?.[otherParticipantId];
        return (
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-white font-medium">
                {userName ? userName.substring(0, 2).toUpperCase() : "?"}
              </span>
            </div>
            {/* Online status indicator */}
            {otherParticipantId && (
              <div 
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${
                  onlineUsers[otherParticipantId] ? 'bg-green-500' : 'bg-gray-500'
                }`}
              ></div>
            )}
          </div>
        );
      }
    }
  };

  // Format timestamp for last message
  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return "";
    
    const date = new Date(timestamp.seconds * 1000);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return format(date, "HH:mm");
    }
    
    // If this week, show day name
    const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return format(date, "EEE");
    }
    
    // Otherwise show date
    return format(date, "dd/MM/yyyy");
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`flex items-center p-3 cursor-pointer hover:bg-gray-700 transition-colors ${
            activeChat?.id === chat.id ? "bg-gray-700" : ""
          }`}
          onClick={() => setActiveChat(chat.id)}
        >
          {/* Chat avatar */}
          <div className="flex-shrink-0 mr-3">
            {getChatAvatar(chat)}
          </div>

          {/* Chat info */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline">
              <h3 className="text-white font-medium truncate">
                {getChatDisplayName(chat)}
              </h3>
              {chat.lastMessage?.timestamp && (
                <span className="text-xs text-gray-400 ml-2">
                  {formatMessageTime(chat.lastMessage.timestamp)}
                </span>
              )}
            </div>
            
            <div className="flex items-center">
              <p className="text-sm text-gray-400 truncate">
                {chat.lastMessage?.content || "No messages yet"}
              </p>
              
              {/* Unread indicator */}
              {chat.unreadCount && chat.unreadCount > 0 && (
                <div className="ml-2 flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-purple-500 text-white text-xs font-medium">
                  {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
