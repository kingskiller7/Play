import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleRegister = async (email: string, password: string, name?: string) => {
    try {
      setError('');
      await api.register({name: name || '', email, password});
      navigate('/login');
      console.log('Registration Successfully.');
    } catch (error) {
      console.error('Registration failed:', error);
      console.log('Try again!!');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <AuthForm onSubmit={handleRegister} isLogin={false} />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Register;