import { useState, useContext } from "react";
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
import { useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../components/ToastNotification";
import loginImage from "../assets/chicken-tikka.webp"; // Replace with your login image

const LoginPage = () => {
  const { login } = useContext(AuthContext);

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
      showSuccessToast("Login successful!");
    } catch (err) {
      showErrorToast("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ minHeight: "100vh", display: "flex", alignItems: "center", mt: 7 }}>
      <Grid container spacing={4}>
        {/* Left Section: Image */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <img
              src={loginImage}
              alt="Login Illustration"
              style={{ width: "100%", height: "80vh", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)" }}
            />
          </Box>
        </Grid>

        {/* Right Section: Form */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 4,
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: "white",
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
      </Grid>
    </Container>
  );
};

export default LoginPage;
