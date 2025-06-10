 import { auth, db } from './firebase.js';
    import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
    import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

    window.registerDriver = async function (){
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user to Firestore with role
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: name,
          email: user.email,
          role: "driver"
        });

        alert("Driver registered successfully ");
      } catch (error) {
        console.error(error);
        alert("Registration failed ");
      }
      
    }