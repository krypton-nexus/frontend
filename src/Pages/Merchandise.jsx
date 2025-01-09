import React from "react";
import "../CSS/Merchandise.css";
import tshirt1 from "../Images/t shirt.jpg";
// import tshirt2 from "../Images/t shirt1.jpg";
import cap1 from "../Images/cap.jpg";
import cap2 from "../Images/cap2.jpg";
import cup1 from "../Images/cup.jpg";
import handband1 from "../Images/handband.jpg";
import handband2 from "../Images/handband2.jpg";

const Merchandise = () => {
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
      description: "Eco-friendly water bottle with club branding",
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
      name: "Club Cap",
      description: "Stylish cap with embroidered club emblem",
      price: "Rs. 800",
      originalPrice: "Rs. 1,000",
      image: cap2,
      discount: "20%",
    },
    {
      id: 6,
      name: "Club Cup",
      description: "Eco-friendly water bottle with club branding",
      price: "Rs. 600",
      originalPrice: "Rs. 800",
      image: tshirt1,
      discount: "25%",
    },
    {
      id: 7,
      name: "Club Hand Band",
      description: "Durable and stylish hand band",
      price: "Rs. 300",
      originalPrice: "Rs. 400",
      image: handband2,
      discount: "25%",
    },
    {
      id: 8,
      name: "Club Cup",
      description: "Eco-friendly water bottle with club branding",
      price: "Rs. 600",
      originalPrice: "Rs. 800",
      image: tshirt1,
      discount: "25%",
    },
  ];

  return (
    <div className="merchandise-container">
      <header className="merchandise-header">
        <h1>Discover Our Merchandise</h1>
        <p>Show your club spirit with our exclusive products</p>
      </header>
      <section className="products">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="pricing">
                <span className="discounted-price">{product.price}</span>
                <span className="original-price">{product.originalPrice}</span>
              </div>
              <div className="product-actions">
                <button className="add-to-cart">Add to Cart</button>
                <button className="wishlist">❤</button>
              </div>
              {/* {product.discount && (
                <span className="product-discount">{product.discount} OFF</span>
              )} */}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Merchandise;
