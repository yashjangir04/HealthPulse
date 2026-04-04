import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Star, 
  GraduationCap, 
  Building2, 
  Mail, 
  Stethoscope,
  Search,
  User,
  X,
  MapPin,
  Phone,
  Calendar,
  Activity
} from "lucide-react";
import { getDoctors } from "../api/doctor";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State to control the modal
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await getDoctors() ;
        
        const doctorsData = response.data.doctors || response.data || [];
        setDoctors(doctorsData);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setError("Failed to load the medical directory. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Helper to extract initials for the avatar
  const getInitials = (name) => {
    if (!name) return "DR";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Helper to calculate age from DOB
  const calculateAge = (dobString) => {
    if (!dobString) return "--";
    const dob = new Date(dobString);
    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms); 
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedDoctor) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedDoctor]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-100 border-t-[#007AFF] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pt-24 pb-32">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-100 bg-blue-50 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-[#007AFF] animate-pulse"></span>
            <span className="text-xs font-bold text-[#007AFF] tracking-wider uppercase">
              Medical Directory
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mb-2">
            Find a <span className="text-[#007AFF]">Doctor.</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2 text-sm md:text-base max-w-lg">
            Browse our network of qualified healthcare professionals, view their credentials, and connect with specialists.
          </p>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 font-semibold text-center">
            {error}
          </div>
        ) : doctors.length === 0 ? (
          <div className="bg-white rounded-[24px] border border-gray-200 border-dashed p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              No Doctors Found
            </h3>
            <p className="text-gray-400 text-sm max-w-sm">
              We couldn't find any registered doctors in the directory at this time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div 
                key={doctor._id} 
                className="bg-white rounded-[24px] border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1"
              >
                {/* Top Section: Profile & Rating */}
                <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-start">
                  <div className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-2xl bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center font-black text-xl shrink-0 overflow-hidden shadow-inner">
                      {doctor.avatarUrl ? (
                        <img src={doctor.avatarUrl} alt={doctor.name} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(doctor.name)
                      )}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xl text-gray-900 leading-tight">
                        {doctor.name}
                      </h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1 flex items-center gap-1">
                        <Stethoscope size={12} /> {doctor.roleType || 'Doctor'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="text-sm font-extrabold text-amber-600">{doctor.rating?.toFixed(1) || "5.0"}</span>
                  </div>
                </div>

                {/* Middle Section: Details */}
                <div className="p-6 flex-1 flex flex-col gap-5">
                  <div className="flex gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-100 bg-blue-50 text-xs font-extrabold text-[#007AFF] tracking-wider uppercase">
                       {doctor.specialization}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-100 bg-emerald-50 text-xs font-extrabold text-emerald-600 tracking-wider uppercase">
                       <GraduationCap size={12} /> {doctor.qualification}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 bg-gray-50 text-gray-400 rounded-md">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">University</p>
                        <p className="font-bold text-gray-800 text-sm">{doctor.university}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 bg-gray-50 text-gray-400 rounded-md">
                        <MapPin size={16} />
                      </div>
                      <div className="truncate">
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Location</p>
                        <p className="font-bold text-gray-800 text-sm truncate">{doctor.address?.city || 'City not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="px-6 pb-6 pt-2">
                  <button 
                    onClick={() => setSelectedDoctor(doctor)}
                    className="w-full py-3.5 bg-gray-50 hover:bg-[#007AFF] text-gray-600 hover:text-white border border-gray-200 hover:border-[#007AFF] rounded-xl font-bold transition-all flex justify-center items-center gap-2 group"
                  >
                    <User size={18} className="text-gray-400 group-hover:text-white transition-colors" /> 
                    View Full Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FULL PROFILE MODAL POPUP */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header / Banner */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 pt-10 pb-6 px-8 relative border-b border-gray-100 flex flex-col items-center text-center">
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedDoctor(null)} 
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 rounded-full p-2.5 transition-colors shadow-sm"
              >
                <X size={20} strokeWidth={3} />
              </button>

              {/* Status Badge */}
              <div className="absolute top-6 left-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {selectedDoctor.isActive ? "Available" : "Unavailable"}
              </div>

              {/* Large Avatar */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white text-[#007AFF] flex items-center justify-center font-black text-3xl shadow-lg border-4 border-white overflow-hidden mb-4 relative z-10">
                {selectedDoctor.avatarUrl ? (
                  <img src={selectedDoctor.avatarUrl} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                ) : (
                  getInitials(selectedDoctor.name)
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                {selectedDoctor.name}
              </h2>
              
              <div className="flex flex-wrap justify-center items-center gap-2 mt-3">
                <span className="text-sm font-extrabold text-[#007AFF] uppercase tracking-wider">
                  {selectedDoctor.specialization}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-sm font-bold text-gray-500">
                  {selectedDoctor.roleType}
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 mt-4 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                <span className="text-sm font-extrabold text-gray-900">{selectedDoctor.rating?.toFixed(1) || "5.0"}</span>
                <span className="text-xs font-bold text-gray-400 ml-1">Patient Rating</span>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto bg-white flex flex-col gap-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Professional Info */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity size={14} className="text-[#007AFF]" /> Professional Details
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Degree / Qualification</p>
                      <p className="font-extrabold text-gray-900 text-base">{selectedDoctor.qualification}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Graduating University</p>
                      <p className="font-bold text-gray-700 text-sm">{selectedDoctor.university}</p>
                    </div>
                  </div>
                </div>

                {/* Personal & Contact */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User size={14} className="text-[#007AFF]" /> Personal & Contact
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex gap-6">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Age</p>
                        <p className="font-extrabold text-gray-900 text-base">{calculateAge(selectedDoctor.dob)} Yrs</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Gender</p>
                        <p className="font-extrabold text-gray-900 text-base">{selectedDoctor.gender}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><Phone size={10} /> Phone Number</p>
                      <p className="font-bold text-[#007AFF] text-sm">{selectedDoctor.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><Mail size={10} /> Email Address</p>
                      <p className="font-bold text-gray-700 text-sm break-all">{selectedDoctor.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
                <p className="text-xs font-extrabold text-[#007AFF] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin size={14} /> Clinic / Hospital Address
                </p>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <p className="font-extrabold text-gray-900 text-base mb-1">
                      {selectedDoctor.address?.fullAddress}
                    </p>
                    <p className="font-bold text-gray-500 text-sm">
                      {selectedDoctor.address?.city}, {selectedDoctor.address?.state} {selectedDoctor.address?.pincode}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer / CTA */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
              <button 
                onClick={() => setSelectedDoctor(null)}
                className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-200 bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button className="flex-1 py-4 bg-[#007AFF] hover:bg-blue-600 text-white rounded-xl font-black text-base flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-blue-500/20">
                <Calendar size={20} />
                Book Appointment
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsList;