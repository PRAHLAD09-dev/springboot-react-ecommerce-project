import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen";
import { ToastProvider } from "./components/motion/ToastProvider";
import ScrollProgress from "./components/motion/ScrollProgress";
import BackToTop from "./components/motion/BackToTop";
import PageTransition from "./components/motion/PageTransition";
import { PageLoader } from "./components/ui";

// Eager: core shopping flow, needed for fastest first paint
import ProductList from "./pages/products/ProductList";
import ProductDetail from "./pages/products/ProductDetail";
import NotFound from "./pages/NotFound";
import NoInternet from "./pages/NoInternet";

// Lazy: admin module (code-split — only loaded when an admin visits)
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Users = lazy(() => import("./pages/admin/Users"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const Merchants = lazy(() => import("./pages/admin/Merchants"));
const Promotions = lazy(() => import("./pages/admin/Promotions"));
const Category = lazy(() => import("./pages/admin/Category"));
const AdminShell = lazy(() => import("./layouts/AdminShell"));

// Lazy: merchant module (code-split — only loaded when a merchant visits)
const MerchantShell = lazy(() => import("./layouts/MerchantShell"));
const BecomeMerchant = lazy(() => import("./pages/merchant/BecomeMerchant"));
const MerchantDelete = lazy(() => import("./pages/merchant/MerchantDelete"));
const MerchantProfile = lazy(() => import("./pages/merchant/MerchantProfile"));
const MerchantUpdate = lazy(() => import("./pages/merchant/MerchantUpdate"));
const Product = lazy(() => import("./pages/merchant/Product"));
const MerchantOrders = lazy(() => import("./pages/merchant/Orders"));
const MerchantDashboard = lazy(() => import("./pages/merchant/Dashboard"));
const MerchantSettings = lazy(() => import("./pages/merchant/Settings"));

// Lazy: user account pages (not needed until logged-in user navigates there)
const Profile = lazy(() => import("./pages/user/Profile"));
const UpdateProfile = lazy(() => import("./pages/user/UpdateProfile"));
const ChangePassword = lazy(() => import("./pages/user/ChangePassword"));
const DeleteAccount = lazy(() => import("./pages/user/DeleteAccount"));
const UserOrders = lazy(() => import("./pages/user/Orders"));
const Notifications = lazy(() => import("./pages/user/Notifications"));
const Cart = lazy(() => import("./pages/user/Cart"));
const Address = lazy(() => import("./pages/user/Address"));
const Payment = lazy(() => import("./pages/user/Payment"));

// Lazy: auth pages
const Login = lazy(() => import("./pages/Auth/Login"));
const Signup = lazy(() => import("./pages/Auth/Signup"));
const ForgetPassword = lazy(() => import("./pages/Auth/ForgetPassword"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));
const VerifyOtp = lazy(() => import("./pages/Auth/VerifyOtp"));
const OAuthSuccess = lazy(() => import("./pages/Auth/OAuthSuccess"));

// Lazy: rarely-hit error pages
const ServerError = lazy(() => import("./pages/ServerError"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const SessionExpired = lazy(() => import("./pages/SessionExpired"));

function App() {
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem("splashShown"));
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  const finishSplash = () => {
    sessionStorage.setItem("splashShown", "true");
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={finishSplash} />;
  }

  if (isOffline) {
    return <NoInternet />;
  }

  return (
    <ToastProvider>
    <BrowserRouter>

      <ScrollProgress />
      <Navbar />

      <div className="flex min-h-screen flex-col bg-ink-50">

        <div className="flex-1">

          <PageTransition>
          <Suspense fallback={<PageLoader label="Loading page" />}>
          <Routes>

            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            <Route element={<AdminShell />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/merchants" element={<Merchants />} />
              <Route path="/admin/promotions" element={<Promotions />} />
              <Route path="/admin/categories" element={<Category />} />
            </Route>

            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/update" element={<UpdateProfile />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
            <Route path="/orders" element={<UserOrders />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/address" element={<Address />} />
            <Route path="/payment/:orderId" element={<Payment />} />

            <Route path="/become-merchant" element={<BecomeMerchant />} />
            <Route element={<MerchantShell />}>
              <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
              <Route path="/merchant/profile" element={<MerchantProfile />} />
              <Route path="/merchant/update" element={<MerchantUpdate />} />
              <Route path="/merchant/delete" element={<MerchantDelete />} />
              <Route path="/merchant/products" element={<Product />} />
              <Route path="/merchant/orders" element={<MerchantOrders />} />
              <Route path="/merchant/settings" element={<MerchantSettings />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />

            <Route path="/500" element={<ServerError />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/session-expired" element={<SessionExpired />} />
            <Route path="/no-internet" element={<NoInternet />} />
            <Route path="*" element={<NotFound />} />

          </Routes>
          </Suspense>
          </PageTransition>

        </div>

        <Footer />

      </div>

      <BackToTop />

    </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
