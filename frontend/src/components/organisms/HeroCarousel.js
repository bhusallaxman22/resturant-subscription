// Path: frontend/src/components/organisms/HeroCarousel.js
import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

// Example images
import foodImage1 from "../../assets/bhat-roti.avif";
import foodImage2 from "../../assets/biryani.jpg";
import foodImage3 from "../../assets/chicken-tikka.webp";
import foodImage4 from "../../assets/dal-bhat.jpg";
import foodImage5 from "../../assets/momo.jpg";

const images = [foodImage1, foodImage2, foodImage3, foodImage4, foodImage5];

const HeroCarousel = () => {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100vh",
                zIndex: 0,
                overflow: "hidden",
            }}
        >
            {images.map((image, index) => (
                <Box
                    key={index}
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        opacity: index === currentImage ? 1 : 0,
                        transition: "opacity 1.5s ease-in-out",
                    }}
                />
            ))}
        </Box>
    );
};

export default HeroCarousel;
