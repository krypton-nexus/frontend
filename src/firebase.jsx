import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyArVVrAk0v6U_mmhmaVd7aNt2cugAbjhXc",
  authDomain: "nexus-communication-channel.firebaseapp.com",
  projectId: "nexus-communication-channel",
  storageBucket: "nexus-communication-channel.firebasestorage.app",
  messagingSenderId: "977911158183",
  appId: "1:977911158183:web:30bc714907841fee0d9282",
  measurementId: "G-2Y8Y2T6BN1",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
