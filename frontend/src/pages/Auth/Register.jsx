import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/authService';
import { Leaf } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', mobile: '', password: '', district: '', farmer_type: 'Individual', land_size: '', soil_type: 'Red Soil'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
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
                       `Dev Error: Request failed with status code ${err.response?.status}. URL: ${err.config?.baseURL}${err.config?.url}`;
      setError(errorMsg);
    }
  };

  const inputClass = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-600 focus:border-emerald-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500";
  const labelClass = "block mb-2 text-sm font-medium text-gray-900 dark:text-white";

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
          <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
              <div className="p-1.5 bg-emerald-500 rounded-lg mr-3 shadow-lg shadow-emerald-500/20">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              AI CropPilot    
          </Link>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-2xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Create an account
                  </h1>
                  
                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
                      {error}
                    </div>
                  )}

                  <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <label htmlFor="name" className={labelClass}>Full Name</label>
                            <input type="text" name="name" id="name" onChange={handleChange} className={inputClass} placeholder="Enter full name" required />
                        </div>
                        <div>
                            <label htmlFor="mobile" className={labelClass}>Mobile Number</label>
                            <input type="text" name="mobile" id="mobile" onChange={handleChange} className={inputClass} placeholder="Enter 10-digit mobile" required />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <label htmlFor="district" className={labelClass}>District / Region</label>
                            <input type="text" name="district" id="district" onChange={handleChange} className={inputClass} placeholder="e.g. Pune" required />
                        </div>
                        <div>
                            <label htmlFor="land_size" className={labelClass}>Land Size (Acres)</label>
                            <input type="number" step="0.1" name="land_size" id="land_size" onChange={handleChange} className={inputClass} placeholder="e.g. 5.5" required />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <label htmlFor="soil_type" className={labelClass}>Soil Type</label>
                            <select name="soil_type" id="soil_type" onChange={handleChange} value={formData.soil_type} className={inputClass}>
                              <option value="Red Soil">Red Soil</option>
                              <option value="Black Soil">Black Soil</option>
                              <option value="Clayey Soil">Clayey Soil</option>
                              <option value="Sandy Soil">Sandy Soil</option>
                              <option value="Alluvial Soil">Alluvial Soil</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="farmer_type" className={labelClass}>Farmer Type</label>
                            <select name="farmer_type" id="farmer_type" onChange={handleChange} value={formData.farmer_type} className={inputClass}>
                              <option value="Individual">Individual</option>
                              <option value="Commercial">Commercial</option>
                              <option value="Cooperative">Cooperative</option>
                            </select>
                        </div>
                      </div>
                      
                      <div>
                          <label htmlFor="password" className={labelClass}>Password</label>
                          <input type="password" name="password" id="password" onChange={handleChange} placeholder="••••••••" className={inputClass} required />
                      </div>

                      <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-emerald-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-emerald-600 dark:ring-offset-gray-800" required />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
                              I accept the <a className="font-medium text-emerald-600 hover:underline dark:text-emerald-500" href="#">Terms and Conditions</a>
                            </label>
                          </div>
                      </div>
                      <button type="submit" className="w-full text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800 transition-colors">
                        Create an account
                      </button>
                      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                          Already have an account? <Link to="/login" className="font-medium text-emerald-600 hover:underline dark:text-emerald-500">Login here</Link>
                      </p>
                  </form>
              </div>
          </div>
      </div>
    </section>
  );
};

export default Register;
