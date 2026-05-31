let allProducts = [];
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
const cachedProducts =
  localStorage.getItem("products");

if (cachedProducts) {

  const parsedProducts =
    JSON.parse(cachedProducts);

  /* IMPORTANT */
  allProducts = parsedProducts;

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
    allProducts = products;

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

        <a href="product.html?id=${product.id}" class="product-link">

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
      e.target.closest(".add-cart-btn");

    if (!button) return;

    const card =
      button.closest(".product-card");

    if (!card) return;

    const id =
      Number(button.dataset.id);

    /* FIND PRODUCT */
    const product =
      allProducts.find(
        item => item.id === id
      );

    if (!product) return;

    /* ADD TO CART */
    addToCart({

      id: product.id,

      title: product.title,

      price: product.price,

      image: product.image,

      quantity: 1,

      size: "M"
    });

    /* FEEDBACK */
    button.textContent =
      "Added ✓";

    setTimeout(() => {

      button.textContent =
        "Add to Cart";

    }, 1500);
  }
);

/* INITIAL LOAD */
fetchProducts();

