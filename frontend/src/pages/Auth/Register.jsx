import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/authService';

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
    try {
      const result = await authService.register(formData);
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-field-light py-10 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-field-dark">Join AI CropPilot</h2>
          <p className="text-field-text mt-2">Start managing your farm smarter</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-field-dark mb-1">Full Name</label>
            <input type="text" name="name" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-field-accent outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-field-dark mb-1">Mobile Number</label>
            <input type="text" name="mobile" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-field-accent outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-field-dark mb-1">Password</label>
            <input type="password" name="password" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-field-accent outline-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-field-dark mb-1">District</label>
              <input type="text" name="district" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-field-accent outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-field-dark mb-1">Land Size (Acres)</label>
              <input type="number" step="0.1" name="land_size" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-field-accent outline-none" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-field-dark mb-1">Soil Type</label>
              <select name="soil_type" onChange={handleChange} value={formData.soil_type} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-field-accent outline-none">
                <option value="Red Soil">Red Soil</option>
                <option value="Black Soil">Black Soil</option>
                <option value="Clayey Soil">Clayey Soil</option>
                <option value="Sandy Soil">Sandy Soil</option>
                <option value="Alluvial Soil">Alluvial Soil</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-field-dark mb-1">Farmer Type</label>
              <select name="farmer_type" onChange={handleChange} value={formData.farmer_type} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-field-accent outline-none">
                <option value="Individual">Individual</option>
                <option value="Commercial">Commercial</option>
                <option value="Cooperative">Cooperative</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-field-accent text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors mt-6">
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-field-text">
          Already have an account? <Link to="/login" className="text-field-accent font-medium hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
