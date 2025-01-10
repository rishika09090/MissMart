let url = "https://bubbly-adorable-hose.glitch.me/products/"
let products = [];
// Access the search parameters
let params = new URLSearchParams(new URL(window.location.href).search);

let category = params.get('category');
let sort = params.get('sort');

fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse the response JSON
    })
    .then(data => {
        console.log(data)
        function searchInObject(obj, searchString) {
            // Split the input string into words
            const searchWords = searchString.toLowerCase().split(' ');
        
            // Helper function to recursively search the object
            function searchRecursive(obj) {
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        const value = obj[key];
        
                        // If the value is an object, search recursively
                        if (typeof value === 'object' && value !== null) {
                            if (searchRecursive(value)) return true;
                        }
                        // If the value is a string, check if any search word is present
                        else if (typeof value === 'string') {
                            const lowerValue = value.toLowerCase();
                            if (searchWords.some(word => lowerValue.includes(word))) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }
        
            // Start the recursive search
            return searchRecursive(obj);
        }
        products = data.filter(product => searchInObject(product, category));
        console.log(products)
        const pageTitle = document.querySelector('.page-header h1');
        pageTitle.textContent = products[0].category.mlc_name;
        const breadcrumb = document.querySelector('.breadcrumb');
        // Create breadcrumb using category levels
        const categoryLevels = [
            { name: products[0].category.tlc_name, slug: products[0].category.tlc_slug },
            { name: products[0].category.mlc_name, slug: products[0].category.mlc_slug }
        ];

        // Generate breadcrumb links
        categoryLevels.forEach((level, index) => {
            const anchor = document.createElement("a");
            anchor.innerText = level.name;
            anchor.href = `products.html?category=${encodeURIComponent(level.slug)}`; // Pass category slug as query param

            // Append the ' > ' separator for all except the last item
            if (index !== 0) breadcrumb.appendChild(document.createTextNode(" > "));
            breadcrumb.appendChild(anchor);
        });


        products = sortProducts(products, "rating-high-low");

        createProductCards(products);
    })
    .catch(error => {
        console.error('There was an error fetching the data:', error);
    });

// Event listener for sorting dropdown change
const sortSelect = document.getElementById('sort-options');
sortSelect.addEventListener('change', (event) => {
    const selectedSort = event.target.value;
    // Apply sorting without reloading the page
    const sortedData = sortProducts(products, selectedSort);
    createProductCards(sortedData);
});

// Function to create product cards
function createProductCards(products) {
    const grid = document.getElementById("product-grid");
    grid.innerHTML = ''; // Clear existing cards

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

        // Discount ribbon
        const mrp = parseInt(product.pricing.discount.mrp);
        const sp = parseInt(product.pricing.discount.prim_price.sp);
        if (mrp > sp) {
            const discountRibbon = document.createElement("div");
            discountRibbon.classList.add("discount-ribbon");
            const discountPercentage = Math.round(((mrp - sp) / mrp) * 100);
            discountRibbon.textContent = `${discountPercentage}% OFF`;
            card.appendChild(discountRibbon);
        }

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

        // Money saved message
        const moneySaved = document.createElement("div");
        moneySaved.classList.add("money-saved");
        const savedAmount = product.pricing.discount.mrp - product.pricing.discount.prim_price.sp;
        moneySaved.textContent = `You save: ₹${savedAmount.toFixed(2)}`;
        moneySaved.style.color = "green";
        card.appendChild(moneySaved);

        // Save button
        const saveBtn = document.createElement("button");
        saveBtn.classList.add("save-btn");

        // Font Awesome bookmark icon
        const bookmarkIcon = document.createElement("i");
        bookmarkIcon.classList.add("fa", "fa-bookmark");
        saveBtn.appendChild(bookmarkIcon);
        card.appendChild(saveBtn);

        // Add to Cart button
        const cartBtn = document.createElement("button");
        cartBtn.classList.add("cart-btn");

        // If the item is in the cart, show plus-minus buttons, otherwise show "Add to Cart"
        if (quantity > 0) {
            cartBtn.innerHTML =
                `<button class="decrease-btn">-</button>
                <span class="quantity">${quantity}</span>
                <button class="increase-btn">+</button>`;
        } else {
            cartBtn.textContent = "Add to Cart";
        }

        // Update cart button UI
        const updateCartUI = () => {
            if (quantity > 0) {
                cartBtn.innerHTML =
                    `<button class="decrease-btn">-</button>
                    <span class="quantity">${quantity}</span>
                    <button class="increase-btn">+</button>`;
            } else {
                cartBtn.textContent = "Add to Cart";
            }

            // Attach event listeners
            const decreaseBtn = cartBtn?.querySelector(".decrease-btn");
            const increaseBtn = cartBtn?.querySelector(".increase-btn");

            decreaseBtn?.addEventListener("click", () => {
                if (quantity > 1) {
                    quantity--;
                    updateCartAPI(product.id, quantity);
                    updateCartUI();
                } else {
                    // Remove item from cart if quantity becomes zero
                    cartBtn.innerHTML = "";
                    cartBtn.textContent = "Add to Cart";
                    removeProductFromCartAPI(product.id);
                    quantity = 0; // Set quantity to 0
                    updateCartUI();
                }
            });

            increaseBtn?.addEventListener("click", () => {
                quantity++;
                updateCartAPI(product.id, quantity);
                updateCartUI();
            });
        };

        // Event listener for "Add to Cart"
        cartBtn.addEventListener("click", () => {
            if (quantity === 0) {
                quantity = 1; // Set quantity to 1 for the first time adding to cart
                updateCartAPI(product.id, quantity);
                updateCartUI(); // Update the button to reflect the new quantity
            }
        });

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
                    console.error('Failed to update cart');
                    alert('There was an error removing the product from your cart.');
                    return;
                }

                alert('Product removed from cart successfully!');

            } catch (error) {
                console.error('Error removing product from cart:', error);
                alert('There was an error removing the product from your cart.');
            }
        };

        updateCartUI();
        card.appendChild(cartBtn)
        grid.appendChild(card)
        return card;
    }

}

// Function to sort products based on selected criteria
function sortProducts(products, criteria) {
    switch (criteria) {
        case "rating-high-low":
            return products.sort((a, b) => parseFloat(b.rating_info.avg_rating) - parseFloat(a.rating_info.avg_rating));
        case "rating-low-high":
            return products.sort((a, b) => parseFloat(a.rating_info.avg_rating) - parseFloat(b.rating_info.avg_rating));
        case "price-low-high":
            return products.sort((a, b) => parseFloat(a.pricing.discount.prim_price.sp) - parseFloat(b.pricing.discount.prim_price.sp));
        case "price-high-low":
            return products.sort((a, b) => parseFloat(b.pricing.discount.prim_price.sp) - parseFloat(a.pricing.discount.prim_price.sp));
        case "saving-high-low":
            return products.sort((a, b) => (parseFloat(b.pricing.discount.mrp) - parseFloat(b.pricing.discount.prim_price.sp)) - (parseFloat(a.pricing.discount.mrp) - parseFloat(a.pricing.discount.prim_price.sp)));
        case "saving-low-high":
            return products.sort((a, b) => (parseFloat(a.pricing.discount.mrp) - parseFloat(a.pricing.discount.prim_price.sp)) - (parseFloat(b.pricing.discount.mrp) - parseFloat(b.pricing.discount.prim_price.sp)));
        case "percent-off-high-low":
            return products.sort((a, b) =>
                ((parseFloat(b.pricing.discount.mrp) - parseFloat(b.pricing.discount.prim_price.sp)) / parseFloat(b.pricing.discount.mrp)) -
                ((parseFloat(a.pricing.discount.mrp) - parseFloat(a.pricing.discount.prim_price.sp)) / parseFloat(a.pricing.discount.mrp))
            );
        case "percent-off-low-high":
            return products.sort((a, b) =>
                ((parseFloat(a.pricing.discount.mrp) - parseFloat(a.pricing.discount.prim_price.sp)) / parseFloat(a.pricing.discount.mrp)) -
                ((parseFloat(b.pricing.discount.mrp) - parseFloat(b.pricing.discount.prim_price.sp)) / parseFloat(b.pricing.discount.mrp))
            );
        default:
            return products;
    }


}



