document.addEventListener("DOMContentLoaded", async () => {
  const cartContainer = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");
  const itemCountElement = document.getElementById("item-count");
  const subtotalTopElement = document.getElementById("subtotal-top");
  const totalSavingsElement = document.getElementById("total-savings");
  let user;
  
  const getUserDetails = async (username) => {
    
    return fetch("https://bubbly-adorable-hose.glitch.me/users")
      .then((response) => response.json())
      .then((data) => data.find((user) => user.username === username));
  };

  
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

  
  const renderCart = (cart) => {
    cartContainer.innerHTML = ""; 

    let total = 0;
    let totalsaving = 0;

    cart.forEach((item) => {
      const product = item.product;
      const quantity = item.quantity;
      const sp = parseFloat(product.pricing.discount.prim_price.sp); 
      const mrp = parseFloat(product.pricing.discount.mrp);
      const saving = (mrp - sp) * quantity;
      totalsaving += saving;
      const subtotal = sp * quantity; 
      total += subtotal; 

      
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

    
    totalSavingsElement.textContent = `₹${totalsaving.toFixed(2)}`;
    subtotalTopElement.textContent = `₹${total.toFixed(2)}`;
    totalPriceElement.textContent = `₹${total.toFixed(2)}`;
  };

  
  window.updateQuantity = (productId, delta) => {
    
    user.cart = user.cart.filter(product => {
      if (product.product.id === productId) {
        product.quantity += delta;

        
        if (product.quantity <= 0) {
          return false; 
        }
      }
      return true; 
    });

    
    updateCart(user);
    
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


  
  getCartData();

  document.getElementById('checkoutButton').addEventListener('click', function() {
    window.location.href = 'checkout.html';
  });
});
