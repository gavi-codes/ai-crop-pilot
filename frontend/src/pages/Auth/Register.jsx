import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/authService';
import { Leaf, User, Lock, ArrowRight, ShieldCheck, Phone, MapPin, Pickaxe, Maximize, Droplets } from 'lucide-react';

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
                       `Connection Error: Could not reach the server. Please try again.`;
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const InputWrapper = ({ icon: Icon, children, label }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-[#17221D] ml-1">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-slate-400" />
          </div>
        )}
        {children}
      </div>
    </div>
  );

  const inputClass = "w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-[#17221D] rounded-xl focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all outline-none appearance-none";
  const selectClass = "w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 text-[#17221D] rounded-xl focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all outline-none appearance-none";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7FAF8] p-4 py-12 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none fixed">
        <div className="absolute -top-[10%] -right-[5%] w-[50%] h-[50%] rounded-full bg-[#DCFCE7]/40 blur-3xl"></div>
        <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-[#DCFCE7]/40 blur-3xl"></div>
      </div>

      <div className="w-full max-w-3xl relative group">
        
        <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-[#16A34A]/10 transition-all duration-500 overflow-hidden relative">
          
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#DCFCE7]/50 rounded-bl-full -z-10 transition-colors duration-500"></div>

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-4 bg-[#DCFCE7] text-[#16A34A] rounded-2xl mb-4 group-hover:bg-[#16A34A] group-hover:text-white transition-colors duration-500 shadow-sm">
              <Leaf className="w-10 h-10" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B3D2E] tracking-tight">Create Account</h1>
            <p className="text-[#64748B] mt-2 font-medium">Join AI CropPilot for precision agricultural intelligence.</p>
          </div>
          
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWrapper icon={User} label="Full Name">
                <input type="text" name="name" onChange={handleChange} className={inputClass} placeholder="John Doe" required />
              </InputWrapper>
              
              <InputWrapper icon={Phone} label="Mobile Number">
                <input type="tel" name="mobile" onChange={handleChange} className={inputClass} placeholder="10-digit number" required />
              </InputWrapper>

              <InputWrapper icon={Lock} label="Password">
                <input type="password" name="password" onChange={handleChange} className={inputClass} placeholder="••••••••" required />
              </InputWrapper>

              <InputWrapper icon={MapPin} label="District">
                <input type="text" name="district" onChange={handleChange} className={inputClass} placeholder="e.g. Bangalore" required />
              </InputWrapper>

              <InputWrapper icon={Pickaxe} label="Farmer Type">
                <select name="farmer_type" onChange={handleChange} className={selectClass}>
                  <option value="Individual">Individual Farmer</option>
                  <option value="FPO">FPO Member</option>
                  <option value="Commercial">Commercial/Corporate</option>
                  <option value="Contract">Contract Farmer</option>
                </select>
              </InputWrapper>

              <InputWrapper icon={Maximize} label="Land Size (Acres)">
                <input type="number" step="0.1" name="land_size" onChange={handleChange} className={inputClass} placeholder="e.g. 2.5" required />
              </InputWrapper>

              <InputWrapper icon={Droplets} label="Primary Soil Type">
                <select name="soil_type" onChange={handleChange} className={selectClass}>
                  <option value="Red Soil">Red Soil</option>
                  <option value="Black Soil">Black Cotton Soil</option>
                  <option value="Alluvial Soil">Alluvial Soil</option>
                  <option value="Clayey Soil">Clayey Soil</option>
                  <option value="Sandy Soil">Sandy Soil</option>
                </select>
              </InputWrapper>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 px-6 bg-[#0B3D2E] text-white font-bold text-lg rounded-xl hover:bg-[#16A34A] transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-[#0B3D2E]/20 hover:shadow-[#16A34A]/30 disabled:opacity-70 group/btn"
              >
                {isLoading ? 'Creating Account...' : 'Complete Registration'}
                {!isLoading && <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-[#64748B] font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-[#16A34A] font-bold hover:text-[#0B3D2E] transition-colors">
              Sign in securely
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
