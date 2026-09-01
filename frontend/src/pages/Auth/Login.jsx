import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/authService';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await authService.login({ 
        mobile: mobile.trim(), 
        password: password.trim() 
      });
      if (result.success) {
        localStorage.setItem('access_token', result.data.access_token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                       `Dev Error: ${err.message}. Status: ${err.response?.status}. URL: ${err.config?.baseURL}${err.config?.url}`;
      setError(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-field-light px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-field-dark">AI CropPilot</h2>
          <p className="text-field-text mt-2">Welcome back to the field</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-field-dark mb-1">Mobile Number</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-field-accent focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-field-dark mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-field-accent focus:border-transparent outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-field-accent text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-field-text">
          Don't have an account? <Link to="/register" className="text-field-accent font-medium hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
