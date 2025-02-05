// src/components/organisms/OrderDetailsDialog.js
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Select,
    MenuItem,
    Box,
} from "@mui/material";

const OrderDetailsDialog = ({ open, order, onClose, onUpdateStatus }) => {
    if (!order) return null;

    // Construct full address string if available
    const fullAddress = order.user.address
        ? `${order.user.address.street}, ${order.user.address.city}, ${order.user.address.state} ${order.user.address.zip}`
        : "";

    console.log("Order Details:", order);

    // Google Maps URL with the address encoded
    const googleMapsUrl = fullAddress
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            fullAddress
        )}`
        : "";

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Order Details</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1" gutterBottom>
                    <strong>User:</strong> {order.user.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Email:</strong> {order.user.email}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Plan:</strong> {order.subscription.mealPlan?.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Delivery Date:</strong>{" "}
                    {new Date(order.deliveryDate).toDateString()}
                </Typography>
                {order.user.address && (
                    <>
                        <Typography variant="body1" gutterBottom>
                            <strong>Delivery Address:</strong> {fullAddress}
                        </Typography>
                        <Button
                            variant="text"
                            color="primary"
                            onClick={() => window.open(googleMapsUrl, "_blank")}
                            sx={{ mt: 1 }}
                        >
                            Open in Google Maps
                        </Button>
                    </>
                )}
                <Typography variant="body1" gutterBottom>
                    <strong>Status:</strong> {order.status}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Meals:</strong>{" "}
                    {order.subscription.mealPlan?.meals
                        ?.map((meal) => meal.name)
                        .join(", ")}
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Select
                        fullWidth
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                    >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="preparing">Preparing</MenuItem>
                        <MenuItem value="out-for-delivery">Out for Delivery</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderDetailsDialog;
