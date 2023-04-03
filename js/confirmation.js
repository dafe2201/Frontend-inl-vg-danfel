"use strict";
import { getProductById } from "./api.js";

const data = [];
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const customerList = JSON.parse(localStorage.getItem("customerData")) || [];

loadData();
getTotalPrice(cart);
renderCustomerDetails(customerList);

async function loadData() {
  for (const element of cart) {
    const product = await getProductById(element.ID);
    data.push(product);
  }
  renderCart(data);
}



async function renderCart(data) {
  // Fetch Item From LocalStorage

  const confirmationDiv = document.querySelector(".confirmation");
  if (cart == null) {
    confirmationDiv.innerHTML = `<h1 class="my-5"> Nothing to see here </h1>`;
  } else {
    confirmationDiv.innerHTML = "";
    let htmlContent = "";

    data.forEach((product) => {
      htmlContent += `
    <div class="img-thumbnail">
    <h5 class="my-1">${getAmount(product.id)}x ${product.title}</h5>
    <p class="my-1 lead fs-4">Price per item: ${product.price} $
    </p>
  </div>`;

      confirmationDiv.innerHTML = htmlContent;

      // Reset localStorage
      localStorage.clear();
    });
  }
}

async function renderCustomerDetails(customerList){
const customer = customerList[length];              // Make sure to pick the latest "customer" entry in the list in case multiple were stored in case of errors in validation.

  const name = document.querySelector("#name");
  name.textContent = `Name: ${customer.name}`;

  const email = document.querySelector("#email");
  email.textContent = `Email: ${customer.email}`;

  const phone = document.querySelector("#phone");
  phone.textContent = `Phone: ${customer.phoneNumber}`;

  const address = document.querySelector("#full-address");
  address.innerHTML = "";
    let htmlContent = `
    <p>Address: ${customer.address}, ${customer.zip}, ${customer.county}</p>
    `;
    address.innerHTML = htmlContent;
}

async function getTotalPrice(cart) {
  const totalPrice = document.querySelector("#total-price");

  let total = 0;
  for (const item of cart) {
    const product = await getProductById(item.ID);
    total += product.price * item.amount;
  }

  totalPrice.innerHTML = "";
 let htmlContent = `
  <p><h3>Your cart total: ${total.toFixed(2)}$</h3></p>
  `;

  totalPrice.innerHTML = htmlContent;
  // totalPrice.textContent = `${total.toFixed(2)}$`;
}

function getAmount(ID) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].ID == ID) {
      return cart[i].amount;
    }
  }
  return 0;
}