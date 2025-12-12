import React, { useState } from "react";
import { Container, TextField, Button, Typography, Stack, Box } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterItem = () => {
    const [item, setItem] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "", // Stores base64 image
        stock: "",
    });
    const [imagePreview, setImagePreview] = useState(null); // For previewing image

    const handleChange = (e) => {
        setItem({ ...item, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setItem({ ...item, image: reader.result });
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        console.log("Sending data:", item); // Debugging log
        if (!item.name || !item.description || !item.price || !item.category || !item.image || !item.stock) {
            toast.error("All fields are required.");
            return;
        }
        if (parseFloat(item.price) <= 0) {
            toast.error("Price must be a positive number.");
            return;
        }

        if (parseInt(item.stock) <= 0) {
            toast.error("Stock quantity must be a positive number.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/items/register-item", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });

            const data = await response.json();
            console.log("Response:", data); // Debug response

            if (!response.ok) {
                throw new Error(data.message || "Failed to register item.");
            }

            toast.success(`Item "${data.item.name}" added successfully!`);
            setItem({ name: "", description: "", price: "", category: "", image: "", stock: "" }); // Reset form
            setImagePreview(null);
        } catch (error) {
            toast.error(`Failed to add item. ${error.message}`);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 3,
                p: 1,
            }}
        >
            <ToastContainer position="top-right" autoClose={3000} />
            <Container
                maxWidth="sm"
                sx={{
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "16px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    p: 3,
                    mt: 5,
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
            >
                <Box textAlign="center" mb={1}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            mb: 1,
                        }}
                    >
                        Register Item
                    </Typography>
                </Box>

                <Stack spacing={1.5}>
                    <TextField size="small" fullWidth label="Item Name" name="name" value={item.name} onChange={handleChange} required />
                    <TextField size="small" fullWidth label="Description" name="description" value={item.description} onChange={handleChange} required multiline rows={3} />
                    <TextField size="small" fullWidth label="Price" name="price" type="number" value={item.price} onChange={handleChange} required />
                    <TextField size="small" fullWidth label="Category" name="category" value={item.category} onChange={handleChange} required />
                    <TextField size="small" fullWidth label="Stock Quantity" name="stock" type="number" value={item.stock} onChange={handleChange} required />

                    {/* Image Upload */}
                    <Button variant="contained" component="label">
                        Upload Item Image
                        <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                    </Button>

                    {/* Preview Image */}
                    {imagePreview && (
                        <Box
                            sx={{
                                mt: 2,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                            }}
                        >
                            <Typography variant="body2">Image Preview:</Typography>
                            <img
                                src={imagePreview}
                                alt="Preview"
                                style={{
                                    width: "100%",
                                    maxWidth: "200px",
                                    height: "auto",
                                    borderRadius: "8px",
                                    marginTop: "8px",
                                    border: "1px solid #ccc",
                                    padding: "4px",
                                }}
                            />
                        </Box>
                    )}

                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                            py: 1.2,
                            borderRadius: "12px",
                            background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                            "&:hover": {
                                transform: "translateY(-1px)",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                            },
                            transition: "all 0.3s ease",
                        }}
                    >
                        Register Item
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
};

export default RegisterItem;
