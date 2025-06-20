import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js"; // 🆕 Add this line

const firebaseConfig = {
  apiKey: "AIzaSyDdagYx3UjRUFkod0Cfv-rgeWm9svNqSjw",
  authDomain: "authentication-f6ee4.firebaseapp.com",
  projectId: "authentication-f6ee4",
  storageBucket: "authentication-f6ee4.appspot.com",
  messagingSenderId: "361139458985",
  appId: "1:361139458985:web:cadec67af08d0a0ddaeab8",
  measurementId: "G-46CDX0KVSW",
  databaseURL: "https://authentication-f6ee4-default-rtdb.firebaseio.com/" // ✅ Required for Realtime DB
};

// Initialize Firebase core services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app); // 🆕 Add this for Realtime DB access

// Export all needed services
export { app, analytics, auth, db, rtdb }; // 🆕 Include rtdb here too
