import { Container } from "@mui/material";
import Navbar from "./components/navbar";
import AdminNavbar from "./components/AdminNavbar";
import SignAndLogin from "./components/signupAndLogin";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import UpdateProfile from "./pages/updateProfile";
import VerifyOtp from "./pages/verifyAccount";
import Productsdisplay from "./pages/homepage";
import Create from "./pages/create";
import Dashboard from "./pages/Dashboard";
import MyWishlist from "./pages/myWishlist";
import MyProducts from "./pages/MyProducts";
import Mycart from "./pages/Mycart";
import AdminDashboard from "./pages/Admin";
import AdminUsers from './pages/AdminUserlist';
import AdminOrder from './pages/AdminOrderItem';
import AddItem from './pages/registerItem';
import AdminProducts from "./pages/AdminProducts";
import Store from "./pages/shop";
import MyWallet from "./pages/mywallet";
import Profile from "./pages/profile";
import MyOrders from "./pages/myOrders";
import Checkout from "./pages/checkout";
import Receipt from "./pages/orderReceipt";
import UpdateItem from "./pages/updateItem";

import { Route, Routes, useLocation } from "react-router-dom";
const App = () => {
  const location = useLocation();
  return (
    <Container sx={{
      margin: 0,
      padding: 0,
    }} >
      {location.pathname !== "/" && location.pathname !== "/admin-dashboard" && <Navbar />}
      {(location.pathname === "/login" || location.pathname === "/signup") && <SignAndLogin />}

      {(location.pathname === '/admin-orders' || location.pathname === '/admin-users' || location.pathname === '/admin-products') && <AdminNavbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/send-otp" element={<VerifyOtp />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/go-shopping" element={<Store />} />
        <Route path="/myproducts" element={<MyProducts />} />
        <Route path="/my-cart" element={<Mycart />} />
        <Route path="/my-wallet" element={<MyWallet />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-orders" element={<MyOrders />} />

        <Route path="/checkout"element={<Checkout/>}/>
        <Route path="/checkout/:orderId" element={<Checkout />} />
        <Route path="/receipt" element={<Receipt/>}/>
        <Route path="/receipt/:orderId" element={<Receipt/>}/>
        <Route path="/edit-item" element={<UpdateItem/>}/>
        <Route path="/edit-item/:itemId" element={<UpdateItem/>}/>


        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/user-products" element={<Productsdisplay />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/products" element={<Productsdisplay />} />
        <Route path="/create" element={<Create />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-orders" element={<AdminOrder />} />
        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/admin-products" element={<AdminProducts />} />
        <Route path="/mywishlist" element={<MyWishlist />} />        
      </Routes>
    </Container>
  );
};
export default App;
