import { useState } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Alert,
} from "@mui/material";
import contactImage from "../assets/contact.png";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <Container sx={{ mt: 5, mb: 5 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                    Contact Us
                </Typography>
                <Typography variant="h6" color="textSecondary" sx={{ maxWidth: "800px", margin: "0 auto" }}>
                    Have a question, feedback, or just want to say hello? We’d love to hear from you! Fill out the form below,
                    and we’ll get back to you as soon as possible.
                </Typography>
            </Box>
            <Grid container spacing={4}>
                {/* Left Section: Form */}
                <Grid item xs={12} md={6}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            name="name"
                            label="Your Name"
                            fullWidth
                            margin="normal"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            name="email"
                            label="Your Email"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            name="message"
                            label="Your Message"
                            multiline
                            rows={4}
                            fullWidth
                            margin="normal"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                mt: 2,
                                background: "linear-gradient(45deg, #ff6f61, #ffa726)",
                            }}
                        >
                            Submit
                        </Button>
                    </form>
                    {submitted && (
                        <Alert severity="success" sx={{ mt: 3 }}>
                            Thank you for reaching out! We’ll get back to you soon.
                        </Alert>
                    )}
                </Grid>
                {/* Right Section: Image */}
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                        }}
                    >
                        <img
                            src={contactImage}
                            alt="Contact Us"
                            style={{
                                width: "100%",
                                height: "auto",
                                borderRadius: "16px",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ContactUs;
