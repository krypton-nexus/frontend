import React from "react";
import { FaPlus, FaClipboardList, FaBoxOpen, FaUsers } from "react-icons/fa";
import AdminSidebar from "../Components/AdminSidebar";
import "../CSS/AdminMarketplace.css";
import { useNavigate } from "react-router-dom";

const AdminMarketplace = () => {
  const navigate = useNavigate();
  const handleAddProduct = () => {
    // Navigate to add-product form or open modal
    console.log("Add Product Clicked");
  };

  return (
    <div className="view-events-container">
      <AdminSidebar />
      <div className="admin-marketplace-container">
        <div className="admin-header">
          <h1>Marketplace Admin Dashboard</h1>
          <button
            className="add-product-button"
            onClick={() => navigate("/addproduct")}>
            <FaPlus /> Add Product
          </button>
        </div>

        <div className="admin-panels">
          <div className="admin-card">
            <FaBoxOpen className="admin-icon" />
            <h2>Total Products</h2>
            <p>48 Products Listed</p>
          </div>

          <div className="admin-card">
            <FaClipboardList className="admin-icon" />
            <h2>Recent Orders</h2>
            <p>12 Pending, 35 Completed</p>
          </div>

          <div className="admin-card">
            <FaUsers className="admin-icon" />
            <h2>Customers</h2>
            <p>180 Registered Users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMarketplace;
