import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, TableHead, TableRow, TableCell, TableBody, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { showErrorToast, showSuccessToast } from "../components/atoms/ToastNotifications";

const AdminCateringRequests = () => {
    const [requests, setRequests] = useState([]);
    const [replyData, setReplyData] = useState({ subject: "", message: "", requestId: null });
    const [open, setOpen] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {

            const res = await axios.get(`${API_URL}/api/catering`, { headers });

            console.log("Fetched Catering Requests:", res.data); // Debugging log

            // Ensure response is an array
            if (Array.isArray(res.data) && res.data.length > 0) {
                setRequests(res.data);
            } else {
                console.warn("API response is not an array or is empty:", res.data);
                setRequests([]); // Set an empty array if no data
            }
        } catch (error) {
            console.error("Error fetching catering requests:", error);
            setRequests([]);
        }
    };


    const sendReply = async () => {
        try {
            await axios.post(`${API_URL}/api/catering/${replyData.requestId}/reply`, replyData, { headers });
            showSuccessToast("Reply sent successfully!");
            setOpen(false);
        } catch (error) {
            console.error("Error sending reply:", error);
            showErrorToast("Error sending reply. Please try again.");
        }
    };

    return (
        <div>
            <h2>Catering Requests</h2>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Event Date</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Message</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {requests.length > 0 ? (
                        requests.map(req => (
                            <TableRow key={req._id}>
                                <TableCell>{req.name}</TableCell>
                                <TableCell>{req.email}</TableCell>
                                <TableCell>{new Date(req.eventDate).toLocaleDateString()}</TableCell>
                                <TableCell>{req.location}</TableCell>
                                <TableCell>{req.message}</TableCell>
                                <TableCell>
                                    <Button variant="contained" onClick={() => {
                                        setReplyData({ subject: `Re: Catering Inquiry`, message: "", requestId: req._id });
                                        setOpen(true);
                                    }}>
                                        Reply
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} style={{ textAlign: "center" }}>
                                No catering requests found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Reply Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Reply to Catering Request</DialogTitle>
                <DialogContent>
                    <TextField label="Subject" fullWidth value={replyData.subject} onChange={e => setReplyData({ ...replyData, subject: e.target.value })} />
                    <TextField label="Message" fullWidth multiline rows={4} value={replyData.message} onChange={e => setReplyData({ ...replyData, message: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={sendReply}>Send Reply</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AdminCateringRequests;
