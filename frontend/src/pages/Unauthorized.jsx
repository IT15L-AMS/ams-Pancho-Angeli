import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <h1 className="text-6xl font-extrabold text-red-600">403</h1>
      <p className="text-xl mt-4">Access Denied: You do not have permission for this page.</p>
      <button 
        onClick={() => navigate('/dashboard')}
        className="mt-6 text-blue-600 underline"
      >
        Go back to Dashboard
      </button>
    </div>
  );
};