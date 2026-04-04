import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  Store, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  LayoutDashboard,
  Star,
  ArrowRight
} from "lucide-react";
import { getShopkeeperAcceptedDeals } from "../api/order";

const ShopView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState({
    dashboardStats: { totalOrders: 0 },
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?._id) return;
      
      try {
        setLoading(true);
        const response = await getShopkeeperAcceptedDeals(user._id);
        const orders = response?.data || [];
        
        setDashboardData({
          dashboardStats: {
            totalOrders: orders.length
          },
          recentOrders: orders
        });
      } catch (error) {
        console.error("Failed to fetch shopkeeper deals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold text-sm animate-pulse tracking-wide">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFCFF] font-sans text-slate-800 pb-24 selection:bg-blue-100 selection:text-blue-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span className="text-xs font-bold text-slate-700 tracking-wide">Store Workspace</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
              Your <span className="text-blue-600">trusted</span> <br className="hidden sm:block" />
              Business Partner.
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              Manage your pharmacy, track accepted orders, and grow your business with actionable insights right at your fingertips.
            </p>
          </div>
          
          <div className="flex gap-4 items-center shrink-0">
            <button className="px-6 py-3.5 rounded-full bg-blue-600 text-white text-sm font-bold shadow-[0_8px_20px_rgb(37,99,235,0.25)] hover:bg-blue-700 hover:shadow-[0_8px_25px_rgb(37,99,235,0.35)] hover:-translate-y-0.5 transition-all flex items-center gap-2">
              <LayoutDashboard size={18} />
              Overview
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          <div className="xl:col-span-1 space-y-8">
            
            <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 bg-white p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 mb-6 flex items-center justify-center">
                  <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Store size={40} strokeWidth={2} />
                  </div>
                </div>
                
                <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">{user?.shopName || "My Pharmacy"}</h2>
                <div className="flex items-center gap-2 mb-4 text-slate-500">
                  <User size={16} />
                  <span className="font-semibold">{user?.ownerName || "Store Owner"}</span>
                </div>

                <div className="flex items-center justify-center gap-3 w-full">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-sm">
                    <Star size={14} className="fill-blue-600 text-blue-600" />
                    {user?.rating ? `${user.rating}.0` : "New"}
                  </span>

                  {user?.isActive && (
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 shadow-sm">
                      <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                      Active
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-blue-600 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                    <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                      {user?.address?.fullAddress || "Address not provided"}<br/>
                      {user?.address?.city && user?.address?.pincode ? `${user.address.city}, ${user.address.pincode}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-sm font-semibold text-slate-700">{user?.phoneNumber || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                    <p className="text-sm font-semibold text-slate-700 truncate">{user?.email || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <ShieldCheck size={22} className="text-blue-600" />
                Store Credentials
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between transition-colors hover:border-blue-200 hover:bg-white hover:shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="text-slate-400">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">License ID</p>
                      <p className="text-sm font-bold text-slate-900">{user?.licenseNumber || "N/A"}</p>
                    </div>
                  </div>
                  {user?.licenseNumber && <CheckCircle size={18} className="text-blue-600" />}
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between transition-colors hover:border-blue-200 hover:bg-white hover:shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="text-slate-400">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">GST Number</p>
                      <p className="text-sm font-bold text-slate-900">{user?.gstNumber || "N/A"}</p>
                    </div>
                  </div>
                  {user?.gstNumber && <CheckCircle size={18} className="text-blue-600" />}
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-3 space-y-8">
            
            <div className="bg-blue-600 rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(37,99,235,0.2)] relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
              <div className="absolute -right-10 -top-20 w-64 h-64 bg-white/10 blur-3xl rounded-full"></div>
              <div className="absolute -bottom-20 left-20 w-48 h-48 bg-blue-400/20 blur-2xl rounded-full"></div>
              
              <div className="relative z-10 text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-4 backdrop-blur-md">
                  <CheckCircle size={14} className="text-blue-200" />
                  <span className="text-xs font-bold tracking-wide text-blue-50">Total Orders Accepted</span>
                </div>
                <p className="text-6xl md:text-7xl font-black tracking-tighter mb-2">
                  {dashboardData?.dashboardStats?.totalOrders?.toLocaleString() || 0}
                </p>
                <p className="text-blue-100 font-medium text-lg max-w-sm">
                  Deals successfully processed by your pharmacy.
                </p>
              </div>
              
              <div className="relative z-10 w-24 h-24 rounded-full bg-white text-blue-600 flex items-center justify-center shrink-0 shadow-[0_8px_30px_rgb(0,0,0,0.15)]">
                <ShoppingCart size={40} strokeWidth={2} />
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Orders</h3>
                  <p className="text-slate-500 font-medium mt-1">Track your successfully accepted quotes.</p>
                </div>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full w-max">
                  View All <ArrowRight size={16} />
                </button>
              </div>
              
              <div className="overflow-x-auto p-4 sm:p-8 pt-0 mt-4">
                {dashboardData.recentOrders.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <ShoppingCart size={32} className="text-slate-300" />
                    </div>
                    <p className="text-xl font-bold text-slate-700 mb-2">No accepted orders yet</p>
                    <p className="text-sm font-medium">When patients accept your quotes, they will appear here.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="text-xs uppercase tracking-wider text-slate-400 font-bold border-b-2 border-slate-100">
                        <th className="pb-4 pl-4">Order Details</th>
                        <th className="pb-4">Price</th>
                        <th className="pb-4">Status</th>
                        <th className="pb-4 text-right pr-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {dashboardData.recentOrders.map((order, i) => {
                        const patientName = order.patientID?.name || "Patient";
                        const displayId = order._id?.substring(order._id.length - 6).toUpperCase() || "N/A";
                        const itemNames = (order.medicines || []).map(m => m.name).join(", ");
                        
                        return (
                          <tr key={order._id || i} className="group border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                            <td className="py-5 pl-4">
                              <p className="font-bold text-slate-900 mb-1.5 text-base">{patientName}</p>
                              <div className="flex items-center gap-2.5">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-sm">
                                  #{displayId}
                                </span>
                                <p className="text-xs font-semibold text-slate-500 truncate max-w-[250px]" title={itemNames}>
                                  {itemNames || "Medicines"}
                                </p>
                              </div>
                            </td>
                            <td className="py-5">
                              <span className="text-lg font-black text-slate-900 tracking-tight">₹{order.price || 0}</span>
                            </td>
                            <td className="py-5">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100 uppercase tracking-wider">
                                <CheckCircle size={12} /> Accepted
                              </span>
                            </td>
                            <td className="py-5 pr-4 text-right text-sm font-semibold text-slate-500">
                              <div className="flex items-center justify-end gap-2 group-hover:text-blue-600 transition-colors">
                                <Clock size={16} /> {formatDate(order.createdAt || order.updatedAt)}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ShopView;