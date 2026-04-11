import { useState } from 'react'
import './App.css'
import './i18n/index.js'
import "flowbite"
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import SplashScreen from './components/Splashscreen'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './components/Login'
import ForgotPassword from './components/ForgotPassword'
import Register from './components/Register'
import ProductDetail from './components/ProductDetail'
import AddProducts from './components/admin/AddProducts'
import AdminProducts from './components/admin/AdminProduct'
import EditProduct from './components/admin/EditProduct'
import SearchResults from './components/SearchResults'
import NotFound from './pages/NotFound'
import Footer from './components/Footer'
import FavoriteButton from './components/FavoriteButton'
import PrivateRoute from './components/PrivateRoute'
import UserRoute from './components/UserRoute'
import ResetPassword from './components/ResetPassword'
import EcommerceApp from './components/EcommerceApp'
import About from './pages/About'
import Contact from './pages/Contact'
import PaymentComponent from './components/PaymentComponent'
import Welcome from './components/Welcome'
import Store from './components/Store'
import StoresList from './pages/StoresList'
import MyOrders from './pages/MyOrders'
import AdminOrders from './pages/AdminOrders'
import CommissionPage from './pages/seller/CommissionPage'
import NotificationsPage from './components/Notificationbell'
import Profile from './pages/Profile'
import BloggerManagement from './pages/superadmin/BloggerManagement'
import BloggerDashboard from './pages/blogger/BloggerDashboard'
import BloggerRegister from './pages/blogger/BloggerRegister'
import BloggerProducts from './pages/blogger/BloggerProducts'
import AddEditBloggerProduct from './pages/blogger/AddEditBloggerProduct'
import Terms from './pages/Terms'
import SuperAdminLogin from './pages/superadmin/SuperAdminLogin'
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard'
import SuperAdminRegister from './pages/superadmin/SuperAdminRegister'
import SuperAdminRoute from './components/SuperAdminRoute'
import SuperAdminCommissions from './pages/superadmin/SuperAdminCommissions'
import GuestRoute from './components/GuestRoute'
import BloggerLogin from './pages/blogger/BloggerLogin'
import MyBonus from './pages/MyBonus'
import AdminChatPage from './pages/superadmin/AdminChatPage'
import ChatWidget from './components/ChatWidget'
import AuthCallback from './pages/AuthCallback'
import SebetCart from './components/SebetCart'

function AppContent() {
  const location = useLocation()
  const authPaths = ["/", "/login", "/register", "/forgot-password", "/auth/callback"]
  const isAuthPage = authPaths.includes(location.pathname) ||
    location.pathname.startsWith("/password/reset/") ||
    location.pathname.startsWith("/auth/") ||
    location.pathname.startsWith("/superadmin/") ||
    location.pathname.startsWith("/blogger/login") ||
    location.pathname.startsWith("/blogger/register")

  const isWidePage =
    location.pathname.startsWith("/home") ||
    location.pathname.startsWith("/shop") ||
    location.pathname.startsWith("/store/") ||
    location.pathname.startsWith("/product/")

  const shellClassName = isAuthPage
    ? "route-shell route-shell--full"
    : isWidePage
      ? "route-shell route-shell--wide"
      : "route-shell"

  return (
    <div className={isAuthPage ? "" : "app-shell"}>
      {!isAuthPage && <Navbar />}

      <div className={shellClassName}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/home" element={<Home />} />
          <Route path="/store/:slug" element={<Store />} />
          <Route path="/stores" element={<StoresList />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<UserRoute><SebetCart /></UserRoute>} />
          <Route path="/shop" element={<EcommerceApp />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/favori" element={<UserRoute><FavoriteButton /></UserRoute>} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
          <Route path="/payment" element={<UserRoute><PaymentComponent /></UserRoute>} />
          <Route path="/notifications" element={<UserRoute><NotificationsPage /></UserRoute>} />
          <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
          <Route path="/my-orders" element={<UserRoute><MyOrders /></UserRoute>} />
          <Route path="/my-bonus" element={<UserRoute><MyBonus /></UserRoute>} />
          <Route path="/seller/commission" element={<UserRoute><CommissionPage /></UserRoute>} />
          <Route path="/blogger/register" element={<GuestRoute><BloggerRegister /></GuestRoute>} />
          <Route path="/blogger/login" element={<GuestRoute><BloggerLogin /></GuestRoute>} />
          <Route path="/blogger/dashboard" element={<BloggerDashboard />} />
          <Route path="/blogger/products" element={<BloggerProducts />} />
          <Route path="/blogger/add-product" element={<AddEditBloggerProduct />} />
          <Route path="/blogger/edit-product/:id" element={<AddEditBloggerProduct />} />
          <Route path="/superadmin/login" element={<GuestRoute><SuperAdminLogin /></GuestRoute>} />
          <Route path="/superadmin/register" element={<GuestRoute><SuperAdminRegister /></GuestRoute>} />
          <Route path="/superadmin/dashboard" element={<SuperAdminRoute><SuperAdminDashboard /></SuperAdminRoute>} />
          <Route path="/superadmin/commissions" element={<SuperAdminRoute><SuperAdminCommissions /></SuperAdminRoute>} />
          <Route path="/superadmin/bloggers" element={<PrivateRoute><BloggerManagement /></PrivateRoute>} />
          <Route path="/superadmin/chat" element={<SuperAdminRoute><AdminChatPage /></SuperAdminRoute>} />
          <Route path="/admin/orders" element={<PrivateRoute><AdminOrders /></PrivateRoute>} />
          <Route path="/admin/products" element={<PrivateRoute><AdminProducts /></PrivateRoute>} />
          <Route path="/admin/dashboard" element={<PrivateRoute><AdminProducts /></PrivateRoute>} />
          <Route path="/admin/product" element={<PrivateRoute><AddProducts /></PrivateRoute>} />
          <Route path="/admin/create-product" element={<PrivateRoute><AddProducts /></PrivateRoute>} />
          <Route path="/admin/edit-product/:id" element={<PrivateRoute><EditProduct /></PrivateRoute>} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {!isAuthPage && <Footer />}
      {!isAuthPage && <ChatWidget />}
    </div>
  )
}

function App() {
  const [splashDone, setSplashDone] = useState(false)

  return (
    <BrowserRouter>
      <Toaster position='top-center' />
      {!splashDone
        ? <SplashScreen onFinish={() => setSplashDone(true)} />
        : <AppContent />
      }
    </BrowserRouter>
  )
}

export default App
