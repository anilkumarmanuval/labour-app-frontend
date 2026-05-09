import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBSUi8Jtv1GsEy-HC9HUS0FdQVkgRtIlAk",
  authDomain: "labour-app-d5b13.firebaseapp.com",
  projectId: "labour-app-d5b13",
  storageBucket: "labour-app-d5b13.firebasestorage.app",
  messagingSenderId: "215212353188",
  appId: "1:215212353188:web:7b13f63414ab9b2b3da831"
};

const app = initializeApp(firebaseConfig);

// 👇 IMPORTANT LINE
export const db = getFirestore(app);
export const auth = getAuth(app);