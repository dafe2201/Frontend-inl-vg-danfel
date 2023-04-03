"use strict";
import { getProducts, getAllProducts } from "./api.js";

 updateCartIcon();
// const data = await getProducts(30);
const data = await getAllProducts();

console.log(data);

const renderCards = (prodList) => {
  let html = "";

  prodList.forEach((element) => {
    let htmlSegment = `
    <div class="col-lg-4 col-md-6">
    <div class="card mb-4 rounded-3 shadow-sm border-black">
      <div
        class="py-3 text-black border-black"
      >
      <img class="card-img-top w-25 rounded" src="${element.image}" alt="Card image cap">
      </div>
      <div class="card-body">
        <p class="lead">${element.title}</p>
        <h2 class="card-title pricing-card-title my-3">
        ${element.price}<small class="text-muted fw-light"> $</small>
        </h2>
        <a href="/product.html" id="${element.id}" class="w-100 btn btn-lg btn-dark save-id">
          Show more
        </a>
      </div>
    </div>
  </div>
    `;

    html += htmlSegment;
  });

  const productsDiv = document.querySelector(".products");
  console.log(productsDiv);
  productsDiv.innerHTML = html;
};

// Render UI Cards
renderCards(data);

// Listener for save-id a btn
const showMoreBtn = document.querySelectorAll(".save-id");

showMoreBtn.forEach((element) => {
  const itemId = element.id;
  console.log(itemId);

  // Save id for later use in LocalStorage
  element.addEventListener("click", () => {
    localStorage.setItem("ID", JSON.stringify(itemId));
  });
});

function updateCartIcon() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartIcon = document.getElementById("cart-space");

  // Check if there are any items in the cart
  if (cart.length > 0) {
    let totalItems = 0;

    // Loop through the items in the cart to count the total number of items
    cart.forEach((item) => {
      totalItems += item.amount;
    });

    // Create a new cart icon badge with the total number of items
    const cartIconText = document.createElement("span");
    cartIconText.classList.add("badge", "bg-danger", "rounded-pill");
    cartIconText.innerText = totalItems;

    // Remove previous cart value so it doesn't display twice on the screen.
    const prevCartIconText = cartIcon.querySelector("span");
    if (prevCartIconText) {
      cartIcon.removeChild(prevCartIconText);
    }

    // Add the new cart icon badge to the cart icon element
    cartIcon.appendChild(cartIconText);
  } else {
    // If the cart is empty, remove any existing cart icon badge
    const prevCartIconText = cartIcon.querySelector("span");
    if (prevCartIconText) {
      cartIcon.removeChild(prevCartIconText);
    }
  }
}