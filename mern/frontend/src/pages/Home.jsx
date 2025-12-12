import React, { useState, useEffect } from "react";
import { Box, Typography, AppBar, Grid, Toolbar, Button, CssBaseline, Card, CardContent, CardMedia, Container } from "@mui/material";
import { assets } from "../assets/assets.js";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { useNavigate } from "react-router-dom";
import { photos } from "../assets/assets.js"
const Home = () => {
  const navigate = useNavigate();  
  const collections = [
    photos.photo,
    photos.photo1,
    photos.photo2,
    photos.photo3,
    photos.photo4,
    photos.photo5,
    photos.photo6,
    photos.photo7,
  ]  
  const randomNumber2 = Math.floor(Math.random() * collections.length);  
  const randomPhoto = collections[randomNumber2];
  const randomPic = randomNumber2+1;
  const photoo = collections[randomPic];
  return (
    <>
      <CssBaseline />
      <AppBar sx={{ backgroundColor: "#0D1B2A" }}>
        <Toolbar>
          <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>

            <Box sx={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", gap: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  background: "linear-gradient(90deg, rgb(120, 20, 150), rgb(110, 97, 219))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "bold",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                E-Farm-App
              </Typography>
            </Box>
            <Button onClick={() => navigate('/login')}
              variant="text" color="secondary" sx={{ borderRadius: 2 }}>
              login
              <LoginIcon />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 8, p: 3, borderRadius: 3 }}>
        {/* Responsive Two-Column Flexbox */}
        <Box sx={{
          display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, justifyContent: "center", transition: "transform 0.3s ease-in-out",
          "&:hover": { transform: "scale(1.05)" },
        }}>

          {/* First Column - Welcome Card */}
          <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: 400 } }}>
            <Card sx={{ boxShadow: 3, borderRadius: 2, height: "500px" }}>
              {/* Robot Image in CardMedia */}
              <CardMedia
                component="img"
                image={randomPhoto}
                alt="Robot"
                sx={{ width: "100%", height: 230, objectFit: "cover", mt: 2, borderRadius: 2 }}
              />
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Hi, and welcome
                  </Typography>
                  <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth="550px">
                    E-Farm is an innovative e-commerce platform designed for buying and selling farm products. Whether you are a farmer looking for a marketplace or a customer searching for fresh produce, E-Farm connects you with the best agricultural products.
                  </Typography>

                  <Button
                    onClick={() => navigate('/signup')}
                    variant="contained"
                    sx={{
                      width: "65%",
                      background: "linear-gradient(90deg, rgb(120, 20, 150), rgb(110, 97, 219))",
                      color: "black",
                      fontWeight: "bold",
                      borderRadius: 1,
                      "&:hover": { background: "linear-gradient(90deg, rgb(120, 20, 150), rgb(110, 97, 219))" },
                    }}
                  >
                    <HowToRegIcon sx={{ mr: 1 }} /> Sign Up
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
          {/* Second Column - Farm Image Card */}
          <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: 400 } }}>
            <Card sx={{ boxShadow: 3, borderRadius: 2, height: "500px", display: "flex", flexDirection: "column" }}>
              {/* Random Farm Image in CardMedia */}
              <CardMedia
                component="img"
                image={photoo}
                alt="Farm Products"
                sx={{ width: "100%", height: 250, objectFit: "cover", borderRadius: 2 }}
              />

              {/* Text Section */}
              <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Typography variant="h5" fontWeight="bold">
                  Fresh Farm Produce 🌾
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse through a variety of farm products including organic vegetables, dairy products, and grains, all sourced from trusted farmers.
                </Typography>



                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mt: 1 }}>
                  <img src={assets.logo} width={50} height={50} style={{ borderRadius: "50%" }} />
                  <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1, fontWeight: "bold" }}>
                    Developed by @Mbeevie-Tech
                  </Typography>
                </Box>

              </CardContent>
            </Card>
          </Box>

        </Box>
      </Container>

      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={2} justifyContent="center">
          {collections.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
              <Box
                component="img"
                src={image}
                alt={`image-${index}`}
                sx={{
                  width: "100%",
                  height: "250px",
                  borderRadius: "12px",
                  boxShadow: 2,
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Home;
