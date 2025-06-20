import React, { useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Typography,
  Grid,
  Button,
  TextareaAutosize,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { Building2, UserPlus, Loader2 } from "lucide-react";
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_S3_REGION,
});
const s3 = new AWS.S3();

const SystemAdminDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const [isCreatingClub, setIsCreatingClub] = useState(false);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "info",
    message: "",
  });

  // Club creation form state
  const [clubForm, setClubForm] = useState({
    id: "",
    title: "",
    welcome_msg: "",
    welcome_short_para: "",
    about_club: "",
    our_activities: "",
    additional_information: "",
    images_url: "",
  });

  // Admin registration form state
  const [adminForm, setAdminForm] = useState({
    club_id: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    role: "",
    is_active: true,
  });
  // Define your style objects
  const styles = {
    hiddenInput: {
      display: "none",
    },
    uploadButton: {
      bgcolor: "#a91d3a",
      color: "common.white",
      px: 3,
      py: 1,
      borderRadius: 2,
      textTransform: "none",
      "&:hover": {
        bgcolor: "#87162e",
      },
    },
    previewWrapper: {
      mt: 2,
      display: "flex",
      justifyContent: "center",
    },
    previewImage: {
      maxWidth: "100%",
      maxHeight: 200,
      borderRadius: 2,
      boxShadow: 3,
    },
  };

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // Handle tab change
  const handleTabChange = (_event, newIndex) => {
    setTabIndex(newIndex);
  };

  // Snackbar helper
  const openSnackbar = (severity, message) => {
    setSnackbar({ open: true, severity, message });
  };
  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Handle club form field change
  const handleClubFormChange = (field) => (event) => {
    setClubForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  // Handle admin form field change
  const handleAdminFormChange = (field) => (event) => {
    const value =
      field === "is_active" ? event.target.checked : event.target.value;
    setAdminForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Create Club submission
  const handleCreateClub = async (e) => {
    e.preventDefault();
    setIsCreatingClub(true);

    try {
      const clubData = {
        id: clubForm.id,
        title: clubForm.title,
        welcome_msg: clubForm.welcome_msg,
        welcome_short_para: clubForm.welcome_short_para,
        about_club: clubForm.about_club,
        our_activities: clubForm.our_activities,
        additional_information: clubForm.additional_information,
        images_url: clubForm.images_url,
      };

      const response = await fetch(`${BASE_URL}/club/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clubData),
      });

      if (response.ok) {
        openSnackbar("success", "Club created successfully");
        // Reset form
        setClubForm({
          id: "",
          title: "",
          welcome_msg: "",
          welcome_short_para: "",
          about_club: "",
          our_activities: "",
          additional_information: "",
          images_url: [],
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create club");
      }
    } catch (error) {
      openSnackbar("error", error.message || "Failed to create club");
    } finally {
      setIsCreatingClub(false);
    }
  };

  // Register Admin submission
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setIsAddingAdmin(true);

    try {
      const adminData = {
        club_id: adminForm.club_id,
        first_name: adminForm.first_name,
        last_name: adminForm.last_name,
        email: adminForm.email,
        password: adminForm.password,
        phone_number: adminForm.phone_number,
        role: adminForm.role,
        is_active: adminForm.is_active,
      };

      const response = await fetch(`${BASE_URL}/admin/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      });

      if (response.ok) {
        openSnackbar("success", "Admin registered successfully");
        // Reset form
        setAdminForm({
          club_id: "",
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          phone_number: "",
          role: "",
          is_active: true,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register admin");
      }
    } catch (error) {
      openSnackbar("error", error.message || "Failed to register admin");
    } finally {
      setIsAddingAdmin(false);
    }
  };
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = `clubs/${Date.now()}-${file.name}`;
    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      Key: fileName,
      Body: file,
      ContentType: file.type,
    };

    try {
      const upload = await s3.upload(params).promise();
      setClubForm((prev) => ({
        ...prev,
        images_url: upload.Location,
      }));
      openSnackbar("success", "Image uploaded successfully!");
    } catch (error) {
      console.error("S3 Upload Error:", error);
      openSnackbar("error", "Failed to upload image.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "background.default",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          flex: 1,
          width: "900px",
          mx: "auto",
          px: 2,
          py: 3,
        }}
      >
        <Typography variant="h3" align="center" gutterBottom>
          System Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Manage clubs and register administrators
        </Typography>

        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          centered
          sx={{
            mb: 3,
            "& .MuiTabs-indicator": {
              backgroundColor: "#a91d3a",
            },
            "& .Mui-selected": {
              color: "#a91d3a !important",
            },
          }}
        >
          <Tab
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <Building2 size={20} /> Create Club
              </Box>
            }
          />
          <Tab
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <UserPlus size={20} /> Register Admin
              </Box>
            }
          />
        </Tabs>

        {tabIndex === 0 && (
          <Card elevation={3}>
            <CardHeader
              title="Create New Club"
              sx={{ bgcolor: "#a91d3a", color: "common.white" }}
            />
            <CardContent>
              <Box component="form" onSubmit={handleCreateClub}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Club ID"
                      fullWidth
                      required
                      value={clubForm.id}
                      onChange={handleClubFormChange("id")}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Club Title"
                      fullWidth
                      required
                      value={clubForm.title}
                      onChange={handleClubFormChange("title")}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Welcome Message *
                    </Typography>
                    <TextareaAutosize
                      minRows={3}
                      placeholder="Enter welcome message"
                      style={{
                        width: "100%",
                        padding: 8,
                        borderRadius: 4,
                        borderColor: "#ccc",
                      }}
                      required
                      value={clubForm.welcome_msg}
                      onChange={handleClubFormChange("welcome_msg")}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Welcome Short Paragraph *
                    </Typography>
                    <TextareaAutosize
                      minRows={2}
                      placeholder="Enter welcome short paragraph"
                      style={{
                        width: "100%",
                        padding: 8,
                        borderRadius: 4,
                        borderColor: "#ccc",
                      }}
                      required
                      value={clubForm.welcome_short_para}
                      onChange={handleClubFormChange("welcome_short_para")}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      About Club *
                    </Typography>
                    <TextareaAutosize
                      minRows={4}
                      placeholder="Describe the club"
                      style={{
                        width: "100%",
                        padding: 8,
                        borderRadius: 4,
                        borderColor: "#ccc",
                      }}
                      required
                      value={clubForm.about_club}
                      onChange={handleClubFormChange("about_club")}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Our Activities *
                    </Typography>
                    <TextareaAutosize
                      minRows={4}
                      placeholder="List club activities"
                      style={{
                        width: "100%",
                        padding: 8,
                        borderRadius: 4,
                        borderColor: "#ccc",
                      }}
                      required
                      value={clubForm.our_activities}
                      onChange={handleClubFormChange("our_activities")}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Additional Information
                    </Typography>
                    <TextareaAutosize
                      minRows={3}
                      placeholder="Any extra details"
                      style={{
                        width: "100%",
                        padding: 8,
                        borderRadius: 4,
                        borderColor: "#ccc",
                      }}
                      value={clubForm.additional_information}
                      onChange={handleClubFormChange("additional_information")}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      {/* Hidden file input */}
                      <input
                        accept="image/*"
                        id="club-image-upload"
                        type="file"
                        onChange={handleImageUpload}
                        style={styles.hiddenInput}
                      />
                      {/* Styled button triggers the file browser */}
                      <label htmlFor="club-image-upload">
                        <Button
                          component="span"
                          variant="contained"
                          sx={styles.uploadButton}
                          startIcon={<Loader2 size={16} />}
                        >
                          {clubForm.images_url
                            ? "Change Image"
                            : "Upload Club Image *"}
                        </Button>
                      </label>
                    </FormControl>

                    {/* Preview */}
                    {clubForm.images_url && (
                      <Box sx={styles.previewWrapper}>
                        <Box
                          component="img"
                          src={clubForm.images_url}
                          alt="Club Preview"
                          sx={styles.previewImage}
                        />
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <Box textAlign="right">
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isCreatingClub}
                        startIcon={
                          isCreatingClub ? (
                            <Loader2 size={16} />
                          ) : (
                            <Building2 size={20} />
                          )
                        }
                        sx={{
                          bgcolor: "#a91d3a",
                          "&:hover": { bgcolor: "#87162e" },
                        }}
                      >
                        {isCreatingClub ? "Creating Club..." : "Create Club"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        )}

        {tabIndex === 1 && (
          <Card elevation={3}>
            <CardHeader
              title="Register Club Administrator"
              sx={{ bgcolor: "success.main", color: "common.white" }}
            />
            <CardContent>
              <Box component="form" onSubmit={handleAddAdmin}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Club ID"
                      fullWidth
                      required
                      value={adminForm.club_id}
                      onChange={handleAdminFormChange("club_id")}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First Name"
                      fullWidth
                      required
                      value={adminForm.first_name}
                      onChange={handleAdminFormChange("first_name")}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Name"
                      fullWidth
                      required
                      value={adminForm.last_name}
                      onChange={handleAdminFormChange("last_name")}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      type="email"
                      fullWidth
                      required
                      value={adminForm.email}
                      onChange={handleAdminFormChange("email")}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Password"
                      type="password"
                      fullWidth
                      required
                      value={adminForm.password}
                      onChange={handleAdminFormChange("password")}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone Number"
                      type="tel"
                      fullWidth
                      required
                      value={adminForm.phone_number}
                      onChange={handleAdminFormChange("phone_number")}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel id="role-label">Role</InputLabel>
                      <Select
                        labelId="role-label"
                        label="Role"
                        value={adminForm.role}
                        onChange={handleAdminFormChange("role")}
                      >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="super_admin">Super Admin</MenuItem>
                        <MenuItem value="moderator">Moderator</MenuItem>
                        <MenuItem value="manager">Manager</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={adminForm.is_active}
                          onChange={handleAdminFormChange("is_active")}
                          color="success"
                        />
                      }
                      label="Active Status"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box textAlign="right">
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isAddingAdmin || !adminForm.role}
                        startIcon={
                          isAddingAdmin ? (
                            <Loader2 size={16} />
                          ) : (
                            <UserPlus size={20} />
                          )
                        }
                        sx={{
                          bgcolor: "#a91d3a",
                          "&:hover": { bgcolor: "#87162e" },
                        }}
                      >
                        {isAddingAdmin
                          ? "Registering Admin..."
                          : "Register Admin"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={closeSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default SystemAdminDashboard;
