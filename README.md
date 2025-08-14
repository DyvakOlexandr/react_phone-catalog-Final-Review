# Product Catalog

Welcome to **Product Catalog**, a fully-featured e-commerce application built with React. This project showcases my skills in building Single Page Applications (SPA), state management, routing, and working with APIs.

- [DEMO LINK](https://DyvakOlexandr.github.io/react_phone-catalog-Final-Review/)

## About the Project

Product Catalog is an interactive and responsive online store that allows users to browse different product categories (phones, tablets, accessories), filter them, add items to favorites and a shopping cart, and view detailed information for each product.

## Key Features

  * **Navigation and Layout:**
      * **Header:** A sticky header with a logo, navigation links, and icons for favorites and the shopping cart.
      * **Footer:** A footer with a link to the GitHub repository and a smooth-scrolling "Back to top" button.
      * **404 Page:** A dedicated "Page not found" page for any unknown URLs.
  * **Home Page (`/`):**
      * **Image Slider:** An automatically-rotating image slider that can also be navigated manually.
      * **Product Sliders:** Separate sliders for "Hot prices" (discounted items) and "Brand new products" (newest items).
      * **Categories:** A "Shop by category" block with links to category pages.
  * **Category Pages (`/phones`, `/tablets`, `/accessories`):**
      * **Dynamic Loading:** Data is loaded dynamically based on the selected category.
      * **Sorting:** Users can sort products by price, newest, or alphabetically, with the sorting state saved in the URL.
      * **Pagination:** Products are divided into pages, with options to display 4, 8, 16, or all items. Pagination parameters are also saved in the URL.
      * **State Handling:** A loader is shown during data fetching, and appropriate messages are displayed for errors or when no products are available.
  * **Product Details Page (`/product/:productId`):**
      * **Breadcrumbs:** A breadcrumb navigation trail for easy browsing.
      * **Product Details:** Detailed product specifications, available colors, and storage capacities.
      * **Image Gallery:** The ability to select and view different product images.
      * **"You may also like" block:** A section with a selection of randomly chosen products.
      * **"Back" button:** Mimics the browser's back button functionality.
  * **Favorites Page (`/favorites`):**
      * **Saving:** Products can be added to and removed from favorites using a heart icon.
      * **Persistence:** Favorites are stored in **`localStorage`** to persist between sessions.
      * **Counter:** The number of favorite items is displayed in the header.
  * **Shopping Cart Page (`/cart`):**
      * **Adding:** An "Add to cart" button adds products to the cart.
      * **Management:** Users can change the quantity of items or remove them from the cart.
      * **Counter:** The number of items in the cart is displayed in the header.
      * **Total Calculation:** The total cost and quantity are automatically calculated.
      * **Persistence:** Cart items are stored in **`localStorage`**.
      * **Checkout:** A "Checkout" button triggers a modal with a confirmation dialog.
  * **Search (Optional):**
      * **Search Bar:** A search bar appears on pages containing a product list.
      * **Debounce:** The search functionality includes a debounce to optimize API calls.
      * **State Persistence:** The search query is saved as a URL parameter.

-----

### **Advanced Features**

The following advanced features have been successfully implemented in this project:

  * **Color Theme Switching:** The application supports both light and dark color themes, allowing users to customize the interface to their preference. A theme-switcher is available in the header.
  * **Skeleton Loaders:** To enhance the user experience, skeleton loaders are used during data fetching. They visually occupy the space where content will appear, making the loading process feel smoother and more predictable.
  * **Multi-language Support:** The application's interface has been adapted to support multiple languages, making it accessible to a wider audience.
  * 
### **How to Run the Project:**
To run this project locally, follow these steps:
**Viewing on GitHub Pages**
The project is hosted on GitHub Pages and can be accessed directly at the following URL:
https://DyvakOlexandr.github.io/react_phone-catalog-Final-Review/
   1. **Clone the repository:**
   git clone https://github.com/DyvakOlexandr/react_phone-catalog-Final-Review.git
   cd react_phone-catalog-Final-Review
   2.**Install dependencies:**
     npm install
     # or
     yarn install
   3. **Start the development server:**
     The application will launch in development mode.
     npm start
     # or
    yarn start
