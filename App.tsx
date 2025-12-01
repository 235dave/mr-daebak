
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import InventoryPage from './pages/InventoryPage';
import LoginPage from './pages/LoginPage';
import StaffDashboard from './pages/StaffDashboard';
import MenuManagementPage from './pages/MenuManagementPage';
import VoiceControl from './components/VoiceControl';
import { isGeminiConfigured } from './services/geminiService';

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Route wrapper for Staff only
const RequireStaff = ({ children }: { children: React.ReactElement }) => {
    const { user, isStaff } = useAuth();
    if (!user || !isStaff) return <Navigate to="/" replace />;
    return children;
};

// Component to handle root path based on role
const HomeRouter = () => {
    const { isStaff } = useAuth();
    return isStaff ? <StaffDashboard /> : <MenuPage />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <HashRouter>
          {!isGeminiConfigured() && (
             <div className="bg-red-500 text-white text-center text-xs p-1">
               Warning: API_KEY is missing. Voice and AI features will be disabled.
             </div>
          )}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }>
              {/* Home Router decides whether to show Menu (Customer) or Dashboard (Staff) */}
              <Route index element={<HomeRouter />} />
              
              {/* Customer Routes */}
              <Route path="cart" element={<CartPage />} />
              <Route path="orders" element={<OrdersPage />} />
              
              {/* Staff Routes */}
              <Route path="inventory" element={
                  <RequireStaff>
                      <InventoryPage />
                  </RequireStaff>
              } />
              <Route path="menu-manage" element={
                  <RequireStaff>
                      <MenuManagementPage />
                  </RequireStaff>
              } />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <VoiceControl />
        </HashRouter>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
