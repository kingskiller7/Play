import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile(token)
        .then(data => setProfile(data))
        .catch(() => navigate('/login'));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {profile.name} to this New World.</h1>
    </div>
  );
};

export default Home;