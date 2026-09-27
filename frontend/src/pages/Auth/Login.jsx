import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/authService';
import { Leaf, User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

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
                       `Connection Error: Could not reach the server. Please try again.`;
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7FAF8] p-4 relative overflow-hidden">
      {/* Decorative background shapes mimicking the dashboard hover effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[#DCFCE7]/40 blur-3xl"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#DCFCE7]/40 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative group">
        
        {/* Main Card container mimicking the 'Operations Command' workers design */}
        <div className="bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-[#16A34A]/10 transition-all duration-500 overflow-hidden relative">
          
          {/* Top right decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#DCFCE7]/50 rounded-bl-full -z-10 transition-colors duration-500"></div>

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-[#DCFCE7] text-[#16A34A] rounded-2xl mb-4 group-hover:bg-[#16A34A] group-hover:text-white transition-colors duration-500 shadow-sm">
              <Leaf className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#0B3D2E] tracking-tight">AI CropPilot</h1>
            <p className="text-[#64748B] mt-2 font-medium">Welcome back, securely sign in to your dashboard.</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#17221D] ml-1">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-[#17221D] rounded-xl focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all outline-none" 
                  placeholder="Enter your registered mobile" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#17221D] ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-[#17221D] rounded-xl focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all outline-none" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-2 py-4 px-6 bg-[#0B3D2E] text-white font-semibold rounded-xl hover:bg-[#16A34A] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#0B3D2E]/20 hover:shadow-[#16A34A]/30 disabled:opacity-70 group/btn"
            >
              {isLoading ? 'Authenticating...' : 'Sign In Securely'}
              {!isLoading && <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#64748B] font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#16A34A] font-bold hover:text-[#0B3D2E] transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
