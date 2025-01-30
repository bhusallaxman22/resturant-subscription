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

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    <Container maxWidth="xs">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4">Login</Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
      </form>
      <Box mt={2} textAlign="center">
        <Typography>
          Don't have an account? <Link to="/register">Sign up</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
