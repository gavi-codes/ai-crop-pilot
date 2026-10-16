import React, { useState, useRef, useEffect } from 'react';
import { chatbotService } from '../../api/chatbotService';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User as UserIcon,
  Sparkles,
  TrendingUp,
  CloudSun,
  Droplet,
  Globe2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Volume1,
  Leaf
} from 'lucide-react';

const AgriBot = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaskara! I am AgriBot, your autonomous AI agricultural copilot. 🌾\nAsk me about mandi wholesale prices, regional weather advisories, soil NPK balancing, or fertilizer schedules in English, Kannada (ಕನ್ನಡ), or Hindi (हिन्दी).',
      language: 'English',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Voice Assistant state
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [currentlySpeakingIdx, setCurrentlySpeakingIdx] = useState(null);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check Speech Recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      
      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      
      recognitionRef.current = rec;
    }
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const presetQueries = [
    { label: '💰 Cotton Mandi Rate', text: 'What is the price of Cotton?', icon: TrendingUp },
    { label: '🌾 Paddy Rate (ಕನ್ನಡ)', text: 'ಭತ್ತದ ಬೆಲೆ ಎಷ್ಟು?', icon: Globe2 },
    { label: '☁️ Weather Advisory', text: 'Show current weather advisory for my district', icon: CloudSun },
    { label: '🧪 Fertilizer Dosage', text: 'What fertilizer does my soil need for vegetative stage?', icon: Droplet },
  ];

  const speakResponse = (text, language, msgIdx = null) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    if (currentlySpeakingIdx === msgIdx && msgIdx !== null) {
      setCurrentlySpeakingIdx(null);
      return;
    }

    const cleanText = text.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    let langCode = 'en-IN';
    if (language === 'Kannada') langCode = 'kn-IN';
    else if (language === 'Hindi') langCode = 'hi-IN';
    
    utterance.lang = langCode;
    
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(langCode));
    if (voice) utterance.voice = voice;
    
    utterance.onend = () => setCurrentlySpeakingIdx(null);
    utterance.onerror = () => setCurrentlySpeakingIdx(null);

    setCurrentlySpeakingIdx(msgIdx);
    window.speechSynthesis.speak(utterance);
  };

  const detectLanguage = (text) => {
    const textLower = text.toLowerCase();
    const kannada_keywords = ['ಬೆಲೆ', 'ದರ', 'ಹವಾಮಾನ', 'ಮಳೆ', 'ರೋಗ', 'ಮಣ್ಣು', 'ಗೊಬ್ಬರ', 'ಯೂರಿಯಾ', 'ನಮಸ್ಕಾರ', 'ಕನ್ನಡ', 'ಭತ್ತ', 'ಹತ್ತಿ'];
    const hindi_keywords = ['नमस्ते', 'मौसम', 'बारिश', 'मूल्य', 'दाम', 'बीमारी', 'खाद', 'मिट्टी', 'बताओ', 'धान', 'कपास'];
    
    if (kannada_keywords.some(kw => textLower.includes(kw))) return 'Kannada';
    if (hindi_keywords.some(kw => textLower.includes(kw))) return 'Hindi';
    return 'English';
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userLang = detectLanguage(text);

    const newMsg = {
      sender: 'user',
      text: text,
      language: userLang,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    if (!textToSend) setInput('');
    
    setLoading(true);
    try {
      const res = await chatbotService.query(text);
      if (res.success) {
        const botLang = detectLanguage(res.response);
        const botMsg = {
          sender: 'bot',
          text: res.response,
          language: botLang,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, botMsg]);
        
        if (voiceEnabled) {
          speakResponse(res.response, botLang);
        }
      } else {
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: 'Oops! I encountered an error processing your inquiry. Please try again.',
          language: 'English',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'Could not connect to the AgriBot service. Please verify server connection.',
        language: 'English',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      const langConfig = detectLanguage(input);
      recognitionRef.current.lang = langConfig === 'Kannada' ? 'kn-IN' : langConfig === 'Hindi' ? 'hi-IN' : 'en-IN';
      recognitionRef.current.start();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col justify-between font-sans">
      
      {/* Top Header & Audio Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-[#10B981] to-[#0B3D2E] text-white rounded-2xl shadow-md ring-2 ring-emerald-500/20">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                AgriBot Copilot
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                Voice AI
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500">Multilingual conversational agronomist supporting Kannada, Hindi, and English</p>
          </div>
        </div>

        {/* Audio Autoplay Switch */}
        <button
          onClick={() => {
            setVoiceEnabled(!voiceEnabled);
            if (voiceEnabled) window.speechSynthesis.cancel();
          }}
          className={`self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
            voiceEnabled 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-2xs' 
              : 'bg-slate-100 border-slate-200 text-slate-500'
          }`}
        >
          {voiceEnabled ? (
            <>
              <Volume2 className="h-4 w-4 text-emerald-600 animate-pulse" />
              <span>Voice Readout: On</span>
            </>
          ) : (
            <>
              <VolumeX className="h-4 w-4 text-slate-400" />
              <span>Voice Readout: Mute</span>
            </>
          )}
        </button>
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
        {messages.map((msg, index) => {
          const isBot = msg.sender === 'bot';
          const isSpeakingThis = currentlySpeakingIdx === index;

          return (
            <div 
              key={index}
              className={`flex items-start gap-3.5 ${isBot ? 'justify-start' : 'justify-end'} animate-fadeIn`}
            >
              {isBot && (
                <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-[#0B3D2E] to-[#10B981] text-white flex items-center justify-center shrink-0 shadow-md">
                  <Leaf className="h-4 w-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-5 shadow-xs transition-all ${
                isBot 
                  ? 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-sm' 
                  : 'bg-gradient-to-r from-[#0B3D2E] to-[#0D4D3A] text-white rounded-tr-sm shadow-md shadow-emerald-950/20'
              }`}>
                
                {/* Header inside bubble */}
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isBot ? 'text-emerald-700' : 'text-emerald-300'}`}>
                    {isBot ? 'AgriBot Intelligence' : 'Field Operator'}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold ${isBot ? 'text-slate-400' : 'text-emerald-200/60'}`}>
                      {msg.time}
                    </span>

                    {/* Bot speak button */}
                    {isBot && (
                      <button 
                        onClick={() => speakResponse(msg.text, msg.language, index)}
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${
                          isSpeakingThis ? 'bg-emerald-100 text-emerald-800' : 'text-slate-400 hover:text-slate-600'
                        }`}
                        title="Read aloud"
                      >
                        {isSpeakingThis ? <VolumeX className="h-3.5 w-3.5 animate-pulse text-emerald-600" /> : <Volume2 className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Message Body */}
                <p className="text-sm leading-relaxed whitespace-pre-line font-medium">
                  {msg.text}
                </p>

                {/* Language Tag */}
                {msg.language && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100/50 flex items-center justify-end">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      isBot ? 'bg-slate-100 text-slate-500' : 'bg-white/10 text-emerald-200'
                    }`}>
                      {msg.language}
                    </span>
                  </div>
                )}
              </div>

              {!isBot && (
                <div className="h-9 w-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md">
                  <UserIcon className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3 animate-fadeIn">
            <div className="h-9 w-9 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md">
              <Leaf className="h-4 w-4" />
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-3xl rounded-tl-sm shadow-xs flex items-center gap-2">
              <div className="flex gap-1.5 items-center px-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs font-bold text-slate-500">AgriBot is analyzing crop data...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Suggestions & Input Console */}
      <div className="pt-3 border-t border-slate-200 shrink-0 space-y-3">
        
        {/* Preset Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {presetQueries.map((pq, idx) => {
            const Icon = pq.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSend(pq.text)}
                disabled={loading}
                className="whitespace-nowrap flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-emerald-400 hover:text-emerald-800 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Icon className="h-3.5 w-3.5 text-emerald-600" />
                <span>{pq.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input Bar with Microphone */}
        <div className="relative flex items-center gap-2">
          
          {/* Voice Microphone Button */}
          {speechSupported && (
            <button
              onClick={toggleListening}
              className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-sm ${
                isListening 
                  ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30 ring-4 ring-rose-200' 
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-emerald-700'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Click to speak'}
            >
              {isListening ? <Mic className="h-5 w-5 animate-bounce" /> : <Mic className="h-5 w-5" />}
            </button>
          )}

          {/* Text Input */}
          <div className="relative flex-1">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? 'Listening to your voice... speak now' : 'Ask about mandi prices, fertilizer, weather, or crop disease...'}
              disabled={loading}
              className="w-full pl-5 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
            />
            
            <button 
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="absolute right-2 top-2 h-9 w-9 bg-gradient-to-tr from-[#0B3D2E] to-[#10B981] hover:opacity-95 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-30 cursor-pointer shadow-xs"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AgriBot;
