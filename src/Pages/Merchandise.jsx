import React, { useState, useEffect } from "react";
import "../CSS/Merchandise.css";
import SideBar from "../Components/SideBar";
import marketbanner from "../Images/marketbanner.png";

// Skeleton Loading Component
const ProductSkeleton = () => (
  <div className="product-card skeleton">
    <div className="skeleton-image"></div>
    <div className="product-info">
      <div className="skeleton-title"></div>
      <div className="skeleton-price"></div>
      <div className="skeleton-description"></div>
      <div className="skeleton-stock"></div>
      <div className="skeleton-button"></div>
    </div>
  </div>
);

const Merchandise = () => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://13.247.207.132:5000/merchandise/products"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [orders, setOrders] = useState([]);

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

  // Only implement createOrder API as requested
  const createOrder = async (orderData) => {
    try {
      const response = await fetch(
        "http://13.247.207.132:5000/merchandise/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: orderData.product_id,
            club_id: orderData.club_id,
            product_quantity: orderData.product_quantity,
            order_amount: orderData.order_amount,
            customer_name: orderData.customer_name,
            customer_email: orderData.customer_email,
            customer_phone: orderData.customer_phone,
            customer_address: orderData.customer_address,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      return await response.json();
    } catch (err) {
      console.error("Order creation error:", err);
      throw err;
    }
  };

  const completePurchase = async () => {
    if (
      !customerForm.name ||
      !customerForm.email ||
      !customerForm.phone ||
      !customerForm.address
    ) {
      alert("Please fill in all fields");
      return;
    }

    const orderData = {
      product_id: selectedProduct.id,
      club_id: selectedProduct.club_id,
      product_quantity: purchaseQuantity,
      order_amount: selectedProduct.product_price * purchaseQuantity,
      customer_name: customerForm.name,
      customer_email: customerForm.email,
      customer_phone: customerForm.phone,
      customer_address: customerForm.address,
    };

    try {
      // API call to create order
      const newOrder = await createOrder(orderData);

      // Update local state
      setOrders([
        ...orders,
        {
          ...newOrder,
          order_status: "Processing", // Default status
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      // Update product quantity locally
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

      alert("Order created successfully!");
      setShowPurchaseModal(false);
      resetCustomerForm();
    } catch (error) {
      alert("Failed to create order. Please try again.");
    }
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
            <img id="bannerImage" src={marketbanner} alt="Merchandise Banner" />
          </div>
          <h3>Discover amazing products from all our clubs</h3>
          <p>
            Support your favorite communities with every purchase — each item
            tells a story and builds a stronger club spirit!
          </p>

          {/* Show error message if there's an error */}
          {error && (
            <div className="error-message">
              <p>Error loading products: {error}</p>
              <button onClick={fetchProducts}>Retry</button>
            </div>
          )}

          <div className="products-grid">
            {loading ? (
              // Show skeleton loading when loading is true
              Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            ) : products.length > 0 ? (
              // Show actual products when loaded
              products.map((product) => (
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
                      disabled={product.product_quantity === 0}
                    >
                      {product.product_quantity === 0
                        ? "Out of Stock"
                        : "Purchase"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              // Show when no products are available
              <div className="no-products">
                <p>No products available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Merchandise;
