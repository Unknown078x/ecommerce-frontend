/* GET CART */
function getCart() {

  return JSON.parse(
    localStorage.getItem("cart")
  ) || [];
}

/* SAVE CART */
function saveCart(cart) {

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );
}

/* UPDATE CART COUNT */
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

/* ADD TO CART */
function addToCart(productData) {

  if (!productData) {
    return false;
  }

  productData.quantity =
    Number(productData.quantity);

  if (
    isNaN(productData.quantity) ||
    productData.quantity <= 0
  ) {
    return false;
  }

  let cart = getCart();

  /* CHECK EXISTING ITEM */
  const existingProduct = cart.find(

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

/* REMOVE ITEM */
function removeFromCart(id, size) {

  let cart = getCart();

  cart = cart.filter(item =>

    !(item.id === id &&
      item.size === size)
  );

  saveCart(cart);

  updateCartCount();
}

/* INITIAL LOAD */
document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateCartCount();

  }
);

/* CROSS TAB SYNC */
window.addEventListener(
  "storage",
  () => {

    updateCartCount();

  }
);