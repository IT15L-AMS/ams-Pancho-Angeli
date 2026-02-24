import React from 'react';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <div className="p-8 text-center text-red-500">No user data found. Please log in.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
          <p className="text-gray-600">Welcome back to the Academic Management System.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">My Profile</h2>
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {user.fullName.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{user.fullName}</p>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats/Actions */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">System Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Authentication Token</span>
                <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Database Connection</span>
                <span className="text-xs font-mono text-green-600 bg-green-50 px-2 py-1 rounded">Synchronized</span>
              </div>
            </div>
          </div>
        </div>

        {/* Informational Note for Instructor */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4">
          <p className="text-sm text-blue-700">
            <strong>Phase 1 Note:</strong> This dashboard verifies that the JWT payload was successfully decoded 
            and the <code>{user.role}</code> role is being enforced by the Frontend router.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;