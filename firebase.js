// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFGzSMVZ9R1XcJ1QGR1DpTlzeUgd3qZ08",
  authDomain: "reimbursementsystem.firebaseapp.com",
  projectId: "reimbursementsystem",
  storageBucket: "reimbursementsystem.appspot.com",
  messagingSenderId: "773086410004",
  appId: "1:773086410004:web:5c8fceb0ac1a848f4dbe01",
  measurementId: "G-VEP9M9C5C8",
  databaseURL: "https://reimbursementsystem-default-rtdb.firebaseio.com.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);