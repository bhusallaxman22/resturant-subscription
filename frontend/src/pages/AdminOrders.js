import { useEffect, useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TableContainer,
  Paper,
  TextField,
  TableSortLabel,
} from "@mui/material";
import { showSuccessToast, showErrorToast } from "../components/ToastNotification";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchFilters, setSearchFilters] = useState({ user: "", mealPlan: "" });
  const [sortConfig, setSortConfig] = useState({ key: "deliveryDate", direction: "asc" });
  const [statusOptions] = useState([
    "pending",
    "preparing",
    "out-for-delivery",
    "completed",
    "cancelled",
  ]);
  const [selectedOrder, setSelectedOrder] = useState(null); // For viewing order details
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/orders/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
      setFilteredOrders(res.data);
    } catch (error) {
      showErrorToast("Error fetching orders.");
    } finally {
      setLoading(false);
    }
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
      fetchOrders();
    } catch (error) {
      showErrorToast("Error updating order status.");
    }
  };

  const handleSearch = () => {
    const { user, mealPlan } = searchFilters;

    const filtered = orders.filter((order) => {
      const matchesUser =
        !user || order.user.name.toLowerCase().includes(user.toLowerCase());
      const matchesMealPlan =
        !mealPlan ||
        order.subscription.mealPlan.name
          .toLowerCase()
          .includes(mealPlan.toLowerCase());
      return matchesUser && matchesMealPlan;
    });

    setFilteredOrders(filtered);
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });

    const sorted = [...filteredOrders].sort((a, b) => {
      if (key === "deliveryDate") {
        return direction === "asc"
          ? new Date(a.deliveryDate) - new Date(b.deliveryDate)
          : new Date(b.deliveryDate) - new Date(a.deliveryDate);
      } else if (key === "status") {
        return direction === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      } else if (key === "user") {
        return direction === "asc"
          ? a.user.name.localeCompare(b.user.name)
          : b.user.name.localeCompare(a.user.name);
      }
      return 0;
    });

    setFilteredOrders(sorted);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Orders
      </Typography>

      {/* Search Controls */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          label="Search by User"
          value={searchFilters.user}
          onChange={(e) =>
            setSearchFilters({ ...searchFilters, user: e.target.value })
          }
          size="small"
        />
        <TextField
          label="Search by Meal Plan"
          value={searchFilters.mealPlan}
          onChange={(e) =>
            setSearchFilters({ ...searchFilters, mealPlan: e.target.value })
          }
          size="small"
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      {/* Orders Table */}
      <TableContainer component={Paper}>
        <Table>
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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>{order.subscription.mealPlan.name}</TableCell>
                <TableCell>
                  {new Date(order.deliveryDate).toDateString()}
                </TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                    size="small"
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Order Details</DialogTitle>
          <DialogContent dividers>
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>User:</strong> {selectedOrder.user.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Email:</strong> {selectedOrder.user.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Plan:</strong> {selectedOrder.subscription.mealPlan.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Delivery Date:</strong>{" "}
                {new Date(selectedOrder.deliveryDate).toDateString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Status:</strong> {selectedOrder.status}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Meals:</strong>{" "}
                {selectedOrder.subscription.mealPlan.meals
                  .map((meal) => meal.name)
                  .join(", ")}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedOrder(null)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default AdminOrders;
