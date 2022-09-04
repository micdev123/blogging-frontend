// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6ohJDw7bTiZAURWjCKd5ZMV8-2sVRZbA",
  authDomain: "blog-mern-app-355a0.firebaseapp.com",
  projectId: "blog-mern-app-355a0",
  storageBucket: "blog-mern-app-355a0.appspot.com",
  messagingSenderId: "697033254739",
  appId: "1:697033254739:web:b778f7edf1c47cc93263a6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export app
export default app;