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

// Render the icon for the cart using the length of the original cart array holding only ID's.
const renderCartIcon = (cart) => {
  const cartIcon = document.getElementById("cart-badge");
  cartIcon.innerText = cart.length;
}

renderCartIcon(cart);

// Render the cart side of the page with the products.
const renderCart = (cartProducts) => {
  const content = document.querySelector(".cart-list");

  // Create an array with unique items to sort out duplicates from the original cart array.
  const uniqueProducts = Array.from(new Set(cartProducts.map((product) => product.id)));

  let htmlContent = "";

  uniqueProducts.forEach((productId) => {
    const productCount = cartProducts.filter((product) => product.id === productId).length; // 1: find all duplicates and put them in an array, 2: return the length value of that array

    const product = cartProducts.find((product) => product.id === productId);

    htmlContent += `
      <li class="list-group-item d-flex justify-content-between lh-sm">
        <div>
          <h6 class="my-0 mx-3">${product.title}</h6>
          <span class="text-muted">${product.price}</span>
        </div>
        <span class="text-muted">${productCount}</span>
      </li>
    `;
  });

  content.innerHTML = htmlContent;
};

 renderCart(cartProducts);

//Action listener for the form
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
