// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-mern-app-f2fda.firebaseapp.com",
  projectId: "real-estate-mern-app-f2fda",
  storageBucket: "real-estate-mern-app-f2fda.appspot.com",
  messagingSenderId: "356949322827",
  appId: "1:356949322827:web:4c950cbf6bf2b66759b1ce"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);