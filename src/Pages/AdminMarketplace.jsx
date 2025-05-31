import React, { useState, useEffect } from "react";
import { FaPlus, FaClipboardList, FaBoxOpen, FaUsers } from "react-icons/fa";
import AdminSidebar from "../Components/AdminSidebar";
import "../CSS/AdminMarketplace.css";
import { useNavigate } from "react-router-dom";

const AdminMarketplace = () => {
  const navigate = useNavigate();

  const [activeAdminTab, setActiveAdminTab] = useState("dashboard");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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

  const [productForm, setProductForm] = useState({
    product_name: "",
    product_price: "",
    product_description: "",
    product_image_link: "",
    product_quantity: "",
  });

  const getProductNameById = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.product_name : "Unknown Product";
  };

  const resetProductForm = () => {
    setProductForm({
      product_name: "",
      product_price: "",
      product_description: "",
      product_image_link: "",
      product_quantity: "",
    });
  };

  const handleAddProduct = () => {
    if (
      !productForm.product_name ||
      !productForm.product_price ||
      !productForm.product_quantity
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const newProduct = {
      id: Math.max(...products.map((p) => p.id)) + 1,
      product_name: productForm.product_name,
      product_price: parseFloat(productForm.product_price),
      product_description: productForm.product_description,
      product_image_link:
        productForm.product_image_link ||
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      product_quantity: parseInt(productForm.product_quantity),
      club_id: "CLUB001",
      created_at: new Date().toISOString(),
    };

    setProducts([...products, newProduct]);
    setShowProductForm(false);
    resetProductForm();
    alert("Product added successfully!");
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      product_name: product.product_name,
      product_price: product.product_price.toString(),
      product_description: product.product_description,
      product_image_link: product.product_image_link,
      product_quantity: product.product_quantity.toString(),
    });
    setShowProductForm(true);
  };

  const handleUpdateProduct = () => {
    if (
      !productForm.product_name ||
      !productForm.product_price ||
      !productForm.product_quantity
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setProducts(
      products.map((product) =>
        product.id === editingProduct.id
          ? {
              ...product,
              product_name: productForm.product_name,
              product_price: parseFloat(productForm.product_price),
              product_description: productForm.product_description,
              product_image_link: productForm.product_image_link,
              product_quantity: parseInt(productForm.product_quantity),
            }
          : product
      )
    );

    setShowProductForm(false);
    setEditingProduct(null);
    resetProductForm();
    alert("Product updated successfully!");
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((product) => product.id !== productId));
      alert("Product deleted successfully!");
    }
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

  const getTotalProducts = () => products.length;
  const getTotalOrders = () => orders.length;
  const getOrderCountsByStatus = () => {
    const counts = {};
    orders.forEach((order) => {
      counts[order.order_status] = (counts[order.order_status] || 0) + 1;
    });
    return counts;
  };
  const getRecentOrders = () => orders.slice(-5).reverse();

  const renderAdminDashboard = () => {
    const statusCounts = getOrderCountsByStatus();
    const recentOrders = getRecentOrders();

    return (
      <div className="admin-dashboard">
        <h3>Dashboard</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Products</h4>
            <div className="stat-number">{getTotalProducts()}</div>
          </div>
          <div className="stat-card">
            <h4>Total Orders</h4>
            <div className="stat-number">{getTotalOrders()}</div>
          </div>
          <div className="stat-card">
            <h4>Processing Orders</h4>
            <div className="stat-number">{statusCounts.Processing || 0}</div>
          </div>
          <div className="stat-card">
            <h4>Completed Orders</h4>
            <div className="stat-number">{statusCounts.Completed || 0}</div>
          </div>
        </div>

        <div className="order-status-summary">
          <h4>Orders by Status</h4>
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="status-item">
              <span className="status-label">{status}:</span>
              <span className="status-count">{count}</span>
            </div>
          ))}
        </div>

        <div className="recent-orders">
          <h4>Recent Orders</h4>
          <div className="orders-table">
            <div className="table-header">
              <span>Customer</span>
              <span>Product</span>
              <span>Quantity</span>
              <span>Amount</span>
              <span>Status</span>
            </div>
            {recentOrders.map((order) => (
              <div key={order.order_id} className="table-row">
                <span>{order.customer_name}</span>
                <span>{getProductNameById(order.product_id)}</span>
                <span>{order.product_quantity}</span>
                <span>${order.order_amount}</span>
                <span
                  className={`status ${order.order_status
                    .toLowerCase()
                    .replace(" ", "-")}`}>
                  {order.order_status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderProductManagement = () => (
    <div className="product-management">
      <div className="section-header">
        <h3>Product Management</h3>
        <button className="add-btn" onClick={() => setShowProductForm(true)}>
          Add Product
        </button>
      </div>

      <div className="products-table">
        <div className="table-header">
          <span>Image</span>
          <span>Name</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Actions</span>
        </div>
        {products.map((product) => (
          <div key={product.id} className="table-row">
            <img
              src={product.product_image_link}
              alt={product.product_name}
              className="product-thumbnail"
            />
            <span>{product.product_name}</span>
            <span>${product.product_price}</span>
            <span>{product.product_quantity}</span>
            <div className="actions">
              <button
                className="edit-btn"
                onClick={() => handleEditProduct(product)}>
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteProduct(product.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrderManagement = () => (
    <div className="order-management admin-dashboard">
      <h3>Order Management</h3>
      <div className="orders-table">
        <div className="table-header">
          <span>Order ID</span>
          <span>Customer</span>
          <span>Email</span>
          <span>Product</span>
          <span>Quantity</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {orders.map((order) => (
          <div key={order.order_id} className="table-row">
            <span>#{order.order_id}</span>
            <span>{order.customer_name}</span>
            <span>{order.customer_email}</span>
            <span>{getProductNameById(order.product_id)}</span>
            <span>{order.product_quantity}</span>
            <span>${order.order_amount}</span>
            <span
              className={`status ${order.order_status
                .toLowerCase()
                .replace(" ", "-")}`}>
              {order.order_status}
            </span>
            <select
              value={order.order_status}
              onChange={(e) =>
                updateOrderStatus(order.order_id, e.target.value)
              }
              className="status-select">
              <option value="Processing">Processing</option>
              <option value="On Track">On Track</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="view-events-container">
      {showProductForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
            <div className="product-form">
              <input
                type="text"
                placeholder="Product Name"
                value={productForm.product_name}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    product_name: e.target.value,
                  })
                }
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={productForm.product_price}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    product_price: e.target.value,
                  })
                }
              />
              <textarea
                placeholder="Description"
                value={productForm.product_description}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    product_description: e.target.value,
                  })
                }
              />
              <input
                type="url"
                placeholder="Image URL"
                value={productForm.product_image_link}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    product_image_link: e.target.value,
                  })
                }
              />
              <input
                type="number"
                placeholder="Quantity"
                value={productForm.product_quantity}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    product_quantity: e.target.value,
                  })
                }
              />
            </div>

            <div className="modal-actions">
              <button
                className="complete-btn"
                onClick={
                  editingProduct ? handleUpdateProduct : handleAddProduct
                }>
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                  resetProductForm();
                }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminSidebar />
      <div className="merchandise-module">
        <div className="admin-view">
          <div className="header ">
            <h1>Admin Merchandise Module</h1>
          </div>
          <div className="admin-tabs">
            <button
              className={activeAdminTab === "dashboard" ? "active" : ""}
              onClick={() => setActiveAdminTab("dashboard")}>
              Dashboard
            </button>
            <button
              className={activeAdminTab === "products" ? "active" : ""}
              onClick={() => setActiveAdminTab("products")}>
              Product Management
            </button>
            <button
              className={activeAdminTab === "orders" ? "active" : ""}
              onClick={() => setActiveAdminTab("orders")}>
              Order Management
            </button>
          </div>

          <div className="admin-content">
            {activeAdminTab === "dashboard" && renderAdminDashboard()}
            {activeAdminTab === "products" && renderProductManagement()}
            {activeAdminTab === "orders" && renderOrderManagement()}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminMarketplace;
