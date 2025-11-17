import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';
import FormSubmit from './pages/FormSubmit';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/formbuilder" element={<FormBuilder />} /> {/* match Dashboard button */}
        <Route path="/forms/:id" element={<FormSubmit />} />    {/* match Dashboard links */}
      </Routes>
    </Router>
  );
}

export default App;
