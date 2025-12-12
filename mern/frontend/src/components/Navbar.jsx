import React, { useEffect } from "react";
import {
  Typography, AppBar, Toolbar, CssBaseline, Box,
  IconButton, Avatar
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home"; // Import Home Icon
import { Link } from "react-router-dom";
import { keyframes } from "@emotion/react";
import { assets } from "../assets/assets.js";
import { useState } from "react";

const glow = keyframes`
  0% { filter: drop-shadow(0 0 2px #7B61FF); }
  50% { filter: drop-shadow(0 0 8px #7B61FF); }
  100% { filter: drop-shadow(0 0 2px #7B61FF); }
`;

const Navbar = () => {

  return (
    <>
      <CssBaseline />
      <AppBar sx={{
        backgroundColor: 'transparent',
        background: 'linear-gradient(135deg, rgba(15,15,25,0.98) 0%, rgba(25,25,45,0.98) 100%)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: 4, py: 1 }}>
          {/* Left Side - Home Icon and Branding */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: "100%" }}>          
              <IconButton component={Link} to="/dashboard" color="inherit">
                <HomeIcon sx={{ fontSize: 32, color: "#7B61FF" }} />
              </IconButton>            
            <Typography variant="h3" sx={{
              fontFamily: "'Bebas Neue', cursive",
              background: 'linear-gradient(45deg, #7B61FF 30%, #A68FFF 70%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 400,
              letterSpacing: '3px',
              position: 'relative',
              animation: `${glow} 3s ease-in-out infinite`,
              '&:after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #7B61FF, transparent)',
                opacity: 0.3
              }
            }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                <img src={assets.logo} width={50} height={50} style={{ borderRadius: "50%" }} />
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#2c3e50" }}>
                  E-Farm
                </Typography>
              </Box>
            </Typography>
          </Box>

          {/* Right Side - User Avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              alt="User Profile"
              src="https://i.pravatar.cc/50"
              sx={{
                width: 48,
                height: 48,
                border: '2px solid #7B61FF',
                boxShadow: '0 0 15px rgba(123,97,255,0.3)',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 0 25px rgba(123,97,255,0.5)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ height: 50 }} /> {/* Spacer */}
    </>
  );
};

export default Navbar;
