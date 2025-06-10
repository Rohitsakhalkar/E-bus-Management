import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { app } from './firebase.js';

const auth = getAuth(app);
const db = getFirestore(app);

window.loginAdmin = async function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("No user profile found in Firestore ❌");
      return;
    }

    const userData = userSnap.data();

    if (userData.role !== "admin") {
      alert("Access denied. Not an admin.");
      return;
    }

    alert("Welcome Admin ✅");
    window.location.href = "admin_dashboard.html";
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed: " + error.message);
  }
};
