import { useEffect, useState } from "react";
import axios from "axios";
import {
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    IconButton,
    Paper,
    TablePagination,
    TableSortLabel,
    Container,
    Box,
    Switch,
    FormControlLabel,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    OutlinedInput
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PreviewIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { showSuccessToast, showErrorToast } from "../components/atoms/ToastNotifications";

const NewsletterManagement = () => {
    // Data states for emails and subscribers
    const [subscribers, setSubscribers] = useState([]);
    const [pastEmails, setPastEmails] = useState([]);
    const [scheduledEmails, setScheduledEmails] = useState([]);

    // Search states for emails
    const [pastEmailsSearchQuery, setPastEmailsSearchQuery] = useState("");
    const [scheduledEmailsSearchQuery, setScheduledEmailsSearchQuery] = useState("");

    // Dialog state for email preview
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState(null);

    // --- SEND EMAIL DIALOG STATES ---
    const [sendEmailDialogOpen, setSendEmailDialogOpen] = useState(false);
    const [composeEmail, setComposeEmail] = useState({
        subject: "",
        recipients: [], // recipients will be an array (or "all")
        message: "",
        scheduledAt: ""
    });
    const [isScheduling, setIsScheduling] = useState(false);

    // Sorting states
    const [subscriberSort, setSubscriberSort] = useState({ field: "name", order: "asc" });
    const [pastEmailsSort, setPastEmailsSort] = useState({ field: "sentAt", order: "desc" });
    const [scheduledEmailsSort, setScheduledEmailsSort] = useState({ field: "scheduledAt", order: "asc" });

    // Pagination states
    const [subscribersPage, setSubscribersPage] = useState(0);
    const [subscribersRowsPerPage, setSubscribersRowsPerPage] = useState(5);
    const [pastEmailsPage, setPastEmailsPage] = useState(0);
    const [pastEmailsRowsPerPage, setPastEmailsRowsPerPage] = useState(5);
    const [scheduledEmailsPage, setScheduledEmailsPage] = useState(0);
    const [scheduledEmailsRowsPerPage, setScheduledEmailsRowsPerPage] = useState(5);

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchPastEmails();
        fetchScheduledEmails();
        fetchSubscribers();
    }, []);

    // --- API FUNCTIONS ---
    const fetchPastEmails = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/newsletter/past-emails`, { headers });
            setPastEmails(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Error fetching past emails:", error);
            showErrorToast("Failed to fetch past emails.");
            setPastEmails([]);
        }
    };

    const fetchScheduledEmails = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/newsletter/scheduled-emails`, { headers });
            setScheduledEmails(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Error fetching scheduled emails:", error);
            showErrorToast("Failed to fetch scheduled emails.");
            setScheduledEmails([]);
        }
    };

    const fetchSubscribers = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/newsletter`, { headers });
            setSubscribers(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Error fetching subscribers:", error);
            showErrorToast("Failed to fetch subscribers.");
            setSubscribers([]);
        }
    };

    // Delete a subscriber (with confirmation)
    const handleDeleteSubscriber = async (subscriberId) => {
        if (!window.confirm("Are you sure you want to delete this subscriber?")) return;
        try {
            await axios.delete(`${API_URL}/api/newsletter/${subscriberId}`, { headers });
            showSuccessToast("Subscriber deleted successfully.");
            fetchSubscribers();
        } catch (error) {
            console.error("Error deleting subscriber:", error);
            showErrorToast("Failed to delete subscriber.");
        }
    };

    // Helper: sort data based on field and order
    const sortData = (data, sort) => {
        const { field, order } = sort;
        return [...data].sort((a, b) => {
            let aVal = a[field];
            let bVal = b[field];

            // Convert date fields (assuming any field with "At" in its name is a date)
            if (field.toLowerCase().includes("at")) {
                aVal = aVal ? new Date(aVal) : new Date(0);
                bVal = bVal ? new Date(bVal) : new Date(0);
            }

            // Compare strings in a case-insensitive manner
            if (typeof aVal === "string") {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return order === "asc" ? -1 : 1;
            if (aVal > bVal) return order === "asc" ? 1 : -1;
            return 0;
        });
    };

    // Sorting handlers for each table
    const handleSubscriberSort = (field) => {
        setSubscribersPage(0);
        setSubscriberSort((prev) =>
            prev.field === field ? { ...prev, order: prev.order === "asc" ? "desc" : "asc" } : { field, order: "asc" }
        );
    };

    const handlePastEmailsSort = (field) => {
        setPastEmailsPage(0);
        setPastEmailsSort((prev) =>
            prev.field === field ? { ...prev, order: prev.order === "asc" ? "desc" : "asc" } : { field, order: "asc" }
        );
    };

    const handleScheduledEmailsSort = (field) => {
        setScheduledEmailsPage(0);
        setScheduledEmailsSort((prev) =>
            prev.field === field ? { ...prev, order: prev.order === "asc" ? "desc" : "asc" } : { field, order: "asc" }
        );
    };

    // --- HANDLER FOR SENDING EMAIL ---
    const handleSendEmail = async () => {
        try {
            // Build payload: if "all" is selected, send as a string; otherwise, use the array.
            const payload = {
                subject: composeEmail.subject,
                recipients:
                    composeEmail.recipients.length === 1 && composeEmail.recipients[0] === "all"
                        ? "all"
                        : composeEmail.recipients,
                message: composeEmail.message,
                schedule: isScheduling && composeEmail.scheduledAt ? composeEmail.scheduledAt : undefined,
            };

            await axios.post(`${API_URL}/api/newsletter/send-email`, payload, { headers });
            showSuccessToast("Email sent successfully.");
            setSendEmailDialogOpen(false);
            setComposeEmail({ subject: "", recipients: [], message: "", scheduledAt: "" });
            setIsScheduling(false);
            // Optionally refresh the email lists:
            fetchPastEmails();
            fetchScheduledEmails();
        } catch (error) {
            console.error("Error sending email:", error);
            showErrorToast("Failed to send email.");
        }
    };

    // --- Derived Data ---
    // Subscribers (sorted and paginated)
    const sortedSubscribers = sortData(subscribers, subscriberSort);
    const paginatedSubscribers = sortedSubscribers.slice(
        subscribersPage * subscribersRowsPerPage,
        subscribersPage * subscribersRowsPerPage + subscribersRowsPerPage
    );

    // Past Emails (search, sorted, and paginated)
    const filteredPastEmails = pastEmails.filter((email) =>
        email.subject.toLowerCase().includes(pastEmailsSearchQuery.toLowerCase()) ||
        (Array.isArray(email.recipients) &&
            email.recipients.some((r) => r.toLowerCase().includes(pastEmailsSearchQuery.toLowerCase())))
    );
    const sortedPastEmails = sortData(filteredPastEmails, pastEmailsSort);
    const paginatedPastEmails = sortedPastEmails.slice(
        pastEmailsPage * pastEmailsRowsPerPage,
        pastEmailsPage * pastEmailsRowsPerPage + pastEmailsRowsPerPage
    );

    // Scheduled Emails (search, sorted, and paginated)
    const filteredScheduledEmails = scheduledEmails.filter((email) =>
        email.subject.toLowerCase().includes(scheduledEmailsSearchQuery.toLowerCase()) ||
        (Array.isArray(email.recipients) &&
            email.recipients.some((r) => r.toLowerCase().includes(scheduledEmailsSearchQuery.toLowerCase())))
    );
    const sortedScheduledEmails = sortData(filteredScheduledEmails, scheduledEmailsSort);
    const paginatedScheduledEmails = sortedScheduledEmails.slice(
        scheduledEmailsPage * scheduledEmailsRowsPerPage,
        scheduledEmailsPage * scheduledEmailsRowsPerPage + scheduledEmailsRowsPerPage
    );

    // Handler for changing the recipients selection
    const handleRecipientsChange = (event) => {
        const {
            target: { value },
        } = event;
        // If "all" is selected, override any other selection.
        if (value.includes("all")) {
            setComposeEmail((prev) => ({ ...prev, recipients: ["all"] }));
        } else {
            setComposeEmail((prev) => ({ ...prev, recipients: typeof value === "string" ? value.split(",") : value }));
        }
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: 20, marginBottom: 20 }}>
            {/* Header with Compose Email Button */}
            <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <h2>📨 Newsletter Management</h2>
                <Button variant="contained" color="primary" onClick={() => setSendEmailDialogOpen(true)}>
                    Compose Email
                </Button>
            </Box>

            {/* --- Send Email Dialog --- */}
            <Dialog open={sendEmailDialogOpen} onClose={() => setSendEmailDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Compose Email</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        label="Subject"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={composeEmail.subject}
                        onChange={(e) => setComposeEmail({ ...composeEmail, subject: e.target.value })}
                    />
                    {/* Recipients dropdown using Select */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="recipients-label">Select Recipients</InputLabel>
                        <Select
                            labelId="recipients-label"
                            multiple
                            value={composeEmail.recipients}
                            onChange={handleRecipientsChange}
                            input={<OutlinedInput label="Select Recipients" />}
                            renderValue={(selected) =>
                                selected.length === 1 && selected[0] === "all"
                                    ? "All Subscribers"
                                    : selected.join(", ")
                            }
                        >
                            <MenuItem value="all">
                                <em>All Subscribers</em>
                            </MenuItem>
                            {subscribers.map((subscriber) => (
                                <MenuItem key={subscriber._id} value={subscriber.email}>
                                    {subscriber.email}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <div style={{ marginBottom: 35 }} >
                        <ReactQuill theme="snow" value={composeEmail.message} onChange={value => setComposeEmail({ ...composeEmail, message: value })} style={{ height: "200px" }} />
                    </div>
                    <FormControlLabel style={{ display: "flex", }}
                        control={
                            <Switch
                                checked={isScheduling}
                                onChange={(e) => {
                                    setIsScheduling(e.target.checked);
                                    if (!e.target.checked) {
                                        setComposeEmail((prev) => ({ ...prev, scheduledAt: "" }));
                                    }
                                }}
                                color="primary"
                            />
                        }
                        label="Schedule Email"
                    />
                    {isScheduling && (
                        <TextField
                            label="Scheduled At"
                            type="datetime-local"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            value={composeEmail.scheduledAt}
                            onChange={(e) => setComposeEmail({ ...composeEmail, scheduledAt: e.target.value })}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSendEmailDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSendEmail}>
                        Send
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Subscribers Section */}
            <Paper elevation={3} style={{ padding: 20, marginBottom: 30 }}>
                <h3>Subscribers</h3>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={subscriberSort.field === "name"}
                                    direction={subscriberSort.field === "name" ? subscriberSort.order : "asc"}
                                    onClick={() => handleSubscriberSort("name")}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={subscriberSort.field === "email"}
                                    direction={subscriberSort.field === "email" ? subscriberSort.order : "asc"}
                                    onClick={() => handleSubscriberSort("email")}
                                >
                                    Email
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedSubscribers.map((subscriber) => (
                            <TableRow key={subscriber._id}>
                                <TableCell>{subscriber.name}</TableCell>
                                <TableCell>{subscriber.email}</TableCell>
                                <TableCell>
                                    <IconButton color="error" onClick={() => handleDeleteSubscriber(subscriber._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {paginatedSubscribers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    No subscribers found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={sortedSubscribers.length}
                    page={subscribersPage}
                    onPageChange={(event, newPage) => setSubscribersPage(newPage)}
                    rowsPerPage={subscribersRowsPerPage}
                    onRowsPerPageChange={(event) => {
                        setSubscribersRowsPerPage(parseInt(event.target.value, 10));
                        setSubscribersPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Paper>

            {/* Past Emails Section */}
            <Paper elevation={3} style={{ padding: 20, marginBottom: 30 }}>
                <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                    <h3>Past Emails</h3>
                    <TextField
                        label="Search Past Emails"
                        variant="outlined"
                        size="small"
                        value={pastEmailsSearchQuery}
                        onChange={(e) => {
                            setPastEmailsSearchQuery(e.target.value);
                            setPastEmailsPage(0);
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={pastEmailsSort.field === "subject"}
                                    direction={pastEmailsSort.field === "subject" ? pastEmailsSort.order : "asc"}
                                    onClick={() => handlePastEmailsSort("subject")}
                                >
                                    Subject
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Recipients</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={pastEmailsSort.field === "sentAt"}
                                    direction={pastEmailsSort.field === "sentAt" ? pastEmailsSort.order : "asc"}
                                    onClick={() => handlePastEmailsSort("sentAt")}
                                >
                                    Sent At
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedPastEmails.length > 0 ? (
                            paginatedPastEmails.map((email) => (
                                <TableRow key={email._id}>
                                    <TableCell>{email.subject}</TableCell>
                                    <TableCell>{Array.isArray(email.recipients) ? email.recipients.join(", ") : "Unknown"}</TableCell>
                                    <TableCell>{email.sentAt ? new Date(email.sentAt).toLocaleString() : "N/A"}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => { setSelectedEmail(email); setPreviewOpen(true); }}>
                                            <PreviewIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No past emails found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={sortedPastEmails.length}
                    page={pastEmailsPage}
                    onPageChange={(event, newPage) => setPastEmailsPage(newPage)}
                    rowsPerPage={pastEmailsRowsPerPage}
                    onRowsPerPageChange={(event) => {
                        setPastEmailsRowsPerPage(parseInt(event.target.value, 10));
                        setPastEmailsPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Paper>

            {/* Scheduled Emails Section */}
            <Paper elevation={3} style={{ padding: 20, marginBottom: 30 }}>
                <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                    <h3>Scheduled Emails</h3>
                    <TextField
                        label="Search Scheduled Emails"
                        variant="outlined"
                        size="small"
                        value={scheduledEmailsSearchQuery}
                        onChange={(e) => {
                            setScheduledEmailsSearchQuery(e.target.value);
                            setScheduledEmailsPage(0);
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={scheduledEmailsSort.field === "subject"}
                                    direction={scheduledEmailsSort.field === "subject" ? scheduledEmailsSort.order : "asc"}
                                    onClick={() => handleScheduledEmailsSort("subject")}
                                >
                                    Subject
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Recipients</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={scheduledEmailsSort.field === "scheduledAt"}
                                    direction={scheduledEmailsSort.field === "scheduledAt" ? scheduledEmailsSort.order : "asc"}
                                    onClick={() => handleScheduledEmailsSort("scheduledAt")}
                                >
                                    Scheduled At
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedScheduledEmails.length > 0 ? (
                            paginatedScheduledEmails.map((email) => (
                                <TableRow key={email._id}>
                                    <TableCell>{email.subject}</TableCell>
                                    <TableCell>{Array.isArray(email.recipients) ? email.recipients.join(", ") : "Unknown"}</TableCell>
                                    <TableCell>{email.scheduledAt ? new Date(email.scheduledAt).toLocaleString() : "N/A"}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => { setSelectedEmail(email); setPreviewOpen(true); }}>
                                            <PreviewIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No scheduled emails found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={sortedScheduledEmails.length}
                    page={scheduledEmailsPage}
                    onPageChange={(event, newPage) => setScheduledEmailsPage(newPage)}
                    rowsPerPage={scheduledEmailsRowsPerPage}
                    onRowsPerPageChange={(event) => {
                        setScheduledEmailsRowsPerPage(parseInt(event.target.value, 10));
                        setScheduledEmailsPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Paper>

            {/* Email Preview Dialog */}
            <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>📩 Email Preview</DialogTitle>
                <DialogContent dividers>
                    {selectedEmail && (
                        <>
                            <h3>{selectedEmail.subject}</h3>
                            <p>
                                <strong>Recipients:</strong>{" "}
                                {Array.isArray(selectedEmail.recipients)
                                    ? selectedEmail.recipients.join(", ")
                                    : "Unknown"}
                            </p>
                            <div dangerouslySetInnerHTML={{ __html: selectedEmail.message }} />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPreviewOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default NewsletterManagement;
