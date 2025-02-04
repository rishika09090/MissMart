# <img src="https://github.com/user-attachments/assets/28ea2568-30f7-49ac-9ba1-4c6f04125ed2" alt="Miss Mart Logo" width="200" height="200">  
# **Miss Mart** - Bigbasket Clone  

Welcome to **Miss Mart**, a fully functional e-commerce platform inspired by **Bigbasket**. Miss Mart offers an intuitive shopping experience with features like browsing products, adding items to the cart, and managing user accounts.

## Live Demo

👉 **[Miss Mart Live Website](https://rishika09090.github.io/MissMart/)** 👈  
(No need to clone or set up! Simply click the link to explore the app.)

---

## 🖼️ Screenshots

### Homepage  
![Homepage Screenshot](https://github.com/user-attachments/assets/73fa8021-bcd2-4976-9f11-c6c5f30b7bfe)
![Categories Dropdown](https://github.com/user-attachments/assets/acf11342-1801-47cc-98fe-908f56b5b911)
![Dynamic Categories Dropdown](https://github.com/user-attachments/assets/4226f2ea-5b52-4340-8cd8-9c97a5274fcc)
![Same Form Login/SignUp](https://github.com/user-attachments/assets/6b8fe9da-b0c9-484b-b2ab-8163f5b0b3e7)

### Product Listing  
![Product Listing Screenshot](https://github.com/user-attachments/assets/e947d461-59f9-4ba9-b8c3-8e7f8502a3d4)
![Add To Cart](https://github.com/user-attachments/assets/d8254e9a-0eaf-4176-b05c-47b445e76907)

### Cart Management  
![Cart Management Screenshot](https://github.com/user-attachments/assets/5449f130-88c5-4227-8f8a-a14ee419cbdd)

![Footer](https://github.com/user-attachments/assets/ecfbeb16-465b-41dc-9060-477db8adcad6)

### Payment Page
![image](https://github.com/user-attachments/assets/81f7a034-78a1-420c-a15d-04c6761e54e2)

---

## Features

### 🌟 Core Features
- **User Authentication**: Register and log in to manage your shopping experience.
- **Product Browsing**: View and filter a wide range of products by category, price, and more.
- **Search Functionality**: Quickly find products using keywords.
- **Add to Cart**: Add products to the cart, modify quantities, or remove items.
- **Sorting Options**: Sort products by rating, price, or discounts.
- **Dynamic Breadcrumbs**: Easy navigation through categories.

### 💻 Technical Highlights

- Dynamic cart updates stored in the backend for logged-in users, with real-time UI synchronization.
- API-powered filtering and sorting for fast and efficient data handling.
- Modular JavaScript structure with reusable components for better maintainability.
- User authentication with local storage to manage user sessions.
- Asynchronous data fetching using `fetch` API for seamless user interaction.
- Discount calculations, savings display, and dynamic product card rendering.
- RESTful backend services using `json-server` for realistic API simulations.

---

## Technologies Used

- **Frontend**:  
  - **HTML5**: For structuring the content.  
  - **CSS3**: For responsive and visually appealing designs.  
  - **JavaScript (ES6)**: For interactivity and dynamic content rendering.  

- **Backend**:  
  - **json-server**: A mock REST API for managing products, users, and carts.  

- **Deployment**:  
  - Hosted backend JSon Server using **Glitch** for live access.
  - Hosted frontend using **GitHub** for live access.

---

## How to Use

1. Open the live demo link: [Miss Mart](https://your-deployed-link-here).
2. Browse through the product categories or use the search bar.
3. Add products to your cart and adjust quantities as needed.
4. Log in or register to save your cart data.
5. Explore sorting options for ratings, price, and discounts.

---

## API Endpoints (Powered by `json-server`)

| Method | Endpoint             | Description                     |
|--------|-----------------------|---------------------------------|
| GET    | `/products`          | Fetch all products              |
| GET    | `/products/:id`      | Fetch product details by ID     |
| POST   | `/users`             | Create a new user               |
| POST   | `/users/login`       | Mock user login                 |
| PATCH  | `/users/:id`         | Update user data (e.g., cart)   |
| GET    | `/users/:id`         | Retrieve user details           |

---

## Future Enhancements

- **Payment Gateway Integration**: Add secure payment options for completing purchases.
- **Wishlist Feature**: Allow users to save items for future purchases.
- **Order History**: Enable users to view past orders.
- **Responsivness**: Fully responsive design for seamless usage across devices.
---

## Acknowledgments

- **Bigbasket**: For inspiring the design and functionality of this project.  
- **json-server**: For providing a simple and lightweight mock API.  

---

## License

This project is open-source and available under the MIT License.
