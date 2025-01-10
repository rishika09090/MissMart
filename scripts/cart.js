document.addEventListener("DOMContentLoaded", async () => {
  const cartContainer = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");
  const itemCountElement = document.getElementById("item-count");
  const subtotalTopElement = document.getElementById("subtotal-top");
  const totalSavingsElement = document.getElementById("total-savings");
  let user;
  // Mock API Call: Replace with your actual API endpoint
  const getUserDetails = async (username) => {
    // Replace with actual API call
    return fetch("https://bubbly-adorable-hose.glitch.me/users")
      .then((response) => response.json())
      .then((data) => data.find((user) => user.username === username));
  };

  // Fetch cart data for the logged-in user
  const getCartData = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      alert("No user logged in");
      return;
    }

    user = await getUserDetails(username);

    if (!user || !user.cart) {
      cartContainer.innerHTML = "<p>Your cart is empty!</p>";
      return;
    }
    itemCountElement.innerText = user.cart.length;
    renderCart(user.cart);
  };

  // Render cart items
  const renderCart = (cart) => {
    cartContainer.innerHTML = ""; // Clear existing cart

    let total = 0;
    let totalsaving = 0;

    cart.forEach((item) => {
      const product = item.product;
      const quantity = item.quantity;
      const sp = parseFloat(product.pricing.discount.prim_price.sp); // Selling price
      const mrp = parseFloat(product.pricing.discount.mrp);
      const saving = (mrp - sp) * quantity;
      totalsaving += saving;
      const subtotal = sp * quantity; // Calculate subtotal for the product
      total += subtotal; // Add subtotal to the total price

      // Create a cart item element
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

      cartItem.innerHTML = `
      <div style="display: flex;"><img src="${product.images[0].s}" alt="${product.desc}">
        <div class="cart-item-details">
          <h4>${product.desc}</h4>
          <p>${product.pack_desc}</p>
          <p>Price: <span id="sp">₹${sp}</span> <span id="mrp">₹${mrp}</span> </p>
        </div></div>
        
        <div class="cart-item-controls">
          <button onclick="updateQuantity('${product.id}', -1)">-</button>
          <span>${quantity}</span>
          <button onclick="updateQuantity('${product.id}', 1)">+</button>
        </div>
        <div class="cart-item-subtotal">
           ₹${subtotal.toFixed(2)}
           <div id="saving">Saved:₹${saving.toFixed(2)} </div>
        </div>
      `;

      cartContainer.appendChild(cartItem);
    });

    // Update total price
    totalSavingsElement.textContent = `₹${totalsaving.toFixed(2)}`;
    subtotalTopElement.textContent = `₹${total.toFixed(2)}`;
    totalPriceElement.textContent = `₹${total.toFixed(2)}`;
  };

  // Update item quantity
  window.updateQuantity = (productId, delta) => {
    // Logic to update quantity and re-render cart
    user.cart = user.cart.filter(product => {
      if (product.product.id === productId) {
        product.quantity += delta;

        // Remove product if quantity becomes 0
        if (product.quantity <= 0) {
          return false; // Exclude this product from the updated cart
        }
      }
      return true; // Keep all other products
    });

    // Call the updateCart function to persist changes
    updateCart(user);
    // Call another API here to update the cart in the backend, if needed
  };

  async function updateCart(user) {
    try {
      const response = await fetch(`https://bubbly-adorable-hose.glitch.me/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      renderCart(result.cart);
      alert("Cart updated successfully");
    } catch (error) {
      console.error("Failed to update cart:", error);
    }
  }


  // Initialize cart
  getCartData();

  document.getElementById('checkoutButton').addEventListener('click', function() {
    window.location.href = 'checkout.html';
  });
});
