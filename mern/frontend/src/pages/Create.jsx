import { Container, Button, CssBaseline, Stack, Typography, TextField } from '@mui/material';
import React, { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Create = () => {
  // State to handle product data
  const [newProduct, setNewproduct] = useState({
    name: "",
    price: "",
    image: ""
  });

  // Handle input changes
  const Handlechange = (e) => {
    setNewproduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const Handlesubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product");
      }
      toast.success("🎉 Product added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      // Clear form after successful submission
      setNewproduct({ name: "", price: "", image: "" });

    } catch (error) {
      toast.error(`❌ ${error.message || "Failed to add product!"}`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <>
      <CssBaseline />
      <ToastContainer />
      <Container maxWidth="sm" sx={{
        marginTop: "140px",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      }}>
        <Typography variant="h4" align='center' gutterBottom> Create New Product </Typography>
        <Stack spacing={2} alignItems={'center'}>
          <TextField
            name='name'
            value={newProduct.name}
            label="Product Name"
            fullWidth
            onChange={Handlechange}
          />
          <TextField
            label="Price"
            value={newProduct.price}
            name='price'
            fullWidth
            type='number'
            onChange={Handlechange}
          />
          <TextField
            label="Image URL"
            name='image'
            value={newProduct.image}
            onChange={Handlechange}
            fullWidth
          />
          <Button variant="contained" color="primary" sx={{ width: "100%" }} onClick={Handlesubmit}>
            Add Product
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export default Create;
