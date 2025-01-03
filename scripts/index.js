document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelector('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const leftArrow = document.querySelector('.arrow-left');
    const rightArrow = document.querySelector('.arrow-right');
    let currentIndex = 0;
    const totalSlides = indicators.length;
    const intervalTime = 3000; 


    function updateSlide(index) {
        slides.style.transform = `translateX(-${index * 100}%)`;
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }


    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlide(currentIndex);
    }


    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlide(currentIndex);
    }


    let slideInterval = setInterval(nextSlide, intervalTime);

    rightArrow.addEventListener('click', () => {
        clearInterval(slideInterval); 
        nextSlide();
        slideInterval = setInterval(nextSlide, intervalTime); 
    });

    leftArrow.addEventListener('click', () => {
        clearInterval(slideInterval);
        prevSlide();
        slideInterval = setInterval(nextSlide, intervalTime); 
    });

    indicators.forEach((indicator, i) => {
        indicator.addEventListener('click', () => {
            clearInterval(slideInterval);
            currentIndex = i;
            updateSlide(currentIndex);
            slideInterval = setInterval(nextSlide, intervalTime); 
        });
    });

    const basketItemsContainer = document.getElementById('basket-items');
    const leftArrowSmartBasket = document.querySelector('.view-all-arrow-button-left');
    const rightArrowSmartBasket = document.querySelector('.view-all-arrow-button-right');
    const viewAllButton = document.getElementById('view-all');
    console.log(leftArrowSmartBasket)
    console.log(rightArrowSmartBasket)

    const apiUrl = 'https://bubbly-adorable-hose.glitch.me/items';
    let allItems = [];
    let currentIndexSmartBasket = 0;
    const itemsPerPage = 4;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            allItems = data; 
            displayItems(currentIndex); 
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    function displayItems(startIndex) {
        const itemsToDisplay = allItems.slice(startIndex, startIndex + itemsPerPage);
        basketItemsContainer.innerHTML = ''; 
        itemsToDisplay.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('basket-item');

            const discount = item.originalPrice - item.price;
            const discountPercentage = (discount / item.originalPrice) * 100;

            itemElement.innerHTML = `
            <p class="discount">${discountPercentage.toFixed(0)}% OFF</p>
            <div class="item-image">
                <img src="${item.imageUrl}" alt="${item.name}">
            </div>
            <div class="item-details">
                <p>${item.brand}</p>            
                <p>${item.name}</p>
                <p class="price">₹${item.price} <span class="original-price">₹${item.originalPrice}</span></p>
                
                <div id="item-details-btn">
                    <button id="save-for-later-btn"><i class="fa-regular fa-bookmark"></i></button>
                    <button id="add-to-cart-btn">ADD</button>
                </div>
            </div>
        `;

            basketItemsContainer.appendChild(itemElement);
        });


        leftArrowSmartBasket.disabled = startIndex <= 0;
        rightArrowSmartBasket.disabled = startIndex + itemsPerPage >= allItems.length;
    }

    leftArrowSmartBasket.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex -= itemsPerPage;
            displayItems(currentIndex);
        }
    });

    rightArrowSmartBasket.addEventListener('click', () => {
        if (currentIndex + itemsPerPage < allItems.length) {
            currentIndex += itemsPerPage;
            displayItems(currentIndex);
        }
    });

    viewAllButton.addEventListener('click', () => {
        console.log('View All clicked');
        displayAllSmartBasketItems();
    });
    function displayAllSmartBasketItems() {
        window.location.href = "products.html"
    }
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.getElementById('close-modal');
    const body = document.body;

    loginBtn.addEventListener('click', () => {
        console.log("huuo")
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
        console.log(event)
        const username = document.getElementById('user-input').value;
        const password = document.getElementById('password').value;

        console.log('Username:', username, 'Password:', password);


        fetch("https://bubbly-adorable-hose.glitch.me/users")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Response:', data);
                let userExists = false;
                data.forEach(user => {
                    if (user.username === username && user.password === password) {
                        alert("login successful!");
                        localStorage.setItem("username", username);
                        localStorage.setItem("password", password);
                        closeModal.dispatchEvent(new Event('click'));
                        updateLoginButton();
                        userExists = true;
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
                        method: 'POST', // HTTP method
                        headers: {
                            'Content-Type': 'application/json', // Specify the content type
                        },
                        body: JSON.stringify({
                            username,
                            password,
                        }), // Convert your data to JSON
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json(); 
                        })
                        .then((data) => {
                            console.log('Response:', data); 
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
                console.log("huuo")
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
    }

    updateLoginButton();
})

