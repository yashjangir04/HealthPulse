import React from 'react';
import { X, Bell, BellOff, Clock, Pill, CheckCircle2 } from 'lucide-react';
import { createPortal } from "react-dom";

const MedicationManagerModal = ({ isOpen, onClose, medications, onToggleReminder }) => {
  if (!isOpen) return null;


  const getSlotType = (time) => {
    if (!time) return "Morning";
    const hour = parseInt(time.split(':')[0]);
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    if (hour < 21) return "Evening";
    return "Night";
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-blue-50 overflow-hidden flex flex-col max-h-[85vh]">
        

        <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gradient-to-br from-white to-[#F8FBFF]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100/50 rounded-2xl text-[#1B80FD] shadow-inner">
              <Pill size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Medication Manager</h2>
              <p className="text-sm font-medium text-slate-400">Sync reminders with your daily schedule</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full transition-all text-slate-400">
            <X size={20} />
          </button>
        </div>

  
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-5">
          {medications.map((med, index) => {
            const slot = getSlotType(med.time);
            
            return (
              <div 
                key={index} 
                className={`group flex flex-col md:flex-row md:items-center justify-between p-6 rounded-[2rem] border-2 transition-all duration-300 ${
                  med.reminderSet 
                    ? 'border-[#1B80FD]/20 bg-blue-50/40 shadow-sm' 
                    : 'border-slate-50 bg-white hover:border-slate-100'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-2xl transition-all duration-500 ${
                    med.reminderSet 
                      ? 'bg-[#1B80FD] text-white rotate-[360deg] shadow-lg shadow-blue-200' 
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Pill size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 text-lg leading-tight">{med.name}</h4>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/60 rounded-lg border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <Clock size={12} /> {med.time || "No Time"}
                      </div>
                      <span className="text-slate-300 font-light">|</span>
                      <span className="text-slate-500 font-bold text-xs">{med.dose}</span>
                      {med.reminderSet && (
                        <span className="text-[10px] font-black text-[#1B80FD] bg-blue-100/50 px-2 py-0.5 rounded-md">
                          {slot} Slot
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 md:mt-0">
                  <button
                    onClick={() => onToggleReminder(index)}
                    className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                      med.reminderSet 
                        ? 'bg-white text-[#22C55E] border-2 border-[#22C55E]/20 shadow-sm hover:bg-red-50 hover:text-red-500 hover:border-red-100' 
                        : 'bg-[#1B80FD] text-white shadow-xl shadow-blue-100 hover:bg-blue-600 hover:-translate-y-0.5 active:translate-y-0'
                    }`}
                  >
                    {med.reminderSet ? (
                      <><CheckCircle2 size={16} /> Active</>
                    ) : (
                      <><Bell size={16} /> Set Reminder</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

       
        <div className="px-10 py-6 bg-slate-50 border-t border-gray-100 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#1B80FD] animate-pulse"></div>
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">
            Automatic Sync with Medication Schedule
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MedicationManagerModal;