import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import AccountDetail from './pages/AccountDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAccounts from './pages/admin/AdminAccounts';
import AdminAccountForm from './pages/admin/AdminAccountForm';
import AdminUsers from './pages/admin/AdminUsers';

import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d1220',
              color: '#e2e8f0',
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: '12px',
              fontFamily: "'Inter', sans-serif",
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#0d1220' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#0d1220' } },
          }}
        />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <>
                  <Navbar />
                  <AdminLayout />
                </>
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="accounts" element={<AdminAccounts />} />
            <Route path="accounts/create" element={<AdminAccountForm />} />
            <Route path="accounts/:id/edit" element={<AdminAccountForm />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/accounts/:id" element={<AccountDetail />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

