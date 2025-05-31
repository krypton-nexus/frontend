import React, { useState, useEffect } from "react";
import "../CSS/Merchandise.css";
import SideBar from "../Components/SideBar";
import marketbanner from "../Images/marketbanner.png";

const Merchandise = () => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);

  const [products, setProducts] = useState([
    {
      id: 1,
      product_name: "Club T-Shirt",
      product_price: 25.99,
      product_description: "Premium cotton t-shirt with club logo",
      product_image_link:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      product_quantity: 50,
      club_id: "CLUB001",
      created_at: "2024-01-10T08:00:00Z",
    },
    {
      id: 2,
      product_name: "Club Hoodie",
      product_price: 45.99,
      product_description: "Comfortable hoodie perfect for cold weather",
      product_image_link:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
      product_quantity: 30,
      club_id: "CLUB001",
      created_at: "2024-01-12T10:30:00Z",
    },
    {
      id: 3,
      product_name: "Club Mug",
      product_price: 12.99,
      product_description: "Ceramic mug with club branding",
      product_image_link:
        "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400",
      product_quantity: 100,
      club_id: "CLUB001",
      created_at: "2024-01-08T14:15:00Z",
    },
    {
      id: 4,
      product_name: "Club Water Bottle",
      product_price: 18.5,
      product_description: "Stainless steel water bottle with club emblem",
      product_image_link:
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
      product_quantity: 75,
      club_id: "CLUB001",
      created_at: "2024-01-14T16:45:00Z",
    },
    {
      id: 5,
      product_name: "Club Cap",
      product_price: 22.99,
      product_description: "Adjustable cap with embroidered club logo",
      product_image_link:
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400",
      product_quantity: 0,
      club_id: "CLUB001",
      created_at: "2024-01-16T09:20:00Z",
    },
  ]);

  const [orders, setOrders] = useState([
    {
      order_id: 1001,
      product_id: 1,
      club_id: "CLUB001",
      product_quantity: 2,
      order_amount: 51.98,
      customer_name: "John Doe",
      customer_email: "john.doe@example.com",
      customer_phone: "123-456-7890",
      customer_address: "123 Main Street, Apt 4B, Springfield, IL 62701",
      order_status: "Processing",
      created_at: "2024-01-15T14:30:00Z",
      updated_at: "2024-01-15T14:30:00Z",
    },
    {
      order_id: 1002,
      product_id: 2,
      club_id: "CLUB001",
      product_quantity: 1,
      order_amount: 45.99,
      customer_name: "Jane Smith",
      customer_email: "jane.smith@example.com",
      customer_phone: "098-765-4321",
      customer_address: "456 Oak Avenue, Springfield, IL 62702",
      order_status: "On Track",
      created_at: "2024-01-14T11:15:00Z",
      updated_at: "2024-01-15T09:20:00Z",
    },
    {
      order_id: 1003,
      product_id: 3,
      club_id: "CLUB001",
      product_quantity: 3,
      order_amount: 38.97,
      customer_name: "Mike Johnson",
      customer_email: "mike.johnson@example.com",
      customer_phone: "555-123-4567",
      customer_address: "789 Pine Road, Unit 12, Springfield, IL 62703",
      order_status: "Completed",
      created_at: "2024-01-13T16:45:00Z",
      updated_at: "2024-01-14T10:30:00Z",
    },
    {
      order_id: 1004,
      product_id: 4,
      club_id: "CLUB001",
      product_quantity: 2,
      order_amount: 37.0,
      customer_name: "Sarah Wilson",
      customer_email: "sarah.wilson@example.com",
      customer_phone: "333-987-6543",
      customer_address: "321 Elm Street, Springfield, IL 62704",
      order_status: "Processing",
      created_at: "2024-01-16T13:20:00Z",
      updated_at: "2024-01-16T13:20:00Z",
    },
    {
      order_id: 1005,
      product_id: 1,
      club_id: "CLUB001",
      product_quantity: 1,
      order_amount: 25.99,
      customer_name: "David Brown",
      customer_email: "david.brown@example.com",
      customer_phone: "777-555-1234",
      customer_address: "654 Maple Drive, Springfield, IL 62705",
      order_status: "Cancelled",
      created_at: "2024-01-12T08:10:00Z",
      updated_at: "2024-01-13T14:45:00Z",
    },
  ]);

  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const resetCustomerForm = () => {
    setCustomerForm({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
  };

  const handlePurchase = (product) => {
    setSelectedProduct(product);
    setPurchaseQuantity(1);
    setShowPurchaseModal(true);
  };

  const completePurchase = () => {
    if (
      !customerForm.name ||
      !customerForm.email ||
      !customerForm.phone ||
      !customerForm.address
    ) {
      alert("Please fill in all fields");
      return;
    }

    const newOrder = {
      order_id: Math.max(...orders.map((o) => o.order_id)) + 1,
      product_id: selectedProduct.id,
      club_id: "CLUB001",
      product_quantity: purchaseQuantity,
      order_amount: selectedProduct.product_price * purchaseQuantity,
      customer_name: customerForm.name,
      customer_email: customerForm.email,
      customer_phone: customerForm.phone,
      customer_address: customerForm.address,
      order_status: "Processing",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setOrders([...orders, newOrder]);

    setProducts(
      products.map((product) =>
        product.id === selectedProduct.id
          ? {
              ...product,
              product_quantity: product.product_quantity - purchaseQuantity,
            }
          : product
      )
    );

    alert("Purchase completed! Confirmation email sent.");
    setShowPurchaseModal(false);
    resetCustomerForm();
  };

  const cancelPurchase = () => {
    setShowPurchaseModal(false);
    resetCustomerForm();
    window.location.reload();
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.order_id === orderId
          ? {
              ...order,
              order_status: newStatus,
              updated_at: new Date().toISOString(),
            }
          : order
      )
    );
    alert("Order status updated! Email sent to customer.");
  };

  return (
    <div className="view-events-container">
      <SideBar />

      {showPurchaseModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Purchase {selectedProduct?.product_name}</h3>
            <div className="purchase-details">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct?.product_quantity}
                  value={purchaseQuantity}
                  onChange={(e) =>
                    setPurchaseQuantity(parseInt(e.target.value))
                  }
                />
              </div>
              <div className="total-price">
                Total: $
                {(selectedProduct?.product_price * purchaseQuantity).toFixed(2)}
              </div>
            </div>

            <div className="customer-form">
              <input
                type="text"
                placeholder="Full Name"
                value={customerForm.name}
                onChange={(e) =>
                  setCustomerForm({ ...customerForm, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                value={customerForm.email}
                onChange={(e) =>
                  setCustomerForm({ ...customerForm, email: e.target.value })
                }
              />
              <input
                type="tel"
                placeholder="Phone"
                value={customerForm.phone}
                onChange={(e) =>
                  setCustomerForm({ ...customerForm, phone: e.target.value })
                }
              />
              <textarea
                placeholder="Address"
                value={customerForm.address}
                onChange={(e) =>
                  setCustomerForm({
                    ...customerForm,
                    address: e.target.value,
                  })
                }
              />
            </div>

            <div className="modal-actions">
              <button className="complete-btn" onClick={completePurchase}>
                Complete Purchase
              </button>
              <button className="cancel-btn" onClick={cancelPurchase}>
                Cancel Purchase
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="merchandise-module">
        <div className="member-view">
          <div className="header">
            <h1>Merchandise Store</h1>
          </div>
          <div className="banner">
            <img
              src={marketbanner}
              alt="Merchandise Banner"
              className="banner-image"
            />
          </div>
          <h3>Discover amazing products from all our clubs</h3>
          <p>
            Support your favorite communities with every purchase — each item
            tells a story and builds a stronger club spirit!
          </p>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={product.product_image_link}
                  alt={product.product_name}
                />
                <div className="product-info">
                  <h3>{product.product_name}</h3>
                  <p className="price">${product.product_price}</p>
                  <p className="description">{product.product_description}</p>
                  <p className="stock">Stock: {product.product_quantity}</p>
                  <button
                    className="purchase-btn"
                    onClick={() => handlePurchase(product)}
                    disabled={product.product_quantity === 0}>
                    {product.product_quantity === 0
                      ? "Out of Stock"
                      : "Purchase"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Merchandise;
