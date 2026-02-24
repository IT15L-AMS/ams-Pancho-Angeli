import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome, {user?.fullName}!</h1>
      <p className="text-gray-600 mt-2">Logged in as: <span className="font-bold text-blue-600">{user?.role}</span></p>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow rounded">Dashboard Analytics</div>
        
        {/* Only Admin sees this button */}
        {user?.role === 'Admin' && (
          <button className="p-4 bg-red-100 text-red-700 rounded border border-red-200">
            Admin Secret Settings
          </button>
        )}
      </div>

      <button onClick={logout} className="mt-8 bg-gray-800 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
};