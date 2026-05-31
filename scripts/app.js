import { auth }
from "./firebase.js";

import {

  addToCart,

  updateCartCount

}
from "./cart.js";

import {

  onAuthStateChanged,

  signOut

}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* GLOBAL PRODUCTS */
let allProducts = [];

/* NAV */
const hamburger =
  document.querySelector(".hamburger");

const navbar =
  document.querySelector(".navbar");

hamburger.addEventListener(
  "click",
  () => {

    navbar.classList.toggle("active");
  }
);

/* ELEMENTS */
const productsGrid =
  document.getElementById("productsGrid");

const loading =
  document.getElementById("loading");

const errorMessage =
  document.getElementById("errorMessage");

const loginBtn =
  document.getElementById("loginBtn");

const logoutBtn =
  document.getElementById("logoutBtn");

/* API */
const API_URL =
  "https://fakestoreapi.com/products";

/* FETCH PRODUCTS */
async function fetchProducts() {

  try {

    loading.style.display =
      "block";

    /* GET CACHE */
    const cachedProducts =
      JSON.parse(
        localStorage.getItem("products")
      );

    /* INSTANT RENDER */
    if (cachedProducts?.data) {

      allProducts =
        cachedProducts.data;

      displayProducts(
        cachedProducts.data
      );

      loading.style.display =
        "none";
    }

    /* BACKGROUND FETCH */
    const response =
      await fetch(API_URL);

    if (!response.ok) {

      throw new Error(
        "Failed to fetch products"
      );
    }

    const freshProducts =
      await response.json();

    /* UPDATE CACHE */
    localStorage.setItem(
      "products",
      JSON.stringify({

        data: freshProducts,

        timestamp: Date.now()
      })
    );

    allProducts =
      freshProducts;

    /* RE-RENDER */
    displayProducts(
      freshProducts
    );

  } catch (error) {

    console.error(error);

    /* ONLY SHOW ERROR IF NO CACHE */
    if (!allProducts.length) {

      errorMessage.textContent =

        "Unable to load products.";

      errorMessage.style.display =
        "block";
    }

  } finally {

    loading.style.display =
      "none";
  }
}

/* DISPLAY */
function displayProducts(products) {

  productsGrid.innerHTML = "";

  products.forEach(product => {

    const card =
      document.createElement("div");

    card.classList.add(
      "product-card"
    );

    card.innerHTML = `

      <img
        src="${product.image}"
        alt="${product.title}"
        loading="lazy"
        decoding="async"
      />

      <div class="product-info">

        <a
          href="product.html?id=${product.id}"
          class="product-link"
        >

          <h3 class="product-title">
            ${product.title}
          </h3>

        </a>

        <p class="product-description">

          ${product.description.slice(0, 80)}...

        </p>

        <p class="product-price">
          $${product.price}
        </p>

        <button
          class="add-cart-btn"
          data-id="${product.id}"
        >
          Add to Cart
        </button>

      </div>
    `;

    productsGrid.appendChild(card);
  });

  const images =
    document.querySelectorAll(
      ".product-card img"
    );

  images.forEach(img => {

    img.addEventListener(
      "load",
      () => {

        img.classList.add("loaded");
      }
    );
  });
}

/* ADD TO CART */
document.addEventListener(
  "click",
  (e) => {

    const button =
      e.target.closest(
        ".add-cart-btn"
      );

    if (!button) return;

    const productId =
      Number(button.dataset.id);

    const product =
      allProducts.find(
        item =>
          item.id === productId
      );

    if (!product) return;

    addToCart({

      id: product.id,

      title: product.title,

      price: product.price,

      image: product.image,

      quantity: 1,

      size: "M"
    });

    button.textContent =
      "Added ✓";

    setTimeout(() => {

      button.textContent =
        "Add to Cart";

    }, 1500);
  }
);

/* AUTH UI */
onAuthStateChanged(
  auth,
  (user) => {

    if (user) {

      loginBtn.style.display =
        "none";

      logoutBtn.style.display =
        "block";

    } else {

      loginBtn.style.display =
        "block";

      logoutBtn.style.display =
        "none";
    }
  }
);

/* LOGOUT */
logoutBtn.addEventListener(
  "click",
  async () => {

    await signOut(auth);

    /* RESET UI */
    const cartCount =
      document.getElementById(
        "cartCount"
      );

    if (cartCount) {

      cartCount.textContent = "0";
    }

    window.location.href =
      "auth.html";
  }
);

/* INIT */
updateCartCount();

fetchProducts();