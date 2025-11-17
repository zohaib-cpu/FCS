import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';
import FormSubmit from './pages/FormSubmit';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 12, borderBottom: '1px solid #eee' }}>
        <Link to="/" style={{ marginRight: 8 }}>Home</Link>
        <Link to="/dashboard" style={{ marginRight: 8 }}>Dashboard</Link>
        <Link to="/login" style={{ marginRight: 8 }}>Login</Link>
        <Link to="/register">Register</Link>
      </nav>

      <div style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<h2>Welcome to FMS (Feedback Management System)</h2>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forms/new" element={<FormBuilder />} />
          <Route path="/forms/:id" element={<FormSubmit />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
