// src/pages/LoginPage.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { showErrorToast } from "../components/atoms/ToastNotifications";
import loginImage from "../assets/chicken-tikka.webp";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0); }
`;

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      showErrorToast("Invalid credentials. Please try again.");
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
          sx={{ top: "10%", left: "5%", width: "80px", height: "80px", animation: `${float} 6s infinite` }}
        />
        <Box
          sx={{ bottom: "15%", right: "10%", width: "120px", height: "120px", animation: `${float} 7s infinite` }}
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
                Welcome Back!
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
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
                  {loading ? <CircularProgress size={24} /> : "Login"}
                </Button>
              </form>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Don't have an account?{" "}
                <Link href="/register" underline="hover" color="secondary">
                  Sign up
                </Link>
              </Typography>
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
                  src={loginImage}
                  alt="Login Illustration"
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

export default LoginPage;
