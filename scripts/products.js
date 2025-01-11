let url = "https://bubbly-adorable-hose.glitch.me/products/"
let products = [];

let params = new URLSearchParams(new URL(window.location.href).search);

let category = params.get('category');
let sort = params.get('sort');

fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(data => {
        console.log(data)
        function searchInObject(obj, searchString) {
            
            const searchWords = searchString.toLowerCase().split(' ');

            
            function searchRecursive(obj) {
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        const value = obj[key];

                        
                        if (typeof value === 'object' && value !== null) {
                            if (searchRecursive(value)) return true;
                        }
                        
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

            
            return searchRecursive(obj);
        }
        products = data.filter(product => searchInObject(product, category));
        console.log(products)
        const pageTitle = document.querySelector('.page-header h1');
        pageTitle.textContent = products[0]?.category.mlc_name;
        const breadcrumb = document.querySelector('.breadcrumb');
        
        const categoryLevels = [
            { name: products[0]?.category.tlc_name, slug: products[0]?.category.tlc_slug },
            { name: products[0]?.category.mlc_name, slug: products[0]?.category.mlc_slug }
        ];

        
        categoryLevels.forEach((level, index) => {
            const anchor = document.createElement("a");
            anchor.innerText = level.name;
            anchor.href = `products.html?category=${encodeURIComponent(level.slug)}`; 

            
            if (index !== 0) breadcrumb.appendChild(document.createTextNode(" > "));
            breadcrumb.appendChild(anchor);
        });


        products = sortProducts(products, "rating-high-low");

        createProductCards(products);
    })
    .catch(error => {
        console.error('There was an error fetching the data:', error);
    });


const sortSelect = document.getElementById('sort-options');
sortSelect.addEventListener('change', (event) => {
    const selectedSort = event.target.value;
    
    const sortedData = sortProducts(products, selectedSort);
    createProductCards(sortedData);
});


function createProductCards(products) {
    const grid = document.getElementById("product-grid");
    grid.innerHTML = ''; 
    if (!products || products.length === 0) {
        grid.innerHTML = '';

        
        const noProductsImage = document.createElement('img');
        noProductsImage.src = 'https://www.bbassets.com/bb2assets/images/png/no-search-results-found.png?tr=w-374,q-80';
        noProductsImage.alt = 'No products found';
        noProductsImage.style.width = '100%';
        noProductsImage.style.maxWidth = '374px';
        noProductsImage.style.margin = '20px auto';
        noProductsImage.style.display = 'block';

        
        grid.appendChild(noProductsImage);
        return;
    }

    
    const loggedInUsername = localStorage.getItem('username');
    let userCart = [];

    
    if (loggedInUsername) {
        fetch('https://bubbly-adorable-hose.glitch.me/users')
            .then(response => response.json())
            .then(users => {
                const user = users.find(user => user.username === loggedInUsername);
                if (user && user.cart) {
                    userCart = user.cart; 
                }

                
                products.forEach(product => {
                    createCard(product, userCart);
                });
            })
            .catch(error => console.error('Error fetching user data:', error));
    } else {
        
        products.forEach(product => {
            createCard(product);
        });
    }

    
    function createCard(product, userCart = []) {

        
        const cartItem = userCart.find(item => item?.product?.id === product.id);
        let quantity = cartItem ? cartItem.quantity : 0;

        const card = document.createElement("div");
        card.classList.add("product-card");

        
        const mrp = parseInt(product.pricing.discount.mrp);
        const sp = parseInt(product.pricing.discount.prim_price.sp);
        if (mrp > sp) {
            const discountRibbon = document.createElement("div");
            discountRibbon.classList.add("discount-ribbon");
            const discountPercentage = Math.round(((mrp - sp) / mrp) * 100);
            discountRibbon.textContent = `${discountPercentage}% OFF`;
            card.appendChild(discountRibbon);
        }

        
        const img = document.createElement("img");
        img.src = product.images[0].s;
        card.appendChild(img);

        
        const brand = document.createElement("div");
        brand.classList.add("brand");
        brand.textContent = product.brand.name;
        card.appendChild(brand);

        
        const name = document.createElement("div");
        name.classList.add("name");
        name.textContent = product.desc;
        card.appendChild(name);

        
        const ratingInfo = product.rating_info;
        if (ratingInfo.avg_rating !== null && ratingInfo.rating_count !== null) {
            const ratingContainer = document.createElement("div");
            ratingContainer.classList.add("rating");

            
            const starIcon = document.createElement("span");
            starIcon.innerHTML = "&#9733;"; 
            starIcon.style.color = "#FFD700"; 
            starIcon.style.marginRight = "5px";
            ratingContainer.appendChild(starIcon);

            
            const averageRating = document.createElement("span");
            averageRating.textContent = ratingInfo.avg_rating;
            averageRating.style.marginRight = "10px";
            ratingContainer.appendChild(averageRating);

            
            const ratingCount = document.createElement("span");
            ratingCount.textContent = `(${ratingInfo.rating_count})`;
            ratingContainer.appendChild(ratingCount);

            
            card.appendChild(ratingContainer);
        }

        
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

        
        const moneySaved = document.createElement("div");
        moneySaved.classList.add("money-saved");
        const savedAmount = product.pricing.discount.mrp - product.pricing.discount.prim_price.sp;
        moneySaved.textContent = `You save: ₹${savedAmount.toFixed(2)}`;
        moneySaved.style.color = "green";
        card.appendChild(moneySaved);

        
        const saveBtn = document.createElement("button");
        saveBtn.classList.add("save-btn");

        
        const bookmarkIcon = document.createElement("i");
        bookmarkIcon.classList.add("fa", "fa-bookmark");
        saveBtn.appendChild(bookmarkIcon);
        card.appendChild(saveBtn);

        
        const cartBtn = document.createElement("button");
        cartBtn.classList.add("cart-btn");

        
        if (quantity > 0) {
            cartBtn.innerHTML =
                `<button class="decrease-btn">-</button>
                <span class="quantity">${quantity}</span>
                <button class="increase-btn">+</button>`;
        } else {
            cartBtn.textContent = "Add to Cart";
        }

        
        const updateCartUI = () => {
            if (quantity > 0) {
                cartBtn.innerHTML =
                    `<button class="decrease-btn">-</button>
                    <span class="quantity">${quantity}</span>
                    <button class="increase-btn">+</button>`;
            } else {
                cartBtn.textContent = "Add to Cart";
            }

            
            const decreaseBtn = cartBtn?.querySelector(".decrease-btn");
            const increaseBtn = cartBtn?.querySelector(".increase-btn");

            decreaseBtn?.addEventListener("click", () => {
                if (quantity > 1) {
                    quantity--;
                    updateCartAPI(product.id, quantity);
                    updateCartUI();
                } else {
                    
                    cartBtn.innerHTML = "";
                    cartBtn.textContent = "Add to Cart";
                    removeProductFromCartAPI(product.id);
                    quantity = 0; 
                    updateCartUI();
                }
            });

            increaseBtn?.addEventListener("click", () => {
                quantity++;
                updateCartAPI(product.id, quantity);
                updateCartUI();
            });
        };

        
        cartBtn.addEventListener("click", () => {
            if (quantity === 0) {
                quantity = 1; 
                updateCartAPI(product.id, quantity);
                updateCartUI(); 
            }
        });

        
        const updateCartAPI = async (productId, quantity) => {
            const loggedInUsername = localStorage.getItem('username');

            if (!loggedInUsername) {
                alert('You must be logged in to add products to your cart!');
                return;
            }

            try {
                
                const userResponse = await fetch('https://bubbly-adorable-hose.glitch.me/users');
                const users = await userResponse.json();
                const user = users.find(user => user.username === loggedInUsername);

                if (!user) {
                    alert('User not found!');
                    return;
                }

                
                if (!user.cart) {
                    user.cart = [];
                }

                
                const product = products.find(p => p.id === productId);
                if (!product) {
                    alert('Product not found!');
                    return;
                }

                
                const existingProductIndex = user.cart.findIndex(item => item.product.id === productId);

                if (existingProductIndex !== -1) {
                    
                    user.cart[existingProductIndex].quantity += quantity;
                } else {
                    
                    user.cart.push({
                        product: product,  
                        quantity: quantity,
                    });
                }

                
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
                updateCartUI(); 

            } catch (error) {
                console.error('Error updating cart:', error);
                alert('There was an error adding the product to your cart.');
            }
        };

        
        const removeProductFromCartAPI = async (productId) => {
            const loggedInUsername = localStorage.getItem('username');

            if (!loggedInUsername) {
                alert('You must be logged in to remove products from your cart!');
                return;
            }

            try {
                
                const userResponse = await fetch('https://bubbly-adorable-hose.glitch.me/users');
                const users = await userResponse.json();
                const user = users.find(user => user.username === loggedInUsername);

                if (!user) {
                    alert('User not found!');
                    return;
                }

                
                user.cart = user.cart.filter(item => item.product.id !== productId);

                
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



