import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box, Avatar } from '@mui/material';
import { Menu, Home, AccountCircle, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = ({ onMenuToggle }) => {
  const navigate = useNavigate();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'rgba(15, 15, 25, 0.9)', 
        backdropFilter: 'blur(8px)', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)' 
      }}
    >
      <Toolbar>
        {/* Menu Icon for Sidebar Toggle */}
        <IconButton color="inherit" edge="start" onClick={onMenuToggle} sx={{ mr: 2 }}>
          <Menu />
        </IconButton>

        {/* E-Farm Branding */}
        <Typography 
          variant="h3" 
          noWrap 
          sx={{ 
            fontWeight: 700, 
            fontFamily: "'Bebas Neue', cursive",
            letterSpacing: '1px', 
            flexGrow: 1, 
            background: 'linear-gradient(45deg, #7B61FF 30%, #A68FFF 70%)',
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}
        >
          E-Farm 
        </Typography>

        {/* Navigation Buttons */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          <Button color="inherit" startIcon={<Home />} onClick={() => navigate('/admin-dashboard')}>Home</Button>
          <Button color="inherit" startIcon={<AccountCircle />} onClick={() => navigate('/account')}>Account</Button>
          <Button color="inherit" startIcon={<ExitToApp />} onClick={() => navigate('/logout')}>Logout</Button>
        </Box>

        {/* Profile Avatar */}
        <Avatar sx={{ bgcolor: '#4cc9f0', cursor: 'pointer', ml: 2 }} onClick={() => navigate('/account')}>
          A
        </Avatar>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
