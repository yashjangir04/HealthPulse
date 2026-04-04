import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { 
  Stethoscope, 
  Activity, 
  ChevronDown, 
  Search, 
  Video, 
  Users,
  Mic,
  Loader2,
  Wand2
} from 'lucide-react';

const Connect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendedSpec, setRecommendedSpec] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const handleListen = () => {
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSymptoms(prev => prev ? prev + ' ' + transcript : transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    setIsAnalyzing(true);
    setRecommendedSpec(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_AI_ROUTE}/api/analyze-symptoms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms })
      });
      const data = await res.json();
      setRecommendedSpec(data.specialty);
    } catch (err) {
      console.error(err);
      setRecommendedSpec('general');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCallRecommended = () => {
    if (recommendedSpec) {
      navigate(`/lobby/${recommendedSpec.toLowerCase()}`);
    }
  };

  const specializations = [
    { label: "Cardiologist (Heart)", value: "cardiologist" },
    { label: "Dermatologist (Skin)", value: "dermatologist" },
    { label: "Pediatrician (Child)", value: "pediatrician" },
    { label: "Orthopedist (Bones)", value: "orthopedist" },
    { label: "Gynecologist (Women's Health)", value: "gynecologist" },
    { label: "Ophthalmologist (Eyes)", value: "ophthalmologist" },
    { label: "Dentist (Teeth)", value: "dentist" }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSpecialistSubmit = (e) => {
    e.preventDefault();
    if (selectedSpecialty) {
      navigate(`/lobby/${selectedSpecialty.value.toLowerCase()}`); 
    }
  };

  const handleGeneralDoctor = () => {
    navigate('/lobby/general'); 
  };

  const handleDoctorGoOnline = () => {
    navigate(`/lobby/${user.specialization.toLowerCase()}`);
  };

  const PageHeader = ({ title, subtitle, badgeText }) => (
    <div className="mb-10 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-blue-200 bg-blue-50 mb-4">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span className="text-[11px] font-bold text-blue-800 tracking-wider uppercase">
            {badgeText}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
          {title}
        </h1>
        <p className="text-gray-500 font-medium mt-2 text-[15px] max-w-lg">
          {subtitle}
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-4 bg-white p-2.5 pr-5 rounded-full border border-slate-200 shadow-sm cursor-default">
        <div className="w-12 h-12 rounded-full bg-linear-to-tr from-slate-800 to-slate-950 flex items-center justify-center text-white font-black text-lg shadow-inner ring-2 ring-white">
          {user?.name ? user.name.substring(0, 2).toUpperCase() : "YA"}
        </div>
        <div className="text-left">
          <p className="text-sm font-black text-slate-900 leading-tight">
            {user?.name || "Yash"}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            {user?.role === 'doctor' ? "Doctor Profile" : "Patient Profile"}
          </p>
        </div>
      </div>
    </div>
  );

  if (user?.role === 'doctor') {
    return (
      <div className="min-h-screen bg-[#FAFCFF] font-sans text-slate-900 pt-24 pb-32">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <PageHeader 
            title={<>Doctor <span className="text-blue-600">Portal.</span></>}
            subtitle="Manage your availability and connect with patients waiting in the lobby."
            badgeText="Provider Dashboard"
          />

          <div className="max-w-md mx-auto mt-12">
            <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-8 border border-slate-100 text-center relative overflow-hidden">
              
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-blue-50 blur-3xl rounded-full opacity-60 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100 rotate-3">
                  <Stethoscope size={36} className="text-blue-600 -rotate-3" />
                </div>
                
                <h2 className="text-2xl font-black text-slate-900 mb-2">
                  Start Your Shift
                </h2>
                <p className="text-slate-500 font-medium text-sm mb-8 px-4">
                  Go online to automatically connect with patients requesting a <span className="capitalize text-blue-600 font-bold">{user?.specialization || "consultation"}</span>.
                </p>

                <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-200">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Current Status</p>
                  <div className="flex items-center justify-center gap-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-300"></span>
                    </span>
                    <span className="font-bold text-slate-600 text-sm">Offline — Not taking patients</span>
                  </div>
                </div>

                <button
                  onClick={handleDoctorGoOnline}
                  className="w-full py-4 px-4 cursor-pointer rounded-xl font-black text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Video size={18} />
                  Go Online & Enter Lobby
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFCFF] font-sans text-slate-900 pt-24 pb-32">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <PageHeader 
          title={<>Find a <span className="text-blue-600">Doctor.</span></>}
          subtitle="Connect with top specialists instantly or consult a general physician for guidance."
          badgeText="Live Matchmaking"
        />

        <div className="max-w-lg mx-auto mt-8">
          <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-8 sm:p-10 border border-slate-100 relative overflow-hidden">
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-blue-50 blur-3xl rounded-full opacity-60 pointer-events-none"></div>

            <div className="relative z-10">
              <form onSubmit={handleSpecialistSubmit} className="space-y-6">
                
                <div className="relative" ref={dropdownRef}>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    I know what I need
                  </label>
                  
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 text-left transition-all font-bold text-sm outline-none ${
                      isOpen 
                        ? 'border-blue-500 bg-white ring-4 ring-blue-50' 
                        : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300'
                    }`}
                  >
                    <span className={selectedSpecialty ? 'text-slate-900' : 'text-slate-400'}>
                      {selectedSpecialty ? selectedSpecialty.label : 'Select a specialization...'}
                    </span>
                    <ChevronDown 
                      size={18} 
                      className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} 
                    />
                  </button>

                  {isOpen && (
                    <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto p-2 animate-in fade-in slide-in-from-top-2">
                      {specializations.map((spec) => (
                        <button
                          key={spec.value}
                          type="button"
                          onClick={() => {
                            setSelectedSpecialty(spec);
                            setIsOpen(false);
                          }}
                          className={`w-full text-left px-4 cursor-pointer py-3 font-bold text-sm rounded-lg transition-colors ${
                            selectedSpecialty?.value === spec.value 
                              ? 'bg-blue-50 text-blue-600' 
                              : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                          }`}
                        >
                          {spec.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={!selectedSpecialty}
                  className={`w-full py-4 px-4 rounded-xl font-black text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    selectedSpecialty 
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-blue-600/20 cursor-pointer active:scale-95' 
                      : 'bg-slate-200 cursor-not-allowed'
                  }`}
                >
                  <Search size={18} />
                  Connect with Specialist
                </button>
              </form>

              <div className="relative flex items-center py-6">
                <div className="grow border-t border-slate-100"></div>
                <span className="shrink-0 mx-4 text-slate-300 font-black text-xs uppercase tracking-widest">OR</span>
                <div className="grow border-t border-slate-100"></div>
              </div>

              <button
                onClick={handleGeneralDoctor}
                className="w-full py-4 px-4 cursor-pointer rounded-xl font-black text-slate-700 bg-white border-2 border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-sm"
              >
                <Activity size={20} className="text-blue-500" />
                Talk to a General Doctor
              </button>

              <div className="relative flex items-center py-6">
                <div className="grow border-t border-slate-100"></div>
                <span className="shrink-0 mx-4 text-slate-300 font-black text-xs uppercase tracking-widest">OR</span>
                <div className="grow border-t border-slate-100"></div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-500">
                    <Wand2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">Not sure what's wrong?</h3>
                    <p className="font-medium text-xs text-slate-500">
                      Describe your symptoms and AI will route you.
                    </p>
                  </div>
                </div>

                <div className="relative mb-3">
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g. I have a severe headache and mild fever..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-4 pr-12 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all resize-none h-24"
                  />
                  <button
                    type="button"
                    onClick={handleListen}
                    className={`absolute right-3 bottom-3 p-2 rounded-full transition-all ${
                      isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    <Mic size={16} />
                  </button>
                </div>

                {!recommendedSpec ? (
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !symptoms.trim()}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                      isAnalyzing || !symptoms.trim()
                        ? 'bg-blue-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-md cursor-pointer active:scale-95'
                    }`}
                  >
                    {isAnalyzing ? (
                      <><Loader2 size={18} className="animate-spin" /> Analyzing...</>
                    ) : (
                      "Analyze Symptoms"
                    )}
                  </button>
                ) : (
                  <div className="bg-white border border-blue-100 rounded-xl p-4 text-center animate-in fade-in zoom-in-95 duration-300 shadow-sm">
                    <p className="text-sm font-medium text-slate-600 mb-1">Recommended Specialist:</p>
                    <p className="text-xl font-black text-blue-700 capitalize mb-4">{recommendedSpec}</p>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={handleCallRecommended}
                        className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-md transition-all active:scale-95"
                      >
                        Call Now
                      </button>
                      <button
                        onClick={() => setRecommendedSpec(null)}
                        className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold text-sm transition-all"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}
                
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Connect;