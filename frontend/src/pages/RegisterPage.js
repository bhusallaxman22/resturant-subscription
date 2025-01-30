import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  showErrorToast,
  showSuccessToast,
} from "../components/ToastNotification";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

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
    <Container maxWidth="xs">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4">Register</Typography>
      </Box>
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
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          onChange={handleChange}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Register"}
        </Button>
      </form>
      <Box mt={2} textAlign="center">
        <Typography>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;
