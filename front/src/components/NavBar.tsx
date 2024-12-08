import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-xl font-bold">Dashboard</Link>
        <Link to="/login" className="text-sm">Login</Link>
        <Link to="/register" className="text-sm">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;