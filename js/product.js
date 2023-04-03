"use strict";
import { getProductById } from "./api.js";

updateCartIcon();

const productID = JSON.parse(localStorage.getItem("ID"));

const data = await getProductById(productID);

const renderProduct = (data) => {
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
  
  let cart = JSON.parse(localStorage.getItem("cart")) || []; 
  
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

  let totalItems = 0;

  cart.forEach(item => {
    totalItems += item.amount;
  });

  const cartIconText = document.createElement("span");
  cartIconText.classList.add("badge", "bg-danger", "rounded-pill");
  cartIconText.innerText = totalItems;

  const prevCartIconText = cartIcon.querySelector("span");
  if (prevCartIconText) {
    cartIcon.removeChild(prevCartIconText);
  }

  if (cart.length > 0) {
    cartIcon.appendChild(cartIconText);
  }
}
