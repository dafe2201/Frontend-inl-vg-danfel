"use strict";
import { getProductById } from "./api.js";

const cart = JSON.parse(localStorage.getItem("cart")) || [];

const data = [];

updateCartIcon();
loadData();

async function loadData() {
  for (const element of cart) {
    const product = await getProductById(element.ID);
    data.push(product);
  }
  renderPage(data);
}

async function renderPage(data) {
  const cartList = document.querySelector(".cart-list");

  cartList.innerHTML = "";

  let htmlContent = "";

  data.forEach((product) => {
    htmlContent += `
      <li class="list-group-item d-flex justify-content-between lh-sm">
        <div class="container">
          <div class="row">
            <div class="col-10">
              <h6 class="my-0 mx-1" id="cart-product-title">${
                product.title
              }</h6>
            </div>
            <div class="col-2">
            <button type="button" class="btn btn-sm btn-outline-danger cart-btn-delete" id="del-${
              product.id
            }">X</button>

            </div>
          </div>
          <div class="row">
            <div class="col-7 my-2" id="cart-button-panel">
              <button type="button" class="btn btn-sm btn-outline-primary cart-btn-decrement" id="dec-${
                product.id
              }">-</button>
              <span class="badge bg-secondary opacity-75" id="${
                product.id
              }">${getAmount(product.id)}</span>
              <button type="button" class="btn btn-sm btn-outline-primary cart-btn-increment" id="inc-${
                product.id
              }">+</button>
            </div>
            <div class="col-4" id="cart-button-panel-2">
              <span class="text-muted"  id="tot-${
                product.id
              }">${getProductSum(product)}$</span>
            </div>
          </div>
        </div>
      </li>
    `;
  });

  getTotalPrice(cart);

  cartList.innerHTML = htmlContent;

  const deleteButtons = document.querySelectorAll(".cart-btn-delete");

  deleteButtons.forEach((button) => {
    const itemid = button.id.replace("del-", "");
    button.addEventListener("click", (e) => {
      e.preventDefault();
      deleteCartItem(itemid);
      location.reload();
    });
  });

  const incrementButtons = document.querySelectorAll(".cart-btn-increment");

  incrementButtons.forEach((button) => {
    const itemid = button.id.replace("inc-", "");
    button.addEventListener("click", (e) => {
      e.preventDefault();
      incrementAmount(itemid);
      updateCartIcon();
      getProductSumByClick(itemid);
    });
  });

  const decrementButtons = document.querySelectorAll(".cart-btn-decrement");

  decrementButtons.forEach((button) => {
    const itemid = button.id.replace("dec-", "");
    button.addEventListener("click", (e) => {
      e.preventDefault();
      decrementAmount(itemid);
      updateCartIcon();
      getProductSumByClick(itemid);
    });
  });
}

function getProductSum(product) {
  const amount = getAmount(product.id);
  return (amount * product.price).toFixed(2);
}

async function getProductSumByClick(itemid) {  
  const product = await getProductById(itemid);
  const query = document.querySelector(`#tot-${itemid}`);

  const amount = getAmount(itemid);
  console.log(amount);

  query.innerHTML = `${(amount * product.price).toFixed(2)}$`
}

function deleteCartItem(itemid) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const productIndex = cart.findIndex((item) => item.ID === itemid);

  cart.splice(productIndex, 1);

  localStorage.setItem("cart", JSON.stringify(cart));
  getTotalPrice(cart);
}

function incrementAmount(itemid) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const productIndex = cart.findIndex((item) => item.ID === itemid);
  if (productIndex !== -1) {
    cart[productIndex].amount += 1;
    const badge = document.getElementById(itemid);
    badge.textContent = cart[productIndex].amount;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  getTotalPrice(cart);
}

function decrementAmount(itemId) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const productIndex = cart.findIndex((item) => item.ID === itemId);
  if (productIndex !== -1) {
    if (cart[productIndex].amount > 1) {
      cart[productIndex].amount -= 1;
      const badge = document.getElementById(itemId);
      badge.textContent = cart[productIndex].amount;
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  getTotalPrice(cart);
}

function getAmount(ID) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].ID == ID) {
      return cart[i].amount;
    }
  }
  return 0;
}

async function getTotalPrice(cart) {
  const cartTotalQuery = document.querySelector("#cart-header");

  let total = 0;
  for (const item of cart) {
    const product = await getProductById(item.ID);
    total += product.price * item.amount;
  }

  cartTotalQuery.textContent = `Your cart total: ${total.toFixed(2)}$`;
}

//Event listener for the form
document.getElementById("checkout-button").addEventListener("click", validate);

function validate(e) {
  e.preventDefault();

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
  const cartNotEmpty = isCartNotEmpty();

  const formBools = [
    firstNameCorrect,
    lastNameCorrect,
    emailCorrect,
    phoneNrCorrectFormat,
    addressCorrect,
    zipCorrect,
    countyCorrect,
    cartNotEmpty,
  ];

  //save customer data to local storage for confirmation page:
  let customerData = JSON.parse(localStorage.getItem("customerData")) || [];
  customerData.push({
    name: firstName.value + " " + lastName.value,
    email: email.value,
    address: address.value,
    county: county.value,
    zip: zip.value,
    phoneNumber: phoneNumber.value,
  });
  localStorage.setItem("customerData", JSON.stringify(customerData));

  checkFormIsValid(formBools); // If all returns true - redirect to confirmation.html
}

const checkFormIsValid = (listOfBooleans) => {
  let checker = (listOfBooleans) =>
    listOfBooleans.every((element) => element === true);

  console.log(listOfBooleans);

  if (checker(listOfBooleans) === true) {
    console.log("Form Complete");
    window.location.replace("/confirmation.html");
  } else {
    console.log("Form not complete");
  }
};

function isCartNotEmpty() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart == null || cart.length == 0) {
    alert("Your cart is empty");
    return false;
  }
  return true;
}

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

function updateCartIcon() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartIcon = document.getElementById("cart-space");

  let totalItems = 0;

  cart.forEach((item) => {
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
