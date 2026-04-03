import React, { useState } from 'react';
import { DUMMY_MEDICINES } from '../data/medicines';
import med_img from '../assets/med_img1.png';
import Line from '../assets/Subtract.png';
import circle from '../assets/Subtract 1.png';
const MedicineDelivery = () => {

  const [activeRequests, setActiveRequests] = useState({});
  const [statusFilter, setStatusFilter] = useState('all');

  const handleBuyClick = (medId) => {
  
    if (activeRequests[medId]) return;

  
    setActiveRequests(prev => ({
      ...prev,
      [medId]: { status: 'searching', offers: [] }
    }));

 
    setTimeout(() => {
      setActiveRequests(prev => ({
        ...prev,
        [medId]: { 
          status: 'accepted', 
          offers: [
            { id: 's1', shopName: 'Apollo Pharmacy', price: 135 },
            { id: 's2', shopName: 'Wellness Medical', price: 130 }
          ] 
        }
      }));
    }, 3000);
  };

  return (
    <div className="flex relative h-screen bg-transparent font-sans text-slate-900 overflow-hidden mt-20">
      
      <main className="flex-1 p-8 overflow-y-auto h-screen custom-scrollbar">
   

        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100 min-h-[85%]">
          <h2 className="text-xl font-bold mb-8 text-slate-700 underline decoration-blue-200 underline-offset-8">
            Prescribed Medicines
          </h2>
          <div className="flex gap-4 mb-8">
  {['all', 'searching', 'accepted'].map((type) => (
    <button
      key={type}
      onClick={() => setStatusFilter(type)}
      className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
        statusFilter === type 
          ? 'bg-[#4C8CF5] text-white shadow-lg shadow-blue-100' 
          : 'bg-white text-slate-400 border border-slate-100 hover:border-blue-200'
      }`}
    >
      {type === 'all' ? 'All Meds' : type === 'searching' ? 'Pending' : 'Ready'}
    </button>
  ))}
  
</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {DUMMY_MEDICINES.filter((med) => {
      const request = activeRequests[med.id];
      if (statusFilter === 'all') return true;
      if (statusFilter === 'searching') return request?.status === 'searching';
      if (statusFilter === 'accepted') return request?.status === 'accepted';
      return true;
    }).map((med) => {
  const request = activeRequests[med.id];
  let cardStyle = "bg-white border-slate-100"; // Default
  
  if (request?.status === 'searching') {
    cardStyle = "bg-yellow-50 border-yellow-200 shadow-yellow-100 animate-pulse";
  } else if (request?.status === 'accepted') {
    cardStyle = "bg-green-50 border-green-200 shadow-green-100";
  }
  //tells what is the request status initially

  return (
    
    <div key={med.id} className={`${cardStyle} border border-slate-100 rounded-[35px] p-6 shadow-sm hover:shadow-xl transition-all flex flex-col min-h-[400px]`}>
    
      <div className="bg-blue-50/50 rounded-3xl h-40 mb-5 flex items-center justify-center relative overflow-hidden">
        <img 
          src={med_img}
        />
 
        {request?.status === 'searching' && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-[10px] font-bold text-blue-600 uppercase">Finding Shops...</span>
          </div>
        )}
      </div>

    
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-xl text-slate-800 ">{med.name}</h3>
          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-lg font-bold uppercase">
            {med.form}
          </span>
        </div>
        
        <p className="text-[11px] text-blue-500 font-bold mb-3">by {med.manufacturer}</p>
        
     
        <div className="bg-slate-50 p-3 rounded-2xl mb-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-wider">Prescribed For:</p>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {med.PrescribedFor}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-50">
        <div>
          <span className="text-[10px] text-slate-400 font-bold block">Strength: {med.strength}</span>
       
        </div>

        
        {!request ? (
          <button 
            onClick={() => handleBuyClick(med.id)}
            className="bg-[#4C8CF5] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
          >
            Buy 
          </button>
        ) : request.status === 'accepted' ? (
          <button 
            className="bg-green-500 text-white px-4 py-3 rounded-2xl text-[10px] font-bold shadow-lg shadow-green-100"
          >
             {request.offers.length} SHOPS READY
          </button>
        ) : (
          <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl text-[10px] font-bold">
            REQUEST SENT
          </div>
        )}
      </div>
    </div>
  );
})}
          </div>
        </div>
      </main>
    
  <div className="absolute bottom-10 right-10 mr-2 w-full -z-10">
    <img src={Line} className="w-full" />
  </div>
      
  <div className="absolute bottom-10 right-10 mr-2 w-full -z-10">
    <img src={Line} className="w-full" />
  </div>
    <div className="absolute top-0 right-0   -z-10">
    <img src={circle} className="width: '100%', height: '150px'"></img>
  </div>
    </div>
  );
};

export default MedicineDelivery;