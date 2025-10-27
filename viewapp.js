const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const product = PRODUCTS.find(p => p.id == id);
const image=document.getElementById("view-img")



if (product) {
  document.querySelector("#view-img").src = product.img;
  document.querySelector("#view-title").textContent = product.title;
  document.querySelector("#view-price").textContent = "Rs." + product.price.toString().replace(/^(\d)(\d+)/, '$1,$2') + ".00";
  document.querySelector("#view-orgprice").textContent = "Rs." + product.orgprice.toString().replace(/^(\d)(\d+)/, '$1,$2') + ".00" ;
  document.querySelector("#view-desc").textContent = product.desc;
  document.querySelector("#disc-rate-view").textContent = Math.floor(((product.price / product.orgprice)*100)-100) + "%"
  const add = document.getElementById("viewpage-btn")
    add.addEventListener("click", () => { addToCart(product.id, quantity); });  
}


let quantity = 1;
const quantityDisplay = document.getElementById('quantity');

document.getElementById('increase').addEventListener('click', () => {
  quantity++;
  quantityDisplay.textContent = quantity;
});

document.getElementById('decrease').addEventListener('click', () => {
  if (quantity > 1) {
    quantity--;
    quantityDisplay.textContent = quantity;
  }
});
    
  renderProducts();
  renderCartCount();
  renderCartItems();
  updateCheckoutList();