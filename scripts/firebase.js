// FIREBASE SDK IMPORTS
import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* FIREBASE CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyDt7upMq7vEzHiQnMu7xU9-7tkgvI-rt00",
  authDomain: "shopease-cb316.firebaseapp.com",
  projectId: "shopease-cb316",
  storageBucket: "shopease-cb316.firebasestorage.app",
  messagingSenderId: "553720576687",
  appId: "1:553720576687:web:50b94af0a7a112e527725a",
  measurementId: "G-DMJ5KB9X5J"
};

/* INITIALIZE */
const app =
  initializeApp(firebaseConfig);

/* AUTH */
const auth =
  getAuth(app);

export { auth };