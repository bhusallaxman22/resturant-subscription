import { useEffect, useState } from "react";
import axios from "axios";
import {
    Button,
    Card,
    CardContent,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Grid,
    Select,
    MenuItem,
    InputAdornment,
    IconButton,
    Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import DeleteIcon from "@mui/icons-material/Delete";
import TableChartIcon from "@mui/icons-material/TableChart";
import AddIcon from "@mui/icons-material/Add";
import { useDrag, useDrop } from "react-dnd";
import { showSuccessToast, showErrorToast } from "../components/atoms/ToastNotifications";
import { motion } from "framer-motion";

const AdminReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [tables, setTables] = useState([]); // Fetched from backend
    const [searchQuery, setSearchQuery] = useState("");
    // Default view set to today's reservations
    const [viewMode, setViewMode] = useState("today");
    const [editTablesOpen, setEditTablesOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
    const [newTableNumber, setNewTableNumber] = useState("");
    const [newMaxCapacity, setNewMaxCapacity] = useState("");

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchReservations();
        fetchTables();
    }, []);

    const fetchReservations = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/reservation`, { headers });
            setReservations(res.data);
        } catch (error) {
            console.error(error);
            setReservations([]);
        }
    };

    const fetchTables = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/table`, { headers });
            setTables(res.data);
        } catch (error) {
            console.error("Error fetching tables:", error);
            setTables([]);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            fetchReservations();
            return;
        }
        const filtered = reservations.filter(
            (res) =>
                res.name?.toLowerCase().includes(query.toLowerCase()) ||
                res.email?.toLowerCase().includes(query.toLowerCase())
        );
        setReservations(filtered);
    };

    const handleDeleteReservation = async () => {
        try {
            await axios.delete(`${API_URL}/api/reservation/${confirmDelete.id}`, { headers });
            showSuccessToast("Reservation deleted successfully.");
            setConfirmDelete({ open: false, id: null });
            fetchReservations();
            fetchTables(); // Refresh tables in case one was freed.
        } catch {
            showErrorToast("Failed to delete reservation.");
        }
    };

    // Manual table assignment endpoint (used by the dropdown)
    const assignTable = async (reservationId, tableNumber) => {
        try {
            await axios.put(
                `${API_URL}/api/reservation/assign-table/${reservationId}`,
                { tableNumber },
                { headers }
            );
            showSuccessToast("Table assigned successfully.");
            fetchReservations();
            fetchTables();
        } catch (error) {
            showErrorToast(error.response?.data?.message || "Failed to assign table.");
        }
    };

    const unassignTable = async (reservationId) => {
        try {
            await axios.put(`${API_URL}/api/reservation/unassign-table/${reservationId}`, {}, { headers });
            showSuccessToast("Table unassigned successfully.");
            fetchReservations();
            fetchTables();
        } catch {
            showErrorToast("Failed to unassign table.");
        }
    };

    // Filter reservations based on the selected view mode (default is "today")
    const filteredReservations = reservations.filter((res) => {
        const resDate = new Date(res.date);
        resDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (viewMode === "today" || viewMode === "default") {
            return resDate.getTime() === today.getTime();
        } else if (viewMode === "upcoming") {
            return resDate.getTime() > today.getTime();
        } else if (viewMode === "past") {
            return resDate.getTime() < today.getTime();
        }
        return true;
    });

    // Reservation Card with dropdown for table assignment.
    const ReservationCard = ({ reservation }) => {
        const [{ isDragging }, drag] = useDrag(
            () => ({
                type: "reservation",
                item: { id: reservation._id },
                collect: (monitor) => ({
                    isDragging: monitor.isDragging(),
                }),
            }),
            [reservation]
        );

        // Handler for when the dropdown changes
        const handleTableAssignment = (e) => {
            const selectedValue = e.target.value;
            if (selectedValue === "") {
                unassignTable(reservation._id);
            } else {
                assignTable(reservation._id, Number(selectedValue));
            }
        };

        // Compute available tables for this reservation.
        // A table is “available” if its maxCapacity is enough and it’s not currently assigned.
        // We also include the currently assigned table (if any) in the list.
        const availableTables = tables.filter((table) => {
            if (table.maxCapacity < reservation.numberOfPeople) return false;
            return !table.assignedReservation; // Only free tables.
        });
        // If the reservation already has a table, include that table even if it's "occupied"
        if (reservation.tableNumber) {
            const assignedTable = tables.find((table) => table.tableNumber === reservation.tableNumber);
            if (assignedTable && !availableTables.some((t) => t.tableNumber === assignedTable.tableNumber)) {
                availableTables.unshift(assignedTable);
            }
        }

        return (
            <motion.div
                ref={drag}
                style={{ opacity: isDragging ? 0.5 : 1, cursor: "grab", marginBottom: "15px" }}
                whileHover={{ scale: 1.02 }}
            >
                <Card sx={{ borderRadius: "12px", boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            📍 {reservation.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Email: {reservation.email}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            📅 {new Date(reservation.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            ⏰ {reservation.time}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                            <PeopleIcon fontSize="small" sx={{ mr: 0.5 }} /> People: {reservation.numberOfPeople}
                        </Typography>
                        {reservation.tableNumber && (
                            <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                                Assigned to Table: {reservation.tableNumber}
                            </Typography>
                        )}
                        <Box sx={{ mt: 2 }}>
                            <Select
                                value={reservation.tableNumber || ""}
                                onChange={handleTableAssignment}
                                displayEmpty
                                fullWidth
                                sx={{ bgcolor: "#f0f0f0", borderRadius: "8px" }}
                            >
                                <MenuItem value="">
                                    <em>Unassigned</em>
                                </MenuItem>
                                {availableTables.map((table) => (
                                    <MenuItem key={table._id} value={table.tableNumber}>
                                        Table {table.tableNumber} (Max: {table.maxCapacity})
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                                fullWidth
                                onClick={() => setConfirmDelete({ open: true, id: reservation._id })}
                            >
                                Delete
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </motion.div>
        );
    };

    // Table Card (droppable) remains as before
    const TableCard = ({ table }) => {
        const [{ isOver }, drop] = useDrop(
            () => ({
                accept: "reservation",
                drop: (item) => assignTable(item.id, table.tableNumber),
                collect: (monitor) => ({
                    isOver: monitor.isOver(),
                }),
            }),
            [table]
        );

        // Change the background color based on assignment status.
        let backgroundColor = table.assignedReservation ? "#E57373" : "#81C784";
        if (isOver && !table.assignedReservation) {
            backgroundColor = "#66BB6A";
        }

        return (
            <motion.div
                ref={drop}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.03 }}
                style={{
                    background: backgroundColor,
                    padding: "20px",
                    borderRadius: "12px",
                    textAlign: "center",
                    boxShadow: "0px 6px 12px rgba(0,0,0,0.1)",
                    color: "#fff",
                    position: "relative",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    <TableChartIcon sx={{ verticalAlign: "middle", mr: 0.5 }} /> Table {table.tableNumber}
                </Typography>
                <Typography variant="body2">Max Capacity: {table.maxCapacity}</Typography>
                {table.assignedReservation && (
                    <Typography
                        variant="caption"
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            background: "#fff",
                            color: "#E57373",
                            px: 1,
                            py: 0.5,
                            borderRadius: "8px",
                            fontWeight: "bold",
                        }}
                    >
                        Occupied
                    </Typography>
                )}
            </motion.div>
        );
    };

    // Handle adding a new table via backend POST /api/table
    const handleAddTable = async () => {
        if (!newTableNumber || !newMaxCapacity) {
            showErrorToast("Please provide both table number and max capacity.");
            return;
        }
        try {
            await axios.post(
                `${API_URL}/api/table`,
                { tableNumber: Number(newTableNumber), maxCapacity: Number(newMaxCapacity) },
                { headers }
            );
            showSuccessToast("Table added successfully.");
            setNewTableNumber("");
            setNewMaxCapacity("");
            fetchTables();
        } catch (error) {
            showErrorToast(error.response?.data?.message || "Failed to add table.");
        }
    };

    // Handle deleting a table via backend DELETE /api/table/:id
    const handleDeleteTable = async (id) => {
        try {
            await axios.delete(`${API_URL}/api/table/${id}`, { headers });
            showSuccessToast("Table deleted successfully.");
            fetchTables();
        } catch (error) {
            showErrorToast(error.response?.data?.message || "Failed to delete table.");
        }
    };

    return (
        <Box
            sx={{
                p: 3,
                minHeight: "100vh",
                background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
            }}
        >
            <Typography variant="h3" align="center" sx={{ mb: 4, fontWeight: "bold", color: "#333" }}>
                🍽️ Restaurant Reservations
            </Typography>

            {/* Search & View Filters */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Search Name/Email"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Select value={viewMode} onChange={(e) => setViewMode(e.target.value)} fullWidth variant="outlined">
                        <MenuItem value="today">📋 Today Reservations</MenuItem>
                        <MenuItem value="upcoming">📋 Upcoming Reservations</MenuItem>
                        <MenuItem value="past">📋 Past Reservations</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Button variant="contained" color="primary" fullWidth onClick={() => setEditTablesOpen(true)}>
                        Edit Tables
                    </Button>
                </Grid>
            </Grid>

            {/* Table Layout (Drag & Drop) */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: 2,
                    mb: 4,
                }}
            >
                {tables.map((table) => (
                    <TableCard key={table._id} table={table} />
                ))}
            </Box>

            {/* Reservations */}
            {viewMode === "today" ? (
                <Grid container spacing={3}>
                    {filteredReservations.map((res) => (
                        <Grid item xs={12} sm={6} md={4} key={res._id}>
                            <ReservationCard reservation={res} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ display: "flex", overflowX: "auto", gap: 2, p: 1 }}>
                    {filteredReservations.map((res) => (
                        <Box key={res._id} sx={{ minWidth: "300px" }}>
                            <ReservationCard reservation={res} />
                        </Box>
                    ))}
                </Box>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, id: null })}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this reservation?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete({ open: false, id: null })}>Cancel</Button>
                    <Button onClick={handleDeleteReservation} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Tables Dialog */}
            <Dialog open={editTablesOpen} onClose={() => setEditTablesOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Tables</DialogTitle>
                <DialogContent>
                    {tables.map((table) => (
                        <Grid container spacing={2} alignItems="center" key={table._id} sx={{ mb: 1 }}>
                            <Grid item xs={4}>
                                <TextField label="Table Number" variant="outlined" type="number" value={table.tableNumber} fullWidth disabled />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField label="Max Capacity" variant="outlined" type="number" value={table.maxCapacity} fullWidth disabled />
                            </Grid>
                            <Grid item xs={4}>
                                <IconButton color="error" onClick={() => handleDeleteTable(table._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}
                    <Typography variant="subtitle1" sx={{ mt: 3 }}>
                        Add New Table
                    </Typography>
                    <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
                        <Grid item xs={4}>
                            <TextField
                                label="Table Number"
                                variant="outlined"
                                type="number"
                                value={newTableNumber}
                                onChange={(e) => setNewTableNumber(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Max Capacity"
                                variant="outlined"
                                type="number"
                                value={newMaxCapacity}
                                onChange={(e) => setNewMaxCapacity(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <IconButton color="primary" onClick={handleAddTable}>
                                <AddIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditTablesOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminReservations;
