// src/App.js
import React, { useContext } from "react";
import { ThemeProvider, CssBaseline, Box, useMediaQuery } from "@mui/material";
import GlobalStyles from "./theme/GlobalStyles";
import AppRoutes from "./routes/AppRoutes";
import { AuthContext } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/organisms/Navbar";
import AdminDrawer from "./components/organisms/AdminDrawer";
import theme from "./theme/theme";
import Footer from "./components/organisms/Footer";

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
          paddingTop: user ? "72px" : "0",
          paddingLeft: user && user.role === "admin" && !isMobile ? "250px" : "0",
          minHeight: "calc(100vh - 200px)",
        }}
      >
        <ToastContainer />
        <AppRoutes />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
