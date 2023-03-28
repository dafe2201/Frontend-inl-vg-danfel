"use strict";
import { getProductById } from "./api.js";

updateCartIcon();

// Fetch Item From LocalStorage
const productID = JSON.parse(localStorage.getItem("ID"));

const data = await getProductById(productID);

const renderProduct = (data) => {
  // Ändra InnerHTML efter products värden
  const specificProductDiv = document.querySelector(".jumbo-product");

  //A HREFEN SKA ÄNDRAS FRÅN CHECKOUT I VG-DELEN
  let htmlContent = `
        <img class=my-5" src="${data.image}" width=200px height=200px style="object-fit: fill">
        <h2 class="my-5"> ${data.title}</h2>
        <p class="my-5 lead fs-4"><strong>Category:</strong> ${data.category}</p>
        <p class="my-5 lead fs-4"><strong>Description:</strong> ${data.description}</p>
        <p class="my-5 lead fs-4"><strong>Price: </strong> ${data.price} $</p>
        <p class="my-5 lead fs-4"><strong>Rating:</strong> ${data.rating.rate}/5 (${data.rating.count} votes)</p>
        <button class="my-3 w-100 btn btn-lg btn-dark" id="add-to-cart-button">Add to cart</button> 
        `;



        //Gammal :         <a href="/checkout.html" class="my-3 w-100 btn btn-lg btn-dark"> 
        //  Add to cart
        //  </a>

  specificProductDiv.innerHTML = htmlContent;
};

renderProduct(data);

document.getElementById("add-to-cart-button").addEventListener("click", addToCart);

//async för att den ska vänta in 
async function addToCart(){
  const productID = JSON.parse(localStorage.getItem("ID"));
  // Tar bort denna under tiden för att bara ta ID: const data = await getProductById(productID);
  
  let cart = JSON.parse(localStorage.getItem("cart")) || []; // if null - create array
  cart.push(productID);
  localStorage.setItem("cart", JSON.stringify(cart));

  
  updateCartIcon();
}

function updateCartIcon() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartIcon = document.getElementById("cart-space");
  // Testa att lägga detta direkt in i HTML istället.. Blir mer clean. 
  if (cart.length > 0) {
    const cartIconText = document.createElement("span");
    cartIconText.classList.add("badge", "bg-danger", "rounded-pill");
    cartIconText.innerText = cart.length;
    // Remove previous cart value
    const prevCartIconText = cartIcon.querySelector("span");
    if (prevCartIconText) {
      cartIcon.removeChild(prevCartIconText);
    }
    cartIcon.appendChild(cartIconText);
  }
}

