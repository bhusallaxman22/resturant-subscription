import { useContext } from "react";
import { ThemeProvider, CssBaseline, Box, useMediaQuery } from "@mui/material";
import GlobalStyles from "./theme/GlobalStyles";
import AppRoutes from "./routes/AppRoutes";
import { AuthContext } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/CustomerNavbar";
import AdminDrawer from "./components/AdminDrawer";
import theme from "./theme/theme";
import Footer from "./components/Footer";

function App() {
  const { user, logout } = useContext(AuthContext);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
          paddingLeft: user && user.role === "admin" && !isMobile ? "150px" : "0",
          minHeight: "calc(100vh - 200px)",
        }}
      >
        <ToastContainer />
        <AppRoutes />
      </Box>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
