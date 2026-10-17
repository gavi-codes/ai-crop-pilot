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
  Tag,
  Volume2,
  VolumeX,
  UploadCloud,
  Camera,
  RefreshCw
} from 'lucide-react';

const DiseaseForm = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  // Multi-language selection: 'English', 'Kannada', or 'Hindi'
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
      const res = await diseaseService.predict(file);
      if (res.success) {
        setResult(res.data);
        setActiveLanguage('English');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze crop image');
    } finally {
      setLoading(false);
    }
  };

  // Text to Speech for remedies
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

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-2 border border-rose-200">
            <Sparkles className="h-3.5 w-3.5 text-rose-600" />
            <span>Multi-Spectral Computer Vision Diagnostics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            AI Crop Disease Scanner
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1 max-w-2xl">
            Upload or capture high-resolution leaf photos to identify fungal, bacterial, or pest infections with multilingual remedies.
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
                    ? 'border-emerald-500 bg-emerald-50/20' 
                    : 'border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/10'
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
                    <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-emerald-500 z-10" />
                    <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-emerald-500 z-10" />
                    <div className="absolute bottom-10 left-2 w-6 h-6 border-b-2 border-l-2 border-emerald-500 z-10" />
                    <div className="absolute bottom-10 right-2 w-6 h-6 border-b-2 border-r-2 border-emerald-500 z-10" />

                    <img 
                      src={preview} 
                      alt="Crop Leaf Telemetry" 
                      className="max-h-72 w-full object-cover rounded-2xl shadow-sm border border-slate-200" 
                    />
                    
                    {/* Holographic Laser Scan Line */}
                    {loading && <div className="scanner-laser"></div>}
                    
                    <p className="text-xs text-emerald-700 font-extrabold mt-3 hover:underline flex items-center gap-1.5">
                      <Camera className="h-4 w-4" />
                      <span>Retake or Change Photo</span>
                    </p>
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center">
                    <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 mb-3 border border-emerald-100 shadow-2xs group-hover:scale-110 transition-transform">
                      <UploadCloud className="h-8 w-8" />
                    </div>
                    <p className="text-base font-extrabold text-slate-900">Drag & drop leaf photo here</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">or browse files / take camera snapshot</p>
                    <span className="mt-4 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
                      JPG, PNG, WebP up to 10MB
                    </span>
                  </div>
                )}
              </div>

              {/* Submit / Scan Button */}
              <button 
                type="submit" 
                disabled={!file || loading}
                className={`w-full py-4 rounded-2xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                  !file 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                    : loading
                      ? 'bg-emerald-600 opacity-90 cursor-wait shadow-emerald-950/20'
                      : 'bg-gradient-to-r from-[#0B3D2E] via-[#0D4D3A] to-[#10B981] hover:opacity-95 shadow-emerald-950/20 active:scale-[0.99]'
                }`}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Neural Diagnostics...</span>
                  </>
                ) : (
                  <>
                    <Scan className="h-4.5 w-4.5" />
                    <span>Run AI Disease Diagnosis</span>
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

        {/* ================= RIGHT COLUMN: DIAGNOSTIC CONSOLE ================= */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden animate-fadeIn space-y-0">
              
              {/* Language Switcher Bar */}
              <div className="p-4 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">Diagnosis Language</span>
                </div>
                
                <div className="flex gap-1.5">
                  {['English', 'Kannada', 'Hindi'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLanguage(lang)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        activeLanguage === lang 
                          ? 'bg-[#10B981] text-white shadow-sm' 
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
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Identified Pathogen</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{result.disease_name}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-black">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <span>{result.confidence}% Confidence</span>
                  </span>

                  {/* Audio Readout Button */}
                  <button
                    onClick={() => handleSpeak(
                      result.treatment_json[activeLanguage] || result.treatment_json['English']
                    )}
                    className="p-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors cursor-pointer"
                    title="Read aloud"
                  >
                    {isSpeaking ? <VolumeX className="h-4 w-4 text-rose-500 animate-pulse" /> : <Volume2 className="h-4 w-4 text-emerald-600" />}
                  </button>
                </div>
              </div>

              {/* Diagnostic Detail Panels */}
              <div className="p-6 sm:p-7 space-y-6">
                
                {/* 1. Pathogen Overview */}
                <div className="space-y-2">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-slate-400" />
                    <span>Symptom Description</span>
                  </h3>
                  <div className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    {result.description_json[activeLanguage] || result.description_json['English']}
                  </div>
                </div>

                {/* 2. Treatment Solution */}
                <div className="space-y-2">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-emerald-600" />
                    <span>Targeted Treatment & Cure</span>
                  </h3>
                  <div className="text-sm text-slate-900 leading-relaxed font-semibold bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80">
                    {result.treatment_json[activeLanguage] || result.treatment_json['English']}
                  </div>
                </div>

                {/* 3. Recovery Fertilizer */}
                <div className="space-y-2">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Sprout className="h-4 w-4 text-indigo-600" />
                    <span>Foliar Immunity Booster</span>
                  </h3>
                  <div className="text-sm text-indigo-900 leading-relaxed font-bold bg-indigo-50/50 p-4 rounded-2xl border border-indigo-200/80">
                    {result.recovery_fertilizer_json[activeLanguage] || result.recovery_fertilizer_json['English']}
                  </div>
                </div>

                {/* 4. Medicine / Agrochemical Product */}
                {result.medicine && (
                  <div className="pt-2">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FlaskConical className="h-4 w-4 text-emerald-600" />
                      <span>{result.disease_name?.toLowerCase().includes('healthy') ? 'Foliar Nutrient / Plant Care' : 'Recommended Agrochemical / Fungicide'}</span>
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row gap-4 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden p-4">
                      <div className="w-full sm:w-28 h-28 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                        {(() => {
                          const rawUrl = result.medicine.photo_url;
                          const safeUrl = (!rawUrl || rawUrl.includes('1585421514738')) 
                            ? 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=500&q=80' 
                            : rawUrl;
                          return (
                            <img 
                              src={safeUrl} 
                              alt="Crop Protection Formulation" 
                              className="w-full h-full object-cover"
                              onError={(e) => { 
                                e.target.src = 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=500&q=80'; 
                              }}
                            />
                          );
                        })()}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="text-base font-black text-slate-900">{result.medicine.name}</h4>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                          <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg font-black">
                            <Tag className="h-3.5 w-3.5" />
                            <span>{result.medicine.price_estimate}</span>
                          </div>
                          <div className="text-slate-600 font-semibold bg-white px-3 py-1 rounded-lg border border-slate-200">
                            <span>Dosage: {result.medicine.quantity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Prevention Advisory */}
                <div className="pt-4 border-t border-slate-200 flex gap-3 items-start">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Preventative Agronomy Protocol</span>
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold">{result.prevention}</p>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="h-full bg-slate-50/70 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-12 text-slate-400 min-h-[460px]">
              <div className="p-4 bg-white rounded-2xl shadow-xs border border-slate-100 mb-4">
                <Scan className="h-10 w-10 text-emerald-600" />
              </div>
              <p className="font-extrabold text-slate-800 text-base">Awaiting Leaf Photography</p>
              <p className="text-xs text-slate-500 font-medium max-w-sm mt-1.5 leading-relaxed">
                Take a close-up photo of the affected leaf showing lesions or discoloration, then click Run AI Disease Diagnosis.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default DiseaseForm;
