
function openTab(event, tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.add('hidden'));

    document.getElementById(tabId).classList.remove('hidden');

    const buttons = document.querySelectorAll('.tab-link');
    buttons.forEach(btn => btn.classList.remove('active'));

    event.currentTarget.classList.add('active');
}


const form = document.getElementById('address-form');
const nextButton = document.getElementById('next-to-delivery');

form.addEventListener('input', () => {
    const allFieldsFilled = Array.from(form.querySelectorAll('input[required]')).every(input => input.value.trim() !== '' || input.value.trim() !== null);
    nextButton.disabled = !allFieldsFilled;
});


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


window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://bubbly-adorable-hose.glitch.me/cities'); 
        cities = await response.json();

        const username = localStorage.getItem("username");
        if (!username) {
            alert("No user logged in");
            return;
        }

        
        const userResponse = await fetch(`https://bubbly-adorable-hose.glitch.me/users?username=${username}`);
        const users = await userResponse.json();
        if (users.length === 0) {
            alert("User not found");
            return;
        }

        const user = users[0];
        const cart = user.cart || [];

        
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




    
    const addressForm = document.getElementById('address-form');
    const nextToDeliveryButton = document.getElementById('next-to-delivery');

    addressForm.addEventListener('input', () => {
        const allFieldsFilled = Array.from(addressForm.querySelectorAll('input[required]')).every(input => input.value.trim() !== '' || input.value.trim() !== null);
        nextToDeliveryButton.disabled = !allFieldsFilled;
    });

    
    nextToDeliveryButton.addEventListener('click', async () => {
        
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

            
            const userResponse = await fetch(`https://bubbly-adorable-hose.glitch.me/users?username=${username}`);
            const users = await userResponse.json();
            if (users.length === 0) {
                alert("User not found");
                return;
            }

            const user = users[0];

            
            user.address = address;
            await fetch(`https://bubbly-adorable-hose.glitch.me/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address }),
            });

            
            document.querySelector('.tab-link.active').disabled = true;
            document.querySelector('.tab-link:nth-child(2)').disabled = false;
            openTab({ currentTarget: document.querySelector('.tab-link:nth-child(2)') }, 'delivery-tab');
        } catch (error) {
            console.error('Error updating address:', error);
        }
    });

    
    const deliveryTab = document.getElementById('delivery-tab');
    const nextToPaymentButton = document.getElementById('next-to-payment');

    deliveryTab.addEventListener('input', () => {
        const deliveryDate = document.getElementById('delivery-date').value.trim();
        const deliveryTime = document.getElementById('delivery-time').value.trim();
        nextToPaymentButton.disabled = !(deliveryDate && deliveryTime);
    });

    
    nextToPaymentButton.addEventListener('click', () => {
        
        document.querySelector('.tab-link.active').disabled = true;
        document.querySelector('.tab-link:nth-child(3)').disabled = false;
        openTab({ currentTarget: document.querySelector('.tab-link:nth-child(3)') }, 'payment-tab');
    });

});

async function initializePaymentTab() {
    try {
        
        const billAmount = document.querySelector('.billAmount').textContent.trim().replace('₹', '');
        const qrCodeContainer = document.getElementById('qr-code-container');
        console.log(billAmount)

        qrCodeContainer.innerHTML = ""
        
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


const nextToPaymentButton = document.getElementById('next-to-payment');
nextToPaymentButton.addEventListener('click', () => {
    openTab({ currentTarget: document.querySelector('.tab-link:nth-child(3)') }, 'payment-tab');
    initializePaymentTab();
});
