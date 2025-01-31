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
} from "@mui/material";

const OrderDetailsDialog = ({ open, order, onClose, onUpdateStatus }) => {
    if (!order) return null;

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
                <Typography variant="body1" gutterBottom>
                    <strong>Status:</strong> {order.status}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Meals:</strong>{" "}
                    {order.subscription.mealPlan?.meals
                        .map((meal) => meal.name)
                        .join(", ")}
                </Typography>
                <Select
                    fullWidth
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                    sx={{ mt: 2 }}
                >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="preparing">Preparing</MenuItem>
                    <MenuItem value="out-for-delivery">Out for Delivery</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
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
