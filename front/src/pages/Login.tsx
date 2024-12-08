import React from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (name: string, password: string) => {
    try {
      const response = await api.login({name, password});
      localStorage.setItem('token', response.token);
      navigate('/');
      console.log('Login Successfully.');
    } catch (error) {
      console.error('Login failed', error);
      console.log('Try again!!');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <AuthForm onSubmit={handleLogin} isLogin={true} />
    </div>
  );
};

export default Login;