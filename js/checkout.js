"use strict";
import { getProductById } from "./api.js";

// Fetch cart from LocalStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];

// Fetch products in the cart from the API and create a new array with complete objects.
const cartProducts = await Promise.all(
  cart.map(async (productID) => {
    const product = await getProductById(productID);
    return product;
  })
);

function logCartProducts() {
  console.log("Items in cartProducts:");
  cartProducts.forEach((item) => {
    console.log(item);                             // REMOVE LOGCARTPRODUCTS
  });
}
logCartProducts();

// Render the icon for the cart using the length of the original cart array holding only ID's.
const renderCartIcon = (cart) => {
  const cartIcon = document.getElementById("cart-badge");
  cartIcon.innerText = cart.length;
}

renderCartIcon(cart);

// Render the cart side of the page with the products.
const renderCart = (cartProducts) => {
  const content = document.querySelector(".cart-list");

  // Create an array with unique items to sort out duplicates from the original cart array. This is only to make it look better on the page.
  const uniqueProducts = Array.from(new Set(cartProducts.map((product) => product.id)));

  let htmlContent = "";

  uniqueProducts.forEach((productId) => {
    const productCount = cartProducts.filter((product) => product.id === productId).length; // 1: find all duplicates and put them in an array, 2: return the length value of that array

    const product = cartProducts.find((product) => product.id === productId);

    htmlContent += `
              <li class="list-group-item d-flex justify-content-between lh-sm">
                <div class="container">
                  <div class="row">
                    <div class="col-10">
                      <h6 class="my-0 mx-1" id="cart-product-title">${product.title}</h6>
                    </div>
                    <div class="col-2">
                      <span class="text-muted">${product.price}$</span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-7 my-2" id="cart-button-panel">
                      <button type="button" class="btn btn-sm btn-outline-primary cart-btn-decrement" id="">-</button>
                      <span class="badge bg-secondary opacity-75" id="cart-product-amount">${productCount}</span>
                      <button type="button" class="btn btn-sm btn-outline-primary cart-btn-increment" id="${product.id}">+</button>
                    </div>
                    <div class="col-4" id="cart-button-panel-2">
                      <button type="button" class="btn btn-sm btn-outline-success cart-btn" id="btn-cart-check">✓</button>
                      <button type="button" class="btn btn-sm btn-outline-danger cart-btn" id="btn-cart-delete">X</button>
                    </div>
                  </div>
                </div>
              </li>
    `;
  });

  content.innerHTML = htmlContent;

  



};



 renderCart(cartProducts);

   // Add event listeners to increment buttons
   const incrementBtn = document.querySelectorAll(".cart-btn-increment");
   incrementBtn.forEach((element) => {
    const itemID = element.id
    
    element.addEventListener("click", () => { 

  });
});


    // Save id for later use in LocalStorage
    // element.addEventListener("click", () => {
    //   localStorage.setItem("ID", JSON.stringify(itemId));

//  const showMoreBtn = document.querySelectorAll(".save-id");

// showMoreBtn.forEach((element) => {
//   const itemId = element.id;
//   console.log(itemId);

//   // Save id for later use in LocalStorage
//   element.addEventListener("click", () => {
//     localStorage.setItem("ID", JSON.stringify(itemId));
//   });
// });


//Event listener for the form
document.getElementById("checkout-button").addEventListener("click", validate);

function validate(e) {
  e.preventDefault(); // needed because of submit being default behaviour.

  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");

  const email = document.getElementById("email");
  const address = document.getElementById("address");
  const county = document.getElementById("county");
  const zip = document.getElementById("zip");

  const phoneNumber = document.getElementById("phoneNumber");

  const firstNameCorrect = nameIsCorrectLength(firstName);

  const lastNameCorrect = nameIsCorrectLength(lastName);

  const emailCorrect = emailIsCorrect(email);

  const phoneNrCorrectFormat = phoneNumberIsCorrect(phoneNumber);

  const addressCorrect = addressIsCorrect(address);
  const zipCorrect = zipIsCorrect(zip);
  const countyCorrect = countyIsCorrect(county);

  const formBools = [
    firstNameCorrect,
    lastNameCorrect,
    emailCorrect,
    phoneNrCorrectFormat,
    addressCorrect,
    zipCorrect,
    countyCorrect,
  ];

  checkFormIsValid(formBools);
}

const checkFormIsValid = (listOfBooleans) => {
  let checker = (listOfBooleans) =>
    listOfBooleans.every((element) => element === true);

  console.log(listOfBooleans);

  if (checker(listOfBooleans) === true) {
    console.log("Form Complete");
    // Simulate an HTTP redirect:
    window.location.replace("/confirmation.html");
  } else {
    console.log("Form not complete");
  }
};

function nameIsCorrectLength(name) {
  if (name.value.length <= 2 || name.value.length > 50) {
    name.classList.add("invalid");
    name.placeholder = "Please enter a valid name";
    return false;
  } else {
    name.classList.remove("invalid");
  }
  return true;
}

function emailIsCorrect(email) {
  if (
    !email.value.includes("@") ||
    email.value.length > 50 ||
    email.value.length == 0
  ) {
    email.classList.add("invalid");
    email.placeholder = "Please enter a valid email";
    return false;
  } else {
    email.classList.remove("invalid");
    return true;
  }
}

function phoneNumberIsCorrect(phoneNumber) {
  const validFormat = /^[\d()-]{1,50}$/gm;
  if (!phoneNumber.value.match(validFormat)) {
    phoneNumber.classList.add("invalid");
    phoneNumber.placeholder = "Not valid phone nr";
    return false;
  } else {
    phoneNumber.classList.remove("invalid");
    return true;
  }
}

function zipIsCorrect(zip) {
  const validZip = /^[0-9]{3} [0-9]{2}$/g;
  if (zip.value.match(validZip)) {
    zip.classList.remove("invalid");
    return true;
  } else {
    zip.classList.add("invalid");
    zip.placeholder = "XXX XX";
    return false;
  }
}

function addressIsCorrect(address) {
  if (address.value.length > 3 && address.value.length < 51) {
    address.classList.remove("invalid");
    return true;
  } else {
    address.classList.add("invalid");
    address.placeholder = "Please enter a valid address";
    return false;
  }
}

function countyIsCorrect(county) {
  if (county.value.length > 1 && county.value.length < 51) {
    county.classList.remove("invalid");
    return true;
  } else {
    county.classList.add("invalid");
    county.placeholder = "Enter a valid county";
    return false;
  }
}
