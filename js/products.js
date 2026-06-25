// ------------------------------
// PRODUCTS (NOW FROM BACKEND)
// ------------------------------
let PRODUCTS = [];
let activeFilter = 'All'; // single source of truth — lives here in products.js

// Called by filter buttons in products.html via onclick="setFilter(...)"
function setFilter(cat, btn) {
  activeFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filterProducts();
}

// ------------------------------
// LOAD PRODUCTS FROM BACKEND
// ------------------------------
async function loadProducts() {
  try {
    const res = await fetch("http://localhost:5000/api/products");
    PRODUCTS = await res.json();

    // WAIT for DOM + THEN render
    setTimeout(() => {
      filterProducts();
      updateCartBadge();
    }, 0);

  } catch (err) {
    console.log(err);
  }
}

function filterProducts() {
  const grid = document.getElementById("products-grid");

  if (!grid) return; // 🔥 prevents silent failure

  grid.innerHTML = "";

  if (!PRODUCTS || PRODUCTS.length === 0) {
    document.getElementById("no-results").style.display = "block";
    return;
  }

  const q = (
    document.getElementById("search-inline")?.value ||
    document.getElementById("search-input")?.value ||
    ""
  ).toLowerCase();

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeFilter === 'All' || p.category === activeFilter;
    const matchQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);

    return matchCat && matchQ;
  });

  document.getElementById("no-results").style.display =
    filtered.length ? "none" : "block";

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-thumb" onclick="window.location='product-detail.html?id=${p._id}'">
        ${getProductImage(p, "small")}
      </div>

      <div class="product-info">
        <div class="product-cat-tag">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">
          ${renderStars(p.rating)}
        </div>

        <div class="product-footer">
          <div class="product-price">₹${p.price}</div>
           <button class="btn btn-primary add-btn" onclick="addToWishlist('${p._id}')">
      ❤️
    </button>
          <button class="btn btn-primary add-btn" onclick="addToCart('${p._id}')">+ Add</button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}


// ------------------------------
// CART SYSTEM (UNCHANGED)
// ------------------------------
function getCart() {
  return JSON.parse(localStorage.getItem("snackhub_cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("snackhub_cart", JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p._id === productId || p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      qty: 1
    });
  }

  saveCart(cart);
  showToast(`${product.name} added to cart! 🛒`);
}

async function addToWishlist(productId) {
  const user = JSON.parse(localStorage.getItem("snackhub_user"));

  if (!user) {
    showToast("Please login first");
    return;
  }

  const product = PRODUCTS.find(
    p => p._id === productId || p.id === productId
  );

  if (!product) return;

  try {
    const response = await fetch(
      "http://localhost:5000/api/wishlist",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.id,
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image || "",
          category: product.category
        })
      }
    );

    const data = await response.json();

    if (response.ok) {
      showToast("Added to Wishlist ❤️");
    } else {
      showToast(data.message || "Wishlist error");
    }
  } catch (err) {
    console.error(err);
    showToast("Failed to add to wishlist");
  }
}

// ------------------------------
// CART BADGE
// ------------------------------
function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((sum, i) => sum + i.qty, 0);

  document.querySelectorAll(".cart-badge").forEach(b => {
    b.textContent = total;
    b.style.display = total > 0 ? "flex" : "none";
  });
}

// ------------------------------
// TOAST MESSAGE
// ------------------------------
function showToast(msg) {
  let toast = document.getElementById("sh-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "sh-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.classList.add("show");

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

// ------------------------------
// IMAGE RENDER
// ------------------------------
function getProductImage(product, size) {
  const cls = size === "large" ? "product-img-large" : "product-img";

  if (product.image) {
    return `
      <img src="${product.image}" alt="${product.name}" class="${cls}"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
      <div class="emoji-thumb" style="display:none;background:${product.gradient}">
        ${product.emoji}
      </div>
    `;
  }

  return `
    <div class="emoji-thumb ${cls}" style="background:${product.gradient}">
      ${product.emoji}
    </div>
  `;
}

// ------------------------------
// STARS UI
// ------------------------------
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;

  let s = "";
  for (let i = 0; i < full; i++) s += "★";
  if (half) s += "½";

  return `<span class="stars">${s}</span><span class="rating-num">${rating}</span>`;
}

// ------------------------------
// START APP
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {

  // Read URL params (?cat=Chocolates, ?q=oreo)
  const params = new URLSearchParams(location.search);

  if (params.get('cat')) {
    activeFilter = params.get('cat');
    // Highlight the matching filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.textContent.trim().replace(/^\S+\s*/, '') === activeFilter ||
          btn.textContent.trim() === activeFilter) {
        btn.classList.add('active');
      }
    });
  }

  if (params.get('q')) {
    const el = document.getElementById('search-inline');
    if (el) el.value = params.get('q');
  }

  loadProducts();
});