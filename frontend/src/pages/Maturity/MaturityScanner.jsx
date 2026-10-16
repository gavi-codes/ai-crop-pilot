import React, { useState, useRef } from 'react';
import { maturityService } from '../../api/maturityService';
import { 
  Scan, 
  Image as ImageIcon, 
  Sparkles, 
  Languages, 
  CalendarDays,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  Volume2,
  VolumeX,
  UploadCloud,
  Camera,
  RefreshCw,
  Clock,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

const MaturityScanner = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  const [activeLanguage, setActiveLanguage] = useState('English');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
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
      const res = await maturityService.analyze(file);
      if (res.success) {
        setResult(res.data);
        setActiveLanguage('English');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze crop maturity');
    } finally {
      setLoading(false);
    }
  };

  // Text to Speech
  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (activeLanguage === 'Kannada') utterance.lang = 'kn-IN';
    else if (activeLanguage === 'Hindi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-US';

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const getAdviceText = () => {
    if (!result) return '';
    try {
      const parsed = JSON.parse(result.actionable_advice_json || '{}');
      return parsed[activeLanguage] || parsed['English'] || 'Advice pending...';
    } catch {
      return 'Advice data unavailable.';
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold mb-2 border border-teal-200">
            <Sparkles className="h-3.5 w-3.5 text-teal-600" />
            <span>Computer Vision Ripeness Telemetry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            AI Harvest Maturity Scanner
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1 max-w-2xl">
            Detect fruit, pod, and grain maturity stages (Unripe, Ripening, Harvest-Ready, or Overripe) to lock in peak market freshness and pricing.
          </p>
        </div>

        <button 
          onClick={() => {
            setFile(null);
            setPreview(null);
            setResult(null);
          }}
          className="self-start sm:self-auto px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>New Scan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= LEFT COLUMN: UPLOAD VIEWFINDER ================= */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Futuristic Viewfinder Dropzone */}
              <div 
                className={`relative rounded-3xl p-6 text-center cursor-pointer transition-all border-2 border-dashed overflow-hidden ${
                  preview 
                    ? 'border-teal-500 bg-teal-50/20' 
                    : 'border-slate-300 hover:border-teal-500 bg-slate-50/50 hover:bg-teal-50/10'
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
                  <div className="relative flex flex-col items-center">
                    
                    {/* Viewfinder Reticles */}
                    <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-teal-500 z-10" />
                    <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-teal-500 z-10" />
                    <div className="absolute bottom-10 left-2 w-6 h-6 border-b-2 border-l-2 border-teal-500 z-10" />
                    <div className="absolute bottom-10 right-2 w-6 h-6 border-b-2 border-r-2 border-teal-500 z-10" />

                    <img 
                      src={preview} 
                      alt="Crop Maturity Telemetry" 
                      className="max-h-72 w-full object-cover rounded-2xl shadow-sm border border-slate-200" 
                    />
                    
                    {loading && <div className="scanner-laser"></div>}
                    
                    <p className="text-xs text-teal-700 font-extrabold mt-3 hover:underline flex items-center gap-1.5">
                      <Camera className="h-4 w-4" />
                      <span>Retake or Change Photo</span>
                    </p>
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center">
                    <div className="p-4 bg-teal-50 rounded-2xl text-teal-600 mb-3 border border-teal-100 shadow-2xs group-hover:scale-110 transition-transform">
                      <UploadCloud className="h-8 w-8" />
                    </div>
                    <p className="text-base font-extrabold text-slate-900">Drag & drop crop photo here</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">or browse files / take camera snapshot</p>
                    <span className="mt-4 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
                      JPG, PNG, WebP up to 10MB
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={!file || loading}
                className={`w-full py-4 rounded-2xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                  !file 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                    : loading
                      ? 'bg-teal-600 opacity-90 cursor-wait shadow-teal-950/20'
                      : 'bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-600 hover:opacity-95 shadow-teal-950/20 active:scale-[0.99]'
                }`}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Ripeness Indicators...</span>
                  </>
                ) : (
                  <>
                    <Scan className="h-4.5 w-4.5" />
                    <span>Scan Crop Maturity & Harvest Timing</span>
                  </>
                )}
              </button>

            </form>

            {error && (
              <div className="mt-4 p-3.5 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-xs font-bold text-center">
                {error}
              </div>
            )}

          </div>
        </div>

        {/* ================= RIGHT COLUMN: MATURITY REPORT ================= */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden animate-fadeIn space-y-0">
              
              {/* Language Switcher Bar */}
              <div className="p-4 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-teal-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">Diagnosis Language</span>
                </div>
                
                <div className="flex gap-1.5">
                  {['English', 'Kannada', 'Hindi'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLanguage(lang)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        activeLanguage === lang 
                          ? 'bg-teal-600 text-white shadow-sm' 
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {lang === 'Kannada' ? 'ಕನ್ನಡ' : lang === 'Hindi' ? 'हिन्दी' : 'English'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Header */}
              <div className="p-6 sm:p-7 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Phenological Stage</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{result.stage}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-100 border border-teal-200 text-teal-900 text-xs font-black">
                    <Sparkles className="h-4 w-4 text-teal-600" />
                    <span>{result.confidence}% Match</span>
                  </span>

                  <button
                    onClick={() => handleSpeak(getAdviceText())}
                    className="p-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors cursor-pointer"
                    title="Read aloud"
                  >
                    {isSpeaking ? <VolumeX className="h-4 w-4 text-rose-500 animate-pulse" /> : <Volume2 className="h-4 w-4 text-teal-600" />}
                  </button>
                </div>
              </div>

              {/* Diagnostic Detail Panels */}
              <div className="p-6 sm:p-7 space-y-6">
                
                {/* Time to Harvest Metric Spotlight */}
                <div className="flex items-center gap-4 bg-teal-50/70 p-5 rounded-2xl border border-teal-200/80">
                  <div className="p-3.5 bg-teal-600 rounded-2xl text-white shadow-md shadow-teal-900/20">
                    <CalendarDays className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-teal-800 uppercase tracking-wider block">Estimated Harvest Window</span>
                    <p className="text-xl font-black text-slate-900 mt-0.5">{result.estimated_days}</p>
                  </div>
                </div>

                {/* 1. Visual Analysis Breakdown */}
                <div className="space-y-2">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-slate-400" />
                    <span>Computer Vision Optical Analysis</span>
                  </h3>
                  <div className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    {(() => {
                      try {
                        const parsed = JSON.parse(result.analysis_json || '{}');
                        return parsed[activeLanguage] || parsed['English'] || 'Analysis pending...';
                      } catch { return 'Analysis data unavailable.'; }
                    })()}
                  </div>
                </div>

                {/* 2. Actionable Post-Harvest / Pre-Harvest Advice */}
                <div className="space-y-2">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-teal-600" />
                    <span>Agronomic Harvest Advisory</span>
                  </h3>
                  <div className="text-sm text-teal-950 leading-relaxed font-semibold bg-teal-50/50 p-4 rounded-2xl border border-teal-200/80">
                    {getAdviceText()}
                  </div>
                </div>

                {/* Prevention / Quality Tip */}
                <div className="pt-4 border-t border-slate-200 flex gap-3 items-start">
                  <ShieldCheck className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Post-Harvest Freshness Tip</span>
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                      Harvest crops in early morning hours before ambient temperature peaks to preserve internal moisture and market shelf-life.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="h-full bg-slate-50/70 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-12 text-slate-400 min-h-[460px]">
              <div className="p-4 bg-white rounded-2xl shadow-xs border border-slate-100 mb-4">
                <Clock className="h-10 w-10 text-teal-600" />
              </div>
              <p className="font-extrabold text-slate-800 text-base">Awaiting Harvest Image</p>
              <p className="text-xs text-slate-500 font-medium max-w-sm mt-1.5 leading-relaxed">
                Upload a clear photo of your fruits, pods, or grain heads to detect exact maturity and countdown to ideal harvest timing.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default MaturityScanner;
