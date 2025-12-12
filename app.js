
const WEB_APP_URL = `https://script.google.com/macros/s/AKfycbyir3_MqkvcQkdu62uM0s3yTrh-v4bPy02519JVSLNxPQLdZaIeGDA4-kSlJrbXPBaxUQ/exec`;
//https://script.google.com/macros/s/AKfycbwWwAnig3NK-0SbGN-VB2xG6i6VOiZYHXxrMalf94vgFBP7gPUxdMFfTcWVRFXMpMWDrw/exec
// If admin saved a product list in localStorage, use it (keeps original code otherwise)
// try {
//   const stored = localStorage.getItem('shop_products');
//   if (stored) {
//     const parsed = JSON.parse(stored);
//     if (Array.isArray(parsed) && parsed.length) {
//       // override PRODUCTS with stored copy
//       window.PRODUCTS = parsed;
//     }
//   }
// } catch(e) { /* ignore parse errors */ }

// --- Product Data ---
const PRODUCTS = [
  { id: 1, title: "Bairi Honey 1kg", price: 3400,  orgprice:4400, desc: "Acquired by honey farming in Sidr(Bairi) forest, Free from Chemicals, With money-pack guaranty in case of any adulteration found.", img: "honey_1.png" },
  { id: 2, title: "Bairi Honey 500g", price: 1700, orgprice:2200, desc: "Acquired by honey farming in Sidr(Bairi) forest, Free from Chemicals, With money-pack guaranty in case of any adulteration found.", img: "honey_2.png" },
  { id: 3, title: "Honey Gift Pack", price: 5100,  orgprice:6600, desc: "Acquired by honey farming in Sidr(Bairi) forest, Free from Chemicals, With money-pack guaranty in case of any adulteration found.", img: "honey_3.png" },
];

let cart = JSON.parse(localStorage.getItem("cart") || "[]");

function formatPKR(n) {
  return n.toLocaleString("en-PK");
}
// Discount Rate

function discountPercent(prices,orgPrices){
const result = Math.floor(((prices / orgPrices)*100)-100) 
return result;
}

// --- Render Products ---
function renderProducts() {
  const container = document.getElementById("products");
  if (!container) return;
  // keep controls if present; remove existing grid
  const controls = document.getElementById("product-controls");
  container.querySelectorAll(".products-grid").forEach(n => n.remove());

  const grid = document.createElement("div");
  grid.className = "products-grid fade-in";

  PRODUCTS.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");img.className = "image";
    img.src = p.img; img.alt = p.title;
    img.style.width = "100%"; img.style.height = "100%"; img.style.objectFit = "cover"; img.style.borderRadius = "8px";
     img.addEventListener("click", () =>  location.href = `view.html?id=${p.id}`);
    
    card.innerHTML =`<div class="Disc-rate"><span class="disc-rate">${discountPercent(p.price,p.orgprice)}%</span></div>`
    const h3 = document.createElement("h3"); h3.textContent = p.title;
    // const desc = document.createElement("p"); desc.textContent = p.desc;
    const price = document.createElement("div"); price.className = "price"; price.textContent = formatPKR(p.price) + " PKR" ;
    const orgprice = price.innerHTML= `<div class="Price"> ${formatPKR(p.price)} PKR</div> <div class="org-price">  ${formatPKR(p.orgprice)} PKR </div>`


    const actions = document.createElement("div"); actions.className = "actions";
    // View button
    const view = document.createElement("button"); view.className = "btn view"; view.dataset.id = p.id; view.textContent = "View";
    view.addEventListener("click", () => openModal(p.id));
    // Add to Cart
    const add = document.createElement("button"); add.className = "btn add";
    add.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bag" viewBox="0 0 16 16">
  <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
</svg>`
    add.addEventListener("click", () => { addToCart(p.id, 1); });
    // Buy Now
    const buy = document.createElement("button"); buy.className = "btn buy"; buy.textContent = "Buy Now";
    buy.addEventListener("click", () => { addToCart(p.id, 1); location.hash = "#checkout"; document.getElementById("checkout")?.scrollIntoView({behavior:'smooth'}); });

    actions.appendChild(view); actions.appendChild(add); actions.appendChild(buy);

    card.appendChild(img); card.appendChild(h3); card.appendChild(price); card.appendChild(actions);
    grid.appendChild(card);
  });

  if (controls) controls.after(grid); else container.appendChild(grid);
}

// --- Modal ---
function openModal(productId) {
  const p = PRODUCTS.find((x) => x.id === productId);
  document.getElementById("modal-image").src = p.img;
  document.getElementById("modal-title").textContent = p.title;
  document.getElementById("modal-desc").textContent = p.desc;
  document.getElementById("modal-price").textContent = formatPKR(p.price);
  document.getElementById("modal-qty").value = 1;
  document.getElementById("product-modal").classList.remove("hidden");
  document.getElementById("add-to-cart").dataset.id = p.id;
}

function closeModal() {
  document.getElementById("product-modal").classList.add("hidden");
}

// --- Cart Functions ---
function updateCheckoutList() {
  renderCartItems();
  renderCartCount();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const elTotal = document.getElementById("cart-total");
  if (elTotal) elTotal.textContent = total.toLocaleString("en-PK");
  
}

function addToCart(id, qty = 1) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  const existing = cart.find((i) => i.id === id);
  if (existing) existing.qty += qty;
  else cart.push({ id: p.id, title: p.title, price: p.price, qty: qty, img: p.img });

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCartCount();
  renderCartItems();
  updateCheckoutList();

  const toast = document.createElement("div");
  toast.textContent = "Added to cart";
  toast.style = "position:fixed;bottom:18px;right:18px;background:#333;color:#fff;padding:8px 12px;border-radius:6px;z-index:9999";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1300);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCartCount() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById("cart-count").textContent = count;
}

function renderCartItems() {
  const container = document.getElementById("cart-items");
  container.innerHTML = "";
  if (cart.length === 0) {
    container.innerHTML = "<p>Cart empty</p>";
    document.getElementById("cart-total").textContent = "0";
    return;
  }
  cart.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.img}" />
      <div style="flex:1">
        <div style="font-weight:700">${item.title}</div>
        <div>${formatPKR(item.price)} PKR × 
          <input type="number" min="1" value="${item.qty}" data-id="${item.id}" class="qty-input" style="width:60px">
        </div>
      </div>
      <div><button class="btn remove" data-id="${item.id}">Remove</button></div>
    `;
    container.appendChild(div);
  });

  container.querySelectorAll(".remove").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      cart = cart.filter((i) => i.id !== id);
      saveCart();
      renderCartItems();
      renderCartCount();
    })
  );

  container.querySelectorAll(".qty-input").forEach((inp) =>
    inp.addEventListener("change", (e) => {
      const id = parseInt(e.target.dataset.id);
      const val = parseInt(e.target.value) || 1;
      const it = cart.find((i) => i.id === id);
      if (it) it.qty = val;
      saveCart();
      renderCartItems();
      renderCartCount();
    })
  );

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById("cart-total").textContent = formatPKR(total);
}

// --- Order Submit ---
document.getElementById("order-form").addEventListener("submit", function (e) {
  e.preventDefault();
  if (cart.length === 0) return alert("Your cart is empty");

  const formData = new FormData(this);
  const orderId = "ORD" + Date.now();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const date = new Date().toLocaleString();

  // send each product line separately to Google Sheet
  cart.forEach((item) => {
    const orderRow = {
      orderId,
      name: formData.get("name"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      location: document.getElementById("Location").value,
      product: item.title,
      quantity: item.qty,
      price: "RS " +item.price,
      total:"RS " +total,
      date: date
    };

    fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderRow),
    });
  });

  afterOrderPlaced({ orderId, name: formData.get("name"), phone: formData.get("phone"), address: formData.get("address"),location: document.getElementById("Location").value, total }, true);
});

function afterOrderPlaced(order, sentToSheet) {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCartCount();
  renderCartItems();
  updateCheckoutList();

  const el = document.getElementById("order-summary");
  el.innerHTML = `
    <strong>Order saved ${sentToSheet ? "to the Owner ✅" : "try Again⚠️"}.</strong><br>
    <strong>Order ID:</strong> ${order.orderId}<br>
    <strong>Name:</strong> ${order.name}<br>
    <strong>Phone:</strong> ${order.phone}<br>
    <strong>Address:</strong> ${order.address}<br>
    <strong>Location:</strong> ${order.location}<br>
    <strong>Total:</strong> ${formatPKR(order.total)} PKR<br>
    <em>We saved your order. We will contact you for order confirmation. You will receive your order in the next two days.<br></em>
    <em class ="popup">Take the screenshoot .</em>
  `;
  document.getElementById("checkout").classList.add("hidden");
  document.getElementById("order-confirm").classList.remove("hidden");
}
/* --------------------
   Search & Filter (init)
   -------------------- */

(function initSearchFilter(){
  const search = document.getElementById('search-input');
  const filter = document.getElementById('category-filter');
  function applyFilters(){
    const q = search ? search.value.trim().toLowerCase() : '';
    const cat = filter ? filter.value : '';
    const filtered = PRODUCTS.filter(p=>{
      const matchQ = q === '' || p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
      const matchCat = cat === '' || (cat === '1' && p.title.includes('1kg')) || (cat === '2' && p.title.includes('500g')) || (cat === '3' && p.title.toLowerCase().includes('gift'));
      return matchQ && matchCat;
    });
    // render filtered
    const container = document.getElementById('products');
    container.querySelectorAll('.products-grid').forEach(n=>n.remove());
    const grid = document.createElement('div'); grid.className='products-grid fade-in';
    filtered.forEach(p=>{
      const card = document.createElement('div'); card.className='card';
      const img = document.createElement('img'); img.src=p.img; img.alt=p.title; img.style.width='100%'; img.style.height='220px'; img.style.objectFit='cover'; img.style.borderRadius='8px';
      img.innerHTML =`<div class="Disc-rate"><span class="disc-rate">${discountPercent(p.price,p.orgprice)}%</span></div>`
      const h3 = document.createElement('h3'); h3.textContent=p.title;
      const price = document.createElement('div'); price.className='price'; price.textContent = formatPKR(p.price) + ' PKR';
      const orgprice = price.innerHTML= `<div class="Price"> ${formatPKR(p.price)} PKR</div> <div class="org-price">  ${formatPKR(p.orgprice)} PKR </div>`
      const actions = document.createElement('div'); actions.className='actions';
      const view = document.createElement('button'); view.className='btn view'; view.textContent='View'; view.addEventListener('click', ()=> openModal(p.id));
      const add = document.createElement('button'); add.className='btn add'; 
       add.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bag" viewBox="0 0 16 16">
  <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
</svg>`
      add.addEventListener('click', ()=> addToCart(p.id,1));
      const buy = document.createElement('button'); buy.className='btn buy'; buy.textContent='Buy Now'; buy.addEventListener('click', ()=> { addToCart(p.id,1); location.hash='#checkout'; document.getElementById('checkout')?.scrollIntoView({behavior:'smooth'}); });
      actions.appendChild(view); actions.appendChild(add); actions.appendChild(buy);
      card.appendChild(img); card.appendChild(h3); card.appendChild(price); card.appendChild(actions);
      grid.appendChild(card);
    });
    const controls = document.getElementById('product-controls');
    if (controls) controls.after(grid); else container.appendChild(grid);
  }
  if (search) search.addEventListener('input', applyFilters);
  if (filter) filter.addEventListener('change', applyFilters);
})();


// --- Init & Navigation Fix ---
function showSectionFromHash() {
  const h = location.hash || "#home";
  const hero = document.querySelector(".hero");
  const banner = document.getElementById("img-banner");
  const products = document.getElementById("products");
  const checkout = document.getElementById("checkout");
  const orderConfirm = document.getElementById("order-confirm");
  

  // Hide all first
  [hero, products, checkout, orderConfirm,].forEach(sec => sec && sec.classList.add("hidden"));

  if (h === "#checkout") {
    checkout.classList.remove("hidden");  
    if (banner) banner.style.display = "none";
  } 
  else if (h === "#order-confirm") {
    orderConfirm.classList.remove("hidden");
    if (banner) banner.style.display = "none";
  } 
  else if (h === "#products") {
    // Products page (can also be shown same as home)
    products.classList.remove("hidden");
    hero.classList.add("hidden");
    if (banner) banner.style.display = "none";
  } 
  
  else {
    // Home (default) — hero + banner + products
    hero.classList.remove("hidden");
    products.classList.remove("hidden");
    if (banner) banner.style.display = "block";
  }
}

// initialize
window.addEventListener("hashchange", showSectionFromHash);
window.addEventListener("load", showSectionFromHash);




document.addEventListener("DOMContentLoaded", () => {
  cart = JSON.parse(localStorage.getItem("cart") || "[]");
  renderProducts();
  renderCartCount();
  renderCartItems();
  updateCheckoutList();

  // Immediately show correct section
  showSectionFromHash();

  // Navigation listener
  // window.addEventListener("hashchange", showSectionFromHash);
  window.addEventListener("hashchange", showSectionFromHash);
window.addEventListener("load", showSectionFromHash);

});


