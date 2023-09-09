// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: "fir-project-bf897.firebaseapp.com",
  projectId: "fir-project-bf897",
  storageBucket: "fir-project-bf897.appspot.com",
  messagingSenderId: "387495598113",
  appId: process.env.APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default firebaseConfig;
