import { auth }
from "./firebase.js";

import {

  createUserWithEmailAndPassword,

  signInWithEmailAndPassword,

  onAuthStateChanged,

  signOut,

  setPersistence,

  browserLocalPersistence

}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* ELEMENTS */
const loginTab =
  document.getElementById("loginTab");

const signupTab =
  document.getElementById("signupTab");

const loginForm =
  document.getElementById("loginForm");

const signupForm =
  document.getElementById("signupForm");

/* LOGIN INPUTS */
const loginEmail =
  document.getElementById("loginEmail");

const loginPassword =
  document.getElementById("loginPassword");

/* SIGNUP INPUTS */
const signupEmail =
  document.getElementById("signupEmail");

const signupPassword =
  document.getElementById("signupPassword");

const confirmPassword =
  document.getElementById("confirmPassword");

/* PASSWORD STRENGTH */
const passwordStrength =
  document.getElementById("passwordStrength");

/* TOGGLE FORMS */
loginTab.addEventListener(
  "click",
  () => {

    loginTab.classList.add("active");

    signupTab.classList.remove("active");

    loginForm.classList.add("active");

    signupForm.classList.remove("active");
  }
);

signupTab.addEventListener(
  "click",
  () => {

    signupTab.classList.add("active");

    loginTab.classList.remove("active");

    signupForm.classList.add("active");

    loginForm.classList.remove("active");
  }
);

/* PASSWORD TOGGLE */
document.querySelectorAll(
  ".toggle-password"
).forEach(icon => {

  icon.addEventListener(
    "click",
    () => {

      const input =
        icon.previousElementSibling;

      input.type =

        input.type === "password"
        ? "text"
        : "password";
    }
  );
});

/* PASSWORD STRENGTH */
signupPassword.addEventListener(
  "input",
  () => {

    const password =
      signupPassword.value;

    if (password.length < 6) {

      passwordStrength.textContent =
        "Weak";

      passwordStrength.style.color =
        "red";

    } else if (

      /^(?=.*[A-Z])(?=.*\d)/.test(password)

    ) {

      passwordStrength.textContent =
        "Strong";

      passwordStrength.style.color =
        "green";

    } else {

      passwordStrength.textContent =
        "Medium";

      passwordStrength.style.color =
        "orange";
    }
  }
);

/* SESSION PERSISTENCE */
setPersistence(
  auth,
  browserLocalPersistence
);

/* SIGNUP */
signupForm.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    const email =
      signupEmail.value.trim();

    const password =
      signupPassword.value;

    const confirm =
      confirmPassword.value;

    /* VALIDATION */
    if (!email || !password) {

      alert(
        "Please fill all fields."
      );

      return;
    }

    if (password.length < 6) {

      alert(
        "Password must be at least 6 characters."
      );

      return;
    }

    if (password !== confirm) {

      alert(
        "Passwords do not match."
      );

      return;
    }

    try {

      await createUserWithEmailAndPassword(

        auth,

        email,

        password
      );

      alert(
        "Signup successful!"
      );

      window.location.href =
        "index.html";

    } catch (error) {

      console.error(error);

      alert(error.message);
    }
  }
);

/* LOGIN */
loginForm.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    const email =
      loginEmail.value.trim();

    const password =
      loginPassword.value;

    try {

      await signInWithEmailAndPassword(

        auth,

        email,

        password
      );

      alert(
        "Login successful!"
      );

      window.location.href =
        "index.html";

    } catch (error) {

      console.error(error);

      alert(error.message);
    }
  }
);

/* AUTH STATE */
onAuthStateChanged(
  auth,
  (user) => {

    if (user) {

      console.log(
        "Logged in:",
        user.email
      );
    }
  }
);

/* LOGOUT */
window.logoutUser =
  async function () {

    try {

      await signOut(auth);

      window.location.href =
        "auth.html";

    } catch (error) {

      console.error(error);
    }
  };
