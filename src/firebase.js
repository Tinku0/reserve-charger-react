// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3bKdmKOLiwLYybeajcmdYRL_9uNONrNk",
  authDomain: "chargequeue-2d62f.firebaseapp.com",
  projectId: "chargequeue-2d62f",
  storageBucket: "chargequeue-2d62f.firebasestorage.app",
  messagingSenderId: "951608306451",
  appId: "1:951608306451:web:b48d4e6c89662934be08e6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
