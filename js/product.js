"use strict";
import { getProductById } from "./api.js";

updateCartIcon();

// Fetch Item From LocalStorage
const productID = JSON.parse(localStorage.getItem("ID"));

const data = await getProductById(productID);

const renderProduct = (data) => {
  // Ändra InnerHTML efter products värden
  const specificProductDiv = document.querySelector(".jumbo-product");


  let htmlContent = `
        <img class=my-5" src="${data.image}" width=200px height=200px style="object-fit: fill">
        <h2 class="my-5"> ${data.title}</h2>
        <p class="my-5 lead fs-4"><strong>Category:</strong> ${data.category}</p>
        <p class="my-5 lead fs-4"><strong>Description:</strong> ${data.description}</p>
        <p class="my-5 lead fs-4"><strong>Price: </strong> ${data.price} $</p>
        <p class="my-5 lead fs-4"><strong>Rating:</strong> ${data.rating.rate}/5 (${data.rating.count} votes)</p>
        <button class="my-3 w-100 btn btn-lg btn-dark" id="add-to-cart-button">Add to cart</button> 
        `;
        
  specificProductDiv.innerHTML = htmlContent;
};

renderProduct(data);

document.getElementById("add-to-cart-button").addEventListener("click", addToCart);


async function addToCart(){
  const productID = JSON.parse(localStorage.getItem("ID"));
  const data = await getProductById(productID);
  
  let cart = JSON.parse(localStorage.getItem("cart")) || []; // if null - create array
  
  let existingItem = cart.find(item => item.ID === productID);
  if (existingItem) {
    existingItem.amount += 1;
  } else {
    cart.push({ ID: productID, amount: 1 });
  }
  
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartIcon();
}

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

    // Remove previous cart value so it doesn't duplicate on screen
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
