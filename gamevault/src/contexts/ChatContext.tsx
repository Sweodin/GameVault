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
  Timestamp
} from "firebase/firestore";
import { getDatabase, ref, onDisconnect, set, onValue } from "firebase/database";
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
  getOrCreateDirectChat: (userId: string, userName: string) => Promise<string>;
  updateTypingStatus: (isTyping: boolean) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

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
  const { currentUser, username } = useAuth();
  const [chats, setChats] = useState<ChatType[]>([]);
  const [activeChat, setActiveChatState] = useState<ChatType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});

  // Load user's chats
  useEffect(() => {
    if (!currentUser) {
      setChats([]);
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
            setChats(prev => 
              prev.map(c => c.id === chat.id ? {...c, unreadCount} : c)
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
            if (message.senderId !== currentUser.uid && message.read === false) {
              const messageRef = doc(db, "chats", activeChat.id, "messages", message.id!);
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
      setActiveChatState(null);
      return;
    }
    
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setActiveChatState(chat);
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentUser || !activeChat || !content.trim()) {
      return;
    }

    try {
      const messageData: Omit<MessageType, 'id'> = {
        content: content.trim(),
        senderId: currentUser.uid,
        senderName: username || 'Unknown User',
        senderProfileImage: currentUser.photoURL || undefined,
        timestamp: serverTimestamp(),
        read: false,
      };

      // Add message to subcollection
      await addDoc(collection(db, "chats", activeChat.id, "messages"), messageData);
      
      // Update chat's last message and timestamp
      const chatRef = doc(db, "chats", activeChat.id);
      await updateDoc(chatRef, {
        lastMessage: {
          content: content.trim(),
          senderId: currentUser.uid,
          timestamp: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  };

  const createDirectChat = async (userId: string, userName: string) => {
    if (!currentUser || !username) {
      throw new Error("You must be logged in to create a chat");
    }

    // Check if chat already exists
    const existingChatId = await getExistingDirectChat(userId);
    if (existingChatId) {
      return existingChatId;
    }

    // Create new chat
    const chatData: Omit<ChatType, 'id'> = {
      participants: [currentUser.uid, userId],
      participantNames: {
        [currentUser.uid]: username,
        [userId]: userName,
      },
      participantImages: {},
      isGroupChat: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Add profile images if available
    if (currentUser.photoURL) {
      chatData.participantImages = {
        ...chatData.participantImages,
        [currentUser.uid]: currentUser.photoURL,
      };
    }

    const chatRef = await addDoc(collection(db, "chats"), chatData);
    return chatRef.id;
  };

  const getExistingDirectChat = async (userId: string): Promise<string | null> => {
    if (!currentUser) return null;

    const chatsQuery = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUser.uid),
      where("isGroupChat", "==", false)
    );

    const querySnapshot = await getDocs(chatsQuery);
    let existingChatId: string | null = null;

    querySnapshot.forEach((doc) => {
      const chatData = doc.data() as ChatType;
      if (chatData.participants.includes(userId)) {
        existingChatId = doc.id;
      }
    });

    return existingChatId;
  };

  const getOrCreateDirectChat = async (userId: string, userName: string) => {
    const existingChatId = await getExistingDirectChat(userId);
    if (existingChatId) {
      return existingChatId;
    }
    return createDirectChat(userId, userName);
  };

  const createGroupChat = async (name: string, participantIds: string[]) => {
    if (!currentUser || !username) {
      throw new Error("You must be logged in to create a chat");
    }

    // Ensure creator is included in participants
    if (!participantIds.includes(currentUser.uid)) {
      participantIds.push(currentUser.uid);
    }

    // Get participant names
    const participantNames: Record<string, string> = {};
    participantNames[currentUser.uid] = username;

    // Fetch other participant names
    for (const userId of participantIds) {
      if (userId !== currentUser.uid) {
        try {
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists()) {
            participantNames[userId] = userDoc.data().username || "Unknown User";
          }
        } catch (err) {
          console.error(`Error fetching user ${userId}:`, err);
        }
      }
    }

    // Create new group chat
    const chatData: Omit<ChatType, 'id'> = {
      participants: participantIds,
      participantNames: participantNames,
      isGroupChat: true,
      name: name,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const chatRef = await addDoc(collection(db, "chats"), chatData);
    return chatRef.id;
  };

  // Add typing indicator functionality
  const updateTypingStatus = async (isTyping: boolean) => {
    if (!currentUser || !activeChat) return;
    
    const typingRef = doc(db, "chats", activeChat.id, "typing", currentUser.uid);
    
    if (isTyping) {
      await setDoc(typingRef, {
        userId: currentUser.uid,
        username: username,
        timestamp: serverTimestamp()
      });
    } else {
      await deleteDoc(typingRef);
    }
  };

  // Add listener for typing indicators
  useEffect(() => {
    if (!activeChat) return;
    
    const typingQuery = collection(db, "chats", activeChat.id, "typing");
    
    const unsubscribe = onSnapshot(typingQuery, (snapshot) => {
      const typingData: Record<string, boolean> = {};
      
      snapshot.forEach(doc => {
        const data = doc.data();
        // Only consider typing if within last 5 seconds
        const isRecent = data.timestamp && 
          (new Date().getTime() - (data.timestamp.toDate?.() || data.timestamp).getTime()) < 5000;
        
        if (isRecent && data.userId !== currentUser?.uid) {
          typingData[data.userId] = true;
        }
      });
      
      setTypingUsers(typingData);
    });
    
    return () => unsubscribe();
  }, [activeChat, currentUser]);

  // Add presence system (online/offline status)
  useEffect(() => {
    if (!currentUser) return;
    
    // Set user as online
    const userStatusRef = ref(rtdb, `status/${currentUser.uid}`);
    
    const setOnline = async () => {
      await set(userStatusRef, {
        state: 'online',
        lastChanged: new Date().getTime()
      });
    };
    
    setOnline();
    
    // Set user as offline when disconnected
    onDisconnect(userStatusRef).set({
      state: 'offline',
      lastChanged: new Date().getTime()
    });
    
    return () => {
      // Set as offline when component unmounts
      set(userStatusRef, {
        state: 'offline',
        lastChanged: new Date().getTime()
      });
    };
  }, [currentUser]);

  // Monitor online status of chat participants
  useEffect(() => {
    if (!chats.length) return;
    
    // Get all unique participants from all chats
    const allParticipants = new Set<string>();
    chats.forEach(chat => {
      chat.participants.forEach(userId => {
        if (userId !== currentUser?.uid) {
          allParticipants.add(userId);
        }
      });
    });
    
    // Create listeners for each participant's status
    const unsubscribes = Array.from(allParticipants).map(userId => {
      const userStatusRef = ref(rtdb, `status/${userId}`);
      
      return onValue(userStatusRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setOnlineUsers(prev => ({
            ...prev,
            [userId]: data.state === 'online'
          }));
        }
      });
    });
    
    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [chats, currentUser]);

  const value = {
    chats,
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
    getOrCreateDirectChat,
    updateTypingStatus,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
