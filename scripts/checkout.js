// Functionality for tabs
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
    const allFieldsFilled = Array.from(form.querySelectorAll('input[required]')).every(input => input.value.trim() !== '');
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
  
  // Fetch cities on page load
  window.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('https://bubbly-adorable-hose.glitch.me/cities'); // Replace with the actual API URL
      cities = await response.json();
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  });
  