import { auth }
from "./firebase.js";

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

/* CART FUNCTIONS */
function getCart() {

  return JSON.parse(
    localStorage.getItem("cart")
  ) || [];
}

function saveCart(cart) {

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );
}

function updateCartCount() {

  const cart = getCart();

  const totalItems = cart.reduce(

    (total, item) =>

      total + (item.quantity || 0),

    0
  );

  const cartCount =
    document.getElementById("cartCount");

  if (cartCount) {

    cartCount.textContent =
      totalItems;
  }
}

function addToCart(productData) {

  let cart = getCart();

  const existingProduct =
    cart.find(

      item =>

        item.id === productData.id &&
        item.size === productData.size
    );

  if (existingProduct) {

    existingProduct.quantity +=
      productData.quantity;

  } else {

    cart.push(productData);
  }

  saveCart(cart);

  updateCartCount();

  return true;
}

/* FETCH PRODUCTS */
async function fetchProducts() {

  try {

    loading.style.display =
      "block";

    const cachedProducts =
      localStorage.getItem("products");

    if (cachedProducts) {

      const parsedProducts =
        JSON.parse(cachedProducts);

      allProducts =
        parsedProducts;

      displayProducts(
        parsedProducts
      );

      loading.style.display =
        "none";

      return;
    }

    const response =
      await fetch(API_URL);

    if (!response.ok) {

      throw new Error(
        "Failed to fetch products"
      );
    }

    const products =
      await response.json();

    allProducts = products;

    localStorage.setItem(
      "products",
      JSON.stringify(products)
    );

    displayProducts(products);

  } catch (error) {

    console.error(error);

    errorMessage.style.display =
      "block";

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
          ${product.description}
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

/* AUTH STATE */
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

    window.location.href =
      "auth.html";
  }
);

/* INITIAL */
updateCartCount();

fetchProducts();
