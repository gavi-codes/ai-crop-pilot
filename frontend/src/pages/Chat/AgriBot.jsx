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
  Volume1
} from 'lucide-react';

const AgriBot = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am Agri-bot, your personal AI agricultural assistant. 🌾\nHow can I help you manage your crops, check mandi wholesale prices, or analyze local weather today?',
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
      
      rec.onstart = () => {
        setIsListening(true);
      };
      
      rec.onend = () => {
        setIsListening(false);
      };
      
      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      
      recognitionRef.current = rec;
    }
    
    // Initialize voices
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
    { label: '💰 Cotton Mandi Price', text: 'What is the price of Cotton?', icon: TrendingUp },
    { label: '🌾 Paddy Rate (ಕನ್ನಡ)', text: 'ಭತ್ತದ ಬೆಲೆ ಎಷ್ಟು?', icon: Globe2 },
    { label: '☁️ Weather Advisory', text: 'Show current weather advisory', icon: CloudSun },
    { label: '🧪 Soil Fertilizer needed', text: 'What fertilizer does my soil need?', icon: Droplet },
  ];

  // Helper to read out bot messages
  const speakResponse = (text, language) => {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel current speech
    window.speechSynthesis.cancel();
    
    // Clean text by stripping emojis
    const cleanText = text.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "");
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Match voices by language tag
    let langCode = 'en-IN';
    if (language === 'Kannada') langCode = 'kn-IN';
    else if (language === 'Hindi') langCode = 'hi-IN';
    
    utterance.lang = langCode;
    
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(langCode));
    if (voice) {
      utterance.voice = voice;
    }
    
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

    // Add user message
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
        
        // Auto-read response if voice is enabled
        if (voiceEnabled) {
          speakResponse(res.response, botLang);
        }
      } else {
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: 'Oops! I encountered an error. Please try again.',
          language: 'English',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'Could not connect to the Agri-bot service. Make sure backend is running.',
        language: 'English',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle dictation
  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Determine language to configure dictation
      const langConfig = detectLanguage(input);
      recognitionRef.current.lang = langConfig === 'Kannada' ? 'kn-IN' : langConfig === 'Hindi' ? 'hi-IN' : 'en-IN';
      recognitionRef.current.start();
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6 h-[calc(100vh-120px)] flex flex-col justify-between">
      
      {/* Header with Voice Configuration */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Bot className="h-8 w-8 text-emerald-500" />
            Agri-bot Voice Assistant
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Speak or type to receive smart market suggestions and weather alerts dynamically read aloud.
          </p>
        </div>

        {/* Audio controls */}
        <button
          onClick={() => {
            setVoiceEnabled(!voiceEnabled);
            if (voiceEnabled) window.speechSynthesis.cancel();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm border ${
            voiceEnabled 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
              : 'bg-slate-100 border-slate-200 text-slate-500'
          }`}
        >
          {voiceEnabled ? (
            <>
              <Volume2 className="h-4.5 w-4.5 text-emerald-600 animate-pulse" />
              <span>Auto Readout: ON</span>
            </>
          ) : (
            <>
              <VolumeX className="h-4.5 w-4.5" />
              <span>Auto Readout: OFF</span>
            </>
          )}
        </button>
      </div>

      {/* Main Conversational Window */}
      <div className="flex-1 bg-white/95 border border-slate-100 shadow-xl shadow-slate-200/50 rounded-3xl p-6 flex flex-col overflow-hidden justify-between border-t-4 border-t-emerald-500">
        
        {/* Messages transcript */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-6 scrollbar-thin scrollbar-thumb-slate-200">
          {messages.map((msg, idx) => {
            const isBot = msg.sender === 'bot';
            return (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${isBot ? 'self-start' : 'self-end flex-row-reverse ml-auto'}`}
              >
                {/* Avatar */}
                <div className={`h-8.5 w-8.5 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${
                  isBot 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                    : 'bg-indigo-50 border-indigo-100 text-indigo-600'
                }`}>
                  {isBot ? <Bot className="h-4.5 w-4.5" /> : <UserIcon className="h-4.5 w-4.5" />}
                </div>

                {/* Bubble */}
                <div className={`relative p-4 rounded-2xl leading-relaxed text-sm ${
                  isBot 
                    ? 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100 font-medium' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-tr-none font-bold shadow-md shadow-emerald-500/10'
                }`}>
                  {isBot && (
                    <button 
                      onClick={() => speakResponse(msg.text, msg.language)}
                      className="absolute -right-3 -top-3 p-1.5 bg-white border border-slate-100 rounded-lg shadow-sm text-slate-400 hover:text-emerald-500 active:scale-95 transition-all"
                      title="Read Message Aloud"
                    >
                      <Volume1 className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <p className="whitespace-pre-line pr-2">{msg.text}</p>
                  <span className={`text-[9px] block mt-1.5 text-right font-bold ${isBot ? 'text-slate-400' : 'text-emerald-100'}`}>
                    {msg.time} • {msg.language}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[80%] self-start">
              <div className="h-8.5 w-8.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                <span className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Recording ripple indicator if listening */}
        {isListening && (
          <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold animate-pulse mb-3 justify-center">
            <div className="h-2 w-2 bg-rose-500 rounded-full animate-ping" />
            <span>Voice Assistant is Listening... Speak now!</span>
          </div>
        )}

        {/* Preset suggestions & input */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          
          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            {presetQueries.map((preset, idx) => {
              const Icon = preset.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(preset.text)}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-650 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all cursor-pointer select-none"
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form input with speech Recognition */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }} 
            className="flex gap-3 items-center"
          >
            {speechSupported && (
              <button
                type="button"
                onClick={toggleListening}
                disabled={loading}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center ${
                  isListening 
                    ? 'bg-rose-500 text-white border-rose-500 animate-pulse shadow-md shadow-rose-500/20' 
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
                title={isListening ? "Stop listening" : "Dictate query"}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5 animate-pulse" />}
              </button>
            )}

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Speak (tap mic) or type your query here..."
              disabled={loading}
              className="flex-1 p-3.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-slate-800 placeholder-slate-400 bg-white"
            />
            
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`p-3.5 rounded-2xl flex items-center justify-center transition-all ${
                !input.trim() || loading
                  ? 'bg-slate-100 text-slate-350 border border-slate-100 cursor-not-allowed'
                  : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow shadow-slate-900/10'
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AgriBot;
