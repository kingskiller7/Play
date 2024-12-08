import React, { useState } from 'react';
import type { FormEvent } from 'react-dom';

type AuthFormProps = {
  onSubmit: (email: string, password: string, name?: string) => void;
  isLogin: boolean;
};

const AuthForm = ({ onSubmit, isLogin }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      onSubmit(name, password);
    } else {
      onSubmit(name, email, password);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-8 bg-white shadow-md rounded-md">
      {!isLogin && (
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700">Email</label>
        <input
          type="email"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700">Password</label>
        <input
          type="password"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md">
        {isLogin ? 'Login' : 'Register'}
      </button>
    </form>
  );
};

export default AuthForm;