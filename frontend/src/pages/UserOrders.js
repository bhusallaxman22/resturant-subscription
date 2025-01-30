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
  Box,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ mb: 4, fontWeight: "bold" }}
      >
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Alert severity="info">You have no orders yet.</Alert>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Plan</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Delivery Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.subscription.mealPlan.name}</TableCell>
                  <TableCell>
                    {new Date(order.deliveryDate).toDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={
                        order.status === "Delivered"
                          ? "success"
                          : order.status === "Pending"
                            ? "warning"
                            : "default"
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Container>
  );
};

export default UserOrders;
