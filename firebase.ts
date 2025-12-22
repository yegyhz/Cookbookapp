// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBydbpskQFUoW87Lj9RBBSuHT99kHhm0cA",
  authDomain: "familycookbook-725b5.firebaseapp.com",
  projectId: "familycookbook-725b5",
  storageBucket: "familycookbook-725b5.appspot.com",
  messagingSenderId: "808644816268",
  appId: "1:808644816268:web:03f9ff34e39e89634ffaa9",
  measurementId: "G-SEZH2G25GZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
