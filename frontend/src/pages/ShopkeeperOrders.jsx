import React, { useState, useEffect } from "react";
import {
  Package,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Search,
  Pill,
  ShoppingBag,
  IndianRupee,
  X,
  User,
  Calendar,
  CheckSquare,
} from "lucide-react";
import { addResponseToOrder, getAllActiveOrders } from "../api/order";
import { useAuth } from "../auth/AuthContext";

const ShopkeeperOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("requests");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);
  const [grandTotal, setGrandTotal] = useState("");
  const { user } = useAuth();
  const currentShopkeeper = user?.shopkeeperID || user?._id;

  const fetchOrders = async () => {
    try {
      const response = await getAllActiveOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getShopkeeperStatus = (order) => {
    // 1. Handle if the order is already finalized by the patient
    if (order.status === "done" || order.status === "completed") {
      const winningShopkeeperId = order.shopkeeperID?._id || order.shopkeeperID;
      return String(winningShopkeeperId) === String(currentShopkeeper)
        ? "completed"
        : "closed";
    }

    // 2. Safely find if the current shopkeeper has responded
    const myResponse = (order.responses || []).find((r) => {
      const responseShopId = r.shopkeeperID?._id || r.shopkeeperID;
      return String(responseShopId) === String(currentShopkeeper);
    });

    // 3. Apply the exact logic you requested:
    if (!myResponse) return "requests"; // No response exists -> New Request
    if (myResponse.status === "accepted") return "quoted"; // Accepted the request -> Quoted
    if (myResponse.status === "rejected") return "rejected"; // Rejected the request -> Rejected

    return "requests"; // Fallback
  };

  const initiateAccept = (orderId) => {
    setAcceptingId(orderId);
    setGrandTotal("");
  };

  const cancelAccept = () => {
    setAcceptingId(null);
    setGrandTotal("");
  };

  const handleConfirmAccept = async (orderId) => {
    if (!grandTotal || isNaN(grandTotal) || Number(grandTotal) <= 0) return;

    setProcessingId(orderId);
    try {
      // console.log(currentShopkeeper);

      await addResponseToOrder({
        orderID: orderId,
        amount: Number(grandTotal),
        status: "accepted",
        shopkeeperID: currentShopkeeper,
      });

      setOrders((prev) =>
        prev.map((order) => {
          if (order._id === orderId) {
            const newResponse = {
              shopkeeperID: currentShopkeeper,
              totalAmount: Number(grandTotal),
              status: "accepted",
            };
            return {
              ...order,
              responses: [...(order.responses || []), newResponse],
            };
          }
          return order;
        }),
      );
      setAcceptingId(null);
      setGrandTotal("");
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectOrder = async (orderId) => {
    setProcessingId(orderId);
    try {
      await addResponseToOrder({
        orderID: orderId,
        amount: 0,
        status: "rejected",
        shopkeeperID: currentShopkeeper,
      });

      setOrders((prev) =>
        prev.map((order) => {
          if (order._id === orderId) {
            const newResponse = {
              shopkeeperID: currentShopkeeper,
              totalAmount: 0,
              status: "rejected",
            };
            return {
              ...order,
              responses: [...(order.responses || []), newResponse],
            };
          }
          return order;
        }),
      );
      setAcceptingId(null);
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const status = getShopkeeperStatus(order);
    if (status === "closed") return false;

    const matchesTab = activeTab === "all" || status === activeTab;
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.patientID?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "requests":
        return {
          label: "New Request",
          bg: "bg-blue-100 text-blue-700",
          dot: "bg-blue-500",
          icon: <Clock size={14} className="mr-1.5" />,
        };
      case "quoted":
        return {
          label: "Quote Sent",
          bg: "bg-amber-100 text-amber-700",
          dot: "bg-amber-500",
          icon: <CheckCircle size={14} className="mr-1.5" />,
        };
      case "completed":
        return {
          label: "Won & Done",
          bg: "bg-emerald-100 text-emerald-700",
          dot: "bg-emerald-500",
          icon: <CheckSquare size={14} className="mr-1.5" />,
        };
      case "rejected":
        return {
          label: "Rejected",
          bg: "bg-red-100 text-red-700",
          dot: "bg-red-500",
          icon: <XCircle size={14} className="mr-1.5" />,
        };
      default:
        return {
          label: status,
          bg: "bg-gray-100 text-gray-700",
          dot: "bg-gray-500",
          icon: null,
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pt-24 pb-32">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-blue-200 bg-blue-50 mb-4">
                <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                <span className="text-[11px] font-bold text-blue-800 tracking-wider uppercase">
                  Vendor Control Panel
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                Order <span className="text-blue-600">Management</span>
              </h1>
            </div>

            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders or patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex bg-slate-200/60 p-1 rounded-xl w-full sm:w-max mb-8 overflow-x-auto no-scrollbar">
          {["requests", "quoted", "completed", "rejected", "all"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                cancelAccept();
              }}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all duration-200 whitespace-nowrap ${
                activeTab === tab
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "requests" ? "New Requests" : tab}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <Package size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              No orders found
            </h3>
            <p className="text-slate-500 text-sm max-w-sm">
              We couldn't find any {activeTab !== "all" ? activeTab : ""} orders
              matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              const currentStatus = getShopkeeperStatus(order);
              const statusConfig = getStatusConfig(currentStatus);
              const isProcessing = processingId === order._id;
              const isAccepting = acceptingId === order._id;

              let displayPrice = null;
              if (currentStatus === "completed") displayPrice = order.price;
              if (currentStatus === "quoted") {
                const myResp = (order.responses || []).find(
                  (r) => r.shopkeeperID === currentShopkeeper,
                );
                if (myResp) displayPrice = myResp.totalAmount;
              }

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusConfig.bg}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}
                        ></span>
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5 font-medium">
                        <User size={14} className="text-slate-400" />
                        {order.patientID?.name || "Unknown Patient"}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar size={12} className="text-slate-400" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Pill size={14} />
                        Prescription ({order.medicines?.length || 0})
                      </h4>
                      {displayPrice !== null && (
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            Quoted
                          </span>
                          <p className="text-base font-black text-blue-600 leading-none">
                            ₹{displayPrice}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {order.medicines?.map((med, idx) => (
                        <div
                          key={med._id || idx}
                          className={`pl-3 border-l-2 ${idx % 2 === 0 ? "border-blue-400" : "border-indigo-400"}`}
                        >
                          <div className="flex justify-between items-start">
                            <p className="font-bold text-sm text-slate-900">
                              {med.name}
                            </p>
                          </div>
                          {med.dose && (
                            <p className="text-xs font-bold text-blue-600 mt-0.5 mb-1.5">
                              Dose: {med.dose}
                            </p>
                          )}
                          {med.notes && (
                            <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-2 rounded-md">
                              {med.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {currentStatus === "requests" && (
                    <div className="p-5 border-t border-slate-100 bg-white">
                      {isAccepting ? (
                        <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                              Your Quote (₹)
                            </label>
                            <button
                              onClick={cancelAccept}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <X size={16} strokeWidth={3} />
                            </button>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <IndianRupee
                                size={14}
                                className="text-slate-500"
                              />
                            </div>
                            <input
                              type="number"
                              placeholder="0.00"
                              value={grandTotal}
                              onChange={(e) => setGrandTotal(e.target.value)}
                              className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-black text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              autoFocus
                            />
                          </div>
                          <button
                            onClick={() => handleConfirmAccept(order._id)}
                            disabled={!grandTotal || isProcessing}
                            className="w-full py-2.5 rounded-lg font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {isProcessing ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <CheckCircle size={16} /> Send Quote
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleRejectOrder(order._id)}
                            disabled={isProcessing}
                            className="flex-1 py-2.5 px-3 rounded-lg font-bold text-sm text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            <XCircle size={16} /> Reject
                          </button>
                          <button
                            onClick={() => initiateAccept(order._id)}
                            disabled={isProcessing}
                            className="flex-1 py-2.5 px-3 rounded-lg font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            <CheckCircle size={16} /> Accept
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {currentStatus !== "requests" && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50">
                      <button className="w-full py-2 rounded-lg font-bold text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 transition-colors flex items-center justify-center gap-2">
                        <ShoppingBag size={14} />
                        View Full Details
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ShopkeeperOrders;
