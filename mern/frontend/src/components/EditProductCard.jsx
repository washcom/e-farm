import React from 'react';
import { Modal, Box, CircularProgress, Typography, TextField, Button } from '@mui/material';
import { toast } from 'react-toastify';

const EditProductCard = ({ open, handleClose, product, handleUpdate }) => {
    const [editedProduct, setEditedProduct] = React.useState({ ...product });
    const [isLoading, setIsLoading] = React.useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = name === 'price' ? parseFloat(value) : value;
        setEditedProduct({ ...editedProduct, [name]: newValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/products/${product._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editedProduct),
            });

            const data = await response.json();
            console.log('API Response Data:', data);

            if (response.ok) {
                handleUpdate(editedProduct);
                handleClose();
                toast.success("🎉 Product updated successfully!", { theme: "colored" });
            } else {
                throw new Error("Failed to update product.");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("❌ Error updating product.", { theme: "colored" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)', width: 400,
                bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
            }}>
                <Typography variant="h6" gutterBottom>Edit Product</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth label="Product Name" name="name"
                        value={editedProduct.name || ''} onChange={handleChange} margin="normal" required />
                    <TextField fullWidth label="Price" name="price" type="number"
                        value={editedProduct.price || ''} onChange={handleChange} margin="normal" required />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" color="primary" type="submit" disabled={isLoading}>
                            {isLoading ? <CircularProgress size={24} /> : 'Save'}
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleClose} disabled={isLoading}>
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default EditProductCard;
