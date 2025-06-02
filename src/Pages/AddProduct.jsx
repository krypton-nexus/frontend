// AddProduct.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AWS from "aws-sdk";
// Named import for jwtDecode
import { jwtDecode } from "jwt-decode";
import "../CSS/AddEvent.css";
import AdminSidebar from "../Components/AdminSidebar";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const BASE_URL = process.env.REACT_APP_BASE_URL;

AWS.config.update({
  accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_S3_REGION,
});
const s3 = new AWS.S3();

const AddProduct = () => {
  const [productData, setProductData] = useState({
    club_id: "",
    product_name: "",
    product_price: "",
    product_discount: "",
    product_quantity: "",
    product_description: "",
    product_category: "",
    imageUrl: "",
    productispublic: "1",
  });

  const [uploading, setUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  // ─────────────────────────────────────────────────────────────────
  // 1) On mount, decode JWT → extract club_id directly
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("admin_access_token");
    if (!token) {
      console.warn("No admin_access_token in localStorage");
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error("Failed to decode JWT:", err);
      return;
    }

    // Assume the token payload includes `club_id`
    if (decoded.club_id) {
      setProductData((prev) => ({
        ...prev,
        club_id: decoded.club_id.toString(),
      }));
    } else {
      console.error("JWT does not contain `club_id` claim");
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────
  // 2) Snackbar close handler
  // ─────────────────────────────────────────────────────────────────
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  // ─────────────────────────────────────────────────────────────────
  // 3) Input-change handler
  // ─────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ─────────────────────────────────────────────────────────────────
  // 4) Upload handler (unchanged)
  // ─────────────────────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setSnackbarMessage("Uploading image...");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);

    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const folderPath = "products";

    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      Key: `${folderPath}/${fileName}`,
      Body: file,
      ContentType: file.type,
    };

    try {
      await s3.upload(params).promise();
      const imageUrl = `https://${process.env.REACT_APP_S3_BUCKET_NAME}.s3.${process.env.REACT_APP_S3_REGION}.amazonaws.com/${folderPath}/${fileName}`;

      setProductData((prev) => ({
        ...prev,
        imageUrl,
      }));
      setUploadPreview(URL.createObjectURL(file));
      setSnackbarMessage("Image uploaded successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("S3 Upload Error:", error);
      setSnackbarMessage("Failed to upload image.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setUploadPreview(null);
    }

    setUploading(false);
  };

  // ─────────────────────────────────────────────────────────────────
  // 5) Submit handler (club_id is already set)
  // ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productData.club_id) {
      setSnackbarMessage("Club ID is not set yet.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    if (!productData.imageUrl) {
      setSnackbarMessage("Please upload an image before submitting.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    const payload = {
      club_id: productData.club_id,
      product_name: productData.product_name,
      product_price: parseFloat(productData.product_price),
      product_discount: parseFloat(productData.product_discount),
      product_quantity: parseInt(productData.product_quantity, 10),
      product_description: productData.product_description,
      product_image_link: productData.imageUrl,
      product_category: productData.product_category,
      productispublic: productData.productispublic,
    };

    console.log("Submitting payload:", payload);

    try {
      const token = localStorage.getItem("admin_access_token");
      const response = await fetch(`${BASE_URL}/merchandise/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSnackbarMessage("Product added successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Clear fields (keep club_id so user can add another)
        setProductData({
          club_id: productData.club_id,
          product_name: "",
          product_price: "",
          product_discount: "",
          product_quantity: "",
          product_description: "",
          product_category: "",
          imageUrl: "",
          productispublic: "1",
        });
        setUploadPreview(null);
      } else {
        const err = await response.json();
        setSnackbarMessage(
          `Product creation failed: ${err.error || "Unknown error"}`
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Create Product Error:", error);
      setSnackbarMessage("Something went wrong. Try again later.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <div className="view-events-container">
      <AdminSidebar />
      <main className="main-content">
        <button
          className="close-event-btn"
          onClick={() => navigate("/adminmarketplace")}
        >
          ✖
        </button>
        <div className="events-header">
          <h2>Add Product</h2>
        </div>

        <form className="event-form" onSubmit={handleSubmit} autoComplete="off">
          <label>
            Product Name:
            <input
              type="text"
              name="product_name"
              value={productData.product_name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Price:
            <input
              type="number"
              name="product_price"
              value={productData.product_price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </label>

          <label>
            Discount (%):
            <input
              type="number"
              name="product_discount"
              value={productData.product_discount}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              required
            />
          </label>

          <label>
            Stock Quantity:
            <input
              type="number"
              name="product_quantity"
              value={productData.product_quantity}
              onChange={handleChange}
              min="0"
              required
            />
          </label>

          <label>
            Product Description:
            <textarea
              name="product_description"
              value={productData.product_description}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Category:
            <select
              name="product_category"
              value={productData.product_category}
              onChange={handleChange}
              required
            >
              <option value="">Select a Category</option>
              <option value="Cloths">Cloths</option>
              <option value="Handband">Handband</option>
              <option value="Caps">Caps</option>
              <option value="WaterBottle">WaterBottle</option>
            </select>
          </label>

          <label>
            Upload Product Image:
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              required
            />
            {uploadPreview && (
              <div className="img-preview-box">
                <img
                  src={uploadPreview}
                  alt="Preview"
                  style={{
                    marginTop: 8,
                    maxWidth: 120,
                    maxHeight: 120,
                    borderRadius: 12,
                    boxShadow: "0 2px 12px #ffbe7248",
                    border: "2px solid #ffb859",
                  }}
                />
              </div>
            )}
          </label>

          <label className="toggle-switch-label">
            Visibility:
            <div className="toggle-row">
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="visibilityToggle"
                  checked={productData.productispublic === "1"}
                  onChange={(e) =>
                    setProductData((prev) => ({
                      ...prev,
                      productispublic: e.target.checked ? "1" : "0",
                    }))
                  }
                />
                <span className="slider round"></span>
              </div>
              <span className="toggle-status">
                {productData.productispublic === "0" ? "Private" : "Public"}
              </span>
            </div>
          </label>

          <button
            type="submit"
            className="create-event-btn"
            disabled={uploading || !productData.imageUrl}
            style={{
              opacity: uploading || !productData.imageUrl ? 0.5 : 1,
              cursor:
                uploading || !productData.imageUrl ? "not-allowed" : "pointer",
            }}
          >
            {uploading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </main>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddProduct;
