import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MenuPage from './pages/customer/MenuPage';
import CartPage from './pages/customer/CartPage';
import OrderStatusPage from './pages/customer/OrderStatusPage';
import LoginPage from './pages/auth/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ClientOrdersPage from './pages/client/ClientOrdersPage';
import MenuManagementPage from './pages/client/MenuManagementPage';
import TablesPage from './pages/client/TablesPage';
import DashboardLayout from './layouts/DashboardLayout';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Public / Customer Routes */}
          <Route path="/menu/:restaurantId/:tableId" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-status/:orderId" element={<OrderStatusPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="client/orders" element={<ClientOrdersPage />} />
            <Route path="client/menu" element={<MenuManagementPage />} />
            <Route path="client/tables" element={<TablesPage />} />
          </Route>

        </Routes>
        <ToastContainer position="bottom-right" />
      </Router>
    </CartProvider>
  );
}

export default App;
