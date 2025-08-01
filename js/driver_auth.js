import { getAuth, signInWithEmailAndPassword ,signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { app } from './firebase.js';

const auth = getAuth(app);
const db = getFirestore(app);

window.loginDriver = async function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    const docRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(docRef);

    if (!userDoc.exists()) {
      alert("User record not found in Firestore ");
      return;
    }

    const userData = userDoc.data();

    if (userData.role !== "driver") {
      alert("Access denied. Not a driver.");
      return;
    }

    alert("Login successful ");
    window.location.href = "driver.html";
  } catch (error) {
    console.error(error);
    alert("Login failed: " + error.message);
  }
};
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(auth);
    // optionally show a toast/alert:
    alert("Logged out successfully 👋");
   
    window.location.href = '../index.html';
  } catch (err) {
    console.error("Logout error:", err);
    alert("Oops, could not log you out");
  }
});