import { auth }
from "./firebase.js";

/* GET USER CART KEY */
function getCartKey() {

  const user =
    auth.currentUser;

  if (!user) {

    return null;
  }

  return `cart_${user.email}`;
}

/* GET CART */
export function getCart() {

  const cartKey =
    getCartKey();

  if (!cartKey) {

    return [];
  }

  return JSON.parse(

    localStorage.getItem(cartKey)

  ) || [];
}

/* SAVE CART */
export function saveCart(cart) {

  const cartKey =
    getCartKey();

  if (!cartKey) return;

  localStorage.setItem(

    cartKey,

    JSON.stringify(cart)
  );
}

/* UPDATE COUNT */
export function updateCartCount() {

  const cart =
    getCart();

  const totalItems =

    cart.reduce(

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

/* ADD TO CART */
export function addToCart(productData) {

  /* BLOCK IF NOT LOGGED IN */
  if (!auth.currentUser) {

    alert(
      "Please login first."
    );

    window.location.href =
      "auth.html";

    return false;
  }

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

/* REMOVE */
export function removeFromCart(
  id,
  size
) {

  let cart = getCart();

  cart = cart.filter(item =>

    !(item.id === id &&
      item.size === size)
  );

  saveCart(cart);

  updateCartCount();
}