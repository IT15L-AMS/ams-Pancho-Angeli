import React from 'react';

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-600 text-white p-6 rounded-t-xl">
          <h1 className="text-3xl font-bold">Admin Control Panel</h1>
          <p>Welcome, {user?.fullName}. You have full system access.</p>
        </div>
        <div className="bg-white p-8 rounded-b-xl shadow-md border">
          <p className="text-gray-600 italic">User management tools will appear here in Phase 2.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;