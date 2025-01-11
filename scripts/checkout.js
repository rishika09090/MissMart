// Tabs functionality
function openTab(event, tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.add('hidden'));

    document.getElementById(tabId).classList.remove('hidden');

    const buttons = document.querySelectorAll('.tab-link');
    buttons.forEach(btn => btn.classList.remove('active'));

    event.currentTarget.classList.add('active');
}

// Enabling "Next" button only when all required fields are filled
const form = document.getElementById('address-form');
const nextButton = document.getElementById('next-to-delivery');

form.addEventListener('input', () => {
    const allFieldsFilled = Array.from(form.querySelectorAll('input[required]')).every(input => input.value.trim() !== '' || input.value.trim() !== null);
    nextButton.disabled = !allFieldsFilled;
});

// City suggestions functionality
let cities = [];
const cityInput = document.getElementById('city');
const citySuggestions = document.getElementById('city-suggestions');

cityInput.addEventListener('input', () => {
    const query = cityInput.value.toLowerCase();
    citySuggestions.innerHTML = '';

    if (query) {
        const filteredCities = cities.filter(city => city.toLowerCase().includes(query));
        filteredCities.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.addEventListener('click', () => {
                cityInput.value = city;
                citySuggestions.innerHTML = '';
            });
            citySuggestions.appendChild(li);
        });
        citySuggestions.style.display = filteredCities.length ? 'block' : 'none';
    } else {
        citySuggestions.style.display = 'none';
    }
});

const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal"
];

const stateInput = document.getElementById('state');
const stateSuggestions = document.getElementById('state-suggestions');
stateInput.addEventListener('input', () => {
    const query = stateInput.value.toLowerCase();
    stateSuggestions.innerHTML = '';

    if (query) {
        const filteredStates = states.filter(state => state.toLowerCase().includes(query));
        filteredStates.forEach(state => {
            const li = document.createElement('li');
            li.textContent = state;
            li.addEventListener('click', () => {
                stateInput.value = state;
                stateSuggestions.innerHTML = '';
            });
            stateSuggestions.appendChild(li);
        });
        stateSuggestions.style.display = filteredStates.length ? 'block' : 'none';
    } else {
        stateSuggestions.style.display = 'none';
    }
});

// Fetch cities on page load and fetch user cart
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://bubbly-adorable-hose.glitch.me/cities'); // Replace with the actual API URL
        cities = await response.json();

        const username = localStorage.getItem("username");
        if (!username) {
            alert("No user logged in");
            return;
        }

        // Fetch user data
        const userResponse = await fetch(`https://bubbly-adorable-hose.glitch.me/users?username=${username}`);
        const users = await userResponse.json();
        if (users.length === 0) {
            alert("User not found");
            return;
        }

        const user = users[0];
        const cart = user.cart || [];

        // Dynamically display cart items
        const cartItemsContainer = document.getElementById('cart-items');
        let totalAmount = 0;
        let totalSavings = 0;

        cart.forEach(item => {
            const originalPrice = parseInt(item.product.pricing.discount.mrp);
            const sellingPrice = parseInt(item.product.pricing.discount.prim_price.sp);
            const savings = (originalPrice - sellingPrice) * item.quantity;

            totalAmount += sellingPrice * item.quantity;
            totalSavings += savings;
        });
        const billAmountElements = document.querySelectorAll('.billAmount');
        billAmountElements.forEach(element => {
            element.textContent = `₹${totalAmount.toFixed(2)}`;
        });
        const savingsAmountElements = document.querySelectorAll('.savings');
        savingsAmountElements.forEach(element => {
            element.textContent = `₹${totalSavings.toFixed(2)}`;
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }




    // Enable "Next" button for Address Tab
    const addressForm = document.getElementById('address-form');
    const nextToDeliveryButton = document.getElementById('next-to-delivery');

    addressForm.addEventListener('input', () => {
        const allFieldsFilled = Array.from(addressForm.querySelectorAll('input[required]')).every(input => input.value.trim() !== '' || input.value.trim() !== null);
        nextToDeliveryButton.disabled = !allFieldsFilled;
    });

    // Handle "Next" button click in Address Tab
    nextToDeliveryButton.addEventListener('click', async () => {
        // Prepare address object
        const address = {
            name: document.getElementById('name').value.trim(),
            mobile: document.getElementById('mobile').value.trim(),
            state: document.getElementById('state').value.trim(),
            city: document.getElementById('city').value.trim(),
            area: document.getElementById('area').value.trim(),
            landmark: document.getElementById('landmark').value.trim(),
            house: document.getElementById('house').value.trim(),
            pincode: document.getElementById('pincode').value.trim(),
            type: document.querySelector('input[name="address-type"]:checked').value,
        };
        console.log(address)
        try {
            const username = localStorage.getItem("username");
            if (!username) {
                alert("No user logged in");
                return;
            }

            // Fetch user object
            const userResponse = await fetch(`https://bubbly-adorable-hose.glitch.me/users?username=${username}`);
            const users = await userResponse.json();
            if (users.length === 0) {
                alert("User not found");
                return;
            }

            const user = users[0];

            // Update user with new address
            user.address = address;
            await fetch(`https://bubbly-adorable-hose.glitch.me/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address }),
            });

            // Show Delivery Options tab
            document.querySelector('.tab-link.active').disabled = true;
            document.querySelector('.tab-link:nth-child(2)').disabled = false;
            openTab({ currentTarget: document.querySelector('.tab-link:nth-child(2)') }, 'delivery-tab');
        } catch (error) {
            console.error('Error updating address:', error);
        }
    });

    // Enable "Next" button for Delivery Options Tab
    const deliveryTab = document.getElementById('delivery-tab');
    const nextToPaymentButton = document.getElementById('next-to-payment');

    deliveryTab.addEventListener('input', () => {
        const deliveryDate = document.getElementById('delivery-date').value.trim();
        const deliveryTime = document.getElementById('delivery-time').value.trim();
        nextToPaymentButton.disabled = !(deliveryDate && deliveryTime);
    });

    // Handle "Next" button click in Delivery Options Tab
    nextToPaymentButton.addEventListener('click', () => {
        // Show Payment tab
        document.querySelector('.tab-link.active').disabled = true;
        document.querySelector('.tab-link:nth-child(3)').disabled = false;
        openTab({ currentTarget: document.querySelector('.tab-link:nth-child(3)') }, 'payment-tab');
    });

});

async function initializePaymentTab() {
    try {
        // Calculate total amount
        const billAmount = document.querySelector('.billAmount').textContent.trim().replace('₹', '');
        const qrCodeContainer = document.getElementById('qr-code-container');
        console.log(billAmount)

        qrCodeContainer.innerHTML = ""
        // Generate a QR Code with UPI link or static data
        const upiLink = `upi://pay?pa=7999674838@ybl&pn=MissMart&am=1&cu=INR`;
        new QRCode(qrCodeContainer, {
            text: upiLink,
            width: 150,
            height: 150,
        });
    } catch (error) {
        console.error('Error generating QR Code:', error);
    }
}

// Initialize Payment Tab on Activation
const nextToPaymentButton = document.getElementById('next-to-payment');
nextToPaymentButton.addEventListener('click', () => {
    openTab({ currentTarget: document.querySelector('.tab-link:nth-child(3)') }, 'payment-tab');
    initializePaymentTab();
});
