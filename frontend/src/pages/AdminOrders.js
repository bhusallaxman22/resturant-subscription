// src/pages/AdminOrders.js
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Select,
  MenuItem,
  Box,
  TableContainer,
  Paper,
  TextField,
  TableSortLabel,
  TablePagination,
  useTheme,
  Grid,
  Alert,
} from "@mui/material";
import { showSuccessToast, showErrorToast } from "../components/atoms/ToastNotifications";
import OrderDetailsDialog from "../components/organisms/OrderDetailsDialog";

const AdminOrders = () => {
  const theme = useTheme();
  const API_URL = import.meta.env.VITE_API_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // For viewing order details

  // Filtering, sorting, and pagination state
  const [searchFilters, setSearchFilters] = useState({ user: "", mealPlan: "" });
  const [sortConfig, setSortConfig] = useState({ key: "deliveryDate", direction: "asc" });
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const statusOptions = ["pending", "preparing", "out-for-delivery", "completed", "cancelled"];

  // Fetch orders once on mount.
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/orders/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (error) {
        showErrorToast("Error fetching orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [API_URL]);

  // Compute filtered orders based on search filters and status filter.
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesUser =
        !searchFilters.user ||
        order.user.name.toLowerCase().includes(searchFilters.user.toLowerCase());
      const matchesMeal =
        !searchFilters.mealPlan ||
        order.subscription.mealPlan?.name.toLowerCase().includes(searchFilters.mealPlan.toLowerCase());
      const matchesStatus = statusFilter ? order.status === statusFilter : true;
      return matchesUser && matchesMeal && matchesStatus;
    });
  }, [orders, searchFilters, statusFilter]);

  // Apply sorting to the filtered orders.
  const sortedOrders = useMemo(() => {
    const sorted = [...filteredOrders].sort((a, b) => {
      const key = sortConfig.key;
      if (key === "deliveryDate") {
        return sortConfig.direction === "asc"
          ? new Date(a.deliveryDate) - new Date(b.deliveryDate)
          : new Date(b.deliveryDate) - new Date(a.deliveryDate);
      } else if (key === "status") {
        return sortConfig.direction === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      } else if (key === "user") {
        return sortConfig.direction === "asc"
          ? a.user.name.localeCompare(b.user.name)
          : b.user.name.localeCompare(a.user.name);
      } else if (key === "mealPlan") {
        const mealA = a.subscription.mealPlan?.name || "";
        const mealB = b.subscription.mealPlan?.name || "";
        return sortConfig.direction === "asc"
          ? mealA.localeCompare(mealB)
          : mealB.localeCompare(mealA);
      }
      return 0;
    });
    return sorted;
  }, [filteredOrders, sortConfig]);

  // Slice the sorted orders for current page.
  const paginatedOrders = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedOrders.slice(start, start + rowsPerPage);
  }, [sortedOrders, page, rowsPerPage]);

  const handleSort = (key) => {
    const isAsc = sortConfig.key === key && sortConfig.direction === "asc";
    setSortConfig({ key, direction: isAsc ? "desc" : "asc" });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccessToast("Order status updated successfully.");
      // Re-fetch orders after update.
      const res = await axios.get(`${API_URL}/api/orders/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
      setSelectedOrder(null);
    } catch (error) {
      showErrorToast("Error updating order status.");
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Orders
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          label="Search by User"
          value={searchFilters.user}
          onChange={(e) => setSearchFilters({ ...searchFilters, user: e.target.value })}
          size="small"
          sx={{ flex: 1 }}
        />
        <TextField
          label="Search by Meal Plan"
          value={searchFilters.mealPlan}
          onChange={(e) => setSearchFilters({ ...searchFilters, mealPlan: e.target.value })}
          size="small"
          sx={{ flex: 1 }}
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          displayEmpty
          size="small"
          sx={{ flex: 1 }}
        >
          <MenuItem value="">All Statuses</MenuItem>
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Glass-styled Table Container */}
      <TableContainer
        component={Paper}
        sx={{
          background: "rgba(255,255,255,0.8)",
          border: "1px solid rgba(255,255,255,0.5)",
          backdropFilter: "blur(12px)",
          boxShadow: "12px 12px 32px rgba(0,0,0,0.06)",
          borderRadius: "24px",
          overflowX: "auto",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === "user"}
                  direction={sortConfig.direction}
                  onClick={() => handleSort("user")}
                >
                  User
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === "mealPlan"}
                  direction={sortConfig.direction}
                  onClick={() => handleSort("mealPlan")}
                >
                  Plan
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === "deliveryDate"}
                  direction={sortConfig.direction}
                  onClick={() => handleSort("deliveryDate")}
                >
                  Delivery Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === "status"}
                  direction={sortConfig.direction}
                  onClick={() => handleSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>{order.subscription.mealPlan?.name}</TableCell>
                <TableCell>{new Date(order.deliveryDate).toDateString()}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Pagination controls */}
        <TablePagination
          component="div"
          count={sortedOrders.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        open={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={updateStatus}
      />
    </Container>
  );
};

export default AdminOrders;
