fetch('https://bubbly-adorable-hose.glitch.me/beverages-tea')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse the response JSON
    })
    .then(data => {
        console.log(data); // Handle the JSON data
        const pageTitle = document.querySelector('.page-header h1');
        pageTitle.textContent = data.screen_info.title + " (" + data.tabs[0].product_info.total_count + ")";
        const breadcrumb = document.querySelector('.breadcrumb');
        data.tabs[0].bread_crumbs.forEach(bread_crumb => {
            const anchor = document.createElement("a");
            anchor.innerText = " > " + bread_crumb.name;
            breadcrumb.appendChild(anchor);
        });

        createProductCards(data.tabs[0].product_info.products);
    })
    .catch(error => {
        console.error('There was an error fetching the data:', error);
    });

function createProductCards(products) {
    const grid = document.getElementById("product-grid");

    // Fetch logged-in user's data from localStorage
    const loggedInUsername = localStorage.getItem('username');
    let userCart = [];

    // If the user is logged in, fetch the cart
    if (loggedInUsername) {
        fetch('https://bubbly-adorable-hose.glitch.me/users')
            .then(response => response.json())
            .then(users => {
                const user = users.find(user => user.username === loggedInUsername);
                if (user && user.cart) {
                    userCart = user.cart; // Set the cart data for the logged-in user
                }

                // Now, create product cards
                products.forEach(product => {
                    createCard(product, userCart);
                });
            })
            .catch(error => console.error('Error fetching user data:', error));
    } else {
        // If user is not logged in, create product cards without cart data
        products.forEach(product => {
            createCard(product);
        });
    }

    // Function to create individual product cards
    function createCard(product, userCart = []) {
        // Check if the product is already in the cart
        const cartItem = userCart.find(item => item?.product?.id === product.id);
        let quantity = cartItem ? cartItem.quantity : 0;

        const card = document.createElement("div");
        card.classList.add("product-card");

        // Product image
        const img = document.createElement("img");
        img.src = product.images[0].s;
        card.appendChild(img);

        // Brand
        const brand = document.createElement("div");
        brand.classList.add("brand");
        brand.textContent = product.brand.name;
        card.appendChild(brand);

        // Product name
        const name = document.createElement("div");
        name.classList.add("name");
        name.textContent = product.desc;
        card.appendChild(name);

        // Rating Section
        const ratingInfo = product.rating_info;
        if (ratingInfo.avg_rating !== null && ratingInfo.rating_count !== null) {
            const ratingContainer = document.createElement("div");
            ratingContainer.classList.add("rating");

            // Star Icon
            const starIcon = document.createElement("span");
            starIcon.innerHTML = "&#9733;"; // Unicode star icon
            starIcon.style.color = "#FFD700"; // Gold color
            starIcon.style.marginRight = "5px";
            ratingContainer.appendChild(starIcon);

            // Average Rating
            const averageRating = document.createElement("span");
            averageRating.textContent = ratingInfo.avg_rating;
            averageRating.style.marginRight = "10px";
            ratingContainer.appendChild(averageRating);

            // Number of Ratings
            const ratingCount = document.createElement("span");
            ratingCount.textContent = `(${ratingInfo.rating_count})`;
            ratingContainer.appendChild(ratingCount);

            // Add rating to card
            card.appendChild(ratingContainer);
        }

        // Pricing
        const prices = document.createElement("div");
        prices.classList.add("prices");

        const originalPrice = document.createElement("span");
        originalPrice.classList.add("original-price");
        originalPrice.textContent = `₹${product.pricing.discount.mrp}`;
        prices.appendChild(originalPrice);

        const discountPrice = document.createElement("span");
        discountPrice.classList.add("discount-price");
        discountPrice.textContent = ` ₹${product.pricing.discount.prim_price.sp}`;
        prices.appendChild(discountPrice);

        card.appendChild(prices);

        // Save button
        const saveBtn = document.createElement("button");
        saveBtn.classList.add("save-btn");

        // Font Awesome bookmark icon
        const bookmarkIcon = document.createElement("i");
        bookmarkIcon.classList.add("fa", "fa-bookmark");
        saveBtn.appendChild(bookmarkIcon);
        card.appendChild(saveBtn);

        // Add to Cart functionality
        const cartBtn = document.createElement("button");
        cartBtn.classList.add("cart-btn");

        // If the item is in the cart, show plus-minus buttons, otherwise show "Add to Cart"
        if (quantity > 0) {
            cartBtn.innerHTML = ` 
                <button class="decrease-btn">-</button>
                <span class="quantity">${quantity}</span>
                <button class="increase-btn">+</button>
            `;
        } else {
            cartBtn.textContent = "Add to Cart";
        }

        // Update cart button UI
        const updateCartUI = () => {
            if (quantity > 0) {
                cartBtn.innerHTML = ` 
                    <button class="decrease-btn">-</button>
                    <span class="quantity">${quantity}</span>
                    <button class="increase-btn">+</button>
                `;
            } else {
                cartBtn.textContent = "Add to Cart";
            }

            // Attach event listeners
            const decreaseBtn = cartBtn.querySelector(".decrease-btn");
            const increaseBtn = cartBtn.querySelector(".increase-btn");

            decreaseBtn.addEventListener("click", () => {
                if (quantity > 1) {
                    quantity--;
                    updateCartAPI(product.id, quantity);
                    updateCartUI();
                } else {
                    // Remove item from cart if quantity becomes zero
                    removeProductFromCartAPI(product.id);
                    quantity = 0; // Set quantity to 0
                    updateCartUI();
                }
            });

            increaseBtn.addEventListener("click", () => {
                quantity++;
                updateCartAPI(product.id, quantity);
                updateCartUI();
            });
        };

        // API function to update cart (storing entire product object)
        const updateCartAPI = async (productId, quantity) => {
            const loggedInUsername = localStorage.getItem('username');

            if (!loggedInUsername) {
                alert('You must be logged in to add products to your cart!');
                return;
            }

            try {
                // Fetch the user data from the backend
                const userResponse = await fetch('https://bubbly-adorable-hose.glitch.me/users');
                const users = await userResponse.json();
                const user = users.find(user => user.username === loggedInUsername);

                if (!user) {
                    alert('User not found!');
                    return;
                }

                // Check if the user has a cart in their data (if not, create one)
                if (!user.cart) {
                    user.cart = [];
                }

                // Find the product object from the products array
                const product = products.find(p => p.id === productId);
                if (!product) {
                    alert('Product not found!');
                    return;
                }

                // Find the existing product in the cart (if any)
                const existingProductIndex = user.cart.findIndex(item => item.product.id === productId);

                if (existingProductIndex !== -1) {
                    // If the product exists in the cart, update the quantity
                    user.cart[existingProductIndex].quantity += quantity;
                } else {
                    // If the product does not exist in the cart, add it with the specified quantity
                    user.cart.push({
                        product: product,  // Store the entire product object
                        quantity: quantity,
                    });
                }

                // Update the cart in the backend
                const updateResponse = await fetch(`https://bubbly-adorable-hose.glitch.me/users/${user.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        cart: user.cart
                    }),
                });

                if (!updateResponse.ok) {
                    console.error('Failed to update cart');
                    alert('There was an error updating your cart.');
                    return;
                }

                alert('Product added to cart successfully!');
                updateCartUI(); // Update the cart button UI to reflect changes

            } catch (error) {
                console.error('Error updating cart:', error);
                alert('There was an error adding the product to your cart.');
            }
        };

        // Remove product from cart API
        const removeProductFromCartAPI = async (productId) => {
            const loggedInUsername = localStorage.getItem('username');

            if (!loggedInUsername) {
                alert('You must be logged in to remove products from your cart!');
                return;
            }

            try {
                // Fetch the user data from the backend
                const userResponse = await fetch('https://bubbly-adorable-hose.glitch.me/users');
                const users = await userResponse.json();
                const user = users.find(user => user.username === loggedInUsername);

                if (!user) {
                    alert('User not found!');
                    return;
                }

                // Remove the product from the cart
                user.cart = user.cart.filter(item => item.product.id !== productId);

                // Update the cart in the backend
                const updateResponse = await fetch(`https://bubbly-adorable-hose.glitch.me/users/${user.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        cart: user.cart
                    }),
                });

                if (!updateResponse.ok) {
                    console.error('Failed to remove product from cart');
                    alert('There was an error removing the product from your cart.');
                    return;
                }

                alert('Product removed from cart successfully!');
                updateCartUI(); // Update the cart button UI to reflect changes

            } catch (error) {
                console.error('Error removing product from cart:', error);
                alert('There was an error removing the product from your cart.');
            }
        };

        cartBtn.addEventListener("click", () => {
            if (quantity === 0) {
                quantity = 1;
            }
            updateCartAPI(product.id, quantity);
            updateCartUI();
        });

        card.appendChild(cartBtn);

        // Append card to grid
        grid.appendChild(card);
    }
}
