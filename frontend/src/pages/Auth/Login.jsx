import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/authService';
import { Leaf } from 'lucide-react';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
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
                       'Connection Error: Could not reach the server. Please verify your database connection.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
              <Leaf className="w-8 h-8 mr-2 text-green-600" />
              AI CropPilot    
          </Link>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Sign in to your account
                  </h1>
                  
                  {error && (
                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                      {error}
                    </div>
                  )}

                  <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                      <div>
                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Mobile Number</label>
                          <input 
                            type="tel" 
                            name="mobile" 
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="e.g. 9876543210" 
                            required 
                          />
                      </div>
                      <div>
                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                          <input 
                            type="password" 
                            name="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            required 
                          />
                      </div>
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-50"
                      >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                      </button>
                      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                          Don’t have an account yet? <Link to="/register" className="font-medium text-green-600 hover:underline dark:text-green-500">Sign up</Link>
                      </p>
                  </form>
              </div>
          </div>
      </div>
    </section>
  );
};

export default Login;
