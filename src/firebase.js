import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1irAga1nIm2aN99k5LrCwqDLE_hNE3KA",
  authDomain: "trial-51233.firebaseapp.com",
  projectId: "trial-51233",
  storageBucket: "trial-51233.appspot.com",
  messagingSenderId: "1011149370894",
  appId: "1:1011149370894:web:61a9b8a53f526d2f8e6e5f"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Auth
const firestore = firebase.firestore(app);

export { auth, firestore };
