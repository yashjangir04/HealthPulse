import React, { useState, useEffect, useRef } from 'react';
import { X, Save, User, FileText, ImagePlus, Loader2, CheckCircle2 } from 'lucide-react';
import { createPortal } from "react-dom";
import { supabase } from '../SupabaseClient';

const TABS = ['Basic Info', 'Personal Notes', 'Upload Report'];

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({ height: "", weight: "" });
  const [personalInfo, setPersonalInfo] = useState("");
  const [reportFile, setReportFile] = useState(null);
  const [reportPreview, setReportPreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle | uploading | done | error
  const fileRef = useRef(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        height: userData.height || "",
        weight: userData.weight || "",
      });
      setPersonalInfo(userData.aiContext || "");
    }
  }, [userData]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReportFile(file);
    if (file.type.startsWith("image/")) {
      setReportPreview(URL.createObjectURL(file));
    } else {
      setReportPreview(null);
    }
    setUploadStatus("idle");
  };

  const handleReportUpload = async () => {
    if (!reportFile || !userData?.email) return;
    setUploadStatus("uploading");
    try {
      const fileName = `${Date.now()}-${reportFile.name}`;
      const { error: storageError } = await supabase.storage
        .from("medical-reports")
        .upload(fileName, reportFile);
      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage
        .from("medical-reports")
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase.from("reports").insert([{
        title: reportFile.name.replace(/\.[^/.]+$/, ""),
        file_url: urlData?.publicUrl,
        user_id: userData.email,
        status: "uploaded",
      }]);
      if (dbError) throw dbError;

      setUploadStatus("done");
      setReportFile(null);
      setReportPreview(null);
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadStatus("error");
    }
  };

  const handleSave = () => {
    onSave({ ...formData, aiContext: personalInfo });
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-blue-100 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-[#F8FBFF] shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Edit Profile</h2>
            <p className="text-sm text-slate-400 mt-0.5">Update your health data and records</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 px-6 sm:px-8 pt-4 shrink-0 overflow-x-auto">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === i
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              }`}
            >
              {i === 0 && <User size={12} />}
              {i === 1 && <FileText size={12} />}
              {i === 2 && <ImagePlus size={12} />}
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">

          {/* ── Tab 0: Basic Info ── */}
          {activeTab === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ReadOnlyField label="Full Name" value={userData.name} />
              <ReadOnlyField label="Email Address" value={userData.email} />
              <ReadOnlyField label="Date of Birth" value={userData.dob} />
              <ReadOnlyField label="Gender" value={userData.gender} />

              <div className="col-span-1 sm:col-span-2 border-t border-gray-100 my-1" />

              <EditableField
                label="Height (cm)"
                type="number"
                value={formData.height}
                onChange={(v) => setFormData({ ...formData, height: v })}
              />
              <EditableField
                label="Weight (kg)"
                type="number"
                value={formData.weight}
                onChange={(v) => setFormData({ ...formData, weight: v })}
              />
            </div>
          )}

          {/* ── Tab 1: Personal Notes ── */}
          {activeTab === 1 && (
            <div className="flex flex-col gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-700 font-medium leading-relaxed">
                <strong>What to write here:</strong> Your diagnoses, allergies, past surgeries, chronic conditions, doctor's notes, symptoms you frequently experience, and any important health context. The AI assistant uses this to give you better answers.
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-blue-600 uppercase tracking-widest ml-1">
                  Personal Health Notes
                </label>
                <textarea
                  rows={12}
                  value={personalInfo}
                  onChange={(e) => setPersonalInfo(e.target.value)}
                  placeholder="e.g. I have Type 2 diabetes diagnosed in 2021. I'm allergic to penicillin. I had an appendectomy in 2018. Currently experiencing mild knee pain..."
                  className="w-full bg-[#F2F7FF] border-2 border-transparent focus:border-[#1B80FD]/30 focus:bg-white outline-none p-4 rounded-2xl text-sm font-medium text-slate-700 leading-relaxed resize-none transition-all"
                />
                <p className="text-xs text-slate-400 font-medium mt-1 ml-1">{personalInfo.length} characters</p>
              </div>
            </div>
          )}

          {/* ── Tab 2: Upload Report ── */}
          {activeTab === 2 && (
            <div className="flex flex-col gap-5">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-sm text-indigo-700 font-medium leading-relaxed">
                Upload photos of prescriptions, lab results, or any medical document. They will be stored securely in your records.
              </div>

              {/* Drop zone */}
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 rounded-2xl p-8 text-center cursor-pointer transition-all"
              >
                {reportPreview ? (
                  <img src={reportPreview} alt="Preview" className="max-h-48 mx-auto rounded-xl object-contain" />
                ) : (
                  <>
                    <ImagePlus size={40} className="text-slate-300 mx-auto mb-3" />
                    <p className="font-bold text-slate-500 text-sm">Click to select a file</p>
                    <p className="text-xs text-slate-400 mt-1">JPG, PNG, PDF supported</p>
                  </>
                )}
                {reportFile && !reportPreview && (
                  <p className="mt-3 text-xs font-bold text-slateigo-600 bg-white border border-slate-200 rounded-xl px-4 py-2 inline-block">{reportFile.name}</p>
                )}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              {reportFile && (
                <button
                  onClick={handleReportUpload}
                  disabled={uploadStatus === "uploading" || uploadStatus === "done"}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    uploadStatus === "done"
                      ? "bg-emerald-100 text-emerald-700 cursor-default"
                      : uploadStatus === "error"
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                  }`}
                >
                  {uploadStatus === "uploading" && <Loader2 size={16} className="animate-spin" />}
                  {uploadStatus === "done" && <CheckCircle2 size={16} />}
                  {uploadStatus === "idle" && "Upload Report"}
                  {uploadStatus === "uploading" && "Uploading..."}
                  {uploadStatus === "done" && "Uploaded Successfully!"}
                  {uploadStatus === "error" && "Upload Failed — Try Again"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-slate-400 font-bold hover:text-slate-600 transition-colors text-sm"
          >
            Cancel
          </button>
          {activeTab !== 2 && (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-7 py-2.5 bg-[#1B80FD] text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all text-sm"
            >
              <Save size={16} /> Save Changes
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

const ReadOnlyField = ({ label, value }) => (
  <div className="flex flex-col gap-1 opacity-60 cursor-not-allowed">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="bg-slate-50 p-3 rounded-xl font-medium text-slate-500 border border-slate-100 text-sm">{value}</div>
  </div>
);

const EditableField = ({ label, type = "text", value, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-black text-[#1B80FD] uppercase tracking-widest ml-1">{label}</label>
    <input
      type={type}
      className="bg-[#F2F7FF] border-2 border-transparent focus:border-[#1B80FD]/30 focus:bg-white outline-none p-3 rounded-xl font-semibold text-slate-600 transition-all"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default EditProfileModal;
