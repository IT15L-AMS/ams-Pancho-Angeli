import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-slate-800 text-white shadow-md">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="text-xl font-bold tracking-tight">
          🎓 Academic Management System <span className="text-blue-400">Portal</span>
        </Link>
        
        {user && (
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded ml-4">
            Role: {user.role}
          </span>
        )}
      </div>

      <div className="space-x-4">
        {!user ? (
          <>
            <Link to="/login" className="hover:text-blue-300">Login</Link>
            <Link to="/register" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Join</Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300 italic">Welcome, {user.fullName}</span>
            <button 
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;