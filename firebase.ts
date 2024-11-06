// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgw1omyXyUxVZBMlANa_foAzBDdXP8R64",
  authDomain: "pet-finder-3257b.firebaseapp.com",
  projectId: "pet-finder-3257b",
  storageBucket: "pet-finder-3257b.firebasestorage.app",
  messagingSenderId: "179007180132",
  appId: "1:179007180132:web:0f6a42fc1f61768bdd3e71",
  measurementId: "G-MXR4KXKNT9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { db, storage };
