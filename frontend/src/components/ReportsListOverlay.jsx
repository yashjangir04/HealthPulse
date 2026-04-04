
import React, { useState, useRef } from 'react';
import { X, FileText, Upload, Loader2 } from 'lucide-react';
import { createPortal } from "react-dom";

const ReportsListOverlay = ({ isOpen, onClose, reports, onUpload }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  setIsAnalyzing(true);

  try {

    await onUpload(file);
  } catch (error) {
    alert("Upload failed!");
  } finally {
    setIsAnalyzing(false);
    event.target.value = null;
  }
};

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-3xl shadow-2xl h-[80vh] flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <div className="p-8 border-b flex justify-between items-center bg-white">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">All Lab Reports</h2>
            <p className="text-slate-400 text-sm">{reports.length} Reports Total</p>
          </div>
          
          <div className="flex items-center gap-3">

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept=".pdf,.jpg,.png,.doc,.docx"
            />

<button onClick={() => fileInputRef.current.click()}>
              {isAnalyzing ? <Loader2 className="animate-spin" /> : <Upload />}
            </button>

            <button 
              onClick={onClose} 
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
            >
              <X size={24}/>
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto space-y-4 flex-1 bg-white">
          {reports.map((report, i) => (
            <div 
              key={report.id || i} 
              className="flex justify-between items-center p-5 bg-slate-50 rounded-[1.5rem] hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-500">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-700">{report.title}</p>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">{report.date}</p>
                                  {report.analysis && (
                <p className="mt-3 text-sm text-green-600">
                  {report.analysis}
                </p>
              )}
                </div>
              </div>

            </div>
          ))}

          {reports.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <FileText className="mx-auto mb-4 opacity-20" size={48} />
              <p>No reports found in your records.</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReportsListOverlay;