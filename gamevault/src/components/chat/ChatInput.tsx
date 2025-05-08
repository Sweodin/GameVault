import React, { useState, useRef, KeyboardEvent, FormEvent, useEffect } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import { useChat } from "../../contexts/ChatContext";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const { sendMessage, activeChat, updateTypingStatus } = useChat();
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;
    
    await sendMessage(message);
    setMessage("");
    
    // Clear typing status when message is sent
    if (isTyping) {
      setIsTyping(false);
      updateTypingStatus(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Update typing status
    if (!isTyping) {
      setIsTyping(true);
      updateTypingStatus(true);
    }
    
    // Reset typing timeout
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    
    // Set timeout to clear typing status after 3 seconds of inactivity
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
      updateTypingStatus(false);
    }, 3000);
  };

  // Clean up typing status when component unmounts
  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
      if (isTyping) {
        updateTypingStatus(false);
      }
    };
  }, [isTyping, updateTypingStatus]);

  if (!activeChat) return null;

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-gray-800 border-t border-gray-700 p-4"
    >
      <div className="flex items-end space-x-2">
        {/* Attachment button */}
        <button
          type="button"
          className="text-gray-400 hover:text-gray-300 p-2 rounded-full hover:bg-gray-700"
          title="Add attachment"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Message input */}
        <div className="flex-1 bg-gray-700 rounded-lg overflow-hidden">
          <textarea
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full bg-transparent text-white px-4 py-3 resize-none focus:outline-none h-10 max-h-32"
            rows={1}
            style={{ minHeight: "40px" }}
          />
        </div>

        {/* Emoji button */}
        <button
          type="button"
          className="text-gray-400 hover:text-gray-300 p-2 rounded-full hover:bg-gray-700"
          title="Add emoji"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Send button */}
        <button
          type="submit"
          disabled={!message.trim()}
          className={`p-2 rounded-full ${
            message.trim()
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-700 text-gray-500"
          }`}
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
