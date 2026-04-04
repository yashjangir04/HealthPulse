import React, { useState, useEffect } from "react";
import {
  Package,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Store,
  ChevronRight,
  IndianRupee,
  Activity,
  CheckSquare,
  Phone,
  X,
} from "lucide-react";
import { getPatientOrders, acceptOrder , rejectOrder } from "../api/order";

const PatientOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [processingId, setProcessingId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [contactDetails, setContactDetails] = useState({
    shopName: "",
    phone: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await getPatientOrders();
        setOrders(result.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();

    const intervalId = setInterval(() => {
      fetchOrders();
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleAcceptOffer = async (orderId, resp) => {
    setProcessingId(resp._id);
    try {
      const targetShopkeeperId =
        resp?.shopkeeper?._id || resp?.shopkeeperID?._id || resp?.shopkeeperID;

      await acceptOrder({
        orderID: orderId,
        price: resp.totalAmount,
        shopkeeperID: targetShopkeeperId,
      });

      setOrders((prev) =>
        prev.map((order) => {
          if (order._id === orderId) {
            const updatedResponses = order.responses.map((r) => ({
              ...r,
              status: r._id === resp._id ? "accepted" : "rejected",
            }));
            return {
              ...order,
              status: "done",
              price: resp.totalAmount || 0,
              responses: updatedResponses,
            };
          }
          return order;
        }),
      );

      const shopName =
        resp?.shopkeeper?.shopName ||
        resp?.shopkeeperID?.shopName ||
        "Local Pharmacy";
      const phone =
        resp?.shopkeeper?.phoneNumber ||
        resp?.shopkeeperID?.phoneNumber ||
        "+91 XXXXXXXXXX";

      setContactDetails({ shopName, phone });
      setShowModal(true);
    } catch (error) {
      console.error("Failed to accept order:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectOffer = async (orderId, resp) => {
    setProcessingId(resp._id);
    try {
      const targetShopkeeperId =
        resp?.shopkeeper?._id || resp?.shopkeeperID?._id || resp?.shopkeeperID;

      await rejectOrder({
        orderID: orderId,
        price: resp.totalAmount,
        shopkeeperID: targetShopkeeperId,
      });

      setOrders((prev) =>
        prev.map((order) => {
          if (order._id === orderId) {
            const updatedResponses = order.responses.map((r) => ({
              ...r,
              status: r._id === resp._id ? "accepted" : "rejected",
            }));
            return {
              ...order,
              status: "done",
              price: resp.totalAmount || 0,
              responses: updatedResponses,
            };
          }
          return order;
        }),
      );
    } catch (error) {
      console.error("Failed to reject order:", error);
    } finally {
      setProcessingId(null);
    }
  };

 
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "active") return order.status === "pending";
    if (activeTab === "past") return order.status === "done";
    return true;
  });

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

  const tabs = [
    { id: "active", label: "Active Requests" },
    { id: "past", label: "Past Orders" },
  ];
  const activeTabIndex = tabs.findIndex((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-[#FAFCFF] font-sans text-gray-900 pt-24 pb-32">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-blue-200 bg-blue-50 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-[11px] font-bold text-blue-800 tracking-wider uppercase">
              My Orders
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
            Track <span className="text-blue-600">Prescriptions.</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2 text-[15px] max-w-lg">
            Review your medicine requests, compare offers from local pharmacies,
            and track your deliveries.
          </p>
        </div>

        <div className="w-full overflow-x-auto no-scrollbar mb-8 pb-2">
          <div className="relative inline-flex bg-slate-200/60 p-1 rounded-xl">
            <div
              className="absolute top-1 bottom-1 w-37.5 sm:w-40 bg-white rounded-lg shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out z-0"
              style={{
                transform: `translateX(calc(${activeTabIndex} * 100%))`,
              }}
            />
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative z-10 w-37.5 sm:w-40 cursor-pointer py-2.5 text-sm font-bold capitalize transition-colors duration-300 ${
                  activeTab === tab.id
                    ? "text-blue-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <Package size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              No {activeTab} orders
            </h3>
            <p className="text-slate-500 text-sm max-w-sm">
              You don't have any {activeTab} medicine requests at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const safeMedicines = order?.medicines || [];
              const safeResponses = order?.responses || [];

              const winningResponse =
                order.status === "done"
                  ? safeResponses.find((r) => r.status === "accepted")
                  : null;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {order.status === "pending" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 shrink-0">
                            <Activity size={12} className="animate-pulse" />{" "}
                            Awaiting Offers
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 shrink-0">
                            <CheckSquare size={12} /> Completed
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                        <Clock size={14} className="text-slate-400" />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex -space-x-2 overflow-hidden sm:justify-end">
                      {safeMedicines.slice(0, 3).map((med, idx) => {
                        const medName = med?.name || "RX";
                        return (
                          <div
                            key={med._id || idx}
                            className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-blue-50 items-center justify-center text-[10px] font-bold text-blue-600 border border-blue-100"
                            title={medName}
                          >
                            {medName.substring(0, 2).toUpperCase()}
                          </div>
                        );
                      })}
                      {safeMedicines.length > 3 && (
                        <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-slate-100 items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
                          +{safeMedicines.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  {winningResponse && (
                    <div className="px-6 py-4 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                          <Store size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                            Fulfilled By
                          </p>
                          <p className="font-black text-slate-900 text-sm">
                            {winningResponse?.shopkeeper?.shopName ||
                              winningResponse?.shopkeeperID?.shopName ||
                              "Local Pharmacy"}
                          </p>
                        </div>
                      </div>
                      <a
                        href={`tel:${winningResponse?.shopkeeper?.phoneNumber || winningResponse?.shopkeeperID?.phoneNumber}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-600 text-sm font-bold rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-colors shadow-sm"
                      >
                        <Phone size={16} />
                        Call Pharmacy
                      </a>
                    </div>
                  )}

                  <div className="p-6 sm:p-8 bg-slate-50/30">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                      Requested Items ({safeMedicines.length})
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {safeMedicines.map((med, idx) => (
                        <span
                          key={med._id || idx}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-700 shadow-sm"
                        >
                          {med?.name || "Unknown Medicine"}
                          {med?.dose && (
                            <span className="ml-1.5 text-[11px] text-slate-400">
                              {med.dose}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>

                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                      Offers from Pharmacies
                    </h4>

                    {safeResponses.filter(
                      (r) =>
                        r?.status === "pending" || r?.status === "accepted",
                    ).length === 0 ? (
                      <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-200">
                        <p className="text-sm font-medium text-slate-500">
                          Waiting for pharmacies to respond with their quotes...
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {safeResponses
                          .filter(
                            (r) =>
                              r?.status === "pending" ||
                              r?.status === "accepted",
                          )
                          .sort(
                            (a, b) =>
                              (a.totalAmount || 0) - (b.totalAmount || 0),
                          )
                          .map((resp, idx) => {
                            const isProcessing = processingId === resp._id;
                            const isAccepted =
                              resp.status === "accepted" &&
                              order.status !== "pending";
                            const isBestPrice =
                              idx === 0 && order.status === "pending";

                            const shopName =
                              resp?.shopkeeper?.shopName ||
                              resp?.shopkeeperID?.shopName ||
                              "Local Pharmacy";
                            const distance = resp?.distance
                              ? `${resp.distance} km`
                              : "Nearby";

                            return (
                              <div
                                key={resp._id}
                                className={`relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col ${
                                  isAccepted
                                    ? "bg-emerald-50 border-emerald-500 shadow-md"
                                    : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-md"
                                }`}
                              >
                                {isBestPrice && (
                                  <div className="absolute -top-3 right-4 bg-amber-400 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                                    Best Price
                                  </div>
                                )}

                                {isAccepted && (
                                  <div className="absolute -top-3 right-4 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-sm uppercase tracking-wider flex items-center gap-1">
                                    <CheckCircle size={10} /> Accepted
                                  </div>
                                )}

                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex gap-3 items-center">
                                    <div
                                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isAccepted ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
                                    >
                                      <Store size={18} />
                                    </div>
                                    <div>
                                      <h5 className="font-black text-[15px] text-slate-900">
                                        {shopName}
                                      </h5>
                                      <div className="flex items-center gap-3 mt-0.5">
                                        <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                                          <MapPin size={10} /> {distance}
                                        </span>
                                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                                          <Star
                                            size={10}
                                            className="fill-current"
                                          />{" "}
                                          4.5
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-100">
                                  <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                                      Quoted Price
                                    </span>
                                    <span
                                      className={`text-xl font-black flex items-center ${isAccepted ? "text-emerald-700" : "text-slate-900"}`}
                                    >
                                      <IndianRupee
                                        size={16}
                                        strokeWidth={3}
                                        className="mr-0.5"
                                      />
                                      {resp?.totalAmount || 0}
                                    </span>
                                  </div>

                                  {order.status === "pending" && (
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() =>
                                          handleRejectOffer(order._id, resp._id)
                                        }
                                        disabled={processingId !== null}
                                        className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors disabled:opacity-50"
                                      >
                                        <XCircle size={20} />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleAcceptOffer(order._id, resp)
                                        }
                                        disabled={processingId !== null}
                                        className="px-4 py-2 bg-blue-600 cursor-pointer text-white text-sm font-bold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                      >
                                        {isProcessing ? (
                                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                          <>Accept</>
                                        )}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-500 p-6 text-center relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white cursor-pointer transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-white">Offer Accepted!</h3>
              <p className="text-emerald-100 text-sm font-medium mt-1">
                Contact the pharmacy to arrange delivery.
              </p>
            </div>

            <div className="p-6 text-center">
              <h4 className="text-lg font-black text-slate-900 mb-6">
                {contactDetails.shopName}
              </h4>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-6">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Contact Number
                </span>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {contactDetails.phone}
                </div>
              </div>

              <a
                href={`tel:${contactDetails.phone}`}
                className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-blue-500/20"
              >
                <Phone size={22} fill="currentColor" />
                Call Now
              </a>

              <button
                onClick={() => setShowModal(false)}
                className="w-full mt-3 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientOrders;
