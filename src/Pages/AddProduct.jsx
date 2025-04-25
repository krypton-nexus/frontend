import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AWS from "aws-sdk";
import "../CSS/AddEvent.css";
import AdminSidebar from "../Components/AdminSidebar";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

AWS.config.update({
  accessKeyId: "AKIAUQ4L3D64ZBVKU2W4",
  secretAccessKey: "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",
  region: "ap-south-1",
});

const s3 = new AWS.S3();

const AddProduct = () => {
  const [productData, setProductData] = useState({
    club_id: "club_gavel",
    product_name: "",
    product_price: "",
    product_discount: "",
    product_quantity: "",
    product_description: "",
    product_category: "",
    imageFile: null,
    imageUrl: "",
    productispublic: "1",
  });
  const navigate = useNavigate();

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Snackbar close handler.
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const folderPath = `Gavel/Event`;

    const params = {
      Bucket: "nexus-se-bucket",
      Key: `${folderPath}/${fileName}`,
      Body: file,
      ContentType: file.type,
    };

    try {
      await s3.upload(params).promise();
      const imageUrl = `https://nexus-se-bucket.s3.ap-south-1.amazonaws.com/${folderPath}/${fileName}`;
      setProductData((prev) => ({
        ...prev,
        imageUrl,
        imageFile: file,
      }));
      console.log("Image uploaded to:", imageUrl);
      setSnackbarMessage("Image uploaded successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("S3 Upload Error:", error);
      setSnackbarMessage("Failed to upload image.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if imageUrl is populated
    if (!productData.imageUrl) {
      setSnackbarMessage("Please upload an image before submitting.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    const payload = {
      club_id: productData.club_id,
      product_name: productData.product_name,
      product_price: productData.product_price,
      product_discount: productData.product_discount,
      product_quantity: productData.product_quantity,
      product_description: productData.product_description,
      images: productData.imageUrl,
      product_category: productData.product_category,
      productispublic: productData.productispublic,
    };

    try {
      const response = await fetch("http://43.205.202.255:5000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_access_token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSnackbarMessage("Product added successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setProductData({
          club_id: "",
          product_name: "",
          product_price: "",
          product_discount: "",
          product_quantity: "",
          product_description: "",
          product_category: "",
          imageFile: null,
          imageUrl: "",
          productispublic: "1",
        });
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
          onClick={() => navigate("/adminmarketplace")}>
          ✖
        </button>
        <div className="events-header">
          <h2>Add Product</h2>
        </div>

        <form className="event-form" onSubmit={handleSubmit}>
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
              type="text"
              name="product_price"
              value={productData.product_price}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Discount:
            <input
              type="text"
              name="product_discount"
              value={productData.product_discount}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Stock Quantity:
            <input
              type="text"
              name="product_quantity"
              value={productData.product_quantity}
              onChange={handleChange}
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
              onChange={handleChange}>
              <option value=""></option>
              <option value="Cloths">Cloths</option>
              <option value="Handband">Handband</option>
              <option value="Caps">Caps</option>
              <option value="WaterBottle">WaterBottle</option>
            </select>
          </label>

          <label>
            Upload Product Image:
            <input type="file" accept="image/*" onChange={handleFileChange} />
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
                      ispublic: e.target.checked ? "1" : "0",
                    }))
                  }
                />
                <span className="slider round"></span>
              </div>
              <span className="toggle-status">
                {productData.ispublic === "0" ? "Private" : "Public"}
              </span>
            </div>
          </label>

          <button type="submit" className="create-event-btn">
            Add Product
          </button>
        </form>
      </main>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddProduct;
