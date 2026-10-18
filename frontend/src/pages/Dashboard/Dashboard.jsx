import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  CloudSun, 
  TrendingUp, 
  Scan, 
  Droplet, 
  Sparkles, 
  ChevronRight, 
  Thermometer, 
  MapPin, 
  Info, 
  RefreshCw, 
  Award, 
  MessageSquare,
  Clock,
  Calendar,
  Shield,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Activity,
  Leaf,
  Check,
  LayoutGrid,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { advisorService } from '../../api/advisorService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState('');
  
  // Crop Portfolio filtering state
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const DEFAULT_RECOMMENDATION = {
    profile: {
      district: user?.district || 'Koppal',
      land_size: user?.land_size || 2.5,
      soil_type: user?.soil_type || 'Red Soil',
      soil_parameters: { nitrogen: 25, phosphorus: 15, potassium: 15, ph: 6.2, moisture: 35 }
    },
    weather: {
      temperature: 28,
      humidity: 68,
      rainfall: 12,
      condition: 'Partly Cloudy',
      advisory: 'Good conditions for crop growth'
    },
    crops: [
      { name: 'Maize', suitability: 'Optimal Vegetative Stage (94% Fit)' },
      { name: 'Groundnut', suitability: 'High Compatibility (Well-drained soil)' },
      { name: 'Paddy', suitability: 'Moist & Fertile Alluvial (96% Fit)' }
    ],
    fertilizer: {
      recommended_fertilizer: 'NPK (19:19:19)',
      quantity_per_acre: 50.0,
      total_quantity: Math.round(50 * (user?.land_size || 2.5)),
      days_to_apply: '7–10 days',
      reason: 'Optimal nitrogen and micronutrient replenishment for active vegetative stage.'
    },
    market: {
      crop: 'Maize',
      district: user?.district || 'Koppal',
      current_price: 1850.0,
      percentage_change: '+6.2%',
      trend: 'positive',
      forecast: [
        { day: 'Day 1', price: 1870.0 },
        { day: 'Day 2', price: 1910.0 },
        { day: 'Day 3', price: 1965.0 }
      ],
      recommendation: 'Market trend is positive'
    }
  };

  const fetchAdvisorData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await advisorService.getRecommendation();
      if (res && res.success && res.data) {
        setRecommendation(res.data);
      } else {
        setRecommendation(DEFAULT_RECOMMENDATION);
      }
    } catch (err) {
      console.warn("Dashboard recommendation notice:", err);
      setRecommendation(DEFAULT_RECOMMENDATION);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisorData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // 9 Module Cards for Operations Command Suite - Matching Reference Design
  const modules = [
    {
      title: 'Crop Health Scan',
      desc: 'Detect diseases, pests and stress using AI-powered image analysis.',
      path: '/disease',
      icon: Scan,
      badge: 'Active'
    },
    {
      title: 'Soil Diagnostics',
      desc: 'Analyze soil health, nutrients and pH for better decisions.',
      path: '/soil',
      icon: Sprout,
      badge: 'Ready'
    },
    {
      title: 'Fertilizer Planner',
      desc: 'Get personalized fertilizer recommendations for your crops.',
      path: '/fertilizer',
      icon: Droplet,
      badge: 'Recommended'
    },
    {
      title: 'Market Intelligence',
      desc: 'Track crop prices, market trends and best selling opportunities.',
      path: '/price',
      icon: TrendingUp,
      badge: 'Live'
    },
    {
      title: 'Weather Advisor',
      desc: 'Real-time weather updates and risk alerts for your farm.',
      path: '/weather',
      icon: CloudSun,
      badge: 'Active'
    },
    {
      title: 'Harvest Maturity',
      desc: 'Predict the right time for harvest and maximize your yield.',
      path: '/maturity',
      icon: Clock,
      badge: 'Monitoring'
    },
    {
      title: 'Smart Crop Calendar',
      desc: 'Plan your farming activities with AI-powered timelines.',
      path: '/calendar',
      icon: Calendar,
      badge: 'On Track'
    },
    {
      title: 'AgriBot Assistant',
      desc: 'Ask questions, get instant advice and expert guidance.',
      path: '/chat',
      icon: MessageSquare,
      badge: 'Online'
    },
    {
      title: 'Government Schemes',
      desc: 'Explore subsidies, loans and latest government schemes.',
      path: '/schemes',
      icon: Award,
      badge: 'Updated'
    },
  ];

  // 16 Real, Accurate Agricultural Crops with High-Resolution Verified Imagery
  const cropPortfolio = [
    {
      name: 'Paddy / Rice',
      variety: 'Sona Masuri & Basmati',
      category: 'Cereals & Grains',
      season: 'Kharif 2025',
      image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=600&q=80',
      status: 'Optimal (96%)',
      stage: 'Panicle Initiation & Tillering',
      acreage: `${(user?.land_size ? (user.land_size * 0.35).toFixed(1) : '1.0')} Acres`,
      harvestDays: '35 Days to Harvest',
      soilMatch: 'Alluvial Clay Loam'
    },
    {
      name: 'Maize (Yellow Corn)',
      variety: 'Hybrid Super 50',
      category: 'Cereals & Grains',
      season: 'Kharif 2025',
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80',
      status: 'Healthy (94%)',
      stage: 'Grain Filling & Tasseling',
      acreage: `${(user?.land_size ? (user.land_size * 0.40).toFixed(1) : '1.2')} Acres`,
      harvestDays: '22 Days to Harvest',
      soilMatch: 'Well-drained Loam'
    },
    {
      name: 'Cotton',
      variety: 'Bt Cotton RCH-2',
      category: 'Commercial & Cash',
      season: 'Kharif 2025',
      image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&q=80',
      status: 'Monitored (91%)',
      stage: 'Boll Development & Bursting',
      acreage: `${(user?.land_size ? (user.land_size * 0.25).toFixed(1) : '0.6')} Acres`,
      harvestDays: '40 Days to Harvest',
      soilMatch: 'Black Cotton Soil'
    },
    {
      name: 'Sugarcane',
      variety: 'Co 86032 (Nellikuppam)',
      category: 'Commercial & Cash',
      season: 'Annual 2025-26',
      image: 'https://images.unsplash.com/photo-1527842891421-42eec6e703ea?w=600&q=80',
      status: 'Optimal (95%)',
      stage: 'Grand Growth & Cane Elongation',
      acreage: '1.5 Acres',
      harvestDays: '90 Days to Harvest',
      soilMatch: 'Deep Rich Loam'
    },
    {
      name: 'Groundnut (Peanut)',
      variety: 'Kadiri-6 & TMV-2',
      category: 'Oilseeds & Pulses',
      season: 'Kharif / Rabi',
      image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&q=80',
      status: 'Vigorous (93%)',
      stage: 'Pod Formation & Pegging',
      acreage: '0.8 Acres',
      harvestDays: '48 Days to Harvest',
      soilMatch: 'Red Sandy Loam'
    },
    {
      name: 'Coffee',
      variety: 'Arabica Sln 795 & Robusta',
      category: 'Plantation & Spices',
      season: 'Winter Harvest',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
      status: 'Premium (97%)',
      stage: 'Red Berry Ripening',
      acreage: '2.0 Acres',
      harvestDays: '55 Days to Harvest',
      soilMatch: 'Laterite Mountain Humus'
    },
    {
      name: 'Arecanut (Betel Nut)',
      variety: 'Mangala & South Canara',
      category: 'Plantation & Spices',
      season: 'Perennial',
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&q=80',
      status: 'High Yield (95%)',
      stage: 'Nut Swelling & Maturation',
      acreage: '1.0 Acres',
      harvestDays: '65 Days to Harvest',
      soilMatch: 'Red Laterite & Gravelly'
    },
    {
      name: 'Coconut',
      variety: 'West Coast Tall Hybrid',
      category: 'Plantation & Spices',
      season: 'Perennial',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80',
      status: 'Robust (96%)',
      stage: 'Continuous Button Setting',
      acreage: '1.5 Acres',
      harvestDays: 'Active Monthly Flush',
      soilMatch: 'Coastal & Delta Alluvial'
    },
    {
      name: 'Tea',
      variety: 'Assamica & Camellia',
      category: 'Plantation & Spices',
      season: 'Perennial Flush',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80',
      status: 'High Quality (98%)',
      stage: 'Two Leaves & a Bud Plucking',
      acreage: '1.0 Acres',
      harvestDays: '8 Days Plucking Cycle',
      soilMatch: 'Acidic Loam (pH 5.0)'
    },
    {
      name: 'Tomato',
      variety: 'Arka Rakshak & Abhinav',
      category: 'Horticulture',
      season: 'Rabi / Summer',
      image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&q=80',
      status: 'Monitored (92%)',
      stage: 'Fruiting & Breaker Red Stage',
      acreage: '0.5 Acres',
      harvestDays: '14 Days to Harvest',
      soilMatch: 'Sandy Loam with Compost'
    },
    {
      name: 'Red Chilli',
      variety: 'Byadagi Kaddi & Guntur',
      category: 'Horticulture',
      season: 'Kharif / Post-Monsoon',
      image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&q=80',
      status: 'Deep Red (94%)',
      stage: 'Pod Color Turning & Drying',
      acreage: '0.6 Acres',
      harvestDays: '28 Days to Harvest',
      soilMatch: 'Black & Red Mixed Soil'
    },
    {
      name: 'Wheat',
      variety: 'Sharbati & Durum Gold',
      category: 'Cereals & Grains',
      season: 'Rabi 2025',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80',
      status: 'Prime Grains (95%)',
      stage: 'Hard Dough & Ripening',
      acreage: '0.8 Acres',
      harvestDays: '30 Days to Harvest',
      soilMatch: 'Clay Loam & Alluvium'
    },
    {
      name: 'Sunflower',
      variety: 'KBSH-53 Hybrid',
      category: 'Oilseeds & Pulses',
      season: 'Zaid / Rabi',
      image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&q=80',
      status: 'High Oil (93%)',
      stage: 'Ray Floret Blooming',
      acreage: '0.7 Acres',
      harvestDays: '32 Days to Harvest',
      soilMatch: 'Deep Well-drained Soil'
    },
    {
      name: 'Black Pepper',
      variety: 'Malabar Panniyur-1',
      category: 'Plantation & Spices',
      season: 'Winter Harvest',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
      status: 'High Piperine (96%)',
      stage: 'Spikes Berry Filling',
      acreage: 'Intercrop (Arecanut)',
      harvestDays: '50 Days to Harvest',
      soilMatch: 'Humus Rich Forest Loam'
    },
    {
      name: 'Cardamom',
      variety: 'Green Gold Malabar',
      category: 'Plantation & Spices',
      season: 'Perennial',
      image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&q=80',
      status: 'Premium Aroma (97%)',
      stage: 'Capsule Swelling & Ripening',
      acreage: '0.5 Acres (Shade)',
      harvestDays: '42 Days to Harvest',
      soilMatch: 'Virgin Forest Evergreen'
    },
    {
      name: 'Blackgram (Urad)',
      variety: 'LBG-752 & Rashmi',
      category: 'Oilseeds & Pulses',
      season: 'Kharif Short-Cycle',
      image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&q=80',
      status: 'Nitrogen-Fixing (94%)',
      stage: 'Pod Desiccation & Sowing Prep',
      acreage: '0.5 Acres',
      harvestDays: '18 Days to Harvest',
      soilMatch: 'Loam & Medium Black'
    }
  ];

  const categories = [
    'All',
    'Cereals & Grains',
    'Commercial & Cash',
    'Plantation & Spices',
    'Horticulture',
    'Oilseeds & Pulses'
  ];

  // Filtered crops based on active category & search
  const filteredCrops = cropPortfolio.filter((crop) => {
    const matchesCategory = activeCategory === 'All' || crop.category === activeCategory;
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          crop.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          crop.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          crop.stage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 lg:p-10 space-y-9 max-w-7xl mx-auto font-sans bg-[#F8FAFC]">
      
      {/* ================= WELCOME BANNER (PRESERVED GREEN IDENTITY WITH AGRICULTURAL LANDSCAPE) ================= */}
      <div 
        className="relative overflow-hidden rounded-3xl p-7 lg:p-9 shadow-lg border border-emerald-950/20 text-white"
        style={{
          background: "linear-gradient(to right, #06281E 0%, #0B3D2E 48%, rgba(11, 61, 46, 0.45) 100%), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80') right center / cover no-repeat"
        }}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-2.5 max-w-xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, {user?.name || 'Ramesh Kumar'}!
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base font-normal leading-relaxed">
              Let's make your farm more productive, profitable and sustainable with AI.
            </p>
          </div>

          {/* Quick Farm Telemetry Card */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 bg-white/95 text-slate-800 p-2 sm:p-2.5 rounded-2xl border border-white/20 shadow-lg backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2.5 px-3 py-2 border-r border-slate-200/80">
              <div className="h-8 w-8 rounded-lg bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
                <Sprout className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">My Farm</span>
                <span className="text-xs font-black text-slate-900 block">{user?.land_size || '12.5'} Acres</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3 py-2 border-r border-slate-200/80">
              <div className="h-8 w-8 rounded-lg bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
                <Leaf className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Crop</span>
                <span className="text-xs font-black text-slate-900 block">Maize</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3 py-2 border-r border-slate-200/80">
              <div className="h-8 w-8 rounded-lg bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Season</span>
                <span className="text-xs font-black text-slate-900 block">Kharif 2025</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/soil')}
              className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-[#14532D] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 border border-slate-200 shadow-2xs"
            >
              <span>View Farm Details</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#16A34A]" />
            </button>
          </div>

        </div>
      </div>

      {/* ================= AUTONOMOUS AGRONOMY ADVISOR (CLEAN MINIMAL PREMIUM GREEN DESIGN) ================= */}
      <section className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs">
        
        {/* Advisor Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]/70">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-center text-[#16A34A] font-extrabold text-sm shrink-0">
              Ai
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#1F2937] tracking-tight">
                Autonomous Agronomy Advisor
              </h2>
              <p className="text-xs font-medium text-[#64748B] mt-0.5">
                AI-driven insights for better decisions and higher yields
              </p>
            </div>
          </div>

          <button 
            onClick={fetchAdvisorData} 
            disabled={loading}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#F8FAFC] text-[#1F2937] rounded-xl text-xs font-bold border border-[#E2E8F0] hover:border-[#16A34A] transition-all shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-[#16A34A] ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Recalculating...' : 'Recalculate Diagnostics'}</span>
          </button>
        </div>

        {/* 4 Advisor Sub-Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-6">
          
          {/* 1. Climate & Weather */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex flex-col justify-between shadow-2xs transition-all duration-200 hover:border-[#16A34A] hover:shadow-[0_4px_16px_rgba(22,163,74,0.06)]">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                    <CloudSun className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1F2937]">Climate & Weather</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] text-[10px] font-bold">
                  Favorable
                </span>
              </div>

              <div className="mt-2">
                <p className="text-3xl font-black text-[#1F2937] tracking-tight">
                  {recommendation?.weather?.temperature || 28}°C
                </p>
                <p className="text-xs text-[#64748B] font-medium mt-0.5">
                  Partly Cloudy
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-medium text-[#1F2937]">
                <div className="flex items-center gap-1.5">
                  <Droplet className="h-3.5 w-3.5 text-[#16A34A]" />
                  <span>Humidity: <strong>{recommendation?.weather?.humidity || 68}%</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CloudSun className="h-3.5 w-3.5 text-[#16A34A]" />
                  <span>Rainfall (7d): <strong>{recommendation?.weather?.rainfall || 12} mm</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] text-[11px] font-semibold p-2.5 rounded-xl text-center">
                Good conditions for crop growth
              </div>
            </div>
          </div>

          {/* 2. Crop Health */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex flex-col justify-between shadow-2xs transition-all duration-200 hover:border-[#16A34A] hover:shadow-[0_4px_16px_rgba(22,163,74,0.06)]">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                    <Leaf className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1F2937]">Crop Health</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] text-[10px] font-bold">
                  Healthy
                </span>
              </div>

              {/* Circular Gauge & Checklist */}
              <div className="flex items-center gap-4 mt-3">
                {/* SVG Progress Donut */}
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#E2E8F0]"
                      strokeWidth="3.2"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#16A34A]"
                      strokeDasharray="92, 100"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-black text-[#1F2937]">92%</span>
                </div>

                {/* Health Indicators */}
                <div className="space-y-1.5 text-xs font-medium text-[#1F2937]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A] shrink-0" />
                    <span>No disease detected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A] shrink-0" />
                    <span>Good crop vigor</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A] shrink-0" />
                    <span>Normal leaf color</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
              <span>Field Surveillance:</span>
              <span className="font-bold text-[#15803D]">Continuous Active</span>
            </div>
          </div>

          {/* 3. Fertilizer Recommendation */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex flex-col justify-between shadow-2xs transition-all duration-200 hover:border-[#16A34A] hover:shadow-[0_4px_16px_rgba(22,163,74,0.06)]">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                    <Droplet className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1F2937]">Fertilizer Recommendation</h3>
                </div>
              </div>

              <div className="mt-1">
                <h4 className="text-base font-extrabold text-[#1F2937]">
                  {recommendation?.fertilizer?.recommended_fertilizer || 'NPK (19:19:19)'}
                </h4>
                <p className="text-[11px] text-[#64748B] font-medium mt-0.5">Recommended Dose</p>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-xl font-black text-[#1F2937]">
                    {recommendation?.fertilizer?.quantity_per_acre || 50} kg/acre
                  </span>
                  <span className="text-xs text-[#64748B] font-semibold">
                    (Total: {recommendation?.fertilizer?.total_quantity || 125} kg)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button 
                onClick={() => navigate('/fertilizer')}
                className="w-full py-2 px-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Apply in 7–10 days</span>
              </button>
            </div>
          </div>

          {/* 4. Price Forecast */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex flex-col justify-between shadow-2xs transition-all duration-200 hover:border-[#16A34A] hover:shadow-[0_4px_16px_rgba(22,163,74,0.06)]">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                    <TrendingUp className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1F2937]">Price Forecast</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] text-[10px] font-bold">
                  Positive
                </span>
              </div>

              <div className="mt-1">
                <p className="text-xs font-bold text-[#1F2937]">
                  {recommendation?.market?.crop || 'Maize'}
                </p>
                <p className="text-[11px] text-[#64748B] font-medium mt-0.5">Expected Price (Next 30 days)</p>
                
                <div className="flex items-center justify-between gap-2 mt-1.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-[#1F2937]">
                      ₹ {recommendation?.market?.current_price || '1,850'}
                    </span>
                    <span className="text-[11px] text-[#64748B]">/quintal</span>
                  </div>

                  {/* Upward Mini Sparkline SVG */}
                  <svg className="w-14 h-7 shrink-0" viewBox="0 0 60 28" fill="none">
                    <path
                      d="M2 24 L14 18 L28 20 L42 10 L58 4"
                      stroke="#16A34A"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-[#16A34A] flex items-center gap-1">
                <span>↑ +6.2%</span>
              </span>
              <span className="text-[11px] font-medium text-[#64748B]">Market trend is positive</span>
            </div>
          </div>

        </div>

      </section>

      {/* ================= OPERATIONS COMMAND SUITE (PREMIUM 3X3 WHITE GRID WITH SUBTLE EMERALD HOVER) ================= */}
      <div className="space-y-5">
        
        {/* Section Header */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0 border border-[#DCFCE7]">
            <LayoutGrid className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#1F2937] tracking-tight">
              Operations Command Suite
            </h2>
            <p className="text-xs font-medium text-[#64748B]">
              Everything you need to manage your farm, powered by AI
            </p>
          </div>
        </div>

        {/* 3x3 Grid of 9 Clean White Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div 
                key={idx}
                tabIndex={0}
                role="button"
                onClick={() => navigate(mod.path)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(mod.path);
                  }
                }}
                className="group relative bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 flex flex-col justify-between shadow-2xs transition-all duration-200 ease-out cursor-pointer hover:border-[#16A34A] hover:shadow-[0_10px_25px_-5px_rgba(22,163,74,0.12),0_8px_10px_-6px_rgba(22,163,74,0.06)] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 select-none"
              >
                {/* Card Top: Icon, Title & Badge */}
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#F0FDF4] group-hover:bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 transition-colors duration-200 border border-[#DCFCE7]/70">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-[#1F2937] group-hover:text-[#14532D] transition-colors duration-200">
                        {mod.title}
                      </h3>
                    </div>

                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] shrink-0">
                      {mod.badge}
                    </span>
                  </div>

                  {/* Card Description */}
                  <p className="text-xs font-medium text-[#64748B] leading-relaxed pl-0.5">
                    {mod.desc}
                  </p>
                </div>

                {/* Card Bottom: Navigation Arrow Indicator */}
                <div className="mt-4 pt-3 border-t border-[#E2E8F0]/60 flex items-center justify-end">
                  <div className="h-7 w-7 rounded-lg bg-slate-50 group-hover:bg-[#F0FDF4] flex items-center justify-center text-slate-400 group-hover:text-[#16A34A] group-hover:translate-x-0.5 transition-all duration-200">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= COLORFUL AGRICULTURAL IMAGES SECTION: 16 ACCURATE CROPS WITH FILTER TABS ================= */}
      <div className="space-y-5 pt-3">
        
        {/* Header with Title & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0 border border-[#DCFCE7]">
              <Leaf className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#1F2937] tracking-tight">
                Active Crop Portfolio & Field Imagery
              </h2>
              <p className="text-xs font-medium text-[#64748B]">
                High-resolution authentic imagery, growth stages and acreage across Karnataka agriculture
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#15803D] bg-[#F0FDF4] px-3 py-1.5 rounded-xl border border-[#DCFCE7] shadow-2xs">
              Showing {filteredCrops.length} of {cropPortfolio.length} Crops
            </span>
          </div>
        </div>

        {/* Filter Navigation Bar & Instant Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-xs">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#1F2937] hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative shrink-0 sm:w-64">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crop or variety..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1F2937] placeholder-slate-400 focus:outline-none focus:border-[#16A34A] transition-colors"
            />
          </div>

        </div>

        {/* 16 Accurate High-Resolution Agricultural Crop Cards */}
        {filteredCrops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredCrops.map((crop, idx) => (
              <div 
                key={idx}
                className="group bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-2xs hover:border-[#16A34A] hover:shadow-[0_10px_25px_-5px_rgba(22,163,74,0.12),0_8px_10px_-6px_rgba(22,163,74,0.06)] hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Real, Accurate High-Resolution Crop Photo */}
                  <div className="h-44 w-full overflow-hidden relative bg-slate-100">
                    <img 
                      src={crop.image} 
                      alt={crop.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    
                    {/* Season Badge */}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-black text-[#14532D] shadow-xs border border-white/50">
                      {crop.season}
                    </div>

                    {/* Health Status Badge */}
                    <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#16A34A] text-white text-[10px] font-bold shadow-xs">
                      {crop.status}
                    </div>
                  </div>

                  {/* Crop Specifications & Agronomic Metrics */}
                  <div className="p-4 space-y-2.5">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] uppercase font-bold text-[#16A34A] tracking-wider">
                          {crop.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {crop.acreage}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-[#1F2937] group-hover:text-[#16A34A] transition-colors mt-0.5">
                        {crop.name}
                      </h3>
                      <p className="text-[11px] text-[#64748B] font-medium">
                        Variety: {crop.variety}
                      </p>
                    </div>

                    <div className="pt-1 border-t border-slate-100 space-y-1.5 text-xs text-[#1F2937]">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#64748B]">Growth Stage:</span>
                        <span className="font-bold text-[#14532D] text-right truncate max-w-[130px]">{crop.stage}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#64748B]">Soil Adaptability:</span>
                        <span className="font-semibold text-slate-600 text-right truncate max-w-[130px]">{crop.soilMatch}</span>
                      </div>
                    </div>

                    {/* Harvest Countdown */}
                    <div className="pt-1.5">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                        <span>Harvest Timeline</span>
                        <span className="text-[#16A34A] font-bold">{crop.harvestDays}</span>
                      </div>
                      <div className="w-full bg-[#F1F5F9] rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-[#16A34A] h-1.5 rounded-full" 
                          style={{ width: `${75 + ((idx * 7) % 22)}%` }}
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Quick Action Navigation Buttons */}
                <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => navigate('/disease')}
                    className="flex-1 py-1.5 px-2 bg-white hover:bg-[#F0FDF4] hover:text-[#16A34A] text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <Scan className="h-3 w-3" />
                    <span>Scan Leaf</span>
                  </button>
                  <button
                    onClick={() => navigate('/price')}
                    className="flex-1 py-1.5 px-2 bg-white hover:bg-[#F0FDF4] hover:text-[#16A34A] text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <TrendingUp className="h-3 w-3" />
                    <span>Mandi Rate</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 bg-white rounded-2xl border border-dashed border-slate-200 text-center">
            <Leaf className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No matching crops found</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting your search query or selecting "All".</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="mt-3 px-3.5 py-1.5 bg-[#F0FDF4] text-[#16A34A] font-bold text-xs rounded-xl border border-[#DCFCE7] hover:bg-[#DCFCE7] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

export default Dashboard;
