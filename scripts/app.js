const hamburger = document.querySelector(".hamburger");
const navbar = document.querySelector(".navbar");

hamburger.addEventListener("click", () => {
  navbar.classList.toggle("active");
});


const productsGrid = document.getElementById("productsGrid");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

/* API URL */
const API_URL = "https://fakestoreapi.com/products";

/* FETCH PRODUCTS */
async function fetchProducts() {

  try {

    /* SHOW LOADING */
    loading.style.display = "block";

    /* CHECK CACHE */
    const cachedProducts = localStorage.getItem("products");

    if (cachedProducts) {

      const parsedProducts = JSON.parse(cachedProducts);

      displayProducts(parsedProducts);

      loading.style.display = "none";

      return;
    }

    /* FETCH API */
    const response = await fetch(API_URL);

    /* HANDLE BAD RESPONSE */
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await response.json();

    /* STORE IN CACHE */
    localStorage.setItem(
      "products",
      JSON.stringify(products)
    );

    /* DISPLAY */
    displayProducts(products);

  } catch (error) {

    console.error(error);

    errorMessage.style.display = "block";

  } finally {

    loading.style.display = "none";
  }
}

/* DISPLAY PRODUCTS */
function displayProducts(products) {

  productsGrid.innerHTML = "";

  products.forEach(product => {

    const card = document.createElement("div");

    card.classList.add("product-card");

    card.innerHTML = `

      <img
        src="${product.image}"
        alt="${product.title}"
        loading="lazy"
      />

      <div class="product-info">

        <h3 class="product-title">
          ${product.title}
        </h3>

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
document.addEventListener("click", (e) => {

  if (e.target.classList.contains("add-cart-btn")) {

    const productId = e.target.dataset.id;

    alert(`Product ${productId} added to cart`);

  }

});

/* INITIAL LOAD */
fetchProducts();