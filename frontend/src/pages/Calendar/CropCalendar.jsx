import React, { useState } from 'react';
import { Calendar, Sprout, Leaf, Sun, Droplets, ArrowRight } from 'lucide-react';

const CropCalendar = () => {
  const [selectedCrop, setSelectedCrop] = useState('Paddy (Rice)');

  const crops = ['Paddy (Rice)', 'Cotton', 'Wheat', 'Sugarcane', 'Tomato'];

  // Static mock data for the hackathon
  const calendarData = {
    'Paddy (Rice)': [
      { day: 'Day 1-20', stage: 'Nursery Preparation', task: 'Sow seeds in wet nursery beds. Maintain 2cm water level.', icon: Sprout, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
      { day: 'Day 21-30', stage: 'Transplanting', task: 'Transplant 2-3 seedlings per hill at shallow depth.', icon: Droplets, color: 'bg-blue-50 text-blue-600 border-blue-200' },
      { day: 'Day 31-60', stage: 'Tillering Phase', task: 'Apply 1st top dressing of Urea. Maintain weed-free field.', icon: Leaf, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
      { day: 'Day 61-90', stage: 'Panicle Initiation', task: 'Apply 2nd top dressing of Urea & Potash. Critical water requirement.', icon: Sun, color: 'bg-amber-50 text-amber-600 border-amber-200' },
      { day: 'Day 110-130', stage: 'Harvesting', task: 'Drain water 10 days before harvest. Harvest at 80% grain maturity.', icon: Calendar, color: 'bg-rose-50 text-rose-600 border-rose-200' },
    ],
    'Cotton': [
      { day: 'Day 1-15', stage: 'Sowing', task: 'Dibble seeds at 90x60 cm spacing. Ensure basal NPK dose.', icon: Sprout, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
      { day: 'Day 20-40', stage: 'Vegetative Growth', task: 'First weeding and hoeing. Spray Neem oil for early pests.', icon: Leaf, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
      { day: 'Day 45-75', stage: 'Squaring / Flowering', task: 'Apply top dressing of Nitrogen. Irrigate if dry spell occurs.', icon: Sun, color: 'bg-amber-50 text-amber-600 border-amber-200' },
      { day: 'Day 80-120', stage: 'Boll Development', task: 'Scout for Pink Bollworm. Apply Potassium Nitrate spray.', icon: Droplets, color: 'bg-blue-50 text-blue-600 border-blue-200' },
      { day: 'Day 130+', stage: 'First Picking', task: 'Pick fully opened bolls manually when dew dries up.', icon: Calendar, color: 'bg-rose-50 text-rose-600 border-rose-200' },
    ]
  };

  const activeData = calendarData[selectedCrop] || calendarData['Paddy (Rice)'];

  return (
    <div className="p-6 max-w-5xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Calendar className="h-8 w-8 text-emerald-500" />
          Smart Crop Calendar
        </h1>
        <p className="text-slate-500 font-medium mt-2">Personalized step-by-step cultivation guide for optimal yield.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Select your Crop</h3>
        <div className="flex flex-wrap gap-3">
          {crops.map(crop => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
                selectedCrop === crop 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="absolute left-10 md:left-24 top-10 bottom-10 w-0.5 bg-slate-100 z-0"></div>
        
        <div className="p-6 md:p-10 space-y-8 relative z-10">
          {activeData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center">
                <div className="w-32 shrink-0 md:text-right font-black text-slate-400">
                  {item.day}
                </div>
                
                <div className={`h-12 w-12 rounded-2xl shrink-0 flex items-center justify-center border-2 shadow-sm ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex-1 hover:shadow-md hover:-translate-y-1 transition-all">
                  <h4 className="text-lg font-black text-slate-900">{item.stage}</h4>
                  <p className="text-slate-600 font-medium mt-1 leading-relaxed">{item.task}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default CropCalendar;
