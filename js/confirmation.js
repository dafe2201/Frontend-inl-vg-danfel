"use strict";
import { getProductById } from "./api.js";

const renderSucessMessage = async () => {
  // Fetch Item From LocalStorage
  const productID = JSON.parse(localStorage.getItem("ID"));

  const confirmationDiv = document.querySelector(".confirmation");
  if (productID == null) {
    confirmationDiv.innerHTML = `<h1 class="my-5"> Nothing to see here </h1>`;
  } else {
    const data = await getProductById(productID);

    let htmlContent = `
    <div class="img-thumbnail"> 
    <h1 class="my-5">THANK YOU FOR ORDERING THE FOLLOWING ITEM:</h1>
      <img class=my-5" src="${data.image}" width=100px height=100px style="object-fit: fill">
      <h2 class="my-5"> ${data.title}</h2>
      <p class="my-5 lead fs-4"><strong>Category:</strong> ${data.category}</p>
      <p class="my-5 lead fs-4"><strong>Description:</strong> ${data.description}</p>
      <p class="my-5 lead fs-4"><strong>Price: </strong> ${data.price} $</p>
      <p class="my-5 lead fs-4"><strong>Rating:</strong> ${data.rating.rate}/5 (${data.rating.count} votes)</p>
      </div>`;

    confirmationDiv.innerHTML = htmlContent;

    // Reset localStorage
    localStorage.clear();
  }
};

await renderSucessMessage();
