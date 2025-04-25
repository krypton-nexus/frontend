import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import "../CSS/Merchandise.css";
import tshirt1 from "../Images/t shirt.jpg";
import cap2 from "../Images/cap2.jpg";
import cup1 from "../Images/cup.jpg";
import handband1 from "../Images/handband.jpg";
import handband2 from "../Images/handband2.jpg";
import bg from "../Images/marketplacebg.png";
import Sidebar from "../Components/SideBar";

const products = [
  {
    id: 1,
    name: "SESA T-Shirt",
    description: "Comfortable cotton t-shirt with club logo",
    price: "Rs. 1,200",
    originalPrice: "Rs. 1,500",
    image: tshirt1,
    discount: "20%",
  },
  {
    id: 2,
    name: "Club Cap",
    description: "Stylish cap with embroidered club emblem",
    price: "Rs. 800",
    originalPrice: "Rs. 1,000",
    image: cap2,
    discount: "20%",
  },
  {
    id: 3,
    name: "Club Cup",
    description: "Eco-friendly cup with club branding",
    price: "Rs. 600",
    originalPrice: "Rs. 800",
    image: cup1,
    discount: "25%",
  },
  {
    id: 4,
    name: "Club Hand Band",
    description: "Durable and stylish hand band",
    price: "Rs. 300",
    originalPrice: "Rs. 400",
    image: handband1,
    discount: "25%",
  },
  {
    id: 5,
    name: "Club Hand Band 2",
    description: "Durable and stylish hand band",
    price: "Rs. 300",
    originalPrice: "Rs. 400",
    image: handband2,
    discount: "25%",
  },
];

const Merchandise = () => {
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="view-events-container">
      <Sidebar />
      <div className="marketplace-container">
        <section className="hero-section">
          <div className="hero-top-bar">
            <div className="marketplace-cart-icon">
              <FaShoppingCart size={24} />
              <span className="cart-count">{cartCount}</span>
            </div>
          </div>
          <h1>Welcome to the Club Marketplace</h1>
          <p>
            Support our club by purchasing premium quality merchandise. Every
            purchase helps fund our activities and growth.
          </p>
          <button className="shop-now-button">Shop Now</button>
        </section>

        <section className="products-section">
          <h2>Premium Quality Club Merchandise</h2>
          <p>
            Each item in our collection is carefully crafted with premium
            materials to ensure the highest quality. Wear your club pride with
            our exclusive merchandise designed for comfort and style.
          </p>

          <div className="products-grid">
            {products.map((product, idx) => (
              <div className="product-card" key={idx}>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="price">{product.price}</p>
                <p className="description">{product.description}</p>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Merchandise;
