function injectFooter() {
    const footerHTML = `
      <div id="footer">
        <div class="footer-content">
          <!-- Logo and About Section -->
          <div class="footer-section">
            <img src="./assets/logo.png" alt="Miss Mart Logo" class="footer-logo">
            <h2>Miss Mart</h2>
            <h3> Where Fresh Meets Fabulous!! </h3>
            
          </div>
  
          <!-- Popular Categories Section -->
          <div class="footer-section ">
            <h3>Popular Categories</h3>
            <ul>
              <li>Sunflower Oils</li>
              <li>Wheat Atta</li>
              <li>Ghee</li>
              <li>Milk</li>
              <li>Health Drinks</li>
              <li>Flakes</li>
              <li>Organic F&V</li>
              <li>Namkeen</li>
              <li>Eggs</li>
              <li>Floor Cleaners</li>
              <li>Other Juices</li>
              <li>Leafy Vegetables</li>
              <li>Frozen Veg Food</li>
              <li>Diapers & Wipes</li>
            </ul>
          </div>
  
          <!-- Popular Brands Section -->
          <div class="footer-section brands">
            <h3>Popular Brands</h3>
            <ul>
              <li>Amul</li>
              <li>Nescafe</li>
              <li>MTR</li>
              <li>Red Bull</li>
              <li>elite cake</li>
              <li>Pediasure</li>
              <li>Yummiez</li>
              <li>Yera</li>
              <li>Yakult</li>
              <li>Britannia</li>
              <li>Wow! Momo</li>
              <li>Fortune</li>
              <li>Haldiram's</li>
              <li>Ferrero</li>
              <li>Lay's</li>
              <li>Patanjali</li>
              <li>McCain</li>
              <li>kwality wallss</li>
              <li>Cadbury Dairy Milk</li>
              <li>Pedigree</li>
              <li><a href="#">Show more +</a></li>
            </ul>
          </div>
  
          <!-- Social Media Section -->
          <div class="footer-section social">
            <h3>Follow Us</h3>
            <div class="social-links">
              <a href="https://facebook.com" target="_blank"><i class="fab fa-facebook"></i> Facebook</a>
              <a href="https://twitter.com" target="_blank"><i class="fab fa-twitter"></i> Twitter</a>
              <a href="https://instagram.com" target="_blank"><i class="fab fa-instagram"></i> Instagram</a>
            </div>
          </div>
        </div>
  
        <!-- Footer Bottom Section -->
        <div class="footer-bottom">
          &copy; 2024-2026 Supermarket Grocery Supplies Pvt Ltd
        </div>
      </div>
    `;
  
    const footerContainer = document.getElementById("footer-container");
    footerContainer.innerHTML = footerHTML;
  }
  
  document.addEventListener("DOMContentLoaded", injectFooter);
  