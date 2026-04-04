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

  // Filter and SORT the orders by time (newest first)
  const filteredOrders = orders
    .filter((order) => {
      if (activeTab === "active") return order.status === "pending";
      if (activeTab === "past") return order.status === "done";
      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
    <div className="min-h-screen bg-white font-sans text-gray-900 pt-24 pb-32">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-100 bg-blue-50 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-xs font-bold text-[#007AFF] tracking-wider uppercase">
              My Orders
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mb-2">
            Track <span className="text-[#007AFF]">Prescriptions.</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2 text-sm md:text-base max-w-lg">
            Review your medicine requests, compare offers from local pharmacies,
            and track your deliveries.
          </p>
        </div>

        <div className="w-full overflow-x-auto no-scrollbar mb-8 pb-2">
          <div className="relative inline-flex bg-gray-50 border border-gray-100 p-1.5 rounded-xl shadow-inner">
            <div
              className="absolute top-1.5 bottom-1.5 w-37.5 sm:w-40 bg-white rounded-lg shadow-sm transition-transform duration-300 ease-out z-0 border border-gray-100"
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
                    ? "text-[#007AFF]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-[24px] border border-gray-200 border-dashed p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
              <Package size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              No {activeTab} orders
            </h3>
            <p className="text-gray-400 text-sm max-w-sm">
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
                  className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6 sm:p-8 border-b border-gray-50 bg-gray-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {order.status === "pending" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-blue-100 text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-[#007AFF] shrink-0">
                            <Activity size={12} className="animate-pulse" />{" "}
                            Awaiting Offers
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-emerald-100 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 shrink-0">
                            <CheckSquare size={12} /> Completed
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-gray-400 flex items-center gap-2">
                        <Clock size={14} className="text-gray-300" />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex -space-x-2 overflow-hidden sm:justify-end">
                      {safeMedicines.slice(0, 3).map((med, idx) => {
                        const medName = med?.name || "RX";
                        return (
                          <div
                            key={med._id || idx}
                            className="inline-flex h-12 w-12 rounded-full ring-2 ring-white bg-blue-50 items-center justify-center text-[11px] font-extrabold text-[#007AFF] border border-blue-100"
                            title={medName}
                          >
                            {medName.substring(0, 2).toUpperCase()}
                          </div>
                        );
                      })}
                      {safeMedicines.length > 3 && (
                        <div className="inline-flex h-12 w-12 rounded-full ring-2 ring-white bg-gray-100 items-center justify-center text-[11px] font-extrabold text-gray-500 border border-gray-200">
                          +{safeMedicines.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  {winningResponse && (
                    <div className="px-6 py-4 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-[#007AFF] rounded-full flex items-center justify-center">
                          <Store size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold text-[#007AFF] uppercase tracking-wider">
                            Fulfilled By
                          </p>
                          <p className="font-extrabold text-gray-900 text-sm">
                            {winningResponse?.shopkeeper?.shopName ||
                              winningResponse?.shopkeeperID?.shopName ||
                              "Local Pharmacy"}
                          </p>
                        </div>
                      </div>
                      <a
                        href={`tel:${winningResponse?.shopkeeper?.phoneNumber || winningResponse?.shopkeeperID?.phoneNumber}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-blue-200 text-[#007AFF] text-sm font-bold rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-colors shadow-sm"
                      >
                        <Phone size={16} />
                        Call Pharmacy
                      </a>
                    </div>
                  )}

                  <div className="p-6 sm:p-8">
                    <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-4">
                      Requested Items ({safeMedicines.length})
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {safeMedicines.map((med, idx) => (
                        <span
                          key={med._id || idx}
                          className="inline-flex items-center px-3.5 py-2 rounded-lg bg-white border border-gray-200 text-sm font-bold text-gray-700 shadow-sm"
                        >
                          {med?.name || "Unknown Medicine"}
                          {med?.dose && (
                            <span className="ml-1.5 text-xs font-semibold text-gray-400 border-l border-gray-200 pl-1.5">
                              {med.dose}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>

                    <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-4 border-t border-gray-100 pt-6">
                      Offers from Pharmacies
                    </h4>

                    {safeResponses.filter(
                      (r) =>
                        r?.status === "pending" || r?.status === "accepted",
                    ).length === 0 ? (
                      <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-sm font-bold text-gray-400">
                          Waiting for pharmacies to respond with quotes...
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
                                className={`relative p-5 rounded-[20px] border transition-all duration-300 flex flex-col ${
                                  isAccepted
                                    ? "bg-emerald-50/50 border-emerald-200 shadow-sm"
                                    : "bg-white border-gray-200 hover:border-blue-200 hover:shadow-md"
                                }`}
                              >
                                {isBestPrice && (
                                  <div className="absolute -top-3 right-4 bg-amber-400 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                                    Best Price
                                  </div>
                                )}

                                {isAccepted && (
                                  <div className="absolute -top-3 right-4 bg-[#00D289] text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider flex items-center gap-1">
                                    <CheckCircle size={10} strokeWidth={3} /> Accepted
                                  </div>
                                )}

                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex gap-3 items-center">
                                    <div
                                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isAccepted ? "bg-[#00D289]/10 text-[#00D289]" : "bg-gray-100 text-gray-500"}`}
                                    >
                                      <Store size={20} />
                                    </div>
                                    <div>
                                      <h5 className="font-extrabold text-base text-gray-900 leading-tight">
                                        {shopName}
                                      </h5>
                                      <div className="flex items-center gap-3 mt-1">
                                        <span className="flex items-center gap-1 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                                          <MapPin size={10} /> {distance}
                                        </span>
                                        <span className="flex items-center gap-1 text-[10px] font-extrabold text-amber-500">
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

                                <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-100">
                                  <div>
                                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-0.5">
                                      Quoted Price
                                    </span>
                                    <span
                                      className={`text-xl font-black flex items-center ${isAccepted ? "text-[#00D289]" : "text-gray-900"}`}
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
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 cursor-pointer transition-all disabled:opacity-50"
                                      >
                                        <XCircle size={20} />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleAcceptOffer(order._id, resp)
                                        }
                                        disabled={processingId !== null}
                                        className="px-5 py-2.5 bg-[#007AFF] cursor-pointer text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-[#00D289] p-6 text-center relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white cursor-pointer transition-colors bg-black/10 rounded-full p-1.5"
              >
                <X size={16} strokeWidth={3} />
              </button>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <CheckCircle size={32} className="text-[#00D289]" />
              </div>
              <h3 className="text-xl font-black text-white">Offer Accepted!</h3>
              <p className="text-emerald-50 text-sm font-bold mt-1">
                Contact the pharmacy to arrange delivery.
              </p>
            </div>

            <div className="p-8 text-center bg-white">
              <h4 className="text-lg font-black text-gray-900 mb-6">
                {contactDetails.shopName}
              </h4>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-6">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Contact Number
                </span>
                <div className="text-2xl font-black text-[#007AFF] tracking-tight">
                  {contactDetails.phone}
                </div>
              </div>

              <a
                href={`tel:${contactDetails.phone}`}
                className="w-full py-4 px-4 bg-[#007AFF] hover:bg-blue-600 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-blue-500/20"
              >
                <Phone size={20} fill="currentColor" />
                Call Now
              </a>

              <button
                onClick={() => setShowModal(false)}
                className="w-full mt-4 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientOrders;