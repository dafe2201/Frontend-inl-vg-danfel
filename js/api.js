export async function getProducts(amount) {
  let url = `https://fakestoreapi.com/products?limit=${amount}`;
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts() {
  let url = `https://fakestoreapi.com/products`;
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

export async function getProductById(id) {
  let url = `https://fakestoreapi.com/products/${id}`;
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}
