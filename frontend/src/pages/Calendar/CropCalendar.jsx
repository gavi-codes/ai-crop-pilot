import React, { useState } from 'react';
import { 
  Calendar, 
  Sprout, 
  Leaf, 
  Sun, 
  Droplets, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award
} from 'lucide-react';

const CropCalendar = () => {
  const [selectedCrop, setSelectedCrop] = useState('Paddy (Rice)');
  const [completedTasks, setCompletedTasks] = useState({});

  const crops = ['Paddy (Rice)', 'Cotton', 'Wheat', 'Sugarcane', 'Tomato'];

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const calendarData = {
    'Paddy (Rice)': [
      { id: 'p1', day: 'Day 1 - 20', stage: 'Nursery Bed Preparation', task: 'Sow pre-germinated seeds in wet nursery beds. Maintain 2cm standing water level and apply initial Azospirillum bio-fertilizer.', icon: Sprout, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
      { id: 'p2', day: 'Day 21 - 30', stage: 'Seedling Transplanting', task: 'Transplant 2-3 seedlings per hill at shallow 2-3cm depth. Ensure basal N-P-K fertilizer dose incorporated into puddled soil.', icon: Droplets, color: 'text-blue-700 bg-blue-50 border-blue-200' },
      { id: 'p3', day: 'Day 31 - 60', stage: 'Active Tillering Phase', task: 'Apply 1st top-dressing of Urea. Inspect field for stem borer and maintain weed-free flood conditions (3-5cm).', icon: Leaf, color: 'text-teal-700 bg-teal-50 border-teal-200' },
      { id: 'p4', day: 'Day 61 - 90', stage: 'Panicle Initiation & Flowering', task: 'Apply 2nd top-dressing of Potash & Urea. Maintain constant irrigation. Critical water requirement window.', icon: Sun, color: 'text-amber-700 bg-amber-50 border-amber-200' },
      { id: 'p5', day: 'Day 110 - 130', stage: 'Grain Hardening & Harvesting', task: 'Drain field water 10-12 days before harvest. Harvest when 80-85% grains turn golden yellow. Sun-dry to 14% moisture.', icon: Calendar, color: 'text-rose-700 bg-rose-50 border-rose-200' },
    ],
    'Cotton': [
      { id: 'c1', day: 'Day 1 - 15', stage: 'Sowing & Germination', task: 'Dibble seeds at 90x60 cm ridge spacing. Incorporate farmyard manure and basal NPK dose into seedbed.', icon: Sprout, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
      { id: 'c2', day: 'Day 20 - 40', stage: 'Vegetative Growth & Weeding', task: 'First mechanical weeding and earthing up. Apply prophylactic Neem seed kernel extract spray for sucking pests.', icon: Leaf, color: 'text-teal-700 bg-teal-50 border-teal-200' },
      { id: 'c3', day: 'Day 45 - 75', stage: 'Squaring & Early Bloom', task: 'Apply top-dressing of Nitrogen. Irrigate if dry spell exceeds 10 days. Scout for early bollworm oviposition.', icon: Sun, color: 'text-amber-700 bg-amber-50 border-amber-200' },
      { id: 'c4', day: 'Day 80 - 120', stage: 'Boll Development', task: 'Monitor pheromone traps for Pink Bollworm. Spray 2% Potassium Nitrate for boll retention and size enhancement.', icon: Droplets, color: 'text-blue-700 bg-blue-50 border-blue-200' },
      { id: 'c5', day: 'Day 130+', stage: 'First Picking Phase', task: 'Pick clean, fully opened bolls manually after morning dew evaporates. Store in clean, dry gunny bags.', icon: Calendar, color: 'text-rose-700 bg-rose-50 border-rose-200' },
    ],
    'Wheat': [
      { id: 'w1', day: 'Day 1 - 10', stage: 'Sowing & Germination', task: 'Drill treated seeds at 20cm row spacing. Apply basal NPK and irrigate immediately for uniform stand establishment.', icon: Sprout, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
      { id: 'w2', day: 'Day 20 - 25', stage: 'Crown Root Initiation (CRI)', task: 'Most critical irrigation stage. Apply 1st irrigation and first top-dressing of Nitrogen.', icon: Droplets, color: 'text-blue-700 bg-blue-50 border-blue-200' },
      { id: 'w3', day: 'Day 40 - 45', stage: 'Tillering Phase', task: 'Execute weed eradication. Apply 2nd irrigation and broadcast remaining Nitrogen dose.', icon: Leaf, color: 'text-teal-700 bg-teal-50 border-teal-200' },
      { id: 'w4', day: 'Day 65 - 70', stage: 'Late Jointing & Flowering', task: 'Ensure soil moisture at boot stage. Scout for yellow rust or foliar blight symptoms.', icon: Sun, color: 'text-amber-700 bg-amber-50 border-amber-200' },
      { id: 'w5', day: 'Day 115 - 125', stage: 'Physiological Maturity & Harvest', task: 'Harvest with combine or sickle when straw turns yellow and grains feel hard between fingernails.', icon: Calendar, color: 'text-rose-700 bg-rose-50 border-rose-200' },
    ],
    'Sugarcane': [
      { id: 's1', day: 'Day 1 - 30', stage: 'Sett Planting & Germination', task: 'Plant two-budded setts in deep furrows treated with fungicide. Apply basal NPK and light irrigation.', icon: Sprout, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
      { id: 's2', day: 'Day 31 - 100', stage: 'Tillering & Formative Phase', task: 'Apply Nitrogen top-dressing at 45 and 90 days. Earth up ridges to prevent lodging and control early shoot borer.', icon: Leaf, color: 'text-teal-700 bg-teal-50 border-teal-200' },
      { id: 's3', day: 'Day 101 - 270', stage: 'Grand Growth Phase', task: 'Provide copious irrigation every 7-10 days. Detrash dry bottom leaves to promote aeration and sunlight.', icon: Sun, color: 'text-amber-700 bg-amber-50 border-amber-200' },
      { id: 's4', day: 'Day 300 - 360', stage: 'Sucrose Ripening & Harvest', task: 'Withhold irrigation 15 days before cutting. Harvest close to ground level where sugar concentration is highest.', icon: Calendar, color: 'text-rose-700 bg-rose-50 border-rose-200' },
    ],
    'Tomato': [
      { id: 't1', day: 'Day 1 - 25', stage: 'Nursery Seeding & Hardening', task: 'Raise seedlings on raised nursery beds under net. Drench with Trichoderma to protect against damping off.', icon: Sprout, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
      { id: 't2', day: 'Day 26 - 45', stage: 'Transplanting & Staking', task: 'Transplant onto drip-mulch beds. Erect wooden or bamboo stakes for indeterminate vine support.', icon: Droplets, color: 'text-blue-700 bg-blue-50 border-blue-200' },
      { id: 't3', day: 'Day 46 - 75', stage: 'Flowering & Fruit Set', task: 'Fertigate water-soluble 19:19:19. Scout for leaf miners, fruit borers, and early blight lesions.', icon: Sun, color: 'text-amber-700 bg-amber-50 border-amber-200' },
      { id: 't4', day: 'Day 76+', stage: 'Sequential Fruit Harvesting', task: 'Pick fruits at breaker or pink stage for distant markets, and full red ripe for immediate local dispatch.', icon: Calendar, color: 'text-rose-700 bg-rose-50 border-rose-200' },
    ]
  };

  const activeData = calendarData[selectedCrop] || calendarData['Paddy (Rice)'];

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2 border border-purple-200">
          <Sparkles className="h-3.5 w-3.5 text-purple-600" />
          <span>Phenological Growth Stages & Task Scheduler</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Smart Crop Cultivation Calendar
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1 max-w-2xl">
          Follow day-by-day agronomic milestones from seedbed preparation to final harvest, optimized for regional climate conditions.
        </p>
      </div>

      {/* Crop Selector Tabs */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
          Select Crop Roadmap
        </span>
        <div className="flex flex-wrap gap-2.5">
          {crops.map(crop => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                selectedCrop === crop 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-10 relative overflow-hidden">
        
        {/* Timeline Center Line */}
        <div className="absolute left-10 md:left-24 top-12 bottom-12 w-0.5 bg-slate-200 z-0"></div>
        
        <div className="space-y-8 relative z-10">
          {activeData.map((item, index) => {
            const Icon = item.icon;
            const isDone = !!completedTasks[item.id];

            return (
              <div key={item.id} className="flex flex-col md:flex-row gap-5 md:gap-10 items-start md:items-center">
                
                {/* Day Badge */}
                <div className="w-28 shrink-0 md:text-right font-black text-xs uppercase tracking-wider text-slate-400">
                  {item.day}
                </div>
                
                {/* Icon Hub */}
                <div className={`h-12 w-12 rounded-2xl shrink-0 flex items-center justify-center border shadow-xs transition-transform hover:scale-110 ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                
                {/* Content Card */}
                <div className={`flex-1 rounded-2xl p-5 border transition-all duration-300 card-hover ${
                  isDone 
                    ? 'bg-emerald-50/50 border-emerald-200' 
                    : 'bg-slate-50/70 border-slate-200/80 hover:bg-white'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                    <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <span>{item.stage}</span>
                      {isDone && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                    </h4>
                    
                    <button
                      onClick={() => toggleTask(item.id)}
                      className={`self-start sm:self-auto text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-xl border transition-all cursor-pointer ${
                        isDone 
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {isDone ? 'Completed' : 'Mark Done'}
                    </button>
                  </div>
                  
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {item.task}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default CropCalendar;
