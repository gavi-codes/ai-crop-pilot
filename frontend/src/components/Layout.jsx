import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sprout, 
  FlameKindling, // Can use for fertilizer or drop
  Droplet, 
  CloudSun, 
  Scan, 
  TrendingUp, 
  LogOut, 
  Menu, 
  X, 
  User as UserIcon,
  Leaf,
  MessageSquare,
  Award,
  PhoneCall,
  Clock,
  Shield,
  Calendar
} from 'lucide-react';
import { authService } from '../api/authService';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Control Center', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Soil Analysis', path: '/soil', icon: Sprout },
    { name: 'Fertilizers', path: '/fertilizer', icon: Droplet },
    { name: 'Crop Health Scan', path: '/disease', icon: Scan },
    { name: 'Harvest Maturity', path: '/maturity', icon: Clock },
    { name: 'Crop Calendar', path: '/calendar', icon: Calendar },
    { name: 'Market Intelligence', path: '/price', icon: TrendingUp },
    { name: 'Weather Advisor', path: '/weather', icon: CloudSun },
    { name: 'Agri-bot Assistant', path: '/chat', icon: MessageSquare },
    { name: 'Government Schemes', path: '/schemes', icon: Award },
    { name: 'Admin Dashboard', path: '/admin', icon: Shield },
  ];

  // Helper to find page title based on active path
  const getPageTitle = () => {
    const current = navItems.find(item => location.pathname === item.path);
    return current ? current.name : 'AI CropPilot';
  };

  return (
    <div className="min-h-screen flex bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50/30 via-slate-50 to-teal-50/15 text-slate-800 font-sans">
      
      {/* Sidebar - Desktop view */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-900 text-white border-r border-slate-800 shrink-0">
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-800">
          <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">
            <Leaf className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              AI CropPilot
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Control Hub v2.0</p>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm group
                  ${isActive 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/10' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <Icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Farmer Info Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center font-bold text-white shadow-inner">
              {user.name ? user.name.charAt(0).toUpperCase() : 'F'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name || 'Farmer'}</p>
              <p className="text-xs text-slate-400 truncate">{user.district || 'District Not Set'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-xl text-xs font-bold transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout Pilot</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-slate-900 text-white border-r border-slate-850 transition-transform duration-300 lg:hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Leaf className="h-6 w-6 text-emerald-400" />
            <span className="font-extrabold text-lg text-white">AI CropPilot</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm
                  ${isActive 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <a href="tel:18001801551" className="flex items-center gap-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl mb-3 active:bg-rose-500/20 transition-colors">
            <div className="h-9 w-9 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400">
              <PhoneCall className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Kisan Helpline</p>
              <p className="text-sm font-bold text-white">1800-180-1551</p>
            </div>
          </a>

          <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl mb-3">
            <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white">
              {user.name ? user.name.charAt(0).toUpperCase() : 'F'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.district}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-xl text-xs font-bold transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout Pilot</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 lg:px-8 shrink-0 z-30 shadow-sm shadow-slate-100/50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="font-bold text-xl md:text-2xl text-slate-900 tracking-tight">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Helpline (Visible on Desktop) */}
            <a href="tel:18001801551" className="hidden lg:flex items-center gap-3 px-4 py-2 bg-rose-50 border border-rose-100 rounded-xl transition-all hover:bg-rose-100 group shadow-sm shadow-rose-100/50">
              <div className="bg-rose-500 p-2 rounded-lg shadow-sm shadow-rose-500/30 group-hover:animate-pulse">
                <PhoneCall className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block leading-none mb-1">Kisan Helpline</span>
                <span className="text-sm font-extrabold text-slate-800 leading-none">1800-180-1551</span>
              </div>
            </a>
            
            <div className="h-10 w-px bg-slate-100 hidden lg:block" />

            {/* Quick Stats Summary (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-3 text-right">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Farm Land size</span>
                <span className="text-sm font-bold text-emerald-600">{user.land_size || '0'} Acres</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Default Soil</span>
                <span className="text-sm font-bold text-slate-700">{user.soil_type || 'Red Soil'}</span>
              </div>
            </div>

            <div className="h-10 w-px bg-slate-100 hidden md:block" />

            {/* Profile Menu */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-400 block">{user.farmer_type || 'Individual'} Farmer</span>
                <span className="text-sm font-semibold text-slate-700">{user.name || 'Farmer'}</span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                <UserIcon className="h-5 w-5 text-slate-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
