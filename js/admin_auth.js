import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
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
    window.location.href = "../admin/admin.html";
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed: " + error.message);
  }
};

// LOGOUT BUTTON HANDLER
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully 👋");
      window.location.href = '../index.html';
    } catch (err) {
      console.error("Logout error:", err);
      alert("Oops, could not log you out");
    }
  });
}
