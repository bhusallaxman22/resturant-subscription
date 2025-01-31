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
  LinearProgress,
  Alert,
  Chip,
  TableSortLabel,
  Paper,
  useTheme,
} from "@mui/material";
import {
  CheckCircle,
  PendingActions,
  LocalShipping,
  KeyboardArrowUp,
  KeyboardArrowDown,
} from "@mui/icons-material";

const UserOrders = () => {
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "deliveryDate",
    direction: "asc",
  });

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

      // Filter out canceled orders
      const activeOrders = res.data.filter((order) => order.status !== "cancelled");
      setOrders(activeOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });

    // Sort orders
    const sortedOrders = [...orders].sort((a, b) => {
      if (key === "deliveryDate") {
        return direction === "asc"
          ? new Date(a.deliveryDate) - new Date(b.deliveryDate)
          : new Date(b.deliveryDate) - new Date(a.deliveryDate);
      } else if (key === "plan") {
        const planA = a.subscription.mealPlan?.name || "";
        const planB = b.subscription.mealPlan?.name || "";
        return direction === "asc" ? planA.localeCompare(planB) : planB.localeCompare(planA);
      } else if (key === "status") {
        return direction === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });

    setOrders(sortedOrders);
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', p: 4 }}>
        <LinearProgress sx={{ height: 4, borderRadius: 2 }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          color: theme.palette.text.primary
        }}
      >
        <LocalShipping fontSize="large" />
        Order History
      </Typography>

      <Paper elevation={0} sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        {orders.length === 0 ? (
          <Alert
            severity="info"
            sx={{
              m: 3,
              borderRadius: 1,
              backgroundColor: theme.palette.background.default
            }}
          >
            No orders found. Start your meal plan journey today!
          </Alert>
        ) : (
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: theme.palette.background.default }}>
              <TableRow>
                <TableCell sx={{
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <TableSortLabel
                    active={sortConfig.key === "plan"}
                    direction={sortConfig.key === "plan" ? sortConfig.direction : "asc"}
                    onClick={() => handleSort("plan")}
                    IconComponent={sortConfig.key === "plan" ?
                      (sortConfig.direction === "asc" ? KeyboardArrowUp : KeyboardArrowDown) :
                      KeyboardArrowUp
                    }
                    sx={{
                      '& .MuiTableSortLabel-icon': {
                        color: `${theme.palette.primary.main} !important`
                      }
                    }}
                  >
                    Meal Plan
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <TableSortLabel
                    active={sortConfig.key === "deliveryDate"}
                    direction={sortConfig.key === "deliveryDate" ? sortConfig.direction : "asc"}
                    onClick={() => handleSort("deliveryDate")}
                    IconComponent={sortConfig.key === "deliveryDate" ?
                      (sortConfig.direction === "asc" ? KeyboardArrowUp : KeyboardArrowDown) :
                      KeyboardArrowUp
                    }
                  >
                    Delivery Date
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <TableSortLabel
                    active={sortConfig.key === "status"}
                    direction={sortConfig.key === "status" ? sortConfig.direction : "asc"}
                    onClick={() => handleSort("status")}
                    IconComponent={sortConfig.key === "status" ?
                      (sortConfig.direction === "asc" ? KeyboardArrowUp : KeyboardArrowDown) :
                      KeyboardArrowUp
                    }
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order._id}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <TableCell sx={{
                    fontWeight: 500,
                    color: theme.palette.text.primary
                  }}>
                    {order.subscription.mealPlan?.name}
                  </TableCell>

                  <TableCell sx={{ color: theme.palette.text.secondary }}>
                    {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={order.status}
                      size="small"
                      icon={
                        order.status === 'Delivered' ? <CheckCircle fontSize="small" /> :
                          order.status === 'Pending' ? <PendingActions fontSize="small" /> :
                            <LocalShipping fontSize="small" />
                      }
                      sx={{
                        fontWeight: 600,
                        borderRadius: 1,
                        ...(order.status === 'Delivered' && {
                          backgroundColor: theme.palette.success.light,
                          color: theme.palette.success.dark
                        }),
                        ...(order.status === 'Pending' && {
                          backgroundColor: theme.palette.warning.light,
                          color: theme.palette.warning.dark
                        }),
                        ...(order.status === 'Processing' && {
                          backgroundColor: theme.palette.info.light,
                          color: theme.palette.info.dark
                        })
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
};

export default UserOrders;

