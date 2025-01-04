document.addEventListener("DOMContentLoaded", async () => {
    const cartContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
  
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
  
      const user = await getUserDetails(username);
  
      if (!user || !user.cart) {
        cartContainer.innerHTML = "<p>Your cart is empty!</p>";
        return;
      }
  
      renderCart(user.cart);
    };
  
    // Render cart items
    const renderCart = (cart) => {
      cartContainer.innerHTML = ""; // Clear existing cart
  
      let total = 0;
  
      cart.forEach((item) => {
        const product = item.product;
        const quantity = item.quantity;
  
        total += parseFloat(product.pricing.discount.sp) * quantity;
  
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
  
        cartItem.innerHTML = `
          <img src="${product.images[0].s}" alt="${product.desc}">
          <div class="cart-item-details">
            <h4>${product.desc}</h4>
            <p>${product.pack_desc}</p>
            <p>Price: ₹${product.pricing.discount.sp}</p>
          </div>
          <div class="cart-item-controls">
            <button onclick="updateQuantity(${product.id}, -1)">-</button>
            <span>${quantity}</span>
            <button onclick="updateQuantity(${product.id}, 1)">+</button>
          </div>
        `;
  
        cartContainer.appendChild(cartItem);
      });
  
      totalPriceElement.textContent = `₹${total.toFixed(2)}`;
    };
  
    // Update item quantity
    function updateQuantity(productId, delta){
        // Logic to update quantity and re-render cart
        console.log(`Update product ${productId} quantity by ${delta}`);
        // You can call another API here to update the cart in the backend
      };
  
    // Initialize cart
    getCartData();
  });
  