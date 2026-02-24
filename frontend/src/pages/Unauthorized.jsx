import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.icon}>🚫</h1>
        <h2 style={styles.title}>Access Denied</h2>
        <p style={styles.message}>
          You do not have the correct role permissions (Admin/Staff) to view this page.
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
          
          <button 
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-700 text-sm underline"
          >
            Go to Previous Page
          </button>
        </div>
      </div>
    </div>
  );
};


const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6'
  },
  card: {
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  icon: {
    fontSize: '50px',
    marginBottom: '10px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '10px'
  },
  message: {
    color: '#4b5563',
    marginBottom: '30px'
  }
};

export default Unauthorized;