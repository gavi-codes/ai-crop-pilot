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
  ArrowLeft
} from 'lucide-react';

const MaturityScanner = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
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
      const res = await maturityService.analyze(file);
      if (res.success) {
        setResult(res.data);
        setActiveLanguage('English');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze maturity');
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
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI Harvest Maturity Scanner</h1>
          <p className="text-sm text-slate-500 mt-2">
            Upload an image of your crop to instantly detect if it is unripe, ripening, ready to harvest, or overripe using Computer Vision.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Column: Upload */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div 
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  preview ? 'border-amber-500 bg-amber-50/20' : 'border-slate-200 hover:bg-slate-50/50'
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
                    <img src={preview} alt="Crop Preview" className="max-h-64 object-cover rounded-lg shadow-sm" />
                    {loading && <div className="scanner-laser"></div>}
                    <p className="text-xs text-amber-600 font-bold mt-3 hover:underline">Change Crop Photo</p>
                  </div>
                ) : (
                  <div className="py-10 flex flex-col items-center">
                    <div className="p-3.5 bg-slate-50 rounded-2xl text-slate-400 group-hover:scale-110 transition-transform mb-3 border border-slate-100">
                      <ImageIcon className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">Drop crop photo here</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">or browse files / camera</p>
                  </div>
                )}
              </div>
              
              <button 
                type="submit" 
                disabled={!file || loading}
                className={`w-full py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                  !file ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-100' : 
                  loading 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white opacity-80 cursor-wait shadow-lg shadow-amber-500/20' 
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-[1.01] active:scale-[0.99] hover:shadow-lg hover:shadow-amber-500/20'
                }`}
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Ripeness...</span>
                  </>
                ) : (
                  <>
                    <Scan className="h-5 w-5" />
                    <span>Scan Crop Maturity</span>
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

        {/* Right Column: Results */}
        <div className="lg:col-span-3">
          {result ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-fadeIn">
              
              {/* Language Switcher header bar */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-4 border-b border-slate-800">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Languages className="h-4 w-4 text-amber-400" />
                  Select Language
                </span>
                
                <div className="flex gap-1">
                  {['English', 'Kannada', 'Hindi'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLanguage(lang)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        activeLanguage === lang 
                          ? 'bg-amber-500 text-white shadow shadow-amber-500/30' 
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
                    <span className="text-[10px] uppercase font-bold text-slate-400">Detected Stage</span>
                    <h2 className="text-2xl font-black text-slate-950 mt-0.5">{result.stage}</h2>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm border bg-amber-50 text-amber-600 border-amber-100">
                        <Sparkles className="h-4 w-4" />
                        <span>{result.confidence}% Confident</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Detail Tabs */}
              <div className="p-6 space-y-6">
                
                {/* Time to Harvest */}
                <div className="flex items-center gap-4 bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                  <div className="p-3 bg-orange-500 rounded-xl shadow-inner">
                    <CalendarDays className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Estimated Time to Harvest</p>
                    <p className="text-lg font-black text-slate-800">{result.estimated_days}</p>
                  </div>
                </div>

                {/* Analysis */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-slate-400" />
                    Visual Analysis
                  </h3>
                  <p className="text-sm text-slate-650 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {(() => {
                      try {
                        const parsed = JSON.parse(result.analysis_json || '{}');
                        return parsed[activeLanguage] || parsed['English'] || 'Analysis pending...';
                      } catch { return 'Analysis data unavailable.'; }
                    })()}
                  </p>
                </div>

                {/* Actionable Advice */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Actionable Advice
                  </h3>
                  <p className="text-sm text-amber-800 leading-relaxed font-semibold bg-amber-50/30 p-4 rounded-2xl border border-amber-100/50">
                    {(() => {
                      try {
                        const parsed = JSON.parse(result.actionable_advice_json || '{}');
                        return parsed[activeLanguage] || parsed['English'] || 'Advice pending...';
                      } catch { return 'Advice data unavailable.'; }
                    })()}
                  </p>
                </div>

              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50 border border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-12 text-slate-400">
              <Scan className="h-12 w-12 text-slate-300 mb-3 animate-pulse" />
              <p className="font-bold text-slate-500 text-sm">Waiting for Scan Telemetry</p>
              <p className="text-[10px] text-slate-400 font-medium max-w-xs mt-1 leading-relaxed">
                Upload or drag a photo of your crop on the left panel to detect its exact maturity and harvest readiness.
              </p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default MaturityScanner;
