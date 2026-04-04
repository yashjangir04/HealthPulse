import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { createPortal } from "react-dom";

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {

  const [formData, setFormData] = useState({
    height: "",
    weight: "",
 
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        height: userData.height || "",
        weight: userData.weight || "",
       
      });
    }
  }, [userData]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-blue-100 overflow-hidden">
        
 
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-[#F8FBFF]">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Edit Profile</h2>
            <p className="text-sm text-slate-400">Update your physical metrics and contact details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

     
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <ReadOnlyField label="Full Name" value={userData.name} />
          <ReadOnlyField label="Email Address" value={userData.email} />
          <ReadOnlyField label="Date of Birth" value={userData.dob} />
          <ReadOnlyField label="Gender" value={userData.gender} />

          <div className="col-span-2 border-t border-gray-50 my-2"></div>

     
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-[#1B80FD] uppercase tracking-widest ml-1">Height (cm)</label>
            <input 
              type="text" 
              className="bg-[#F2F7FF] border-2 border-transparent focus:border-[#1B80FD]/30 focus:bg-white outline-none p-3 rounded-xl font-semibold text-slate-600 transition-all"
              value={formData.height}
              onChange={(e) => setFormData({...formData, height: e.target.value})}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-[#1B80FD] uppercase tracking-widest ml-1">Weight (kg)</label>
            <input 
              type="number" 
              className="bg-[#F2F7FF] border-2 border-transparent focus:border-[#1B80FD]/30 focus:bg-white outline-none p-3 rounded-xl font-semibold text-slate-600 transition-all"
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
            />
          </div>

     
        </div>

     
        <div className="px-8 py-6 bg-slate-50 flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-slate-400 font-bold hover:text-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="flex items-center gap-2 px-8 py-2.5 bg-[#1B80FD] text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all"
          >
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};


const ReadOnlyField = ({ label, value }) => (
  <div className="flex flex-col gap-1 opacity-60 cursor-not-allowed">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="bg-slate-50 p-3 rounded-xl font-medium text-slate-500 border border-slate-100">
      {value}
    </div>
  </div>
);

export default EditProfileModal;

