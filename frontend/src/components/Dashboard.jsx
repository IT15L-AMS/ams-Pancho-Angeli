import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  BookOpenIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'Total Courses', value: '12', icon: BookOpenIcon },
    { name: 'Enrolled Students', value: '245', icon: UserGroupIcon },
    { name: 'Completed', value: '8', icon: AcademicCapIcon },
    { name: 'Average Grade', value: '85%', icon: ChartBarIcon },
  ];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.full_name}!
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Role: <span className="font-medium text-indigo-600">{user?.Role?.name}</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
            >
              <dt>
                <div className="absolute bg-indigo-500 rounded-md p-3">
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </dd>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">
            {user?.Role?.name} Dashboard
          </h2>
          <div className="mt-4 bg-white shadow rounded-lg p-6">
            {user?.Role?.name === 'Admin' && (
              <div>
                <h3 className="text-lg font-medium mb-4">System Overview</h3>
                <p className="text-gray-600">Welcome to the Admin Dashboard. You have full system access.</p>
              </div>
            )}
            {user?.Role?.name === 'Registrar' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Enrollment Management</h3>
                <p className="text-gray-600">Manage student enrollments and academic records.</p>
              </div>
            )}
            {user?.Role?.name === 'Instructor' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Course Management</h3>
                <p className="text-gray-600">Manage your courses and grade students.</p>
              </div>
            )}
            {user?.Role?.name === 'Student' && (
              <div>
                <h3 className="text-lg font-medium mb-4">My Courses</h3>
                <p className="text-gray-600">View your enrolled courses and grades.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;