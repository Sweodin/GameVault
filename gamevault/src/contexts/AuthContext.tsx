import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  JSX,
} from "react";
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

/*----- Initialize Firestore
 const db = getFirestore(); -----*/

interface AuthContextType {
  currentUser: User | null;
  username: string | null;
  userStatus: string;
  profileImageUrl: string | null;
  signup: (
    email: string,
    password: string,
    username: string
  ) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  updateUserStatus: (status: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string>("Online");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(
    email: string,
    password: string,
    username: string
  ): Promise<UserCredential> {
    try {
      console.log(
        "Starting signup process for:",
        email,
        "with username:",
        username
      );

      // Create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log(
        "User created successfully, updating profile with username:",
        username
      );

      // Update the user's display name with the username
      await updateProfile(userCredential.user, {
        displayName: username,
      });

      console.log("Profile updated, saving to Firestore");

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username,
        email,
        createdAt: new Date().toISOString(),
      });

      console.log("User data saved to Firestore");

      // Update local state
      setUsername(username);

      return userCredential;
    } catch (error) {
      console.error("Error during signup process:", error);
      throw error;
    }
  }

  function login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout(): Promise<void> {
    return signOut(auth);
  }

  function updateUserStatus(status: string): void {
    setUserStatus(status);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      console.log("Auth state changed, user:", user);

      if (user) {
        // Get the username from Firestore if available
        try {
          console.log(
            "Attempting to fetch user data from Firestore for UID:",
            user.uid
          );
          const userDoc = await getDoc(doc(db, "users", user.uid));
          console.log(
            "Firestore document exists:",
            userDoc.exists(),
            userDoc.data()
          );

          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("Username from Firestore:", userData.username);
            setUsername(userData.username);
            if (userData.profileImageUrl) {
              setProfileImageUrl(userData.profileImageUrl);
            } else if (user.photoURL) {
              setProfileImageUrl(user.photoURL);
            }
          } else {
            // Fallback to displayName if Firestore data doesn't exist
            console.log(
              "No Firestore document, falling back to displayName:",
              user.displayName
            );
            setUsername(user.displayName);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Fallback to displayName if there's an error
          console.log(
            "Error occurred, falling back to displayName:",
            user.displayName
          );
          setUsername(user.displayName);
        }
      } else {
        setUsername(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    username,
    userStatus,
    profileImageUrl,
    signup,
    login,
    logout,
    updateUserStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
