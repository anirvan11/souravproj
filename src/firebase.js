// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDox5g5LMxZrkpxpN22Uygx5z34w6uJMus",
    authDomain: "sourav-ff18e.firebaseapp.com",
    projectId: "sourav-ff18e",
    storageBucket: "sourav-ff18e.firebasestorage.app",
    messagingSenderId: "360440529349",
    appId: "1:360440529349:web:01d633570cc0fed4310bac",
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
