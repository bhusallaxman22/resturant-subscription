import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, TableHead, TableRow, TableCell, TableBody, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select } from "@mui/material";
import ReactQuill from "react-quill"; // Rich text editor
import "react-quill/dist/quill.snow.css";
import { showSuccessToast } from "../components/atoms/ToastNotifications";

const AdminNewsletter = () => {
    const [subscribers, setSubscribers] = useState([]); // Ensure it's an array
    const [emailData, setEmailData] = useState({ subject: "", message: "", recipient: "all" });
    const [open, setOpen] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {

        try {
            const res = await axios.get(`${API_URL}/api/newsletter`, { headers });

            // Ensure response is an array
            if (Array.isArray(res.data)) {
                setSubscribers(res.data);
            } else {
                console.error("API response is not an array:", res.data);
                setSubscribers([]);
            }
        } catch (error) {
            console.error("Error fetching subscribers:", error);
            setSubscribers([]);
        }
    };

    const sendEmail = async () => {
        try {
            let recipientData = emailData.recipient;

            // If sending to all, ensure recipients is "all"
            if (emailData.recipient === "all") {
                recipientData = "all";
            } else if (typeof recipientData === "string") {
                recipientData = [recipientData]; // Convert single email to an array
            }

            await axios.post(`${API_URL}/api/newsletter/send-email`, {
                recipients: recipientData,
                subject: emailData.subject,
                message: emailData.message
            }, { headers });

            showSuccessToast("Email sent successfully!");
            setOpen(false);
        } catch (error) {
            console.error("Error sending email:", error);
        }
    };


    return (
        <div>
            <h2>Newsletter Subscribers</h2>
            <Button variant="contained" onClick={() => setOpen(true)}>Send Email</Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {subscribers.length > 0 ? (
                        subscribers.map(sub => (
                            <TableRow key={sub._id}>
                                <TableCell>{sub.name}</TableCell>
                                <TableCell>{sub.email}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={2} style={{ textAlign: "center" }}>
                                No subscribers found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Email Sending Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Send Newsletter</DialogTitle>
                <DialogContent>
                    <TextField label="Subject" fullWidth value={emailData.subject} onChange={e => setEmailData({ ...emailData, subject: e.target.value })} />

                    <Select fullWidth value={emailData.recipient} onChange={e => setEmailData({ ...emailData, recipient: e.target.value })} sx={{ marginTop: 2 }}>
                        <MenuItem value="all">All Subscribers</MenuItem>
                        {subscribers.length > 0 ? (
                            subscribers.map(sub => (
                                <MenuItem key={sub.email} value={sub.email}>{sub.email}</MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No subscribers found</MenuItem>
                        )}
                    </Select>

                    {/* Rich Text Editor for Email Message */}
                    <ReactQuill theme="snow" value={emailData.message} onChange={value => setEmailData({ ...emailData, message: value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={sendEmail}>Send</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AdminNewsletter;
