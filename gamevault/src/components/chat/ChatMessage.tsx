import React from "react";
import { format } from "date-fns";
import { MessageType } from "../../contexts/ChatContext";
import { useAuth } from "../../contexts/AuthContext";

interface ChatMessageProps {
  message: MessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { currentUser } = useAuth();
  const isOwnMessage = currentUser && message.senderId === currentUser.uid;
  
  // Format timestamp if it exists
  const formattedTime = message.timestamp ? 
    format(new Date(message.timestamp.seconds * 1000), "HH:mm") : 
    "";

  return (
    <div
      className={`flex mb-4 ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar for other users' messages */}
      {!isOwnMessage && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
            {message.senderProfileImage ? (
              <img
                src={message.senderProfileImage}
                alt={message.senderName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-medium text-white">
                {message.senderName.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>
        </div>
      )}

      <div className={`max-w-[70%]`}>
        {/* Sender name for other users' messages */}
        {!isOwnMessage && (
          <div className="text-xs text-gray-400 mb-1 ml-1">
            {message.senderName}
          </div>
        )}

        {/* Message content */}
        <div
          className={`px-4 py-2 rounded-xl ${
            isOwnMessage
              ? "bg-purple-600 text-white rounded-tr-none"
              : "bg-gray-700 text-white rounded-tl-none"
          }`}
        >
          <p className="text-sm">{message.content}</p>
          <div
            className={`text-xs mt-1 ${
              isOwnMessage ? "text-purple-200" : "text-gray-400"
            }`}
          >
            {formattedTime}
            {isOwnMessage && (
              <span className="ml-2">
                {message.read ? "Read" : "Delivered"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
