import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ActivationPage from "./pages/ActivationPage";
import { ToastContainer } from "react-toastify";
import HomePage from "./pages/HomePage.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "./components/layout/Layout.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import FAQPage from "./pages/FAQpage.jsx";
import BestSelling from "./pages/BestSelling.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProtectedRoute from "./routes/Protected.jsx";
import ShopCreatePage from "./pages/ShopCreatePage.jsx";
import ShopLoginPage from "./pages/ShopLoginPage.jsx";
import { LoadSeller } from "./redux/actions/seller"; // adjust path
import { loadUser } from "./redux/actions/user";
import SellerProtected from "./routes/SellerProtected.jsx";
import ShopLayout from "./components/Shop/shoplayout.jsx";
import ShopDetailPage from "./components/Shop/ShopDetailPage.jsx";
import CreateProductPage from "./pages/CreateProduct.jsx";
import { loadProducts } from "./redux/actions/product.js";
import ShopAllProductsPage from "./components/Shop/ShopAllProductsPage.jsx";
import EditProductPage from "./pages/EditProductPage.jsx";
import CreateEventPage from "./pages/CreateEvent.jsx";
import { fetchEvents } from "./redux/actions/Events.js";
import ShopAllEventsPage from "./pages/AllEvents.jsx";
import CouponManagementPage from "./pages/CouponManagementPage .jsx";
import AllEventsPage from "./pages/AllEventPage.jsx";
import EventDetailPage from "./pages/EventDetailpage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import { PaymentSuccess } from "./pages/PaymentSucess.jsx";
import ShopOrderManagement from "./pages/ShopOrders.jsx";
import ShopDashboard from "./pages/ShopDashbaord.jsx";
import OrderDetailsPage from "./pages/OrderDetailPage.jsx";
import ShopRefundPage from "./pages/ShopRefundPage.jsx";
import ShopSettings from "./pages/ShopSettingPage.jsx";
import InboxPage from "./pages/ShopInboxppage.jsx";
import WithdrawPage from "./pages/WithdrawPage.jsx";
import AdminDashboard from "./pages/Admin.jsx";
import EditEventPage from "./pages/EventEditpage.jsx";
function App() {
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  useEffect(() => {
    dispatch(loadUser());
    dispatch(LoadSeller());
    dispatch(loadProducts());
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path={"/"} element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Login register={true} />} />
          <Route path=":type/activation/:token" element={<ActivationPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="event" element={<AllEventsPage />} />
          <Route path="event/:id" element={<EventDetailPage />} />

          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path={"faq"} element={<FAQPage />} />
          <Route path={"best-selling"} element={<BestSelling />} />
          <Route path={"/Shop/:id"} element={<ShopDetailPage />} />
          <Route path={"checkout"} element={<CheckoutPage />} />
          <Route path={"order/:id"} element={<OrderDetailsPage />} />
          <Route path={"payment-success"} element={<PaymentSuccess />} />
        </Route>
        <Route path={"/Shop/create"} element={<ShopCreatePage />} />
        <Route path={"/Shop/login"} element={<ShopLoginPage />} />
        <Route path={"/Shop/:id"} element={<ShopDetailPage />} />

        <Route
          path="/dashboard/:tab?"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shop/dashboard"
          element={
            <SellerProtected>
              <ShopLayout />
            </SellerProtected>
          }
        >
          <Route index element={<ShopDashboard />} />
          <Route path="products" element={<ShopAllProductsPage />} />
          <Route path="products/edit/:id" element={<EditProductPage />} />
          <Route path="events/edit/:id" element={<EditEventPage />} />
          <Route path="events/create" element={<CreateEventPage />} />
          <Route path="events" element={<ShopAllEventsPage />} />
          <Route path="products/create" element={<CreateProductPage />} />
          <Route path="coupons" element={<CouponManagementPage />} />
          <Route path="orders" element={<ShopOrderManagement />} />
          <Route path="refunds" element={<ShopRefundPage />} />
          <Route path="settings" element={<ShopSettings />} />
          <Route path="inbox" element={<InboxPage userType={"seller"} />} />
          <Route path="Withdraw" element={<WithdrawPage />} />
        </Route>
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;
