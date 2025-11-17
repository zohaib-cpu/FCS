import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css'; // new CSS file for styling

export default function Dashboard() {
  const [forms, setForms] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await API.get('/forms');
      setForms(res.data);
    } catch (err) {
      console.error('Failed to load forms', err);
    }
  };

  return (
    <div className="dashboard-page">
          {user && (
  <button
    className="logout-btn bounce-hover"
    onClick={() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }}
  >
    Logout
  </button>
)}
      <h1 className="dashboard-header">Feedback Collection System</h1>
  


      <div className="dashboard-container">
        {user && <p className="welcome-text">Welcome, <strong>{user.name}</strong> ({user.role})</p>}

        {user?.role !== 'student' && (
          <button
            className="submit-btn1 bounce-hover"
            onClick={() => navigate('/formbuilder')}
          >
            Create Form
          </button>
        )}

<h3 className="form-section-title">Available Forms</h3>
<div className="form-grid">
  {forms.map(f => (
    <div
      key={f._id}
      className="form-card"
      onClick={() => navigate(`/forms/${f._id}`)}
    >
      <div className="form-card-header">
        <h4 className="form-card-title">{f.title}</h4>
      </div>
      <div className="form-card-body">
        <p className="form-card-desc">{f.description}</p>
      </div>
    </div>
  ))}
</div>


      </div>
    </div>
  );
}
