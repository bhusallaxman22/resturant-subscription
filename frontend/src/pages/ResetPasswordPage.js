// src/pages/ResetPasswordPage.js
import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  showErrorToast,
  showSuccessToast,
} from "../components/atoms/ToastNotifications";
import resetImage from "../assets/chicken-tikka.webp";
import axios from "axios";

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0); }
`;

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract the token from ?token= in the URL
  const token = searchParams.get("token");

  const API_URL = import.meta.env.VITE_API_URL;


  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1) If there's no token, redirect or show an error
  useEffect(() => {
    if (!token) {
      showErrorToast("No token provided. Please check your email link.");
      // Option A: Immediately redirect
      navigate("/forgot-password");
      // Option B: Alternatively, you could just show a message/return
    }
  }, [token, navigate]);

  const toggleNewPasswordVisibility = () =>
    setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 2) Basic client checks
    if (!newPassword || !confirmPassword) {
      showErrorToast("Please fill out both fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showErrorToast("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      // 3) Call your backend's reset-password route
      await axios.post(`${API_URL}/api/auth/reset-password`, {
        token,
        newPassword,
      });

      showSuccessToast("Password reset successful. Please log in.");
      navigate("/login");
    } catch (err) {
      showErrorToast(
        err.response?.data?.message ||
          "Could not reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        background: "var(--bg-gradient)",
        overflow: "hidden",
        py: 4,
      }}
    >
      {/* Floating Background Elements */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 0,
          "& > div": {
            position: "absolute",
            borderRadius: "30px",
            background: "rgba(124, 131, 253, 0.1)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.3)",
          },
        }}
      >
        <Box
          sx={{
            top: "10%",
            left: "5%",
            width: "80px",
            height: "80px",
            animation: `${float} 6s infinite`,
          }}
        />
        <Box
          sx={{
            bottom: "15%",
            right: "10%",
            width: "120px",
            height: "120px",
            animation: `${float} 7s infinite`,
          }}
        />
      </Box>

      <Container
        maxWidth="md"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
          mt: 7,
        }}
      >
        <Grid container spacing={4}>
          {/* Form Section */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 4,
                boxShadow:
                  "12px 12px 32px rgba(0,0,0,0.06), -8px -8px 24px rgba(255,255,255,0.8)",
                borderRadius: "24px",
                backgroundColor: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.5)",
                backdropFilter: "blur(12px)",
                textAlign: "center",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                Reset Your Password
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleNewPasswordVisibility}>
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    mt: 3,
                    background: "linear-gradient(45deg, #ff6f61, #ffa726)",
                    py: 1.5,
                    borderRadius: "24px",
                    textTransform: "none",
                  }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Reset Password"}
                </Button>
              </form>
            </Box>
          </Grid>

          {/* Image Section */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "rgba(255,255,255,0.8)",
                  borderRadius: "24px",
                  padding: 2,
                  boxShadow:
                    "12px 12px 32px rgba(0,0,0,0.06), -8px -8px 24px rgba(255,255,255,0.8)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  backdropFilter: "blur(12px)",
                  animation: `${float} 4s ease-in-out infinite`,
                }}
              >
                <img
                  src={resetImage}
                  alt="Reset Password Illustration"
                  style={{
                    width: "100%",
                    height: "80vh",
                    borderRadius: "16px",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ResetPasswordPage;
