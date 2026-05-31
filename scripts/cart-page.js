const cartItems =
  document.getElementById("cartItems");

const cartTotal =
  document.getElementById("cartTotal");

const checkoutBtn =
  document.getElementById("checkoutBtn");

/* LOAD CART */
function loadCart() {

  const cart = getCart();

  /* EMPTY CART */
  if (cart.length === 0) {

    cartItems.innerHTML = `

      <div class="empty-cart">

        <h2>
          Your cart is empty.
        </h2>

      </div>
    `;

    cartTotal.textContent = "0.00";

    if (checkoutBtn) {
      checkoutBtn.disabled = true;
    }

    return;
  }

  if (checkoutBtn) {
    checkoutBtn.disabled = false;
  }

  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {

    const itemTotal =

      Number(item.price) *
      Number(item.quantity);

    total += itemTotal;

    const cartCard =
      document.createElement("div");

    cartCard.classList.add("cart-card");

    cartCard.innerHTML = `

      <img
        src="${item.image}"
        alt="${item.title}"
      />

      <div class="cart-info">

        <h3>
          ${item.title}
        </h3>

        <p>
          Size:
          ${item.size}
        </p>

        <p>
          Price:
          $${Number(item.price).toFixed(2)}
        </p>

        <!-- QUANTITY -->
        <div class="cart-quantity">

          <button
            class="qty-btn decrease"
            data-index="${index}"
          >
            −
          </button>

          <span>
            ${item.quantity}
          </span>

          <button
            class="qty-btn increase"
            data-index="${index}"
          >
            +
          </button>

        </div>

        <p class="item-total">

          Item Total:
          $${itemTotal.toFixed(2)}

        </p>

        <!-- REMOVE -->
        <button
          class="remove-btn"
          data-id="${item.id}"
          data-size="${item.size}"
        >
          Remove
        </button>

      </div>
    `;

    cartItems.appendChild(cartCard);
  });

  cartTotal.textContent =
    total.toFixed(2);
}

/* UPDATE QUANTITY */
function updateQuantity(
  index,
  change
) {

  let cart = getCart();

  if (!cart[index]) return;

  cart[index].quantity =

    Number(cart[index].quantity) +
    Number(change);

  /* PREVENT BELOW 1 */
  if (cart[index].quantity < 1) {

    cart[index].quantity = 1;
  }

  saveCart(cart);

  updateCartCount();

  loadCart();
}

/* CLICK EVENTS */
document.addEventListener(
  "click",
  (e) => {

    /* REMOVE ITEM */
    const removeBtn =
      e.target.closest(".remove-btn");

    if (removeBtn) {

      const id =
        Number(removeBtn.dataset.id);

      const size =
        removeBtn.dataset.size;

      removeFromCart(id, size);

      loadCart();
    }

    /* INCREASE */
    const increaseBtn =
      e.target.closest(".increase");

    if (increaseBtn) {

      const index =
        Number(increaseBtn.dataset.index);

      updateQuantity(index, 1);
    }

    /* DECREASE */
    const decreaseBtn =
      e.target.closest(".decrease");

    if (decreaseBtn) {

      const index =
        Number(decreaseBtn.dataset.index);

      updateQuantity(index, -1);
    }
  }
);

/* CHECKOUT */
if (checkoutBtn) {

  checkoutBtn.addEventListener(
    "click",
    () => {

      alert(
        "Proceeding to checkout..."
      );
    }
  );
}

/* INITIAL LOAD */
loadCart();