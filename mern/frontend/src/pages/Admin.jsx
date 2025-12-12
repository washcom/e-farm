import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, CssBaseline, AppBar, Toolbar, Typography, IconButton, Drawer, List,
  ListItem, ListItemIcon, ListItemText, Card, createTheme, ThemeProvider, styled,
  useTheme, useMediaQuery, CardContent, Grid, CircularProgress, alpha
} from '@mui/material';
import {
  Menu, ChevronLeft, Dashboard, ShoppingCart, BarChart, Layers, Person, Inventory,
  People, MonetizationOn, AttachMoney, HourglassEmpty, Category, Restore, PersonAdd
} from '@mui/icons-material';

const drawerWidth = 280;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7367f0',
    },
    secondary: {
      main: '#ff9f43',
    },
    background: {
      default: '#161622',
      paper: '#1a1a2a',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'Arial',
      'sans-serif',
    ].join(','),
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

const GlassAppBar = styled(AppBar)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(12px)',
  borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
}));

const GlassDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    background: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(12px)',
    borderRight: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  },
}));

const HoverListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: '8px',
  margin: '4px 8px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.15),
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
  },
}));

const GradientCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
  backdropFilter: 'blur(12px)',
  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
  },
}));

function AdminDashboard() {
  const [users, setUsers] = useState(0); 
  const [paidOrders,setPaidOrders] = useState(0);
  const [totalRevenue,setTotalRevenue] = useState(0);
  const [pendingOrders,setPendingOrders] = useState(0);
  const [totalProducts,setTotalProducts] = useState(0);
  const [totalCategories,setTotalCategories] = useState(0);
  const [refundRequests,setRefundRequests] = useState(0);
  const [newSignups,setNewSignups] = useState(0);  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);

  useEffect(() => {
    const fetchUsersStats = async()=>{
      const response = await fetch('http://localhost:5000/api/admin/total-users',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const data = await response.json();
      setUsers(data);  
      console.log("users:",data);
      setLoading(false);      
    }  
    const fetchTotalItems = async()=>{
      const response = await fetch('http://localhost:5000/api/admin/total-items',{  
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const data = await response.json();
      setTotalProducts(data);
      console.log("total products:",data);  
      setLoading(false);
    }  
    const fetchTotalCategories = async()=>{
      const response = await fetch('http://localhost:5000/api/admin/total-categories',{  
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const data = await response.json();
      setTotalCategories(data.length);
      console.log("total categories:",data.length);  
      setLoading(false);
    } 
    const fetchPaidOrders = async()=>{
      const response = await fetch('http://localhost:5000/api/admin/paid-orders',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const data = await response.json();
      setPaidOrders(data);
      console.log("paid orders:",data);
      setLoading(false);
    }
    const fetchUnpaidOrders = async()=>{
      const response = await fetch('http://localhost:5000/api/admin/unpaid-orders',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const data = await response.json();
      setPendingOrders(data);
      console.log("pending orders:",data);
      setLoading(false);
    }
    const todaysignups = async()=>{
      const response = await fetch('http://localhost:5000/api/admin/todays-signups',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const data = await response.json();
      setNewSignups(data);  
      console.log("new signups:",0);
      setLoading(false);
    }
    const fetchTotalSales = async()=>{
      const response = await fetch('http://localhost:5000/api/admin/total-sales',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const data = await response.json();
      setTotalRevenue(data);
      console.log("total revenue:",data);
      setLoading(false);
    }
    //call the function
    fetchUsersStats();
    fetchTotalItems();
    fetchTotalCategories();
    fetchPaidOrders();
    fetchUnpaidOrders();
    todaysignups();
    fetchTotalSales();
  }, []);

  const handleDrawerToggle = () => setOpen(!open);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex', background: theme.palette.background.default }}>
        <CssBaseline />
        <GlassAppBar position="fixed">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
              <Menu />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '0.5px', ml: 4 }}>
              E-farm Admin
            </Typography>
          </Toolbar>
        </GlassAppBar>
        <GlassDrawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={open}
          onClose={handleDrawerToggle}
          sx={{ '& .MuiDrawer-paper': { width: open ? drawerWidth : 80, transition: 'width 0.3s' } }}
        >
          <Toolbar sx={{ display: 'flex', justifyContent: open ? 'space-between' : 'center', paddingX: 2 }}>
            {open && (
              <Typography variant="h6" sx={{
                background: 'linear-gradient(45deg, #7367f0 30%, #9e95f5 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                letterSpacing: '0.5px'
              }}>
                E-Farm
              </Typography>
            )}
            <IconButton onClick={handleDrawerToggle} sx={{ color: 'text.primary' }}>
              <ChevronLeft sx={{ transform: `rotate(${open ? 0 : 180}deg)`, transition: 'transform 0.3s' }} />
            </IconButton>
          </Toolbar>
          <List>
            {[
              { text: 'Dashboard', icon: <Dashboard />, path: '/admin-dashboard' },
              { text: 'Orders', icon: <ShoppingCart />, path: '/admin-orders' },
              { text: 'Products', icon: <Inventory />, path: '/admin-products' },
              { text: 'Reports', icon: <BarChart />, path: '/reports' },
              { text: 'Users', icon: <Person />, path: '/admin-users' },
            ].map((item, index) => (
              <HoverListItem button key={index} onClick={() => navigate(item.path)}>
                <ListItemIcon sx={{ color: 'text.secondary' }}>{item.icon}</ListItemIcon>
                {open && <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    letterSpacing: '0.25px'
                  }}
                />}
              </HoverListItem>
            ))}
          </List>
        </GlassDrawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: open ? drawerWidth : 5 }}>
          <Toolbar />
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
              <CircularProgress color="secondary" />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {[
                { title: "Total Users", value: users, color: '#7367f0', icon: <People /> },
                { title: "Paid Orders", value: paidOrders, color: '#28c76f', icon: <MonetizationOn /> },
                { title: "Total Revenue", value: `${totalRevenue}`, color: '#ff9f43', icon: <AttachMoney /> },
                { title: "Pending Orders", value: pendingOrders, color: '#ea5455', icon: <HourglassEmpty /> },
                { title: "Total Products", value: totalProducts, color: '#9c27b0', icon: <Inventory /> },
                { title: "Total Categories", value: totalCategories, color: '#00cfe8', icon: <Category /> },             
                
                { title: "New Signups Today", value: newSignups, color: '#4caf50', icon: <PersonAdd /> },
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <GradientCard sx={{ p: 2 }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box sx={{
                          background: alpha(stat.color, 0.6),
                          borderRadius: '15px',
                          p: 1.4,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {React.cloneElement(stat.icon, { sx: { color: stat.color, fontSize: '28px' } })}
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="subtitle2" color="textSecondary">
                            {stat.title}
                          </Typography>
                          <Typography variant="h5" fontWeight={600}>
                            {stat.value}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </GradientCard>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default AdminDashboard;