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
import { showErrorToast, showSuccessToast } from "../components/ToastNotification";
import registerImage from "../assets/chicken-tikka.webp"; // Replace with your register image

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      showSuccessToast("Registration successful!");
    } catch (err) {
      showErrorToast("Error registering user. Please try again.");
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
              src={registerImage}
              alt="Register Illustration"
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
              Create an Account
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                name="name"
                label="Name"
                fullWidth
                margin="normal"
                onChange={handleChange}
                required
              />
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                onChange={handleChange}
                required
              />
              <TextField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                onChange={handleChange}
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
                fullWidth
                sx={{
                  mt: 3,
                  background: "linear-gradient(45deg, #64b5f6, #42a5f5)",
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Register"}
              </Button>
            </form>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <Link href="/login" underline="hover" color="secondary">
                Login
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RegisterPage;
