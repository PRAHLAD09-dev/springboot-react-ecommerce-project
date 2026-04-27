import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";


import ProductList from "./pages/products/ProductList";
import ProductDetail from "./pages/products/ProductDetail";

import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import AdminOrders from "./pages/admin/Orders";
import Merchants from "./pages/admin/Merchants";
import Promotions from "./pages/admin/Promotions";
import Category from "./pages/admin/Category";

import Profile from "./pages/user/Profile";
import UpdateProfile from "./pages/user/UpdateProfile";
import ChangePassword from "./pages/user/ChangePassword";
import DeleteAccount from "./pages/user/DeleteAccount";
import UserOrders from "./pages/user/Orders";
import Cart from "./pages/user/Cart";
import Address from "./pages/user/Address";
import Payment from "./pages/user/Payment";

import MerchantProfile from "./pages/merchant/MerchantProfile";
// import MerchantUpdate from "./pages/merchant/MerchantUpdate";
// import MerchantDelete from "./pages/merchant/MerchantDelete";
import Product from "./pages/merchant/Product";
import MerchantOrders from "./pages/merchant/Orders";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import VerifyOtp from "./pages/Auth/VerifyOtp";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="p-4">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/merchants" element={<Merchants />} />
          <Route path="/admin/promotions" element={<Promotions />} />
          <Route path="/admin/categories" element={<Category />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/update" element={<UpdateProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
          <Route path="/orders" element={<UserOrders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/address" element={<Address />} />
          <Route path="/payment/:orderId" element={<Payment />} />

          <Route path="/merchant/profile" element={<MerchantProfile />} />
          {/* <Route path="/merchant/update" element={<MerchantUpdate />} />
          <Route path="/merchant/delete" element={<MerchantDelete />} /> */}
          <Route path="/merchant/products" element={<Product />} />
          <Route path="/merchant/orders" element={<MerchantOrders />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;