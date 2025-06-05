import React, { useState, useEffect } from "react";
import { FaPlus, FaClipboardList, FaBoxOpen, FaUsers } from "react-icons/fa";
import AdminSidebar from "../Components/AdminSidebar";
import "../CSS/Merchandise.css";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Box from "@mui/material/Box";


const BASE_URL = process.env.REACT_APP_BASE_URL;

const AdminMarketplace = () => {
  const navigate = useNavigate();
  const [clubId, setClubId] = useState("");
  const [products, setProducts] = useState([]);
  const [activeAdminTab, setActiveAdminTab] = useState("dashboard");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const DashboardSkeleton = () => (
    <div className="admin-dashboard">
      {/* Dashboard Title */}
      <Skeleton variant="text" width={210} height={36} sx={{ mb: 2 }} />

      {/* Summary Stat Cards */}
      <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} sx={{ flex: 1, borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Stack spacing={2} alignItems="center">
                <Skeleton variant="circular" width={48} height={48} />
                <Skeleton variant="text" width="60%" height={22} />
                <Skeleton variant="text" width="40%" height={32} />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Status Chips */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={150} height={28} sx={{ mb: 2 }} />
        <Stack direction="row" spacing={2}>
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              width={90}
              height={32}
              sx={{ borderRadius: 16 }}
            />
          ))}
        </Stack>
      </Box>

      {/* Recent Orders Table */}
      <Box sx={{ mt: 4 }}>
        <Skeleton variant="text" width={180} height={28} sx={{ mb: 2 }} />
        <div className="orders-table" style={{ width: "100%" }}>
          {/* Table Head */}
          <Stack direction="row" spacing={3} sx={{ mb: 1 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="text" width={80} height={20} />
            ))}
          </Stack>
          {/* Rows */}
          {[1, 2, 3, 4, 5].map((i) => (
            <Stack
              key={i}
              direction="row"
              spacing={3}
              alignItems="center"
              sx={{
                mb: 1,
                p: 1,
                borderRadius: 2,
                background: "#fafbfc",
              }}
            >
              <Skeleton variant="circular" width={36} height={36} />
              <Skeleton variant="text" width={90} height={20} />
              <Skeleton variant="rectangular" width={60} height={20} />
              <Skeleton variant="rectangular" width={70} height={20} />
              <Skeleton
                variant="rectangular"
                width={76}
                height={28}
                sx={{ borderRadius: 8 }}
              />
            </Stack>
          ))}
        </div>
      </Box>
    </div>
  );

  const ProductsTableSkeleton = () => (
    <div className="product-management">
      <div
        className="section-header"
        style={{ display: "flex", alignItems: "center", gap: 12 }}
      >
        <Skeleton variant="text" width={180} height={32} />
        <Skeleton
          variant="rectangular"
          width={120}
          height={38}
          sx={{ borderRadius: 2 }}
        />
      </div>
      <div className="products-table" style={{ width: "100%", marginTop: 16 }}>
        {/* Table Head */}
        <Stack direction="row" spacing={3} sx={{ mb: 1 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="text" width={90} height={20} />
          ))}
        </Stack>
        {/* Table Rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <Stack
            key={i}
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              mb: 2,
              p: 1,
              borderRadius: 2,
              background: "#f6f7fa",
            }}
          >
            <Skeleton
              variant="rectangular"
              width={60}
              height={50}
              sx={{ borderRadius: 2 }}
            />
            <Stack flex={1}>
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width={80} height={18} />
            </Stack>
            <Skeleton variant="rectangular" width={65} height={18} />
            <Skeleton variant="rectangular" width={60} height={18} />
            {/* Action Buttons */}
            <Stack direction="row" spacing={1}>
              <Skeleton
                variant="rectangular"
                width={44}
                height={34}
                sx={{ borderRadius: 1 }}
              />
              <Skeleton
                variant="rectangular"
                width={44}
                height={34}
                sx={{ borderRadius: 1 }}
              />
            </Stack>
          </Stack>
        ))}
      </div>
    </div>
  );

  const OrdersTableSkeleton = () => (
    <div className="order-management admin-dashboard">
      <Skeleton variant="text" width={220} height={38} sx={{ mb: 2 }} />
      <div className="orders-table" style={{ width: "100%" }}>
        {/* Table Head */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} variant="text" width={70} height={20} />
          ))}
        </Stack>
        {/* Table Rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <Stack
            key={i}
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              mb: 2,
              p: 1,
              borderRadius: 2,
              background: "#f6f7fa",
            }}
          >
            <Skeleton variant="circular" width={32} height={32} />
            <Stack flex={1} spacing={0.5}>
              <Skeleton variant="text" width={80} height={18} />
              <Skeleton variant="text" width={70} height={14} />
            </Stack>
            <Skeleton variant="text" width={110} height={18} />
            <Skeleton variant="rectangular" width={48} height={22} />
            <Skeleton variant="rectangular" width={46} height={22} />
            {/* Badge and Select Skeleton */}
            <Skeleton variant="rounded" width={66} height={28} />
            <Skeleton
              variant="rectangular"
              width={88}
              height={32}
              sx={{ borderRadius: 1 }}
            />
          </Stack>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    const token = localStorage.getItem("admin_access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserEmail(decoded.email);
        setClubId(decoded.club_id); // Assuming club_id is in the token
        setLoading(false);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("token not found");
    }
  }, [navigate]);

  // Define fetchProducts function outside useEffect
  const fetchProducts = async () => {
    if (!clubId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/merchandise/products/club/${clubId}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error("Fetch products error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders function
  const fetchOrders = async () => {
    if (!clubId) return;

    try {
      const response = await fetch(
        `${BASE_URL}/merchandise/orders/club/${clubId}`
      );

      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error("Fetch orders error:", err);
      // Keep mock data as fallback
      setOrders([
        {
          order_id: 1001,
          product_id: 1,
          customer_name: "John Doe",
          customer_email: "john@example.com",
          product_quantity: 2,
          order_amount: 50.0,
          order_status: "Processing",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Initial fetch when clubId changes
  useEffect(() => {
    fetchProducts();
  }, [clubId]);

  // Initial fetch when clubId changes
  useEffect(() => {
    if (clubId) {
      fetchOrders();
    }
  }, [clubId]);

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

  // Navigate to Add Product page
  const handleAddProductNavigation = () => {
    navigate("/add-product");
  };

  const handleAddProduct = async () => {
    if (
      !productForm.product_name ||
      !productForm.product_price ||
      !productForm.product_quantity
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("admin_access_token");
      const response = await fetch(`${BASE_URL}/merchandise/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_name: productForm.product_name,
          product_price: parseFloat(productForm.product_price),
          product_description: productForm.product_description,
          product_image_link: productForm.product_image_link,
          product_quantity: parseInt(productForm.product_quantity),
          club_id: clubId,
        }),
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts([...products, newProduct]);
        setShowProductForm(false);
        resetProductForm();
        alert("Product added successfully!");
        fetchProducts(); // Refresh the products list
      } else {
        throw new Error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      // Fallback to local state update if API fails
      const newProduct = {
        id: Math.max(...products.map((p) => p.id)) + 1,
        product_name: productForm.product_name,
        product_price: parseFloat(productForm.product_price),
        product_description: productForm.product_description,
        product_image_link: productForm.product_image_link,
        product_quantity: parseInt(productForm.product_quantity),
        club_id: clubId,
        created_at: new Date().toISOString(),
      };

      setProducts([...products, newProduct]);
      setShowProductForm(false);
      resetProductForm();
      alert("Product added successfully!");
    }
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

  // ─────────────────────────────────────────────────────────────────
  // 1) EDIT (UPDATE) PRODUCT
  // ─────────────────────────────────────────────────────────────────
  const handleUpdateProduct = async () => {
    if (
      !productForm.product_name ||
      !productForm.product_price ||
      !productForm.product_quantity
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("admin_access_token");
      // Note: the backend endpoint for updating a product is:
      //   PUT /merchandise/products/<product_id>
      const response = await fetch(
        `${BASE_URL}/merchandise/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_name: productForm.product_name,
            product_price: parseFloat(productForm.product_price),
            product_description: productForm.product_description,
            product_image_link: productForm.product_image_link,
            product_quantity: parseInt(productForm.product_quantity, 10),
            // We do NOT need to send club_id here again, since the API knows which product to update.
          }),
        }
      );

      if (!response.ok) {
        // In case backend returns a 4xx/5xx:
        const err = await response.json();
        throw new Error(err.error || `Status ${response.status}`);
      }

      // If it succeeds, re‐fetch the list of products so the UI shows the latest data:
      await fetchProducts();

      setShowProductForm(false);
      setEditingProduct(null);
      resetProductForm();
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);

      // Fallback: update local state to at least reflect the change in the table.
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                product_name: productForm.product_name,
                product_price: parseFloat(productForm.product_price),
                product_description: productForm.product_description,
                product_image_link: productForm.product_image_link,
                product_quantity: parseInt(productForm.product_quantity, 10),
              }
            : p
        )
      );

      setShowProductForm(false);
      setEditingProduct(null);
      resetProductForm();
      alert("Product updated locally (offline fallback).");
    }
  };

  const handleDeleteProduct = async (productId) => {
    // Confirm with the user
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const token = localStorage.getItem("admin_access_token");
      if (!token) {
        alert("You must be logged in to perform this action.");
        return;
      }

      // Send DELETE request
      const response = await fetch(
        `${BASE_URL}/merchandise/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // The backend might return 204 No Content or 200 OK on successful deletion.
      if (response.ok) {
        // Remove the deleted product from local state
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        alert("Product deleted successfully!");
      } else {
        // Try to read JSON error body, if any
        let errorMessage = `Status ${response.status}`;
        try {
          const errJson = await response.json();
          errorMessage = errJson.error || errJson.message || errorMessage;
        } catch {
          // ignore JSON parse errors
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(`Failed to delete product: ${error.message}`);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("admin_access_token");
      const response = await fetch(
        `${BASE_URL}/merchandise/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            order_status: newStatus,
          }),
        }
      );

      if (response.ok) {
        fetchOrders(); // Refresh orders list
        alert("Order status updated! Email sent to customer.");
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      // Fallback to local state update if API fails
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
    }
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
                    .replace(" ", "-")}`}
                >
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
        <button className="add-btn" onClick={handleAddProductNavigation}>
          Add Product
        </button>
      </div>

      {loading && <div className="loading">Loading products...</div>}
      {error && <div className="error">Error: {error}</div>}

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
              // onError={(e) => {
              //   e.target.src =
              //     "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400";
              // }}
            />
            <span>{product.product_name}</span>
            <span>${product.product_price}</span>
            <span>{product.product_quantity}</span>
            <div className="actions">
              <button
                className="edit-btn"
                onClick={() => handleEditProduct(product)}
              >
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteProduct(product.id)}
              >
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
      {ordersLoading && <div className="loading">Loading orders...</div>}

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
                .replace(" ", "-")}`}
            >
              {order.order_status}
            </span>
            <select
              value={order.order_status}
              onChange={(e) =>
                updateOrderStatus(order.order_id, e.target.value)
              }
              className="status-select"
            >
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
                placeholder="Product Name *"
                value={productForm.product_name}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    product_name: e.target.value,
                  })
                }
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price *"
                value={productForm.product_price}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    product_price: e.target.value,
                  })
                }
                required
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
                rows="4"
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
                placeholder="Quantity *"
                value={productForm.product_quantity}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    product_quantity: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="modal-actions">
              <button
                className="complete-btn"
                onClick={
                  editingProduct ? handleUpdateProduct : handleAddProduct
                }
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                  resetProductForm();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminSidebar />
      <div className="merchandise-module">
        <div className="admin-view">
          <div className="header">
            <h1>Admin Merchandise Module</h1>
          </div>
          <div className="admin-tabs">
            <button
              className={activeAdminTab === "dashboard" ? "active" : ""}
              onClick={() => setActiveAdminTab("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={activeAdminTab === "products" ? "active" : ""}
              onClick={() => setActiveAdminTab("products")}
            >
              Product Management
            </button>
            <button
              className={activeAdminTab === "orders" ? "active" : ""}
              onClick={() => setActiveAdminTab("orders")}
            >
              Order Management
            </button>
          </div>

          <div className="admin-content">
            {activeAdminTab === "dashboard" && loading && <DashboardSkeleton />}
            {activeAdminTab === "dashboard" &&
              !loading &&
              renderAdminDashboard()}
            {activeAdminTab === "products" && loading && (
              <ProductsTableSkeleton />
            )}
            {activeAdminTab === "products" &&
              !loading &&
              renderProductManagement()}
            {activeAdminTab === "orders" && ordersLoading && (
              <OrdersTableSkeleton />
            )}
            {activeAdminTab === "orders" &&
              !ordersLoading &&
              renderOrderManagement()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMarketplace;
