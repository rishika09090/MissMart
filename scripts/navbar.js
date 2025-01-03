document.getElementById("navbar").innerHTML = `<nav id="nav">
    <div id="top-nav">
        <a href="/" style="display: block; text-decoration: none;">

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
            <input type="search" placeholder="Search for Products...">

        </div>
        <div id="location-btn">
            <button>
                <i class="fa fa-compass"></i> Select Location
            </button>
        </div>
        <div id="login-signup-btn">
            <button id="login-btn">Login/Sign Up</button>
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
`


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
    console.log(categoryList)
    // Function to display the first 5 categories and add the dropdown button
    function displayInitialCategories(data) {
        const initialCategories = data.slice(0, 5); // First 5 categories
        const remainingCategories = data.slice(5); // Remaining categories

        // Append the first 5 categories
        initialCategories.forEach(category => {
            const categoryItem = createCategoryElement(category);
            categoryList.appendChild(categoryItem);
        });

        // Add the dropdown button
        const dropdownContainer = document.createElement('div');
        dropdownContainer.classList.add('dropdown-container');

        const dropdownButton = document.createElement('div');
        dropdownButton.innerHTML = '<i class="fas fa-angle-double-right"></i>'; // Add icon using Font Awesome class
        dropdownButton.classList.add('category-item');
        // dropdownButton.textContent = '\uf101'; // Unicode for double right arrow
        dropdownButton.style.fontFamily = "Font Awesome 5 Free"; // Set Font Awesome font
        dropdownButton.style.fontWeight = "900"; // Use appropriate font weight
        dropdownButton.style.textAlign = 'center';
        dropdownButton.style.fontSize = '22px';
        dropdownButton.style.cursor = 'pointer';

        // Dropdown menu for remaining categories
        const dropdownMenu = document.createElement('div');
        dropdownMenu.classList.add('dropdown-menu');
        dropdownMenu.style.display = 'none'; // Initially hidden
        dropdownMenu.style.position = 'absolute';
        dropdownMenu.style.backgroundColor = '#fff';
        dropdownMenu.style.border = '1px solid #ddd';
        dropdownMenu.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';
        dropdownMenu.style.padding = '10px';
        dropdownMenu.style.zIndex = '10';

        // Append remaining categories to the dropdown menu
        remainingCategories.forEach(category => {
            const dropdownItem = createCategoryElement(category);
            dropdownItem.style.padding = '15px 10px';
            dropdownItem.style.borderBottom = '1px solid #eee';
            dropdownItem.style.cursor = 'pointer';
            dropdownItem.classList.add('category-item', 'category-item-dropdown')
            dropdownMenu.appendChild(dropdownItem);
        });

        // Toggle dropdown menu visibility on click
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

    // Helper function to create a category element
    function createCategoryElement(category) {
        const categoryItem = document.createElement('div');
        categoryItem.classList.add('category-item');
        categoryItem.textContent = category.display_name;

        // Add click event to navigate to the URL
        categoryItem.addEventListener('click', () => {
            window.open(category.url, '_blank'); // Open link in a new tab
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
    // const dropdown = document.getElementById('category-list');

    function createDropdown(data, parent) {
        if(data){
            data.forEach(item => {
                const dropdownItem = document.createElement('div');
                dropdownItem.classList.add('dropdown-item');
                dropdownItem.textContent = item.name;
          
                if (item.children && item.children.length > 0) {
                  const childDropdown = document.createElement('div');
                  childDropdown.classList.add('dropdown-child');
                  createDropdown(item.children, childDropdown);
                  dropdownItem.appendChild(childDropdown);
                }
          
                parent.appendChild(dropdownItem);
              });
        } else return;

      }
    
      // Initialize dropdown on button click
    //   document.querySelector('#shop-by-category-btn button').addEventListener('click', async () => {
    //     if (dropdown.style.display === 'none' || !dropdown.style.display) {
    //       dropdown.style.display = 'block';
    
    //       // Fetch data and create dropdown
    //       const data = await loadCategories();
    //       dropdown.innerHTML = ''; // Clear existing content
    //       createDropdown(data, dropdown);
    //     } else {
    //       dropdown.style.display = 'none';
    //     }
    //   });
}   
