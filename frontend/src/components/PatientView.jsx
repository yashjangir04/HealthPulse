  import { supabase } from '../supabaseClient';
  import React, { useState, useRef, useEffect } from 'react';
  import EditProfileModal from '../components/EditProfileModal';
  import MedicationManagerModal from '../components/MedicationManagerModal';
  import ReportsListOverlay from '../components/ReportsListOverlay';
  import { Edit3, Heart, Activity, Plus, Pill, ChevronRight, ChevronUp, ClipboardList, FileText, Calendar, Clock } from 'lucide-react';
  import { useNavigate } from "react-router-dom";
  import axios from 'axios';
  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
  axios.defaults.withCredentials = true;

const ProfileView = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [userData, setUserData] = useState({
      name: "Virat Sharma",
      email: "v.sharma@gmail.com",
      avatar: "",
      dob: "5-Aug-1997",
      age: 28,
      weight: 75,
      height: "5'11 ft",
      gender: "Male",
      bloodGroup: "A+",
      address: "Near Lodha Garden, Sector 23, New Delhi, India",
      phoneNumber: "+91 - 63752 XXXXX",
      secondaryContact: "Anjali Sharma (Wife) - +91 98765 XXXX",
      diagnoses: ["Type 2 Diabetes", "Hypertension"],
      medications: [
        { name: "Metterrin", dose: "500mg", time: "09:00 AM", reminderSet: true },
        { name: "Lisinpoil", dose: "10mg", time: "08:00 PM", reminderSet: true },
        { name: "Vitamin B12", dose: "", time: "02:00 PM", reminderSet: false }
      ],
      appointments: [
          { doctor: "Dr. Ankit Verma", specialty: "Cardiologist", date: "24 Oct", time: "10:30 AM" },
          { doctor: "Dr. Megha Singh", specialty: "Endocrinologist", date: "28 Oct", time: "04:15 PM" },
          { doctor: "Dr. Rahul Iyer", specialty: "General Physician", date: "05 Nov", time: "11:00 AM" }
      ],
      vitals: { bp: "121/75", pulse: "67" },
      reports: [
        { title: "X-Ray-Virat Sharma", date: "01/10/2022" },
        { title: "Allergen-specific IgE", date: "17/05/2021" },
        { title: "Nascal Endoscopy", date: "18/04/2020" }
      ]
    });

  // ✅ REPLACE your handleReportUpload with this inside ProfileContent.js
  // ... existing code

  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from('reports').select('*').limit(1);
      if (error) {
        console.error("❌ Connection Failed:", error.message);
      } else {
        console.log("✅ Connection Successful! Database reached.");
      }
    };
    testConnection();
  }, []);

  useEffect(() => {
  const fetchUserReports = async () => {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', userData.email) // Matching the user
      .order('created_at', { ascending: false }); // Newest first

    if (error) {
      console.error("Error fetching reports:", error);
    } else if (data) {
      // Update the state with REAL data from DB
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
  };

  fetchUserReports();
}, [userData.email]); // Runs once when the component mounts

  const handleReportUpload = async (file) => {
    if (!file) return;

    try {
      // 1. Upload to Supabase
      const fileName = `${Date.now()}-${file.name}`;

      const { error: storageError } = await supabase.storage
        .from('medical-reports')
        .upload(fileName, file);

      if (storageError) throw storageError;

      // 2. Get public URL
const { data } = supabase.storage
  .from('medical-reports')
  .getPublicUrl(fileName);

const publicUrl = data?.publicUrl;

if (!publicUrl) throw new Error("Failed to get public URL");

      // 3. 🔥 CALL BACKEND AI API
const response = await axios.post('/api/analyze-report', {
  reportUrl: publicUrl,
  userId: userData.email
});

      const result = await response.json();

      if (!result.success) throw new Error("AI failed");

      // 4. Save to Supabase DB
      const { error: dbError } = await supabase
        .from('reports')
        .insert([{
          title: file.name.replace(/\.[^/.]+$/, ""),
          file_url: publicUrl,
          user_id: userData.email,
          analysis: result.analysis, // 🔥 IMPORTANT
          status: 'completed'
        }]);

      if (dbError) throw dbError;

      // 5. Update UI
      const newReport = {
        title: file.name,
        date: new Date().toLocaleDateString('en-GB'),
        analysis: result.analysis,
        file_url: publicUrl
      };

      setUserData(prev => ({
        ...prev,
        reports: [newReport, ...prev.reports]
      }));

      alert("Upload + AI analysis done!");

    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };
  // ... rest of component

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      handleReportUpload(file);
      e.target.value = null;
    };

    const handleAvatarChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setUserData({ ...userData, avatar: reader.result });
        reader.readAsDataURL(file);
      }
    };

    const handleSaveProfile = (updatedFields) => {
      const NewUserData = { ...userData, ...updatedFields };
      setUserData(NewUserData);
      localStorage.setItem("healthpulse_user_data", JSON.stringify(NewUserData));
      setIsEditModalOpen(false);
    };

    const handleToggleReminder = (index) => {
      const updatedMeds = [...userData.medications];
      updatedMeds[index].reminderSet = !updatedMeds[index].reminderSet;
      setUserData({ ...userData, medications: updatedMeds });
    };

    const status = ((bp, pulse) => {
      const [systolic] = bp.split('/').map(Number);
      if (systolic >= 140 || pulse > 100) return { label: "Attention", color: "bg-red-500" };
      return { label: "Normal", color: "bg-[#22C55E]" };
    })(userData.vitals.bp, userData.vitals.pulse);

    return (
      <div className="p-4 md:p-8 bg-[#E3EEFF]/50 min-h-screen">
        
        {/* PAGE NAVIGATION TABS */}
        <div className="max-w-[1200px] mx-auto mb-8 flex gap-4">
          <button 
            onClick={() => setCurrentPage(1)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${currentPage === 1 ? 'bg-[#1B80FD] text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-white/80'}`}
          >
            <Activity size={18} /> Overview
          </button>
          <button 
            onClick={() => setCurrentPage(2)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${currentPage === 2 ? 'bg-[#1B80FD] text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-white/80'}`}
          >
            <ClipboardList size={18} /> Medical Records
          </button>
        </div>

        <div className="max-w-[1200px] mx-auto">
          {currentPage === 1 ? (
            /* --- PAGE 1: PRIMARY PROFILE & APPOINTMENTS (LEFT) | VITALS & MEDS (RIGHT) --- */
            <div className="grid grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT COLUMN */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                {/* MAIN IDENTITY CARD */}
                <section className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-xl border-[2px] border-[#1B80FD]/20 flex flex-col md:flex-row gap-8 lg:gap-12">
                  <div className="flex flex-col items-center w-full md:w-[40%] shrink-0">
                    <div className="relative group cursor-pointer">
                      <div className="w-24 h-24 rounded-full border-2 border-blue-50 overflow-hidden mb-3 bg-slate-100 relative shadow-inner">
                        <img src={userData.avatar || `https://ui-avatars.com/api/?name=${userData.name}`} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <label htmlFor="avatar-upload" className="absolute bottom-3 right-0 bg-[#1B80FD] text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs border-2 border-white cursor-pointer hover:scale-110 transition-transform">
                        <Plus size={14} />
                      </label>
                      <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </div>
                    <h2 className="font-bold text-xl text-slate-800 mb-4 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>{userData.name}</h2>
                    <div className="w-full border-t border-slate-50 mb-5"></div>
                    <div className="grid grid-cols-2 gap-2.5 w-full">
                      <StatBox label="DOB" value={userData.dob} />
                      <StatBox label="AGE" value={userData.age} />
                      <StatBox label="WEIGHT" value={`${userData.weight} kg`} />
                      <StatBox label="HEIGHT" value={userData.height} />
                      <StatBox label="GENDER" value={userData.gender} />
                      <StatBox label="BLOOD GROUP" value={userData.bloodGroup} />
                    </div>
                  </div>
                  <div className="hidden md:block w-[5px] bg-slate-100 self-stretch my-2"></div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-6">
                      <InfoBox label="Home Address" value={userData.address} />
                      <InfoBox label="Mobile Phone" value={userData.phoneNumber} />
                      <InfoBox label="Email" value={userData.email} />
                      <div className="pt-2 border-t border-slate-50 flex justify-between items-center group cursor-pointer" onClick={() => navigate("/contact")}>
                        <div>
                          <p className="text-slate-400 font-medium text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Secondary Contact</p>
                          <p className="text-slate-600 font-semibold text-sm italic" style={{ fontFamily: "'Inter', sans-serif" }}>{userData.secondaryContact}</p>
                        </div>
                        <ChevronRight size={18} className="text-[#1B80FD] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                    <button onClick={() => setIsEditModalOpen(true)} className="mt-6 w-fit flex items-center gap-2 px-8 py-2.5 bg-[#EBF3FF] text-[#1B80FD] rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#1B80FD] hover:text-white transition-all duration-300 shadow-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <Edit3 size={14}/> Edit Profile
                    </button>
                  </div>
                </section>

                {/* APPOINTMENT SCHEDULE BOX (NOW BELOW PROFILE) */}
                <section className="bg-white rounded-[2.5rem] shadow-xl border-[2px] border-[#1B80FD]/10 overflow-hidden flex-grow">
                  <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Calendar size={22} className="text-[#1B80FD]" />
                      <h3 className="text-xl font-light text-slate-400 tracking-tight">Upcoming Appointments</h3>
                    </div>
                    <button onClick={() => navigate("/appointments")} className="text-[#1B80FD] font-bold text-xs uppercase tracking-widest hover:underline decoration-dotted decoration-2 underline-offset-4"style={{ fontFamily: "'Poppins', sans-serif" }}>Show All Appointments ›</button>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {userData.appointments.map((appt, i) => (
                      <div key={i} className="bg-[#F8FAFF] p-5 rounded-[1.5rem] border border-blue-50 relative group hover:border-[#1B80FD]/30 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="bg-white p-2 rounded-lg shadow-sm">
                            <Clock size={14} className="text-[#1B80FD]" />
                          </div>
                          <span className="text-[12px] font-black text-[#1B80FD] bg-blue-50 px-3 py-1 rounded-full uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>{appt.date}</span>
                        </div>
                        <p className="text-slate-600 font-semibold leading-tight" style={{ fontFamily: "'Inter', sans-serif" }}>{appt.doctor}</p>
                        <p className="text-slate-400 font-medium text-sm mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>{appt.specialty}</p>
                        <p className="text-[12px] font-mono text-slate-500">{appt.time}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <section className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border-[2px] border-[#1B80FD]/10 flex-grow">
                  <div className="px-8 py-4 flex justify-between items-center border-b border-gray-100">
                    <span className="text-xl font-light text-slate-400 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>Recent Vitals</span>
                    <span className={`px-3 py-1 ${status.color} text-white text-[10px] rounded-full font-bold uppercase tracking-widest`} style={{ fontFamily: "'Inter', sans-serif" }}>{status.label}</span>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-gray-100">
                    <VitalItem icon={Heart} label="BP" value={userData.vitals.bp} color="text-red-400" />
                    <VitalItem icon={Activity} label="Pulse" value={userData.vitals.pulse} unit="BPM" color="text-[#1B80FD]" />
                  </div>
                </section>

                <section className="bg-white rounded-[2.5rem] shadow-xl border-[2px] border-[#1B80FD]/10 overflow-hidden flex-grow flex flex-col min-h-[200px]">
                  <div className="px-8 pt-6 pb-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-light text-slate-400 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>Current Medications</h3>
                    <Pill size={20} className="text-[#1B80FD]/50" />
                  </div>
                  <div className="px-8 py-6 space-y-5 flex-grow flex flex-col justify-between">
                    {userData.medications.slice(0, 3).map((med, i) => (
                      <div key={i} className="flex items-center gap-4 group">
                        <div className="w-2 h-2 rounded-full bg-[#1B80FD]"></div>
                        <p className="text-lg font-normal text-slate-600 tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>{med.name} <span className="text-sm text-slate-400 ml-2" style={{ fontFamily: "'Inter', sans-serif" }}>{med.dose}</span></p>
                      </div>
                    ))}
                    <button onClick={() => setIsMedModalOpen(true)} className="w-full mt-4 text-[#1B80FD] font-bold text-xs uppercase tracking-widest text-left hover:translate-x-1 transition-transform" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Show All Medicines ›
                    </button>
                  </div>
                </section>
              </div>
            </div>
          ) : (
            /* --- PAGE 2: MEDICAL HISTORY (UNCHANGED) --- */
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-7">
                <section className="bg-white rounded-[2.5rem] p-10 shadow-xl border-[2px] border-[#1B80FD]/10 h-full">
                  <div className="mb-6">
                    <h3 className="text-2xl font-light text-slate-400 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>Current Health Status</h3>
                    <div className="w-16 h-1 bg-[#1B80FD] rounded-full mt-2"></div>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                    <StatusItem label="Active Diagnoses" value={userData.diagnoses.join(", ")} />
                    <StatusItem label="Severity/Status" value="Controlled, Chronic" />
                    <StatusItem label="Type of Diagnosis" value="Chronic" />
                    <StatusItem label="Date of Diagnosis" value="2010, 2012" />
                    <StatusItem label="Drug Allergies" value="Penicillin, Sulfa" />
                    <StatusItem label="Food/Environmental" value="Peanuts, Latex" />
                  </ul>
                </section>
              </div>
              <div className="col-span-12 lg:col-span-5">
                <section className="bg-white rounded-[2.5rem] p-8 shadow-xl border-[2px] border-[#1B80FD]/10 flex flex-col min-h-[400px]">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-light text-slate-400 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>Lab Reports</h3>
                    <button onClick={() => fileInputRef.current.click()} className="bg-[#1B80FD] text-white p-2 rounded-xl shadow-lg hover:scale-105 transition-transform">
                      <Plus size={18}/>
                    </button>
                  </div>
                  <div className="space-y-6 mb-6">
                    {userData.reports.map((report, i) => (
                      <div key={i} className="flex justify-between items-center text-sm group cursor-pointer border-b border-transparent hover:border-blue-50 pb-2">
                        <div className="flex items-center">
                          <FileText size={16} className="text-blue-300 mr-3" />
                          <p className="text-slate-600 font-medium truncate max-w-[200px]" style={{ fontFamily: "'Inter', sans-serif" }}>{report.title}</p>
                        </div>
                        <p className="text-slate-400 text-[10px] font-mono">{report.date}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <button onClick={() => setIsReportsOpen(true)} className="text-[#1B80FD] font-bold text-xs underline underline-offset-8 decoration-dotted uppercase tracking-widest" style={{ fontFamily: "'Poppins', sans-serif" }}>Show All</button>
                    <div className="w-10 h-10 rounded-full bg-[#F2F7FF] text-[#1B80FD] flex items-center justify-center border border-blue-100 cursor-pointer" onClick={() => setIsReportsOpen(true)}>
                      <ChevronUp size={20} />
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>

        {/* MODALS */}
        <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleFileChange} />
        <ReportsListOverlay isOpen={isReportsOpen} onClose={() => setIsReportsOpen(false)} reports={userData.reports} onUpload={handleReportUpload} />
        <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} userData={userData} onSave={handleSaveProfile} />
        <MedicationManagerModal isOpen={isMedModalOpen} onClose={() => setIsMedModalOpen(false)} medications={userData.medications} onToggleReminder={handleToggleReminder} />
      </div>
    );
  };

  // HELPERS (UNCHANGED)
  const InfoBox = ({ label, value }) => (
    <div>
      <p className="text-slate-400 font-medium text-sm mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{label}</p>
      <p className="text-slate-600 font-semibold leading-tight" style={{ fontFamily: "'Inter', sans-serif" }}>{value}</p>
    </div>
  );

  const StatBox = ({ label, value }) => (
    <div className="bg-[#EBF3FF] p-3 rounded-xl text-center border border-blue-50/50 shadow-sm">
      <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-tighter" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</p>
      <p className="text-[13px] font-bold text-slate-600" style={{ fontFamily: "'Inter', sans-serif" }}>{value}</p>
    </div>
  );

  const StatusItem = ({ label, value }) => (
    <li className="flex flex-col gap-1">
      <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest" style={{ fontFamily: "'Poppins', sans-serif" }}>{label}</span>
      <p className="text-slate-700 font-medium text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{value}</p>
    </li>
  );

const VitalItem = ({ icon: Icon, label, value, unit, color }) => (
  <div className="p-6 flex flex-col items-center justify-center group">
    <Icon className={`${color} mb-2 transition-transform group-hover:scale-110`} size={28} strokeWidth={1.5} />
    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</p>
    <p className="text-2xl font-bold text-slate-700" style={{ fontFamily: "'Inter', sans-serif" }}>{value} <span className="text-xs font-normal text-slate-400">{unit}</span></p>
  </div>
);

export default ProfileView;