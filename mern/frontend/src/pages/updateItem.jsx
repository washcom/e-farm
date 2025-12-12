import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, TextField, Button, Typography, CircularProgress, Box,Card,CardContent } from "@mui/material";
import { toast ,ToastContainer } from "react-toastify";

const UpdateItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState({ name: "", price: "", stock: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/items/one-item/${itemId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) throw new Error(`Failed to fetch item: ${itemId}`);

        const data = await response.json();
        setItem(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        toast.error(error);
      }
    };

    fetchItemData();
  }, [itemId]);

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/items/update/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(item),
      });

      if (!response.ok) throw new Error(`Failed to update item: ${itemId}`);

      const data = await response.json();
      console.log("Update successful:", data);
      setTimeout(()=>{
        navigate("/myproducts"); 
      },3000);
      
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  if (loading) return <CircularProgress sx={{ display: "block", margin: "50px auto" }} />;
  if (error) return <Typography color="error" align="center">{error}</Typography>;
  return (
    <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <Card sx={{ width: "100%", p: 3, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          fontWeight="bold"
          sx={{
            background: "linear-gradient(45deg, #FF6B6B, #6B47FF)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Update Item
        </Typography>

        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Name" name="name" value={item.name} onChange={handleChange} required fullWidth variant="outlined" />
          <TextField label="Price" name="price" type="number" value={item.price} onChange={handleChange} required fullWidth variant="outlined" />
          <TextField label="Stock" name="stock" type="number" value={item.stock} onChange={handleChange} required fullWidth variant="outlined" />
          <TextField label="Description" name="description" multiline rows={3} value={item.description} onChange={handleChange} fullWidth variant="outlined" />

          <Button
            variant="contained"
            size="large"
            onClick={handleUpdate}
            sx={{
              background: "linear-gradient(90deg, #6B47FF, #FF6B6B)",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: 1,
              "&:hover": {
                background: "linear-gradient(90deg, #FF6B6B, #6B47FF)",
              },
            }}
          >
            Update Item
          </Button>
        </Box>
      </CardContent>
    </Card>
  </Container>
  );
};

export default UpdateItem;
