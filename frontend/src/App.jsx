import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";

import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Products from "./pages/admin/Product";
import Orders from "./pages/admin/Orders";
import Merchants from "./pages/admin/Merchants";
import Promotions from "./pages/admin/Promotions";

import Profile from "./pages/user/Profile";
import UpdateProfile from "./pages/user/UpdateProfile";
import ChangePassword from "./pages/user/ChangePassword";
import DeleteAccount from "./pages/user/DeleteAccount";

import MerchantProfile from "./pages/merchant/MerchantProfile";
import MerchantUpdate from "./pages/merchant/MerchantUpdate";
import MerchantChangePassword from "./pages/merchant/MerchantChangePassword";
import MerchantDelete from "./pages/merchant/MerchantDelete";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import ResetPassword from "./pages/Auth/ResetPassword";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/merchants" element={<Merchants />} />
          <Route path="/admin/promotions" element={<Promotions />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/update" element={<UpdateProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/delete-account" element={<DeleteAccount />} />

          <Route path="/merchant/profile" element={<MerchantProfile />} />
          <Route path="/merchant/update" element={<MerchantUpdate />} />
          <Route path="/merchant/change-password" element={<MerchantChangePassword />} />
          <Route path="/merchant/delete" element={<MerchantDelete />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;