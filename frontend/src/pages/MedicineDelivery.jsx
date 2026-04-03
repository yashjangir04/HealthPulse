import React, { useState,useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import {
    ShoppingBag,
    Check,
    Plus,
    ArrowRight,
    Pill,
    Info,
    CheckSquare,
    Square,
    Loader2
  } from "lucide-react";
  import { getMedicines } from "../api/appointment";
  import { createOrder } from "../api/order";

const MedicineDelivery = () => {
    const navigate = useNavigate();
  const { meetingID } = useParams();

  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAllSelected = cart.length === medicines.length && medicines.length > 0;
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const result = await getMedicines({ meetingID });
        setMedicines(result.data || []);
      } catch (error) {
        console.error("Failed to fetch medicines:", error);
      } finally {
        setLoading(false);
      }
    };
    if (meetingID) {
        fetchMedicines();
      }
    }, [meetingID]);

    const toggleCart = (med) => {
        setCart((prev) => {
          const isSelected = prev.some(
            (item) => (item._id || item.id) === (med._id || med.id)
          );
    
          if (isSelected) {
            return prev.filter(
              (item) => (item._id || item.id) !== (med._id || med.id)
            );
          } else {
            return [...prev, med];
          }
        });
      };
      const handleSelectAll = () => {
        if (isAllSelected) {
          setCart([]);
        } else {
          setCart([...medicines]);
        }
      };
      const handleProceed = async () => {
        if (cart.length === 0) return;
        await createOrder({ prescriptions: cart });
        navigate("/patient/orders");
      };
      
      const displayedMedicines = medicines.filter((med) => {
        if (activeTab === "cart") {
          return cart.some(
            (item) => (item._id || item.id) === (med._id || med.id)
          );
        }
        return true;
      });
      
      if (loading) {
        return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFCFF]">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-bold tracking-wide uppercase text-sm">Loading Prescriptions...</p>
          </div>
        );
      }   

  

      return (
        <div className="min-h-screen bg-[#FAFCFF] font-sans text-gray-900 pt-24 pb-36">
          <main className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 bg-white p-6 sm:p-8 rounded-4xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-100 bg-blue-50 mb-4">
                  <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                  <span className="text-[11px] font-extrabold text-blue-800 tracking-wider uppercase">
                    Pharmacy Orders
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 leading-tight">
                  Your <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Prescriptions.</span>
                </h1>
                <p className="text-gray-500 font-medium mt-2 text-[15px] max-w-lg">
                  Review and select the medicines prescribed by your doctor to proceed with your order.
                </p>
              </div>
    
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={handleSelectAll}
                  className={`flex items-center cursor-pointer justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 border-2 ${
                    isAllSelected
                      ? "border-blue-600 text-blue-700 bg-blue-50 shadow-sm"
                      : "border-gray-200 text-gray-600 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {isAllSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                  {isAllSelected ? "Deselect All" : "Select All"}
                </button>
    
                <div className="flex bg-gray-100 p-1.5 rounded-xl border border-gray-200/50">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`flex-1 sm:flex-none px-6 cursor-pointer py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                      activeTab === "all"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab("cart")}
                    className={`flex-1 sm:flex-none flex cursor-pointer items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                      activeTab === "cart"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Selected
                    <span className={`px-2 py-0.5 rounded-full text-[11px] ${
                      activeTab === 'cart' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {cart.length}
                    </span>
                  </button>
                </div>
              </div>
            </div>
    
            {displayedMedicines.length === 0 ? (
              <div className="bg-white rounded-4xl border-2 border-dashed border-gray-200 p-12 sm:p-20 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5 text-gray-400">
                  <ShoppingBag size={32} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">No medicines selected</h3>
                <p className="text-gray-500 font-medium max-w-md">
                  You haven't added any medicines to your order yet. Switch to "All" to view your prescription.
                </p>
                <button 
                  onClick={() => setActiveTab("all")}
                  className="mt-8 px-8 py-3.5 bg-blue-50 border border-blue-100 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors"
                >
                  View All Prescriptions
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {displayedMedicines.map((med) => {
                  const id = med._id || med.id;
                  const inCart = cart.some((item) => (item._id || item.id) === id);
    
                  return (
                    <div
                      key={id}
                      onClick={() => toggleCart(med)}
                      className={`group relative cursor-pointer rounded-3xl p-5 transition-all duration-300 border-2 flex flex-col h-full ${
                        inCart 
                          ? "border-blue-600 bg-blue-50/40 shadow-[0_8px_20px_-6px_rgba(37,99,235,0.2)] scale-[1.02] ring-4 ring-blue-600/10" 
                          : "border-gray-100 bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4 items-center w-full pr-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                            inCart ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-blue-50 text-blue-600"
                          }`}>
                            <Pill size={22} strokeWidth={2.5} />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <h3 className="font-black text-lg text-gray-900 truncate leading-tight">
                              {med.name}
                            </h3>
                            <span className="inline-block mt-1 font-bold text-gray-500 text-[13px]">
                              {med.dose || med.strength || "Standard Dose"}
                            </span>
                          </div>
                        </div>
    
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border-2 absolute top-5 right-5 ${
                          inCart 
                            ? "bg-blue-600 border-blue-600 text-white" 
                            : "bg-gray-50 border-gray-200 text-gray-300 group-hover:border-blue-200 group-hover:text-blue-200"
                        }`}>
                          {inCart ? <Check size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                        </div>
                      </div>
    
                      <div className={`mt-auto p-4 rounded-2xl border transition-colors duration-300 ${
                        inCart ? "bg-white/80 border-blue-100" : "bg-gray-50 border-gray-100"
                      }`}>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Info size={14} className={inCart ? "text-blue-400" : "text-gray-400"} />
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            Doctor's Instructions
                          </p>
                        </div>
                        <p className="text-[13px] text-gray-700 font-medium leading-relaxed line-clamp-3">
                          {med.notes || med.PrescribedFor || "No specific instructions provided."}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
    
          {cart.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl bg-gray-900 text-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] p-3 sm:p-4 flex items-center justify-between z-50 animate-in slide-in-from-bottom-8 fade-in duration-300 border border-gray-800">
              <div className="flex items-center gap-4 pl-2 sm:pl-4">
                <div className="relative w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center shrink-0 border border-gray-700">
                  <ShoppingBag size={22} className="text-blue-400" strokeWidth={2.5} />
                  <span className="absolute -top-2.5 -right-2.5 bg-blue-600 text-white text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-gray-900">
                    {cart.length}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black leading-tight">
                    {cart.length} Medicine{cart.length > 1 ? 's' : ''}
                  </span>
                  <span className="text-xs text-gray-400 font-medium mt-0.5">
                    Ready for checkout
                  </span>
                </div>
              </div>
    
              <button
                onClick={handleProceed}
                className="flex items-center cursor-pointer justify-center gap-2 bg-white text-gray-900 px-6 sm:px-8 py-3.5 rounded-xl text-[15px] font-bold shadow-lg hover:bg-gray-100 active:scale-95 transition-all group shrink-0"
              >
                Checkout
                <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      );
    };
    
    export default MedicineDelivery;

