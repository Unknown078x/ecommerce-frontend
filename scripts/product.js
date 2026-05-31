const productDetail =
  document.getElementById("productDetail");

const cartCount =
  document.getElementById("cartCount");

/* GET PRODUCT ID FROM URL */
const params =
  new URLSearchParams(window.location.search);

const productId =
  params.get("id");

/* VALIDATE PRODUCT ID */
if (!productId || isNaN(productId)) {

  productDetail.innerHTML = `
    <h2>Invalid Product ID</h2>
  `;

  throw new Error("Invalid Product ID");
}

/* API URL */
const API_URL =
  `https://fakestoreapi.com/products/${productId}`;

/* FETCH PRODUCT */
async function fetchProduct() {

  try {

    const response =
      await fetch(API_URL);

    if (!response.ok) {

      throw new Error(
        "Failed to fetch product"
      );
    }

    const product =
      await response.json();

    displayProduct(product);

  } catch (error) {

    console.error(error);

    productDetail.innerHTML = `
      <h2>Failed to load product.</h2>
    `;
  }
}

/* DISPLAY PRODUCT */
function displayProduct(product) {

  productDetail.innerHTML = `

    <!-- IMAGE -->
    <div class="product-detail-image">

      <div class="image-container">

        <img
          id="mainProductImage"
          src="${product.image}"
          alt="${product.title}"
        />

      </div>

    </div>

    <!-- INFO -->
    <div class="product-detail-info">

      <h1>${product.title}</h1>

      <p class="product-detail-description">
        ${product.description}
      </p>

      <!-- VARIATIONS -->
      <div class="product-options">

        <label>Choose Size:</label>

        <div class="size-options">

          <button class="size-btn active">
            S
          </button>

          <button class="size-btn">
            M
          </button>

          <button class="size-btn">
            L
          </button>

          <button class="size-btn disabled">
            XL
          </button>

        </div>

      </div>

      <!-- QUANTITY -->
      <div class="quantity-container">

        <button id="decreaseQty">
          −
        </button>

        <span id="quantity">
          1
        </span>

        <button id="increaseQty">
          +
        </button>

      </div>

      <!-- PRICE -->
      <p class="product-detail-price">

        Total: $

        <span id="totalPrice">
          ${product.price}
        </span>

      </p>

      <!-- BUTTON -->
      <button
        class="detail-cart-btn"
        id="addToCartBtn"
      >
        Add to Cart
      </button>

      <!-- SUCCESS MESSAGE -->
      <p
        class="success-message"
        id="successMessage"
      >
        Product added successfully!
      </p>

    </div>
  `;

  setupInteractions(product);
}

/* PRODUCT INTERACTIONS */
function setupInteractions(product) {

  let quantity = 1;

  let selectedSize = "S";

  const quantityText =
    document.getElementById("quantity");

  const totalPrice =
    document.getElementById("totalPrice");

  const increaseBtn =
    document.getElementById("increaseQty");

  const decreaseBtn =
    document.getElementById("decreaseQty");

  const sizeButtons =
    document.querySelectorAll(".size-btn");

  const successMessage =
    document.getElementById("successMessage");

  const addToCartBtn =
    document.getElementById("addToCartBtn");

  /* SAFETY CHECK */
  if (
    !quantityText ||
    !totalPrice ||
    !increaseBtn ||
    !decreaseBtn ||
    !addToCartBtn
  ) {
    return;
  }

  /* UPDATE PRICE */
  function updatePrice() {

    const total =
      ((product.price || 0) * quantity)
      .toFixed(2);

    totalPrice.textContent = total;
  }

  /* INCREASE QUANTITY */
  increaseBtn.addEventListener(
    "click",
    () => {

      if (quantity < 10) {

        quantity++;

        quantityText.textContent =
          quantity;

        updatePrice();
      }
    }
  );

  /* DECREASE QUANTITY */
  decreaseBtn.addEventListener(
    "click",
    () => {

      if (quantity > 1) {

        quantity--;

        quantityText.textContent =
          quantity;

        updatePrice();
      }
    }
  );

  /* SIZE SELECTION */
  sizeButtons.forEach(button => {

    if (
      !button.classList.contains(
        "disabled"
      )
    ) {

      button.addEventListener(
        "click",
        () => {

          sizeButtons.forEach(btn =>
            btn.classList.remove(
              "active"
            )
          );

          button.classList.add(
            "active"
          );

          selectedSize =
            button.textContent.trim();
        }
      );
    }
  });

  /* ADD TO CART */
  addToCartBtn.addEventListener(
    "click",
    () => {

      let cart =
        JSON.parse(
          localStorage.getItem("cart")
        ) || [];

      /* CHECK EXISTING PRODUCT */
      const existingProduct =
        cart.find(item =>

          item.id === product.id &&
          item.size === selectedSize
        );

      if (existingProduct) {

        existingProduct.quantity +=
          quantity;

      } else {

        cart.push({

          id: product.id,

          title: product.title,

          price: product.price,

          image: product.image,

          quantity,

          size: selectedSize
        });
      }

      /* SAVE CART */
      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );

      /* UPDATE UI */
      updateCartCount();

      /* SUCCESS FEEDBACK */
      successMessage.classList.add(
        "show"
      );

      setTimeout(() => {

        successMessage.classList.remove(
          "show"
        );

      }, 2000);
    }
  );
}

/* UPDATE CART COUNT */
function updateCartCount() {

  const cart =
    JSON.parse(
      localStorage.getItem("cart")
    ) || [];

  /* TOTAL QUANTITY */
  const totalItems =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  cartCount.textContent =
    totalItems;
}

/* INITIAL LOAD */
updateCartCount();

fetchProduct();