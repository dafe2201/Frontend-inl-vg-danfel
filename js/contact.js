"use strict";

updateCartIcon();

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
  

