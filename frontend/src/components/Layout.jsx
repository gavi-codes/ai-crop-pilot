import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sprout, 
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
  Calendar,
  Sparkles,
  ChevronRight,
  Activity,
  Layers,
  MapPin,
  ExternalLink
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

  const navSections = [
    {
      label: 'Core Operations',
      items: [
        { name: 'Control Center', path: '/dashboard', icon: LayoutDashboard, badge: 'Live' },
        { name: 'Crop Health Scan', path: '/disease', icon: Scan, badge: 'AI Vision' },
        { name: 'Harvest Maturity', path: '/maturity', icon: Clock, badge: 'Beta' },
        { name: 'Crop Calendar', path: '/calendar', icon: Calendar },
      ]
    },
    {
      label: 'Precision Agronomy',
      items: [
        { name: 'Soil Diagnostics', path: '/soil', icon: Sprout },
        { name: 'Fertilizer Planner', path: '/fertilizer', icon: Droplet },
        { name: 'Weather Advisor', path: '/weather', icon: CloudSun },
      ]
    },
    {
      label: 'Market & Assistance',
      items: [
        { name: 'Market Intelligence', path: '/price', icon: TrendingUp, badge: 'AI Forecast' },
        { name: 'AgriBot Assistant', path: '/chat', icon: MessageSquare, badge: 'Voice' },
        { name: 'Government Schemes', path: '/schemes', icon: Award },
        { name: 'Admin Console', path: '/admin', icon: Shield },
      ]
    }
  ];

  // Helper to find page title based on active path
  const getPageInfo = () => {
    for (const sec of navSections) {
      const match = sec.items.find(item => location.pathname === item.path);
      if (match) return { title: match.name, section: sec.label };
    }
    return { title: 'Executive Control Hub', section: 'Overview' };
  };

  const pageInfo = getPageInfo();

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#0F172A] font-sans antialiased bg-dot-pattern">
      
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#06281E] text-white border-r border-emerald-950/40 shrink-0 shadow-2xl z-30 select-none">
        
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 gap-3.5 border-b border-white/5 bg-[#0B3D2E]/40 backdrop-blur-md">
          <div className="relative p-2.5 bg-gradient-to-tr from-[#10B981] to-[#84CC16] rounded-2xl shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/20">
            <Leaf className="h-5 w-5 text-white" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
                AI CropPilot
              </h1>
              <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 rounded-md border border-emerald-400/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-emerald-400/70 font-semibold tracking-wide">Autonomous Farm OS</p>
          </div>
        </div>

        {/* AI Engine Status Pulse */}
        <div className="mx-4 mt-4 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-100">Telemetry Engine</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            Online
          </span>
        </div>

        {/* Categorized Navigation */}
        <nav className="flex-1 px-3.5 py-4 space-y-6 overflow-y-auto">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-extrabold text-emerald-400/50 uppercase tracking-wider mb-2">
                {sec.label}
              </p>
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      relative flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm group
                      ${isActive 
                        ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-lg shadow-emerald-900/40 font-semibold' 
                        : 'text-emerald-100/75 hover:bg-white/[0.07] hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        location.pathname === item.path 
                          ? 'bg-white/20 text-white' 
                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Emergency Kisan Helpline Pill */}
        <div className="px-4 pb-3">
          <a 
            href="tel:18001801551" 
            className="group flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-rose-950/40 to-rose-900/20 border border-rose-500/25 hover:border-rose-400/40 transition-all shadow-md shadow-rose-950/20"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <PhoneCall className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block leading-none mb-1">
                  Kisan Call Center
                </span>
                <span className="text-xs font-extrabold text-white leading-none">1800-180-1551</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full">24/7</span>
          </a>
        </div>

        {/* Farmer Profile Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#031A13]/60">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#10B981] to-[#0B3D2E] flex items-center justify-center font-extrabold text-white text-base shadow-inner border border-emerald-400/30">
              {user.name ? user.name.charAt(0).toUpperCase() : 'F'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user.name || 'Farmer Pilot'}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/70 truncate">
                <MapPin className="h-3 w-3 shrink-0" />
                <span>{user.district || 'Karnataka, India'}</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MOBILE DRAWER BACKDROP ================= */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-md lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= MOBILE DRAWER ================= */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-[#06281E] text-white border-r border-emerald-900/40 transition-transform duration-300 ease-in-out lg:hidden shadow-2xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 bg-[#0B3D2E]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-[#10B981] to-[#84CC16] rounded-xl shadow-md">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-lg text-white">AI CropPilot</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="p-2 text-emerald-300 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-extrabold text-emerald-400/50 uppercase tracking-wider mb-2">
                {sec.label}
              </p>
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) => `
                      flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors
                      ${isActive 
                        ? 'bg-[#10B981] text-white font-semibold shadow-md' 
                        : 'text-emerald-100/70 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4.5 w-4.5" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 bg-[#031A13]/80">
          <a href="tel:18001801551" className="flex items-center gap-3 p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl mb-3">
            <PhoneCall className="h-4 w-4 text-rose-400" />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-rose-400 uppercase">Kisan Helpline</p>
              <p className="text-xs font-bold text-white">1800-180-1551</p>
            </div>
          </a>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 text-rose-300 rounded-xl text-xs font-bold hover:bg-rose-500/20 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Executive Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between px-6 lg:px-8 shadow-xs">
          
          {/* Left: Mobile trigger & Breadcrumbs */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <span>AI CropPilot</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                <span className="text-emerald-700">{pageInfo.section}</span>
              </div>
              <h2 className="font-extrabold text-xl md:text-2xl text-slate-900 tracking-tight leading-tight">
                {pageInfo.title}
              </h2>
            </div>
          </div>

          {/* Right: Telemetry chips & Profile */}
          <div className="flex items-center gap-3">
            
            {/* Live Telemetry Chips (Desktop Only) */}
            <div className="hidden xl:flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-2xl p-1.5 shadow-2xs">
              <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-xl shadow-xs border border-slate-100">
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">{user.district || 'Karnataka'}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-xl shadow-xs border border-slate-100">
                <Layers className="h-3.5 w-3.5 text-amber-600" />
                <span className="text-xs font-bold text-slate-800">{user.land_size || '2.5'} ac</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-xl shadow-xs border border-slate-100">
                <Sprout className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">{user.soil_type || 'Red Soil'}</span>
              </div>
            </div>

            {/* Helpline Fast-dial (Desktop) */}
            <a 
              href="tel:18001801551" 
              className="hidden md:flex items-center gap-2.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 rounded-2xl transition-all shadow-2xs group"
            >
              <div className="h-7 w-7 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <PhoneCall className="h-3.5 w-3.5" />
              </div>
              <div className="text-left leading-none">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-rose-500 block">Kisan Help</span>
                <span className="text-xs font-black text-rose-950">1800-180-1551</span>
              </div>
            </a>

            {/* Profile Avatar Pill */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="hidden sm:block text-right">
                <span className="text-xs font-extrabold text-slate-900 block leading-tight">{user.name || 'Farmer Pilot'}</span>
                <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider block">
                  {user.farmer_type || 'Individual'} Operator
                </span>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#0B3D2E] to-[#10B981] text-white font-extrabold flex items-center justify-center shadow-md shadow-emerald-950/10 ring-2 ring-emerald-500/20">
                {user.name ? user.name.charAt(0).toUpperCase() : 'F'}
              </div>
            </div>

          </div>
        </header>

        {/* Dynamic Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
};

export default Layout;
