import React, { useEffect, useState } from "react";
import { 
  PiPillFill, PiPlusBold, PiTrashBold, PiWarningCircleFill, PiCheckCircleFill, PiXBold,
  PiUser, PiSparkle, PiFileText, PiUsers, PiBell, PiCalendarBlank, PiLink, PiShoppingBag, PiSignOut, PiCaretLeftBold
} from "react-icons/pi";
import { useAuth } from "../auth/AuthContext";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const MediList = () => {
  const { user } = useAuth();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  const date = new Date().getDate();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const [hour, setHour] = useState(new Date().getHours());
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "July", "Aug", "Sept", "Oct", "Nov", "Dec",
  ];

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/medications", {
        withCredentials: true,
      });
      if (response.data.success) {
        setMedications(response.data.medications);
      }
    } catch (err) {
      console.error("Failed to fetch meds:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExtend = async (medId, missedCount) => {
    try {
      const response = await axios.post(
        `/api/medications/extend`,
        { medicationId: medId, extraDays: 2 },
        { withCredentials: true }
      );
      if (response.data.success) fetchMedications();
    } catch (err) {
      console.error("Extension failed:", err);
    }
  };

  useEffect(() => {
    if (user) fetchMedications();

    const interval = setInterval(() => {
      const now = new Date();
      setHour(now.getHours());
      if (now.getMinutes() === 0) fetchMedications();
    }, 60000);

    return () => clearInterval(interval);
  }, [user]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMed, setNewMed] = useState({
    name: "", durationDays: 7, daysOfWeek: [],
    schedule: { M: "not-prescribed", A: "not-prescribed", E: "not-prescribed", N: "not-prescribed" },
  });

  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleDayToggle = (day) => {
    setNewMed((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "taken": return "bg-[#007AFF] text-white border-transparent shadow-sm"; 
      case "missed": return "bg-red-500 text-white border-transparent shadow-sm";
      case "immediate": return "bg-amber-500 text-white border-transparent ring-4 ring-amber-500/20";
      case "later": return "bg-gray-100 text-gray-500 border-transparent font-medium";
      default: return "bg-transparent text-gray-300 border-gray-200 border-2 border-dashed";
    }
  };

  const handleSlotClick = async (medId, slot, currentStatus) => {
    if (currentStatus === "immediate" || currentStatus === "later") {
      try {
        const response = await axios.patch(
          `/api/medications/update-status`,
          { medicationId: medId, slot: slot, status: "taken" },
          { withCredentials: true }
        );
        if (response.data.success) fetchMedications();
      } catch (err) {
        console.error("Update failed:", err);
      }
    }
  };

  const handleDelete = async (medId) => {
    try {
      const response = await axios.delete(`/api/medications/${medId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setMedications((prev) => prev.filter((m) => m._id !== medId));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleToggleSlot = (slot) => {
    setNewMed((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [slot]: prev.schedule[slot] === "not-prescribed" ? "later" : "not-prescribed",
      },
    }));
  };

  const handleAddSubmit = async () => {
    if (!newMed.name.trim()) return;
    const payload = {
      medicine: newMed.name,
      schedule: newMed.schedule,
      durationDays: newMed.durationDays,
      daysOfWeek: newMed.daysOfWeek.length > 0 ? newMed.daysOfWeek : allDays,
    };

    try {
      const response = await axios.post("/api/medications/add", payload, {
        withCredentials: true,
      });
      if (response.data.success) {
        fetchMedications();
        setIsModalOpen(false);
        setNewMed({
          name: "", durationDays: 7, daysOfWeek: [],
          schedule: { M: "not-prescribed", A: "not-prescribed", E: "not-prescribed", N: "not-prescribed" },
        });
      }
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  const getInitials = (name) => {
    if (!name) return "YJ";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-100 border-t-[#007AFF] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden text-gray-900 font-sans">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-white relative">
        {/* Centered Content Container */}
        <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12 pb-24">
          
          {/* Header Section */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#007AFF] border border-blue-100 rounded-lg text-xs font-bold tracking-wider mb-4">
              <div className="w-2 h-2 rounded-full bg-[#007AFF]"></div>
              MY SCHEDULE
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-2">
              Track <span className="text-[#007AFF]">Medications.</span>
            </h1>
            <p className="text-gray-500 text-sm md:text-base max-w-lg mt-3">
              Review your daily medicine routine, mark your taken doses, and manage your active prescriptions easily.
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-1.5 flex w-fit mb-8 shadow-inner">
            <div className="bg-white text-[#007AFF] font-bold text-sm px-6 py-2.5 rounded-lg shadow-sm">
              Today's Plan
            </div>
            <div className="text-gray-500 font-bold text-sm px-6 py-2.5 flex items-center">
              {date} {months[month]} {year}
            </div>
            <div className="text-gray-400 font-bold text-sm px-6 py-2.5 flex items-center border-l border-gray-200">
              {hour >= 5 && hour < 12 ? "Morning" : hour >= 12 && hour < 17 ? "Afternoon" : hour >= 17 && hour < 21 ? "Evening" : "Night"}
            </div>
          </div>

          {/* Medications List */}
          <div className="flex flex-col gap-6">
            {medications.length === 0 ? (
              <div className="py-16 text-center border border-gray-100 rounded-[24px] bg-white shadow-sm">
                <PiPillFill className="mx-auto text-5xl text-gray-200 mb-4" />
                <p className="text-xl font-bold text-gray-800">No Active Medications</p>
                <p className="text-gray-400 text-sm mt-2">You don't have any schedules for today.</p>
              </div>
            ) : (
              medications.map((med) => {
                const medName = typeof med.medicine === 'object' ? med.medicine?.name : med.medicine;
                
                return (
                  <div key={med._id} className="bg-white border border-gray-100 rounded-[24px] shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
                    
                    <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                      <div className="flex gap-2">
                        <span className="px-2.5 py-1 bg-blue-50 text-[#007AFF] text-[10px] font-extrabold rounded flex items-center gap-1.5 tracking-wider">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="animate-pulse"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                          ACTIVE COURSE
                        </span>
                        <span className="px-2.5 py-1 border border-gray-200 text-gray-400 bg-white text-[10px] font-extrabold rounded tracking-wider">
                          {med.durationDays} DAYS
                        </span>
                      </div>
                      <div className="text-xs font-bold text-gray-400">
                        {hour >= 5 && hour < 12 ? "Morning" : hour >= 12 && hour < 17 ? "Afternoon" : hour >= 17 && hour < 21 ? "Evening" : "Night"}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                            <PiPillFill size={28} />
                          </div>
                          <div>
                            <h3 className="text-xl font-extrabold text-gray-900" title={medName}>
                              {medName || "Unknown"}
                            </h3>
                            <button
                              onClick={() => handleDelete(med._id)}
                              className="text-red-400 text-xs font-bold flex items-center gap-1 hover:text-red-500 transition-colors mt-1.5"
                            >
                              <PiTrashBold size={14} /> Remove Schedule
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {["M", "A", "E", "N"].map((slot) => (
                            <div
                              key={slot}
                              onClick={() => handleSlotClick(med._id, slot, med.schedule[slot])}
                              className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-sm transition-all duration-200
                                ${med.schedule[slot] === "immediate" || med.schedule[slot] === "later" ? "cursor-pointer hover:scale-105 active:scale-95" : ""} 
                                ${getStatusClass(med.schedule[slot])}`}
                            >
                              {med.schedule[slot] === "taken" ? <PiCheckCircleFill size={20} /> : slot}
                            </div>
                          ))}
                        </div>
                      </div>

                      {med.needsExtension && (
                        <div className="mt-6 border border-red-100 bg-red-50 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg text-red-500 shadow-sm">
                              <PiWarningCircleFill size={20} />
                            </div>
                            <p className="text-red-700 text-sm font-bold">
                              Course ended. You missed {med.missedCount} doses.
                            </p>
                          </div>
                          <button
                            onClick={() => handleExtend(med._id, med.missedCount)}
                            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-colors shrink-0 w-full sm:w-auto shadow-sm"
                          >
                            Extend Course
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-2 border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 text-[#007AFF] font-bold py-5 rounded-[24px] flex items-center justify-center gap-2 transition-all text-base"
            >
              <PiPlusBold size={20} /> Add New Medication
            </button>

            {/* Labels / Legend */}
            <div className="mt-8 px-2 border-t border-gray-100 pt-8">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Status Legend</p>
              <div className="flex flex-wrap gap-4 md:gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#007AFF] text-white flex items-center justify-center shadow-sm">
                    <PiCheckCircleFill size={16} />
                  </div>
                  <span className="text-sm font-bold text-gray-600">Taken</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm">
                    <span className="text-xs font-extrabold">M</span>
                  </div>
                  <span className="text-sm font-bold text-gray-600">Missed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center ring-4 ring-amber-500/20">
                    <span className="text-xs font-extrabold">M</span>
                  </div>
                  <span className="text-sm font-bold text-gray-600">Take Now</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                    <span className="text-xs font-extrabold">M</span>
                  </div>
                  <span className="text-sm font-bold text-gray-600">Later</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-transparent border-2 border-dashed border-gray-200 text-gray-300 flex items-center justify-center">
                    <span className="text-xs font-extrabold">M</span>
                  </div>
                  <span className="text-sm font-bold text-gray-600">Skip / None</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Add Medication Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-end sm:items-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-[24px] sm:rounded-[32px] w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
            
            <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100 bg-white">
              <h2 className="text-xl font-extrabold text-gray-900">New Schedule</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full p-2 transition-colors">
                <PiXBold size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex flex-col gap-6 bg-white">
              
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Medicine Name</label>
                <input
                  type="text"
                  placeholder="e.g. Paracetamol"
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-base font-semibold text-gray-900 outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  value={newMed.durationDays || ""}
                  onChange={(e) => setNewMed({ ...newMed, durationDays: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-base font-semibold text-gray-900 outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                  placeholder="7"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Days of Week</label>
                <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-wrap divide-y divide-gray-100">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                    const isDaySelected = newMed.daysOfWeek?.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => handleDayToggle(day)}
                        className={`w-full flex justify-between items-center px-5 py-3.5 transition-colors ${isDaySelected ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'}`}
                      >
                        <span className={`text-sm font-bold ${isDaySelected ? 'text-[#007AFF]' : 'text-gray-600'}`}>{day}</span>
                        {isDaySelected && <PiCheckCircleFill className="text-[#007AFF]" size={20} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Daily Schedule</label>
                <div className="flex justify-between gap-3">
                  {["M", "A", "E", "N"].map((slot) => {
                    const isSelected = newMed.schedule[slot] !== "not-prescribed";
                    return (
                      <button
                        key={slot}
                        onClick={() => handleToggleSlot(slot)}
                        className={`flex-1 aspect-square rounded-2xl text-lg font-extrabold transition-all border
                          ${isSelected ? "bg-[#007AFF] text-white border-[#007AFF] shadow-md shadow-[#007AFF]/20" : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"}`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button 
                onClick={handleAddSubmit} 
                disabled={!newMed.name.trim()}
                className={`w-full py-4 rounded-xl font-bold text-base mt-2 transition-all
                  ${newMed.name.trim() ? "bg-[#007AFF] hover:bg-blue-600 text-white shadow-lg shadow-[#007AFF]/20" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
              >
                Save Schedule
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediList;