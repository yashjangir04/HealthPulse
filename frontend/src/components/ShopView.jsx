import React, { useState, useEffect, useRef } from 'react';
import { 
Edit3, Store, MapPin, Phone, Mail, 
  Package, ShoppingBag, IndianRupee, 
  Plus, ChevronRight, Clock, FileText, 
  User, Award, ClipboardCheck, Bell,
  ArrowUpRight
} from 'lucide-react';

const ShopView = () => {
const [currentPage, setCurrentPage] = useState(1);
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Integrated Shopkeeper Data (combining your fragments)
//   const [shopData, setShopData] = useState({
//     ownerName: "Rajesh Kumar",
//     shopName: "Kumar Medical & General Store",
//     email: "kumar.medicals@gmail.com",
//     phoneNumber: "+91 98765 43210",
//     avatar: "",
//     licenseNo: "DL-20394/2024",
//     gstin: "07AAAAA0000A1Z5",
//     address: {
//       fullAddress: "Shop No. 12, Ground Floor, Galaxy Plaza",
//       city: "New Delhi",
//       state: "Delhi",
//       pincode: "110023"
//     },
//     stats: {
//       totalOrders: 154,
//       rating: "4.8",
//       activeQuotes: 12
//     },
//     recentOrders: [
//       { id: "ORD-9921", customer: "Virat Sharma", amount: "₹1,250", status: "Completed", date: "24 Oct" },
//       { id: "ORD-9925", customer: "Anjali Singh", amount: "₹450", status: "Pending", date: "25 Oct" },
//       { id: "ORD-9930", customer: "Rahul Iyer", amount: "₹2,100", status: "completed", date: "26 Oct" }
//     ],
// incomingRequests: [
//       { id: "REQ-102", patient: "Suresh Raina", items: "3 Items", time: "5 mins ago" },
//       { id: "REQ-105", patient: "MS Dhoni", items: "1 Item", time: "12 mins ago" },
//       { id: "REQ-109", patient: "Rohit Sharma", items: "5 Items", time: "1 hr ago" }
//     ]
//   });

useEffect(() => {
    const fetchShopData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('http://localhost:5000/api/shop/profile/1'); 
        const data = await response.json();
        setShopData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching shop data:", error);
        setLoading(false);
      }
    };
    fetchShopData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen font-bold text-blue-500">Loading Dashboard...</div>;
  if (!shopData) return <div className="flex justify-center items-center h-screen text-red-500">Error loading data.</div>;

  const shopStatus = { label: "Verified", color: "bg-[#22C55E]" };

  return (
    <div className="p-4 md:p-8 bg-[#E3EEFF]/50 min-h-screen font-sans">
      {/* Navigation Tabs */}
      <div className="max-w-[1200px] mx-auto mb-8 flex gap-4">
        <button 
          onClick={() => setCurrentPage(1)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${currentPage === 1 ? 'bg-[#1B80FD] text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-white/80'}`}
        >
          <Store size={18} /> Shop Overview
        </button>
        <button 
          onClick={() => setCurrentPage(2)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${currentPage === 2 ? 'bg-[#1B80FD] text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-white/80'}`}
        >
          <ShoppingBag size={18} /> Inventory & Docs
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto">
        {currentPage === 1 ? (
          <div className="grid grid-cols-12 gap-6 items-stretch">
            
            {/* Left Section: Shop & Owner Info */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
              <section className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-xl border-[2px] border-[#1B80FD]/20 flex flex-col md:flex-row gap-8 lg:gap-12">
                <div className="flex flex-col items-center w-full md:w-[40%] shrink-0">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-2 border-blue-50 overflow-hidden mb-3 bg-slate-100 shadow-inner">
                      <img src={`https://ui-avatars.com/api/?name=${shopData.shopName}&background=1B80FD&color=fff`} alt="Shop Logo" className="w-full h-full object-cover" />
                    </div>
                    <label className="absolute bottom-3 right-0 bg-[#1B80FD] text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer border-2 border-white hover:scale-110 transition-transform">
                      <Plus size={14} />
                    </label>
                  </div>
                  <h2 className="font-bold text-xl text-slate-800 text-center mb-4 tracking-tight">{shopData.shopName}</h2>
                  <div className="w-full border-t border-slate-50 mb-5"></div>
                  
                  <div className="grid grid-cols-2 gap-2.5 w-full">
                    <StatBox label="RATING" value={shopData.stats.rating} />
                    <StatBox label="ORDERS" value={shopData.stats.totalOrders} />
                    <StatBox label="QUOTES" value={shopData.stats.activeQuotes} />
                    <StatBox label="CITY" value={shopData.address.city} />
                  </div>
                </div>

                <div className="hidden md:block w-[5px] bg-slate-100 self-stretch my-2"></div>

                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="space-y-6">
                    <InfoBox label="Owner Name" value={shopData.ownerName} icon={User} />
                    <InfoBox label="Shop Address" value={`${shopData.address.fullAddress}, ${shopData.address.city}, ${shopData.address.pincode}`} icon={MapPin} />
                    <InfoBox label="Contact Details" value={`${shopData.phoneNumber} | ${shopData.email}`} icon={Phone} />
                    
                    <div className="pt-2 border-t border-slate-50 flex justify-between items-center group cursor-pointer">
                      <div>
                        <p className="text-slate-400 font-medium text-sm">Business License</p>
                        <p className="text-slate-600 font-semibold text-sm italic">{shopData.licenseNo} (Drug License)</p>
                      </div>
                      <Award size={18} className="text-[#1B80FD]" />
                    </div>
                  </div>
                  <button className="mt-6 w-fit flex items-center gap-2 px-8 py-2.5 bg-[#EBF3FF] text-[#1B80FD] rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#1B80FD] hover:text-white transition-all shadow-sm">
                    <Edit3 size={14}/> Edit Business Profile
                  </button>
                </div>
              </section>

              {/* Recent Orders Section */}
              <section className="bg-white rounded-[2.5rem] shadow-xl border-[2px] border-[#1B80FD]/10 overflow-hidden">
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={22} className="text-[#1B80FD]" />
                    <h3 className="text-xl font-light text-slate-400 tracking-tight">Accepted Quotes</h3>
                  </div>
                  <button className="text-[#1B80FD] font-bold text-xs uppercase tracking-widest hover:underline decoration-dotted">View All Orders ›</button>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {shopData.recentOrders.map((order, i) => (
                    <div key={i} className="bg-[#F8FAFF] p-5 rounded-[1.5rem] border border-blue-50 hover:border-[#1B80FD]/30 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-black text-[#1B80FD] bg-blue-50 px-2 py-1 rounded-full">{order.date}</span>
                        <p className="text-[12px] font-mono text-slate-400">{order.id}</p>
                      </div>
                      <p className="text-slate-600 font-semibold">{order.customer}</p>
                      <p className="text-[#22C55E] font-bold text-lg">{order.amount}</p>
                      <p className="text-[11px] uppercase tracking-tighter font-bold text-slate-400 mt-1">{order.status}</p>
                      <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Section: Vitals (Business Vitals) & Inventory */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              <section className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border-[2px] border-[#1B80FD]/10">
                <div className="px-8 py-4 flex justify-between items-center border-b border-gray-100">
                  <span className="text-xl font-light text-slate-400 tracking-tight">Shop Status</span>
                  <span className={`px-3 py-1 ${shopStatus.color} text-white text-[10px] rounded-full font-bold uppercase tracking-widest`}>{shopStatus.label}</span>
                </div>
                <div className="grid grid-cols-2 divide-x divide-gray-100">
                   <div className="p-6 flex flex-col items-center justify-center">
                      <ClipboardCheck className="text-blue-400 mb-2" size={28} />
                      <p className="text-[10px] text-slate-400 uppercase font-black">GSTIN</p>
                      <p className="text-sm font-bold text-slate-700">Verified</p>
                   </div>
                   <div className="p-6 flex flex-col items-center justify-center">
                      <IndianRupee className="text-emerald-500 mb-2" size={28} />
                      <p className="text-[10px] text-slate-400 uppercase font-black">Daily Rev</p>
                      <p className="text-lg font-bold text-slate-700">₹8.4k</p>
                   </div>
                </div>
              </section>

<section className="bg-white rounded-[2.5rem] shadow-xl border-[2px] border-[#1B80FD]/10 overflow-hidden flex-grow flex flex-col min-h-[300px]">
  <div className="px-8 pt-6 pb-4 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
    <div className="flex items-center gap-2">
      <h3 className="text-xl font-light text-slate-400 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
        Incoming Requests
      </h3>
      {/* Animated pulse dot to indicate live activity */}
      <span className="flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
      </span>
    </div>
    <Bell size={20} className="text-[#1B80FD]/50" />
  </div>

  <div className="px-8 py-6 space-y-5 flex-grow">
    {shopData.incomingRequests.map((req, i) => (
      <div 
        key={i} 
        onClick={() => navigate("/shopkeeper-orders")}
        className="flex items-center justify-between group cursor-pointer hover:bg-[#F8FAFF] p-2 -mx-2 rounded-xl transition-all"
      >
        <div className="flex items-center gap-3">
          {/* Visual indicator for the request type */}
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1B80FD] group-hover:bg-[#1B80FD] group-hover:text-white transition-colors">
          </div>
          <div>
            <p className="text-slate-600 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>
              {req.patient}
            </p>
            <p className="text-[12px] font-mono text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>
              {req.items} • {req.id}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-[#1B80FD] bg-blue-50 px-2 py-1 rounded-full">
            {req.time}
          </p>
        </div>
      </div>
    ))}

    {shopData.incomingRequests.length === 0 && (
      <div className="text-center py-10">
        <p className="text-slate-400 text-sm italic">No new requests at the moment</p>
      </div>
    )}

    <button 
      onClick={() => navigate("/shopkeeper-orders")}
      className="w-full mt-4 flex items-center justify-between group text-[#1B80FD] font-bold text-xs uppercase tracking-widest hover:translate-x-1 transition-transform"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <span>Review All Requests</span>
      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
</section>
            </div>
          </div>
        ) : (
          /* Medical Records tab replaced with Business Documents */
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-7">
              <section className="bg-white rounded-[2.5rem] p-10 shadow-xl border-[2px] border-[#1B80FD]/10 h-full">
                <div className="mb-6">
                  <h3 className="text-2xl font-light text-slate-400 tracking-tight">Business Compliance</h3>
                  <div className="w-16 h-1 bg-[#1B80FD] rounded-full mt-2"></div>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                  <StatusItem label="Entity Type" value="Partnership / Retailer" />
                  <StatusItem label="GST Registration" value={shopData.gstin} />
                  <StatusItem label="License Validity" value="Valid until Dec 2028" />
                  <StatusItem label="Tax Category" value="Medical Services (Exempt/Lower)" />
                  <StatusItem label="Primary Contact" value={shopData.ownerName} />
                  <StatusItem label="Emergency Backup" value="+91 90000 00000" />
                </ul>
              </section>
            </div>
            <div className="col-span-12 lg:col-span-5">
              <section className="bg-white rounded-[2.5rem] p-8 shadow-xl border-[2px] border-[#1B80FD]/10 flex flex-col min-h-[400px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-light text-slate-400 tracking-tight">Legal Documents</h3>
                  <button className="bg-[#1B80FD] text-white p-2 rounded-xl shadow-lg hover:scale-105 transition-transform">
                    <Plus size={18}/>
                  </button>
                </div>
                <div className="space-y-6 mb-6">
                  {["Drug_License_2024.pdf", "GST_Certificate.pdf", "Shop_Establishment_Act.pdf"].map((doc, i) => (
                    <div key={i} className="flex justify-between items-center text-sm group cursor-pointer border-b border-transparent hover:border-blue-50 pb-2">
                      <div className="flex items-center">
                        <FileText size={16} className="text-blue-300 mr-3" />
                        <p className="text-slate-600 font-medium">{doc}</p>
                      </div>
                      <p className="text-slate-400 text-[10px] font-mono">12/01/2024</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Helper Components
const InfoBox = ({ label, value, icon: Icon }) => (
  <div className="flex gap-3 items-start">
    {Icon && <Icon size={18} className="text-slate-300 mt-1" />}
    <div>
      <p className="text-slate-400 font-medium text-xs mb-0.5">{label}</p>
      <p className="text-slate-600 font-semibold leading-tight text-sm">{value}</p>
    </div>
  </div>
);

const StatBox = ({ label, value }) => (
  <div className="bg-[#EBF3FF] p-3 rounded-xl text-center border border-blue-50/50 shadow-sm">
    <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-tighter">{label}</p>
    <p className="text-[13px] font-bold text-slate-600">{value}</p>
  </div>
);

const StatusItem = ({ label, value }) => (
  <li className="flex flex-col gap-1">
    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{label}</span>
    <p className="text-slate-700 font-medium text-sm">{value}</p>
  </li>
);

export default ShopView;