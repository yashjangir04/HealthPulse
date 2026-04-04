import { supabase } from '../SupabaseClient';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import EditProfileModal from '../components/EditProfileModal';
import MedicationManagerModal from '../components/MedicationManagerModal';
import ReportsListOverlay from '../components/ReportsListOverlay';
import { 
  Edit3, Heart, Activity, Plus, Pill, ChevronRight, 
  ChevronUp, ClipboardList, FileText, Calendar, User, 
  MapPin, Phone, Mail, Droplet, CheckCircle 
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { getMe } from '../api/auth';
import { CalculateAge } from '../utils/CalculateAge' ;

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

const ProfileView = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        const user = res.data.user;

        setUserData({
          ...user,
          name: user.name || "User",
          email: user.email || "",
          dob: user.dob ? new Date(user.dob).toLocaleDateString('en-GB') : "N/A",
          age: CalculateAge(user.dob),
          weight: user.weight || "--",
          height: user.height || "--",
          gender: user.gender || "N/A",
          bloodGroup: user.bloodGroup || "N/A",
          phoneNumber: user.phoneNumber || "N/A",
          address:
  typeof user.address === "object"
    ? user.address.fullAddress
    : user.address || "No address provided",
          avatar: user.avatar || null,
          secondaryContact: user.secondaryContacts?.[0]
            ? `${user.secondaryContacts[0].name} - ${user.secondaryContacts[0].phoneNumber}`
            : "No contact",
          medications: user.medicineReminders || [],
          appointments: user.appointments || [],
          vitals: user.vitals || { bp: "120/80", pulse: "72" },
          diagnoses: user.medicalHistory || ["No active medical history"],
          reports: [], 
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const fetchReports = useCallback(async (email) => {
    if (!email) return;
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', email)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUserData(prev => ({
        ...prev,
        reports: data.map(repo => ({
          title: repo.title,
          date: new Date(repo.created_at).toLocaleDateString('en-GB'),
          analysis: repo.analysis,
          url: repo.file_url
        }))
      }));
    }
  }, []);

  useEffect(() => {
    if (userData?.email) {
      fetchReports(userData.email);
    }
  }, [userData?.email, fetchReports]);

  const handleReportUpload = async (file) => {
    if (!file || !userData?.email) return;
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: storageError } = await supabase.storage.from('medical-reports').upload(fileName, file);
      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage.from('medical-reports').getPublicUrl(fileName);
      const publicUrl = urlData?.publicUrl;

      const response = await axios.post('/api/analyze-report', { reportUrl: publicUrl, userId: userData.email });
      
      const { error: dbError } = await supabase.from('reports').insert([{
        title: file.name.replace(/\.[^/.]+$/, ""),
        file_url: publicUrl,
        user_id: userData.email,
        analysis: response.data.analysis,
        status: 'completed'
      }]);

      if (dbError) throw dbError;
      fetchReports(userData.email);
      alert("Analysis complete!");
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
  };

  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold text-sm animate-pulse tracking-wide">Loading health profile...</p>
      </div>
    );
  }

  const status = ((bp, pulse) => {
    const [systolic] = (bp || "120/80").split('/').map(Number);
    if (systolic >= 140 || pulse > 100) return { label: "Attention", color: "bg-red-500 text-white" };
    return { label: "Normal", color: "bg-emerald-50 text-emerald-700 border border-emerald-200" };
  })(userData.vitals.bp, userData.vitals.pulse);

  const renderSchedule = (scheduleObj) => {
    if (!scheduleObj) return null;
    if (typeof scheduleObj === 'string') return scheduleObj;
    if (typeof scheduleObj === 'object') {
      return (
        <div className="flex gap-1.5 mt-1">
          {Object.entries(scheduleObj).map(([time, isActive]) => {
            if (!isActive) return null;
            const labels = { M: "Morning", A: "Afternoon", E: "Evening", N: "Night" };
            return (
              <span key={time} className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-500 shadow-sm">
                {labels[time] || time}
              </span>
            );
          })}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCFF] font-sans text-slate-800 pb-24 selection:bg-blue-100 selection:text-blue-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">Patient Portal</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
              Your <span className="text-blue-600">health</span> <br className="hidden sm:block" />
              Overview.
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              Manage your personal health data, track medications, and securely store your medical records in one place.
            </p>
          </div>
          
          <div className="flex bg-slate-200/50 p-1 rounded-full w-max border border-slate-200/60 shrink-0">
            <button 
              onClick={() => setCurrentPage(1)} 
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${currentPage === 1 ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Activity size={16} /> Overview
            </button>
            <button 
              onClick={() => setCurrentPage(2)} 
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${currentPage === 2 ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <ClipboardList size={16} /> Records
            </button>
          </div>
        </div>

        {currentPage === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              
              <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-500 to-indigo-600"></div>
                
                <div className="relative z-10 flex flex-col items-center text-center mt-8">
                  <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden mb-4 bg-white">
                    <img src={userData.avatar || `https://ui-avatars.com/api/?name=${userData.name}&background=eff6ff&color=1d4ed8`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{userData.name}</h2>
                  <div className="flex items-center gap-2 mt-1 text-slate-500">
                    <User size={14} />
                    <span className="font-semibold">{userData.gender} • {userData.age ? `${userData.age} Yrs` : userData.dob}</span>
                  </div>

                  <button 
                    onClick={() => setIsEditModalOpen(true)} 
                    className="mt-6 px-6 py-2.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2 border border-blue-100"
                  >
                    <Edit3 size={14}/> Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-8 pt-8 border-t border-slate-100">
                  <StatBox label="Weight" value={`${userData.weight} kg`} icon={<Activity size={14}/>} />
                  <StatBox label="Height" value={`${userData.height} cm`} icon={<User size={14}/>} />
                  <StatBox label="Blood" value={userData.bloodGroup} icon={<Droplet size={14}/>} />
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <FileText size={18} className="text-blue-500" />
                  Contact Information
                </h3>
                
                <div className="space-y-6">
                  <InfoBox icon={Phone} label="Mobile Phone" value={userData.phoneNumber} />
                  <InfoBox icon={Mail} label="Email Address" value={userData.email} />
                  <InfoBox icon={MapPin} label="Home Address" value={userData.address} />
                  
                  <div className="pt-6 border-t border-slate-100">
                    <div className="group cursor-pointer p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:border-blue-200 transition-colors flex justify-between items-center" onClick={() => navigate("/contact")}>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Emergency Contact</p>
                        <p className="text-sm font-bold text-slate-700">{userData.secondaryContact}</p>
                      </div>
                      <ChevronRight size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="lg:col-span-2 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-red-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                  
                  <div className="relative z-10 flex justify-between items-start mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center">
                      <Heart size={24} className="fill-current" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  
                  <div className="relative z-10">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Blood Pressure</p>
                    <p className="text-4xl font-black text-slate-900 tracking-tight">{userData.vitals.bp} <span className="text-base font-bold text-slate-400 tracking-normal">mmHg</span></p>
                  </div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                  
                  <div className="relative z-10 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Activity size={24} />
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Heart Rate</p>
                    <p className="text-4xl font-black text-slate-900 tracking-tight">{userData.vitals.pulse} <span className="text-base font-bold text-slate-400 tracking-normal">BPM</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <Pill size={24} className="text-blue-500" />
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Medications</h3>
                  </div>
                  <button onClick={() => setIsMedModalOpen(true)} className="w-10 h-10 rounded-full bg-white border border-slate-200 text-blue-600 flex items-center justify-center shadow-sm hover:border-blue-300 transition-colors">
                    <Plus size={20} />
                  </button>
                </div>
                
                <div className="p-8">
                  {userData.medications.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-500 font-medium">No active medications recorded.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userData.medications.slice(0, 4).map((med, i) => {
                        const medName = typeof med.medicine === 'object' ? med.medicine?.name : med.medicine;
                        
                        return (
                          <div key={med._id || i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors group">
                            <div className="flex items-center gap-4">
                              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgb(59,130,246,0.5)]"></div>
                              <div>
                                <p className="font-bold text-slate-900">{medName || "Unknown Medicine"}</p>
                                {renderSchedule(med.schedule)}
                              </div>
                            </div>
                            <CheckCircle size={18} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {userData.medications.length > 4 && (
                    <button onClick={() => setIsMedModalOpen(true)} className="w-full mt-6 py-3 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider hover:bg-blue-100 transition-colors">
                      View All Medications
                    </button>
                  )}
                </div>
              </div>

              {userData.appointments.length > 0 && (
                <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Upcoming Appointments</h3>
                    <Calendar size={20} className="text-blue-500" />
                  </div>
                  <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userData.appointments.map((appt, i) => (
                      <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
                        <p className="font-bold text-slate-900 text-lg mb-1">{appt.doctor}</p>
                        <p className="text-sm font-semibold text-slate-500">{appt.specialty}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Medical History</h3>
                <div className="space-y-6">
                  {userData.diagnoses.length > 0 ? (
                    userData.diagnoses.map((item, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
                        <p className="font-bold text-slate-800">{typeof item === 'object' ? item.condition : item}</p>
                        {typeof item === 'object' && item.date && <p className="text-xs font-semibold text-slate-500 mt-1">{item.date}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 font-medium">No medical history recorded.</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col min-h-[500px]">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Lab Reports</h3>
                  <button 
                    onClick={() => fileInputRef.current.click()} 
                    className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-[0_8px_20px_rgb(37,99,235,0.25)] hover:bg-blue-700 hover:scale-105 transition-all"
                  >
                    <Plus size={20} strokeWidth={3}/>
                  </button>
                </div>
                
                <div className="flex-1 space-y-4">
                  {userData.reports.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-60 mt-12">
                      <FileText size={48} className="text-slate-300 mb-4" />
                      <p className="text-slate-600 font-bold">No reports uploaded</p>
                      <p className="text-xs text-slate-400 mt-1">Upload a PDF or image to get AI analysis</p>
                    </div>
                  ) : (
                    userData.reports.map((report, i) => (
                      <div key={i} className="group p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all flex justify-between items-center cursor-pointer" onClick={() => setIsReportsOpen(true)}>
                        <div className="flex items-center gap-4 overflow-hidden">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                            <FileText size={18} />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-800 truncate">{report.title}</p>
                            <p className="text-xs font-semibold text-slate-400 mt-0.5">{report.date}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500" />
                      </div>
                    ))
                  )}
                </div>
                
                {userData.reports.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-100 flex justify-center">
                    <button onClick={() => setIsReportsOpen(true)} className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest hover:text-blue-800 transition-colors">
                      View All Reports <ChevronUp size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleReportUpload(e.target.files[0])} />
      <ReportsListOverlay isOpen={isReportsOpen} onClose={() => setIsReportsOpen(false)} reports={userData.reports} onUpload={handleReportUpload} />
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} userData={userData} onSave={async (formData) => {
  try {
    const res = await axios.put("/api/patient/profile", formData);

    // update UI with backend response
    setUserData(prev => ({
      ...prev,
      ...res.data
    }));

    setIsEditModalOpen(false);

  } catch (err) {
    console.error(err);
    alert("Update failed");
  }
}} />
      <MedicationManagerModal isOpen={isMedModalOpen} onClose={() => setIsMedModalOpen(false)} medications={userData.medications} onToggleReminder={() => {}} />
    </div>
  );
};

const InfoBox = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
      <Icon size={18} />
    </div>
    <div className="overflow-hidden">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      
      <p  className="text-sm font-semibold text-slate-800 truncate">
  {typeof value === "object"
    ? value?.fullAddress || "Invalid address"
    : value}
</p>
    </div>
  </div>
);

const StatBox = ({ label, value, icon }) => (
  <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center border border-slate-100">
    <div className="text-blue-400 mb-2">{icon}</div>
    <p className="text-sm font-black text-slate-800">{value}</p>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</p>
  </div>
);

export default ProfileView;