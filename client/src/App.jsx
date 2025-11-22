// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // For notifications
import { useAuth } from './context/AuthContext';

// Import Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddJob from './pages/AddJob';
import Kanban from './pages/Kanban';
import Analytics from './pages/Analytics';

// Import Components
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import EditJob from './pages/EditJob';
import Register from './pages/Register';
import Extension from './pages/Extension';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Global Notification System */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      
      {/* Show Navbar only if logged in */}
      {isAuthenticated && <NavBar />}

      <Routes>
        {/* Public Route: Login Page */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
        />
        {/* <Route path="/register" element={<Register />} /> */}

        {/* --- Protected Routes --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-job" element={<AddJob />} />
          
          {/* --- EDIT JOB ROUTE --- */}
          <Route path="/edit-job/:id" element={<EditJob />} />

          <Route path="/kanban" element={<Kanban />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>

        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} 
        />
        <Route path="/extension" element={<Extension />} />
        {/* Fallback route - if no other route matches */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </>
  );
}

export default App;