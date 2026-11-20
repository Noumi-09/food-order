
// ========================================
// FOODORDER - ONLINE FOOD ORDERING SYSTEM
// ========================================

// Restaurant Data
const restaurants = [
    {id:1,name:"Pizza Paradise",cuisine:"Italian",rating:4.8,time:"30-40 min",image:"https://images.unsplash.com/photo-1579751626657-72bc17010498?w=600"},
    {id:2,name:"Burger House",cuisine:"American",rating:4.6,time:"20-30 min",image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"},
    {id:3,name:"Sushi World",cuisine:"Japanese",rating:4.9,time:"35-40 min",image:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600"},
    {id:4,name:"Noodle Express",cuisine:"Asian",rating:4.5,time:"25-35 min",image:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600"},
    {id:5,name:"Green Bowl",cuisine:"Healthy",rating:4.7,time:"20-30 min",image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600"},
    {id:6,name:"Sweet Treats",cuisine:"Desserts",rating:4.8,time:"15-25 min",image:"https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600"}
];

// Menu Data
let menuItems = [
    {id:1,restaurant:1,name:"Margherita Pizza",category:"Pizza",description:"Classic tomato, mozzarella and basil",price:249,image:"https://images.unsplash.com/photo-1579751626657-72bc17010498?w=600"},
    {id:2,restaurant:1,name:"Farmhouse Pizza",category:"Pizza",description:"Fresh vegetables and cheese",price:329,image:"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600"},
    {id:3,restaurant:2,name:"Classic Burger",category:"Burger",description:"Juicy patty with fresh vegetables",price:179,image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"},
    {id:4,restaurant:2,name:"Cheese Burger",category:"Burger",description:"Loaded with melted cheese",price:219,image:"https://images.unsplash.com/photo-1550547660-d9450f859349?w=600"},
    {id:5,restaurant:3,name:"Salmon Sushi",category:"Sushi",description:"Fresh salmon sushi rolls",price:399,image:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600"},
    {id:6,restaurant:4,name:"Hakka Noodles",category:"Noodles",description:"Spicy stir-fried noodles",price:189,image:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600"},
    {id:7,restaurant:5,name:"Healthy Salad",category:"Salad",description:"Fresh green vegetables",price:159,image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600"},
    {id:8,restaurant:6,name:"Chocolate Cake",category:"Dessert",description:"Rich chocolate cake",price:129,image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600"},
    {id:9,restaurant:6,name:"Ice Cream",category:"Dessert",description:"Creamy vanilla ice cream",price:99,image:"https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600"},
    {id:10,restaurant:1,name:"Fresh Lemonade",category:"Beverage",description:"Refreshing fresh lemonade",price:79,image:"https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?w=600"}
];

// Local Storage Data
let cart = JSON.parse(localStorage.getItem("foodCart")) || [];
let orders = JSON.parse(localStorage.getItem("foodOrders")) || [];
let profile = JSON.parse(localStorage.getItem("foodProfile")) || {};
let discount = 0;
let appliedPromo = false;
let currentCategory = "All";

const currency = value => "₹" + Number(value).toFixed(2);

function saveData() {
    localStorage.setItem("foodCart", JSON.stringify(cart));
    localStorage.setItem("foodOrders", JSON.stringify(orders));
    localStorage.setItem("foodProfile", JSON.stringify(profile));
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
}

// Navigation
function toggleMenu() {
    document.getElementById("navLinks").classList.toggle("open");
}

function closeMenu() {
    document.getElementById("navLinks").classList.remove("open");
}

function toggleTheme() {
    document.body.classList.toggle("dark");
    localStorage.setItem("foodTheme", document.body.classList.contains("dark") ? "dark" : "light");
}

if(localStorage.getItem("foodTheme") === "dark") {
    document.body.classList.add("dark");
}

// Display Restaurants
function renderRestaurants() {
    const grid = document.getElementById("restaurantGrid");

    grid.innerHTML = restaurants.map(r => `
        <article class="food-card">
            <img src="${r.image}" alt="${r.name}" loading="lazy">
            <div class="food-info">
                <h3>${r.name}</h3>
                <p>${r.cuisine} Cuisine</p>
                <div class="food-meta">
                    <span>⭐ ${r.rating}</span>
                    <span>🕒 ${r.time}</span>
                </div>
                <button class="card-btn" onclick="showRestaurant(${r.id})">View Restaurant</button>
            </div>
        </article>
    `).join("");
}

function showRestaurant(id) {
    currentCategory = "All";
    const items = menuItems.filter(item => item.restaurant === id);
    document.getElementById("menuGrid").innerHTML = items.map(createMenuCard).join("");
    document.getElementById("menu").scrollIntoView({behavior:"smooth"});
}

// Menu Rendering
function createMenuCard(item) {
    return `
        <article class="food-card">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="food-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="food-meta">
                    <span class="price">${currency(item.price)}</span>
                    <span>⭐ 4.8</span>
                </div>
                <button class="card-btn" onclick="addToCart(${item.id})">+ Add to Cart</button>
            </div>
        </article>
    `;
}

function renderMenu() {
    const items = currentCategory === "All"
        ? menuItems
        : menuItems.filter(item => item.category === currentCategory);

    document.getElementById("menuGrid").innerHTML =
        items.length ? items.map(createMenuCard).join("") :
        '<p class="empty">No items found.</p>';
}

function filterCategory(category) {
    currentCategory = category;

    document.querySelectorAll(".category").forEach(btn => {
        btn.classList.remove("active");
    });

    const buttons = [...document.querySelectorAll(".category")];
    const selected = buttons.find(btn =>
        btn.textContent.trim().toLowerCase() === category.toLowerCase() ||
        (category === "All" && btn.textContent.includes("All"))
    );

    if(selected) selected.classList.add("active");

    renderMenu();
    document.getElementById("menu").scrollIntoView({behavior:"smooth"});
}

// Search
function searchFood() {
    const query = document.getElementById("searchInput").value.toLowerCase().trim();

    if(!query) {
        renderMenu();
        return;
    }

    const foundItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );

    const foundRestaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.cuisine.toLowerCase().includes(query)
    );

    document.getElementById("menuGrid").innerHTML =
        foundItems.map(createMenuCard).join("") ||
        '<p class="empty">No matching food items found.</p>';

    if(foundRestaurants.length) {
        document.getElementById("restaurantGrid").innerHTML =
            foundRestaurants.map(r => `
                <article class="food-card">
                    <img src="${r.image}" alt="${r.name}">
                    <div class="food-info">
                        <h3>${r.name}</h3>
                        <p>${r.cuisine} Cuisine</p>
                        <button class="card-btn" onclick="showRestaurant(${r.id})">View Menu</button>
                    </div>
                </article>
            `).join("");
    }

    document.getElementById("menu").scrollIntoView({behavior:"smooth"});
}

// Cart
function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    if(!item) return;

    const existing = cart.find(i => i.id === id);

    if(existing) existing.quantity++;
    else cart.push({...item, quantity:1});

    saveData();
    renderCart();
    showToast(item.name + " added to cart!");
}

function updateQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if(!item) return;

    item.quantity += change;

    if(item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
    }

    saveData();
    renderCart();
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    saveData();
    renderCart();
    showToast("Item removed from cart");
}

function calculateSubtotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
    const container = document.getElementById("cartItems");

    document.getElementById("cartCount").textContent =
        cart.reduce((sum, item) => sum + item.quantity, 0);

    if(!cart.length) {
        container.innerHTML = '<div class="empty">🛒 Your cart is empty. Add some delicious food!</div>';
    } else {
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <p>${currency(item.price)} each</p>
                </div>
                <div class="quantity">
                    <button onclick="updateQuantity(${item.id},-1)">−</button>
                    <strong>${item.quantity}</strong>
                    <button onclick="updateQuantity(${item.id},1)">+</button>
                </div>
                <strong>${currency(item.price * item.quantity)}</strong>
                <button class="remove-btn" onclick="removeItem(${item.id})">✕</button>
            </div>
        `).join("");
    }

    updateTotals();
}

function updateTotals() {
    const subtotal = calculateSubtotal();
    const delivery = subtotal > 0 ? 30 : 0;
    discount = appliedPromo ? Math.min(subtotal * 0.10, 100) : 0;
    const total = Math.max(0, subtotal + delivery - discount);

    document.getElementById("subtotal").textContent = currency(subtotal);
    document.getElementById("delivery").textContent = currency(delivery);
    document.getElementById("discount").textContent = currency(discount);
    document.getElementById("total").textContent = currency(total);
    document.getElementById("checkoutTotal").textContent = currency(total);
}

function applyPromo() {
    const code = document.getElementById("promoCode").value.trim().toUpperCase();

    if(!cart.length) {
        showToast("Add items to your cart first");
        return;
    }

    if(code === "FOOD10") {
        appliedPromo = true;
        updateTotals();
        showToast("10% discount applied!");
    } else {
        appliedPromo = false;
        updateTotals();
        showToast("Invalid promo code. Try FOOD10");
    }
}

function goToCheckout() {
    if(!cart.length) {
        showToast("Your cart is empty!");
        return;
    }

    document.getElementById("checkout").scrollIntoView({behavior:"smooth"});
}

// Checkout
document.getElementById("checkoutForm").addEventListener("submit", function(e) {
    e.preventDefault();

    if(!cart.length) {
        showToast("Your cart is empty");
        return;
    }

    const order = {
        id: "FO" + Date.now().toString().slice(-8),
        items: [...cart],
        total: calculateSubtotal() + 30 - discount,
        name: document.getElementById("customerName").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        city: document.getElementById("city").value.trim(),
        payment: document.getElementById("payment").value,
        date: new Date().toLocaleString(),
        status: "Pending"
    };

    orders.unshift(order);
    cart = [];
    appliedPromo = false;

    saveData();
    renderCart();
    renderOrders();
    renderDashboard();

    this.reset();

    showToast("Order placed successfully! 🎉");
    document.getElementById("orders").scrollIntoView({behavior:"smooth"});
});

// Order History and Tracking
function renderOrders() {
    const container = document.getElementById("orderList");

    if(!orders.length) {
        container.innerHTML = '<p class="empty">No orders yet. Start ordering now!</p>';
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <h3>Order #${order.id}</h3>
            <p>📅 ${order.date}</p>
            <p>👤 ${escapeHTML(order.name)}</p>
            <p>📍 ${escapeHTML(order.address)}, ${escapeHTML(order.city)}</p>
            <p>📞 ${escapeHTML(order.phone)}</p>
            <p>💳 ${escapeHTML(order.payment)}</p>
            <p>🍽️ ${order.items.map(i => escapeHTML(i.name) + " × " + i.quantity).join(", ")}</p>
            <p><strong>Total: ${currency(order.total)}</strong></p>
            <p>Status: <span class="status">${order.status}</span></p>
            <div class="order-actions">
                <button onclick="trackOrder('${order.id}')">Track Order</button>
                <button onclick="reorder('${order.id}')">Reorder</button>
                <button onclick="rateOrder('${order.id}')">Rate Order ⭐</button>
            </div>
        </div>
    `).join("");
}

function trackOrder(id) {
    const order = orders.find(o => o.id === id);
    if(order) {
        showToast("Order " + id + ": " + order.status);
    }
}

function updateOrderStatus(id, status) {
    const order = orders.find(o => o.id === id);
    if(!order) return;

    order.status = status;
    saveData();
    renderOrders();
    renderDashboard();
    showToast("Order status updated: " + status);
}

function reorder(id) {
    const order = orders.find(o => o.id === id);
    if(!order) return;

    order.items.forEach(item => {
        const existing = cart.find(c => c.id === item.id);
        if(existing) existing.quantity += item.quantity;
        else cart.push({...item});
    });

    saveData();
    renderCart();
    document.getElementById("cart").scrollIntoView({behavior:"smooth"});
    showToast("Previous order added to cart!");
}

function rateOrder(id) {
    const rating = prompt("Rate your order from 1 to 5 stars:");
    if(rating === null) return;

    const value = Number(rating);

    if(!Number.isInteger(value) || value < 1 || value > 5) {
        showToast("Please enter a rating from 1 to 5");
        return;
    }

    const order = orders.find(o => o.id === id);
    if(order) {
        order.rating = value;
        saveData();
        renderOrders();
        showToast("Thank you for your " + value + "-star rating!");
    }
}

// Restaurant Dashboard
function renderDashboard() {
    document.getElementById("dashItems").textContent = menuItems.length;
    document.getElementById("dashOrders").textContent = orders.length;

    const revenue = orders
        .filter(o => o.status !== "Cancelled")
        .reduce((sum,o) => sum + o.total,0);

    document.getElementById("dashRevenue").textContent = currency(revenue);

    document.getElementById("dashboardOrders").innerHTML =
        orders.map(order => `
            <div class="order-card">
                <h3>Order #${order.id}</h3>
                <p>${escapeHTML(order.name)} - ${currency(order.total)}</p>
                <p>Status: <span class="status">${order.status}</span></p>
                <div class="order-actions">
                    <button onclick="updateOrderStatus('${order.id}','Preparing')">Preparing</button>
                    <button onclick="updateOrderStatus('${order.id}','Out for Delivery')">Out for Delivery</button>
                    <button onclick="updateOrderStatus('${order.id}','Delivered')">Delivered</button>
                    <button onclick="updateOrderStatus('${order.id}','Cancelled')">Cancel</button>
                </div>
            </div>
        `).join("");
}

document.getElementById("addItemForm").addEventListener("submit",function(e) {
    e.preventDefault();

    const name = document.getElementById("newItemName").value.trim();
    const price = Number(document.getElementById("newItemPrice").value);
    const category = document.getElementById("newItemCategory").value;

    if(!name || !Number.isFinite(price) || price <= 0) {
        showToast("Enter valid item details");
        return;
    }

    menuItems.push({
        id: Math.max(0,...menuItems.map(i => i.id)) + 1,
        restaurant:1,
        name,
        category,
        description:"Freshly prepared delicious food",
        price,
        image:"https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=600"
    });

    renderMenu();
    renderDashboard();
    this.reset();
    showToast("New menu item added!");
});

// Profile
document.getElementById("profileForm").addEventListener("submit",function(e) {
    e.preventDefault();

    profile = {
        name:document.getElementById("profileName").value,
        email:document.getElementById("profileEmail").value,
        phone:document.getElementById("profilePhone").value,
        address:document.getElementById("profileAddress").value
    };

    saveData();
    showToast("Profile saved successfully!");
});

function loadProfile() {
    document.getElementById("profileName").value = profile.name || "";
    document.getElementById("profileEmail").value = profile.email || "";
    document.getElementById("profilePhone").value = profile.phone || "";
    document.getElementById("profileAddress").value = profile.address || "";
}

// Simulated Authentication
document.getElementById("authForm").addEventListener("submit",function(e) {
    e.preventDefault();

    const user = {
        name:document.getElementById("authName").value.trim(),
        email:document.getElementById("authEmail").value.trim(),
        role:document.getElementById("authRole").value
    };

    // Demo only: no real authentication or password security.
    localStorage.setItem("foodUser",JSON.stringify(user));

    document.getElementById("authMessage").textContent =
        "Welcome " + user.name + "! Demo account created as " + user.role + ".";

    showToast("Welcome to FoodOrder!");
});

// Basic HTML escaping for customer-provided text
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&":"&amp;",
        "<":"&lt;",
        ">":"&gt;",
        '"':"&quot;",
        "'":"&#39;"
    })[char]);
}

// Initialize Application
function initializeApp() {
    renderRestaurants();
    renderMenu();
    renderCart();
    renderOrders();
    renderDashboard();
    loadProfile();
}

initializeApp();
