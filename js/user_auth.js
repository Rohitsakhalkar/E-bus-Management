import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword ,signOut} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { app } from './firebase.js';

const auth = getAuth(app);
const db = getFirestore(app);

window.registerUser = async function () {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!name || !email || !password) {
    alert("Please fill all fields.");
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      role: "user"
    });

    alert("Registration successful ✅");
    window.location.href = "../user/user_home.html";
  } catch (err) {
    console.error(err);
    alert("Registration failed: " + err.message);
  }
};

window.loginUser = async function () {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;
    alert("Login successful ✅");
    window.location.href = "../user/user_home.html";
  } catch (err) {
    console.error(err);
    alert("Login failed: " + err.message);
  }
};
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
