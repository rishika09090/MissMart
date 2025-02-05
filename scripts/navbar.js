document.getElementById("navbar").innerHTML = `<nav id="nav">
    <div id="top-nav">
        <a href="index.html" style="display: block; text-decoration: none;">

            <div id="logo">
                <div>
                    <img src="./assets/navLogo.png" alt="MissMart logo" width="50px">
                    <span id="logo-name">
                        <span>
                            <span id="miss">Miss</span>
                            Mart
                        </span>
                    </span>
                </div>
                <span id="logoDesc">Where Fresh Meets Fabulous!!</span>
            </div>
        </a>

        <div id="search-box">
            <i class="fa fa-search"></i>
            <input id="search-input" type="search" placeholder="Search for Products...">

        </div>
        <div id="location-btn">
            <button>
                <i class="fa fa-compass"></i> Select Location
            </button>
        </div>
        <div id="login-signup-btn">
            <button id="login-btn">Login/Sign Up</button>
        </div>
        <div id="cart-btn">
            <button>
                <i class="fa fa-shopping-cart"></i>
            </button>
        </div>
    </div>

    <div id="bottom-nav">
        <div id="shop-by-category-btn">
            <button>
                <span>Shop By Category</span>
                <i class="fa fa-caret-down"></i>
            </button>
        </div>

        <!-- Container for dynamically inserted categories -->
        <div id="category-list" class="category-list">
            <!-- Categories will be inserted here -->
        </div>
    </div>
</nav>
<div id="dropdown"></div>
    <!-- Login/Signup Modal -->
    <div id="login-modal">
        <div id="modal-content">
            <button id="close-modal">&times;</button>
            <div id="form-section">
                <h2>Login/Sign up</h2>
                <form id="login-form">
                    <label for="user-input">Enter Phone number / Email Id</label>
                    <input type="text" id="user-input" placeholder="Phone number / Email Id">
                    <input type="password" name="" id="password" placeholder="Password">
                    <button type="submit">Continue</button>
                </form>
                <p>
                    By continuing, I accept the
                    <a href="#">Terms and Conditions</a> & <a href="#">Privacy Policy</a>.
                    This site is protected by reCAPTCHA and the Google - Privacy Policy and & Terms of Service apply.
                </p>
            </div>
        </div>
    </div>
`

document.getElementById('cart-btn').addEventListener('click', function () {
    window.location.href = 'cart.html';
});

const navbar = document.getElementById("nav");
if (navbar) {
    fetch("https://bubbly-adorable-hose.glitch.me/top_links")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            displayInitialCategories(data);
        })
        .catch((error) => {
            console.error("There was an error with the fetch operation:", error);
        });

    const categoryList = document.getElementById('category-list');
    
    function displayInitialCategories(data) {
        const initialCategories = data.slice(0, 5); 
        const remainingCategories = data.slice(5); 

        
        initialCategories.forEach(category => {
            const categoryItem = createCategoryElement(category);
            categoryList.appendChild(categoryItem);
        });

        
        const dropdownContainer = document.createElement('div');
        dropdownContainer.classList.add('dropdown-container');

        const dropdownButton = document.createElement('div');
        dropdownButton.innerHTML = '<i class="fas fa-angle-double-right"></i>'; 
        dropdownButton.classList.add('category-item');
        
        dropdownButton.style.fontFamily = "Font Awesome 5 Free"; 
        dropdownButton.style.fontWeight = "900"; 
        dropdownButton.style.textAlign = 'center';
        dropdownButton.style.fontSize = '22px';
        dropdownButton.style.cursor = 'pointer';

        
        const dropdownMenu = document.createElement('div');
        dropdownMenu.classList.add('dropdown-menu');
        dropdownMenu.style.display = 'none'; 
        dropdownMenu.style.position = 'absolute';
        dropdownMenu.style.backgroundColor = '#fff';
        dropdownMenu.style.border = '1px solid #ddd';
        dropdownMenu.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';
        dropdownMenu.style.padding = '10px';
        dropdownMenu.style.zIndex = '10';

        
        remainingCategories.forEach(category => {
            const dropdownItem = createCategoryElement(category);
            dropdownItem.style.padding = '15px 10px';
            dropdownItem.style.borderBottom = '1px solid #eee';
            dropdownItem.style.cursor = 'pointer';
            dropdownItem.classList.add('category-item', 'category-item-dropdown')
            dropdownMenu.appendChild(dropdownItem);
        });

        
        dropdownButton.addEventListener('click', () => {
            if (dropdownMenu.style.display === 'none') {
                dropdownMenu.style.display = 'block';
            } else {
                dropdownMenu.style.display = 'none';
            }
        });

        dropdownContainer.appendChild(dropdownButton);
        dropdownContainer.appendChild(dropdownMenu);
        categoryList.appendChild(dropdownContainer);
    }

    
    function createCategoryElement(category) {
        const categoryItem = document.createElement('div');
        categoryItem.classList.add('category-item');
        categoryItem.textContent = category.display_name;
        
        categoryItem.addEventListener('click', () => {
            const categoryParams = new URLSearchParams({
                category: category.url.split('/').pop()
            });
            const targetUrl = `products.html?${categoryParams.toString()}`;
            window.location.href = targetUrl; 
        });

        return categoryItem;
    }

    document.getElementById('shop-by-category-btn').addEventListener('click', function () {
        const dropdownMenu = document.getElementById('dropdown');
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';

        if (!dropdownMenu.dataset.loaded) {
            loadCategories();
        }
    });

    async function loadCategories() {
        const apiUrl = 'https://bubbly-adorable-hose.glitch.me/categories';
        try {
            const response = await fetch(apiUrl);
            const categories = await response.json();
            createDropdown(categories, document.getElementById('dropdown'));
            document.getElementById('dropdown').dataset.loaded = true;
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }
    

    function createDropdown(data, parent) {
        if (data) {
            data.forEach(item => {
                const dropdownItem = document.createElement('div');
                dropdownItem.classList.add('dropdown-item');
                dropdownItem.textContent = item.name;
    
                
                dropdownItem.addEventListener('click', () => {
                    
                    const searchParams = new URLSearchParams();
                    searchParams.set('category', item.slug);
                    
                    window.location.href = `products.html?${searchParams.toString()}`;
                });
    
                if (item.children && item.children.length > 0) {
                    const childDropdown = document.createElement('div');
                    childDropdown.classList.add('dropdown-child');
                    createDropdown(item.children, childDropdown);
                    dropdownItem.appendChild(childDropdown);
                }
    
                parent.appendChild(dropdownItem);
            });
        } else {
            return;
        }
    }
    

    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.getElementById('close-modal');
    const body = document.body;

    loginBtn.addEventListener('click', () => {
        loginModal.classList.add('active');
        body.classList.add('modal-active');
    });

    closeModal.addEventListener('click', () => {
        loginModal.classList.remove('active');
        body.classList.remove('modal-active');
    });

    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
            body.classList.remove('modal-active');
        }
    });


    const form = document.getElementById('login-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('user-input').value;
        const password = document.getElementById('password').value;



        fetch("https://bubbly-adorable-hose.glitch.me/users")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                let userExists = false;
                data.forEach(user => {
                    if (user.username === username && user.password === password) {
                        alert("login successful!");
                        localStorage.setItem("username", username);
                        localStorage.setItem("password", password);
                        closeModal.dispatchEvent(new Event('click'));
                        updateLoginButton();
                        userExists = true;
                        window.location.reload();
                        return;
                    }
                    else if (user.username === username && user.password !== password) {
                        alert("Incorrect password!")
                        userExists = true;
                        return;
                    }
                })
                if (!userExists) {
                    fetch('https://bubbly-adorable-hose.glitch.me/users', {
                        method: 'POST', 
                        headers: {
                            'Content-Type': 'application/json', 
                        },
                        body: JSON.stringify({
                            username,
                            password,
                        }), 
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then((data) => {
                            localStorage.setItem("username", username);
                            localStorage.setItem("password", password);
                            alert("Signup Successful!")
                            closeModal.dispatchEvent(new Event('click'));
                            updateLoginButton();
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                }
            })
            .catch((error) => {
                console.error(error);
            })




    });

    const loginButton = document.getElementById('login-btn');

    function updateLoginButton() {
        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');

        if (username && password) {
            loginButton.textContent = 'Logout';
            loginButton.onclick = logout;
        } else {
            loginButton.textContent = 'Login/Sign Up';
            loginButton.onclick = null;
            loginButton.addEventListener('click', () => {
                loginModal.classList.add('active');
                body.classList.add('modal-active');
            });

            closeModal.addEventListener('click', () => {
                loginModal.classList.remove('active');
                body.classList.remove('modal-active');
            });

            loginModal.addEventListener('click', (e) => {
                if (e.target === loginModal) {
                    loginModal.classList.remove('active');
                    body.classList.remove('modal-active');
                }
            });
        }
    }

    function logout() {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        alert('You have been logged out.');

        updateLoginButton();
        window.location.reload();
    }

    updateLoginButton();

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            const query = searchInput.value.trim();
            console.log(query)
            if (query) {
                const categoryParams = new URLSearchParams({
                    category: query
                });
                window.location.href = `products.html?${categoryParams.toString()}`;
            } else {
                alert('Please enter a search term');
            }
        }
    });
}   
