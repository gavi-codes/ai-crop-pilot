import React, { useState, useRef } from 'react';
import { diseaseService } from '../../api/diseaseService';
import { 
  Scan, 
  Image as ImageIcon, 
  Sparkles, 
  Languages, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  FlaskConical,
  Sprout,
  ShieldCheck,
  ArrowLeft,
  Pill,
  Tag
} from 'lucide-react';

const DiseaseForm = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  // Multi-language selection state: 'English', 'Kannada', or 'Hindi'
  const [activeLanguage, setActiveLanguage] = useState('English');
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setResult(null);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    setError('');
    try {
      const res = await diseaseService.predict(file);
      if (res.success) {
        setResult(res.data);
        setActiveLanguage('English'); // Reset to default
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => window.history.back()}
          className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI Crop Disease Scan</h1>
          <p className="text-sm text-slate-500 mt-2">
            Upload a clear photo of your affected crop leaves to analyze symptoms and get localized remedies in multiple languages.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Column: Upload Console */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div 
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  preview ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200 hover:bg-slate-50/50'
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                  capture="environment"
                />
                
                {preview ? (
                  <div className="relative flex flex-col items-center overflow-hidden rounded-xl">
                    <img src={preview} alt="Leaf Preview" className="max-h-64 object-cover rounded-lg shadow-sm" />
                    
                    {/* Pulsating Laser Line (Holographic Scanner) */}
                    {loading && <div className="scanner-laser"></div>}
                    
                    <p className="text-xs text-emerald-600 font-bold mt-3 hover:underline">Change Leaf Photo</p>
                  </div>
                ) : (
                  <div className="py-10 flex flex-col items-center">
                    <div className="p-3.5 bg-slate-50 rounded-2xl text-slate-400 group-hover:scale-110 transition-transform mb-3 border border-slate-100">
                      <ImageIcon className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">Drag and drop photo here</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">or browse files / take photo</p>
                  </div>
                )}
              </div>
              
              <button 
                type="submit" 
                disabled={!file || loading}
                className={`w-full py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                  !file ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-100' : 
                  loading 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white opacity-80 cursor-wait shadow-lg shadow-emerald-500/20' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:scale-[1.01] active:scale-[0.99] hover:shadow-lg hover:shadow-emerald-500/20'
                }`}
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Pathogen...</span>
                  </>
                ) : (
                  <>
                    <Scan className="h-5 w-5" />
                    <span>Scan Leaf for Diseases</span>
                  </>
                )}
              </button>
            </form>
            
            {error && (
              <div className="mt-4 p-3.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 text-xs font-bold text-center">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Diagnostic Console (Results) */}
        <div className="lg:col-span-3">
          {result ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-fadeIn">
              
              {/* Language Switcher header bar */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-4 border-b border-slate-800">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Languages className="h-4 w-4 text-emerald-400" />
                  Select Language
                </span>
                
                <div className="flex gap-1">
                  {['English', 'Kannada', 'Hindi'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLanguage(lang)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        activeLanguage === lang 
                          ? 'bg-emerald-500 text-white shadow shadow-emerald-500/30' 
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {lang === 'Kannada' ? 'ಕನ್ನಡ' : lang === 'Hindi' ? 'हिन्दी' : 'English'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Header */}
              <div className="p-6 bg-slate-50 border-b border-slate-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Diagnosis Diagnosis</span>
                    <h2 className="text-2xl font-black text-slate-950 mt-0.5">{result.disease_name}</h2>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm border ${
                    result.confidence > 70 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    <Sparkles className="h-4 w-4 animate-spin-slow" />
                    <span>{result.confidence}% Match</span>
                  </span>
                </div>
              </div>

              {/* Diagnostic detailed tabs */}
              <div className="p-6 space-y-6">
                
                {/* 1. Pathogen details */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-slate-400" />
                    What is this Disease?
                  </h3>
                  <p className="text-sm text-slate-650 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {result.description_json[activeLanguage] || result.description_json['English']}
                  </p>
                </div>

                {/* 2. Treatment Solution */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-emerald-500" />
                    Recommended Treatment Solution
                  </h3>
                  <p className="text-sm text-slate-800 leading-relaxed font-semibold bg-emerald-50/20 p-4 rounded-2xl border border-emerald-100/50">
                    {result.treatment_json[activeLanguage] || result.treatment_json['English']}
                  </p>
                </div>

                {/* 3. Recovery Fertilizer */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <Sprout className="h-4 w-4 text-indigo-500" />
                    Immunity Recovery Fertilizer
                  </h3>
                  <p className="text-sm text-indigo-800 leading-relaxed font-bold bg-indigo-50/20 p-4 rounded-2xl border border-indigo-100/50">
                    {result.recovery_fertilizer_json[activeLanguage] || result.recovery_fertilizer_json['English']}
                  </p>
                </div>

                {/* 4. Recommended Medicine */}
                {result.medicine && (
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Pill className="h-4 w-4 text-rose-500" />
                      Recommended Medicine / Pesticide
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row gap-4 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                      <div className="w-full sm:w-1/3 bg-slate-50 border-r border-slate-100 relative min-h-[140px]">
                        <img 
                          src={result.medicine.photo_url || 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&q=80'} 
                          alt="Medicine" 
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&q=80' }}
                        />
                      </div>
                      <div className="p-4 sm:w-2/3 flex flex-col justify-center">
                        <h4 className="text-lg font-black text-slate-900 mb-1">{result.medicine.name}</h4>
                        <div className="flex items-center gap-3 mt-2 text-sm">
                          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg font-bold">
                            <Tag className="h-3.5 w-3.5" />
                            {result.medicine.price_estimate}
                          </div>
                          <div className="text-slate-600 font-medium">
                            <span className="text-xs text-slate-400 uppercase font-bold mr-1 block">Dosage</span>
                            {result.medicine.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Prevention */}
                <div className="pt-4 border-t border-slate-100 flex gap-2.5 items-start">
                  <ShieldCheck className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Prevention Tip</span>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">{result.prevention}</p>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50 border border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-12 text-slate-400">
              <Scan className="h-12 w-12 text-slate-300 mb-3 animate-pulse" />
              <p className="font-bold text-slate-500 text-sm">Waiting for Scan Telemetry</p>
              <p className="text-[10px] text-slate-400 font-medium max-w-xs mt-1 leading-relaxed">
                Upload or drag a photo of the leaf on the left panel, then run diagnostic scans to display results here.
              </p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default DiseaseForm;
