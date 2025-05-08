import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCTyZCaSNbGNtv4AN8Mr-eB1f5AAlS9tm8",
  authDomain: "gamevault-37a71.firebaseapp.com",
  projectId: "gamevault-37a71",
  storageBucket: "gamevault-37a71.firebasestorage.app",
  messagingSenderId: "725232159084",
  appId: "1:725232159084:web:9d98863c428c4119a34b49",
  measurementId: "G-TDRZTC82C7",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
