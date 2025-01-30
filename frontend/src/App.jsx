import { useContext } from "react";
import { ThemeProvider, CssBaseline, Box, Typography } from "@mui/material";
import theme from "./theme/theme";
import GlobalStyles from "./theme/GlobalStyles";
import AppRoutes from "./routes/AppRoutes";
import { AuthContext } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/CustomerNavbar";
import AdminDrawer from "./components/AdminDrawer";

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      {user && user.role === "admin" ? (
        <AdminDrawer onLogout={logout} />
      ) : (
        <Navbar />
      )}
      <Box
        sx={{
          paddingTop: user ? "64px" : "0",
          paddingLeft: user && user.role === "admin" ? "240px" : "0",
        }}
      >
        <ToastContainer />
        <AppRoutes />
      </Box>
      <Box
        sx={{
          backgroundColor: "#000",
          color: "#fff",
          py: 2,
          textAlign: "center",
          width: "100%",
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Saffron Kitchen | All Rights Reserved.
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
