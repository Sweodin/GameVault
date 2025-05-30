import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import {
  getDatabase,
  ref,
  onDisconnect,
  set,
  onValue,
} from "firebase/database";
import { db } from "../firebase";

// Initialize Realtime Database for presence system
const rtdb = getDatabase();
import { useAuth } from "./AuthContext";

// Define types
export type MessageType = {
  id?: string;
  content: string;
  senderId: string;
  senderName: string;
  senderProfileImage?: string;
  timestamp: any;
  read?: boolean;
};

export type ChatType = {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  participantImages?: Record<string, string>;
  lastMessage?: MessageType;
  isGroupChat: boolean;
  name?: string;
  createdAt: any;
  updatedAt: any;
  unreadCount?: number;
  isGameChannel?: boolean;
  gameId?: string;
  channelName?: string;
};

interface ChatContextType {
  chats: ChatType[];
  activeChat: ChatType | null;
  messages: MessageType[];
  loading: boolean;
  error: string | null;
  typingUsers: Record<string, boolean>;
  onlineUsers: Record<string, boolean>;
  sendMessage: (content: string) => Promise<void>;
  setActiveChat: (chatId: string | null) => void;
  createDirectChat: (userId: string, userName: string) => Promise<string>;
  createGroupChat: (name: string, participantIds: string[]) => Promise<string>;
  createGameChannel: (
    gameId: string,
    gameName: string,
    channelName: string
  ) => Promise<string>;
  getOrCreateDirectChat: (userId: string, userName: string) => Promise<string>;
  updateTypingStatus: (isTyping: boolean) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Define and export the hook directly
export function useChat(): ChatContextType {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [chats, setChats] = useState<ChatType[]>([]);
  const [filteredChats, setFilteredChats] = useState<ChatType[]>([]);
  const [activeChat, setActiveChatState] = useState<ChatType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  const { currentUser, username } = useAuth();

  // Load user's chats
  useEffect(() => {
    if (!currentUser) {
      setChats([]);
      setFilteredChats([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const userChatsQuery = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      userChatsQuery,
      (snapshot) => {
        const chatData: ChatType[] = [];
        snapshot.forEach((doc) => {
          chatData.push({ id: doc.id, ...doc.data() } as ChatType);
        });

        // Sort chats by last message timestamp (most recent first)
        chatData.sort((a, b) => {
          const timeA = a.updatedAt ? a.updatedAt.seconds : 0;
          const timeB = b.updatedAt ? b.updatedAt.seconds : 0;
          return timeB - timeA;
        });

        setChats(chatData);

        // Filter out game channels from regular chats
        const regularChats = chatData.filter((chat) => !chat.isGameChannel);
        setFilteredChats(regularChats);

        setLoading(false);

        // For each chat, count unread messages
        chatData.forEach(async (chat) => {
          if (currentUser) {
            const unreadQuery = query(
              collection(db, "chats", chat.id, "messages"),
              where("senderId", "!=", currentUser.uid),
              where("read", "==", false)
            );

            const unreadSnapshot = await getDocs(unreadQuery);
            const unreadCount = unreadSnapshot.size;

            // Update local state with unread count
            setChats((prev) =>
              prev.map((c) => (c.id === chat.id ? { ...c, unreadCount } : c))
            );

            // Also update filtered chats with unread count
            setFilteredChats((prev) =>
              prev.map((c) => (c.id === chat.id ? { ...c, unreadCount } : c))
            );
          }
        });
      },
      (err) => {
        console.error("Error loading chats:", err);
        setError("Failed to load chats");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Load messages for active chat
  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      return;
    }

    const messagesQuery = query(
      collection(db, "chats", activeChat.id, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const messagesData: MessageType[] = [];
        snapshot.forEach((doc) => {
          messagesData.push({ id: doc.id, ...doc.data() } as MessageType);
        });
        setMessages(messagesData);

        // Mark messages as read
        if (currentUser) {
          messagesData.forEach(async (message) => {
            if (
              message.senderId !== currentUser.uid &&
              message.read === false
            ) {
              const messageRef = doc(
                db,
                "chats",
                activeChat.id,
                "messages",
                message.id!
              );
              await updateDoc(messageRef, { read: true });
            }
          });
        }
      },
      (err) => {
        console.error("Error loading messages:", err);
        setError("Failed to load messages");
      }
    );

    return () => unsubscribe();
  }, [activeChat, currentUser]);

  const setActiveChat = (chatId: string | null) => {
    if (!chatId) {
      console.log("Setting active chat to null");
      setActiveChatState(null);
      return;
    }

    console.log(`Attempting to set active chat to: ${chatId}`);
    const chat = chats.find((c) => c.id === chatId);

    if (chat) {
      console.log(`Found chat in local state: ${chat.name || "Unnamed chat"}`);
      setActiveChatState(chat);
    } else {
      // If chat is not in the list (e.g., from URL), load it
      console.log(`Chat not found in local state, loading from Firestore`);
      const loadChat = async () => {
        try {
          const chatDoc = await getDoc(doc(db, "chats", chatId));
          if (chatDoc.exists()) {
            const data = chatDoc.data();
            console.log(
              `Loaded chat from Firestore: ${data.name || "Unnamed chat"}`
            );

            // Create a properly typed chat object
            const chatData: ChatType = {
              id: chatDoc.id,
              participants: data.participants || [],
              participantNames: data.participantNames || {},
              isGroupChat: Boolean(data.isGroupChat),
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              name: data.name,
              lastMessage: data.lastMessage,
              participantImages: data.participantImages,
              unreadCount: data.unreadCount,
              isGameChannel: data.isGameChannel,
              gameId: data.gameId,
              channelName: data.channelName,
            };

            setActiveChatState(chatData);
          } else {
            console.error(`Chat with ID ${chatId} not found in Firestore`);
            setError("Chat not found");
          }
        } catch (err) {
          console.error("Error loading chat:", err);
          setError("Failed to load chat");
        }
      };
      loadChat();
    }
  };

  // Create a direct chat between current user and another user
  const createDirectChat = async (
    userId: string,
    userName: string
  ): Promise<string> => {
    if (!currentUser || !username) {
      throw new Error("You must be logged in to create a chat");
    }

    try {
      // Check if a direct chat already exists
      const existingChatQuery = query(
        collection(db, "chats"),
        where("participants", "array-contains", currentUser.uid),
        where("isGroupChat", "==", false)
      );

      const querySnapshot = await getDocs(existingChatQuery);
      let existingChat: ChatType | null = null;

      querySnapshot.forEach((doc) => {
        // Create a properly typed object with the document data and ID
        const data = doc.data();
        const chatWithId: ChatType = {
          id: doc.id,
          participants: data.participants || [],
          participantNames: data.participantNames || {},
          isGroupChat: Boolean(data.isGroupChat),
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          // Optional properties
          lastMessage: data.lastMessage,
          name: data.name,
          participantImages: data.participantImages,
          unreadCount: data.unreadCount,
          isGameChannel: data.isGameChannel,
          gameId: data.gameId,
          channelName: data.channelName,
        };

        if (chatWithId.participants.includes(userId)) {
          existingChat = chatWithId;
        }
      });

      // If we found an existing chat, return its ID
      if (existingChat) {
        // Use a type assertion to tell TypeScript this is a ChatType
        return (existingChat as ChatType).id;
      }

      // Create a new chat
      const participantNames: Record<string, string> = {};
      participantNames[currentUser.uid] = username;
      participantNames[userId] = userName;

      const chatData = {
        participants: [currentUser.uid, userId],
        participantNames,
        isGroupChat: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const chatRef = await addDoc(collection(db, "chats"), chatData);
      return chatRef.id;
    } catch (err) {
      console.error("Error creating direct chat:", err);
      throw new Error("Failed to create chat");
    }
  };

  // Create a group chat
  const createGroupChat = async (
    name: string,
    participantIds: string[]
  ): Promise<string> => {
    if (!currentUser || !username) {
      throw new Error("You must be logged in to create a group chat");
    }

    try {
      // Ensure current user is included in participants
      const participants = [...new Set([currentUser.uid, ...participantIds])];

      // Set up participant names (we only know the current user's name)
      const participantNames: Record<string, string> = {};
      participantNames[currentUser.uid] = username;

      // In a real app, you'd fetch other users' names from the database

      const chatData = {
        participants,
        participantNames,
        name,
        isGroupChat: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const chatRef = await addDoc(collection(db, "chats"), chatData);
      return chatRef.id;
    } catch (err) {
      console.error("Error creating group chat:", err);
      throw new Error("Failed to create group chat");
    }
  };

  // Create a game channel chat (forum-like channel for game discussions)
  const createGameChannel = async (
    gameId: string,
    gameName: string,
    channelName: string
  ): Promise<string> => {
    if (!currentUser || !username) {
      throw new Error("You must be logged in to create a game channel");
    }

    try {
      console.log(
        `Creating/joining game channel: ${gameName} - #${channelName}`
      );

      // Check if this game channel already exists
      const existingChannelQuery = query(
        collection(db, "chats"),
        where("isGameChannel", "==", true),
        where("gameId", "==", gameId),
        where("channelName", "==", channelName)
      );

      const querySnapshot = await getDocs(existingChannelQuery);
      if (!querySnapshot.empty) {
        // Channel already exists, return its ID
        const existingChannel = querySnapshot.docs[0];
        console.log(`Found existing channel with ID: ${existingChannel.id}`);

        // Add current user to participants if not already included
        const channelData = existingChannel.data();
        const typedChannelData = {
          ...channelData,
          id: existingChannel.id,
          participants: channelData.participants || [],
          participantNames: channelData.participantNames || {},
        } as ChatType;

        if (!typedChannelData.participants.includes(currentUser.uid)) {
          console.log(`Adding user ${username} to channel participants`);
          await updateDoc(existingChannel.ref, {
            participants: [...typedChannelData.participants, currentUser.uid],
            [`participantNames.${currentUser.uid}`]: username,
            updatedAt: serverTimestamp(),
          });
        }

        return existingChannel.id;
      }

      // Create a new game channel
      console.log(
        `Creating new game channel for ${gameName} - #${channelName}`
      );
      const channelData = {
        participants: [currentUser.uid],
        participantNames: { [currentUser.uid]: username },
        name: `${gameName} - #${channelName}`,
        isGroupChat: true,
        isGameChannel: true,
        gameId,
        channelName,
        description: `Discussion forum for ${channelName} in ${gameName}`,
        isPublic: true, // Game channels are public forums
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Add a welcome message to the channel
        lastMessage: {
          text: `Welcome to the ${channelName} channel for ${gameName}!`,
          sender: "system",
          timestamp: serverTimestamp(),
        },
      };

      const channelRef = await addDoc(collection(db, "chats"), channelData);
      console.log(`Created new channel with ID: ${channelRef.id}`);

      // Add a welcome message to the channel
      await addDoc(collection(db, "chats", channelRef.id, "messages"), {
        text: `Welcome to the #${channelName} discussion forum for ${gameName}! This is a public channel for all players to discuss ${channelName}-related topics.`,
        sender: "system",
        senderName: "GameVault System",
        timestamp: serverTimestamp(),
        read: {},
      });

      return channelRef.id;
    } catch (err) {
      console.error("Error creating game channel:", err);
      throw new Error("Failed to create game channel");
    }
  };

  // Get or create a direct chat
  const getOrCreateDirectChat = async (
    userId: string,
    userName: string
  ): Promise<string> => {
    return createDirectChat(userId, userName);
  };

  // Send a message in the active chat
  const sendMessage = async (content: string): Promise<void> => {
    if (!currentUser || !username || !activeChat) {
      throw new Error("Cannot send message");
    }

    try {
      const messageData = {
        content,
        senderId: currentUser.uid,
        senderName: username,
        senderProfileImage: currentUser.photoURL || null,
        timestamp: serverTimestamp(),
        read: false,
      };

      // Add message to the chat's messages collection
      await addDoc(
        collection(db, "chats", activeChat.id, "messages"),
        messageData
      );

      // Update the chat's last message and timestamp
      await updateDoc(doc(db, "chats", activeChat.id), {
        lastMessage: {
          content,
          senderId: currentUser.uid,
          timestamp: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      });

      // Reset typing status
      updateTypingStatus(false);
    } catch (err) {
      console.error("Error sending message:", err);
      throw new Error("Failed to send message");
    }
  };

  // Update user's typing status
  const updateTypingStatus = async (isTyping: boolean): Promise<void> => {
    if (!currentUser || !activeChat) return;

    try {
      const typingRef = ref(rtdb, `typing/${activeChat.id}/${currentUser.uid}`);

      if (isTyping) {
        // Set typing status and remove it after 10 seconds of inactivity
        await set(typingRef, true);
        onDisconnect(typingRef).remove();
      } else {
        // Clear typing status
        await set(typingRef, null);
      }
    } catch (err) {
      console.error("Error updating typing status:", err);
    }
  };

  // Listen for typing status changes
  useEffect(() => {
    if (!activeChat) {
      setTypingUsers({});
      return;
    }

    const typingRef = ref(rtdb, `typing/${activeChat.id}`);

    const unsubscribe = onValue(typingRef, (snapshot) => {
      if (snapshot.exists()) {
        const typingData = snapshot.val();
        setTypingUsers(typingData);
      } else {
        setTypingUsers({});
      }
    });

    return () => {
      unsubscribe();
    };
  }, [activeChat]);

  // Listen for online status changes
  useEffect(() => {
    if (!currentUser) return;

    // Set user as online
    const userStatusRef = ref(rtdb, `status/${currentUser.uid}`);
    set(userStatusRef, true);
    onDisconnect(userStatusRef).remove();

    // Listen for online status of other users
    const statusRef = ref(rtdb, "status");

    const unsubscribe = onValue(statusRef, (snapshot) => {
      if (snapshot.exists()) {
        const statusData = snapshot.val();
        setOnlineUsers(statusData);
      } else {
        setOnlineUsers({});
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  const contextValue: ChatContextType = {
    chats: filteredChats, // Use filtered chats that exclude game channels
    activeChat,
    messages,
    loading,
    error,
    typingUsers,
    onlineUsers,
    sendMessage,
    setActiveChat,
    createDirectChat,
    createGroupChat,
    createGameChannel,
    getOrCreateDirectChat,
    updateTypingStatus,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
}
