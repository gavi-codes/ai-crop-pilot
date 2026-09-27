import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/authService';
import { Leaf } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', mobile: '', password: '', district: '', farmer_type: 'Individual', land_size: '', soil_type: 'Red Soil'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const cleanData = {
      ...formData,
      mobile: formData.mobile.trim(),
      password: formData.password.trim()
    };

    try {
      const result = await authService.register(cleanData);
      if (result.success) {
        navigate('/login');
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

  const inputClass = "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500";
  const labelClass = "block mb-2 text-sm font-medium text-gray-900 dark:text-white";

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
          <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
              <Leaf className="w-8 h-8 mr-2 text-green-600" />
              AI CropPilot    
          </Link>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-2xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Create an account
                  </h1>
                  
                  {error && (
                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                      {error}
                    </div>
                  )}

                  <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className={labelClass}>Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="John Doe" required />
                        </div>
                        <div>
                            <label htmlFor="mobile" className={labelClass}>Mobile Number</label>
                            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className={inputClass} placeholder="10-digit number" required />
                        </div>
                        <div>
                            <label htmlFor="password" className={labelClass}>Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputClass} placeholder="••••••••" required />
                        </div>
                        <div>
                            <label htmlFor="district" className={labelClass}>District</label>
                            <input type="text" name="district" value={formData.district} onChange={handleChange} className={inputClass} placeholder="e.g. Bangalore" required />
                        </div>
                        <div>
                            <label htmlFor="farmer_type" className={labelClass}>Farmer Type</label>
                            <select name="farmer_type" value={formData.farmer_type} onChange={handleChange} className={inputClass}>
                              <option value="Individual">Individual Farmer</option>
                              <option value="FPO">FPO Member</option>
                              <option value="Commercial">Commercial/Corporate</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="land_size" className={labelClass}>Land Size (Acres)</label>
                            <input type="number" step="0.1" name="land_size" value={formData.land_size} onChange={handleChange} className={inputClass} placeholder="e.g. 2.5" required />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="soil_type" className={labelClass}>Primary Soil Type</label>
                            <select name="soil_type" value={formData.soil_type} onChange={handleChange} className={inputClass}>
                              <option value="Red Soil">Red Soil</option>
                              <option value="Black Soil">Black Cotton Soil</option>
                              <option value="Alluvial Soil">Alluvial Soil</option>
                              <option value="Clayey Soil">Clayey Soil</option>
                              <option value="Sandy Soil">Sandy Soil</option>
                            </select>
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-50"
                      >
                        {isLoading ? 'Creating Account...' : 'Create an account'}
                      </button>
                      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                          Already have an account? <Link to="/login" className="font-medium text-green-600 hover:underline dark:text-green-500">Login here</Link>
                      </p>
                  </form>
              </div>
          </div>
      </div>
    </section>
  );
};

export default Register;
