// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCh9-oU17hRXpkYdexEp_EneeUiSNrSc4s",
  authDomain: "todo-app-d600c.firebaseapp.com",
  databaseURL: "https://todo-app-d600c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "todo-app-d600c",
  storageBucket: "todo-app-d600c.firebasestorage.app",
  messagingSenderId: "196298856746",
  appId: "1:196298856746:web:2682811c8c81271122a653"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
