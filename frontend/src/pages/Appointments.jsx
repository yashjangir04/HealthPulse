import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  getAppointments,
  scheduleAppointment,
  cancelAppointment,
  rescheduleAppointment,
  updateAppointmentStatus,
} from "../api/appointment";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Video,
  RefreshCw,
  X,
  FileText,
  Pill,
  AlertCircle,
  CalendarPlus,
  Stethoscope,
  Eye,
  Trash2,
  Activity,
  CheckSquare,
  XCircle,
} from "lucide-react";

const Appointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isDoctor = user?.role === "doctor";

  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [appointments, setAppointments] = useState([]);

  const [now, setNow] = useState(Date.now());

  const fetchAppointments = async () => {
    try {
      const result = await getAppointments();
      setAppointments(result.data || []);
    } catch (error) {
      console.error("Failed fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();

    const intervalId = setInterval(() => {
      setNow(Date.now());
      fetchAppointments();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const tabs = [
    { id: "all", label: "All" },
    { id: "upcoming", label: "Upcoming" },
    { id: "ongoing", label: "Ongoing" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  const activeTabIndex = tabs.findIndex((t) => t.id === activeTab);

  const statusPriority = {
    ongoing: 1,
    upcoming: 2,
    completed: 3,
    cancelled: 4,
  };

  const fiveMinutesMs = 5 * 60 * 1000;

  const derivedAppointments = appointments.map((app) => {
    let displayStatus = app.status ? app.status.toLowerCase() : "";

    if (displayStatus === "upcoming") {
      const startTimeMs = new Date(app.startTime).getTime();
      if (now >= startTimeMs - fiveMinutesMs) {
        displayStatus = "ongoing";
      }
    }
    return { ...app, displayStatus };
  });

  const filteredAppointments = derivedAppointments
    .filter((app) => activeTab === "all" || app.displayStatus === activeTab)
    .sort((a, b) => {
      if (statusPriority[a.displayStatus] !== statusPriority[b.displayStatus]) {
        return (
          statusPriority[a.displayStatus] - statusPriority[b.displayStatus]
        );
      }
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();

      if (a.displayStatus === "completed" || a.displayStatus === "cancelled") {
        return timeB - timeA;
      }
      return timeA - timeB;
    });

  const getStatusBadge = (status) => {
    switch (status) {
      case "ongoing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 shrink-0">
            <Activity size={12} className="animate-pulse" /> Ongoing
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 shrink-0">
            <CheckSquare size={12} /> Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 shrink-0">
            <XCircle size={12} /> Cancelled
          </span>
        );
      case "upcoming":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 shrink-0">
            <Clock size={12} /> Upcoming
          </span>
        );
    }
  };

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

  const handleJoinRoom = async (appointment) => {
    try {
      if (
        user.role === "doctor" &&
        appointment.status?.toLowerCase() === "upcoming"
      ) {
        await updateAppointmentStatus({
          meetingID: appointment._id,
          status: "ongoing",
          startTime: new Date(),
        });
      }
      navigate(`/meeting/${appointment.roomID}`);
    } catch (error) {
      console.error("Failed to start meeting:", error);
    }
  };

  const handleOpenReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setNewDate("");
    setNewTime("");
    setModalMode("reschedule");
    setIsModalOpen(true);
  };

  const handleOpenFollowUp = (appointment) => {
    setSelectedAppointment(appointment);
    setNewDate("");
    setNewTime("");
    setModalMode("followup");
    setIsModalOpen(true);
  };

  const handleOpenCancel = (appointment) => {
    setSelectedAppointment(appointment);
    setModalMode("cancel");
    setIsModalOpen(true);
  };

  const handleOpenDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setModalMode("details");
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    let combinedDateTimeISO = null;

    if (
      modalMode !== "cancel" &&
      modalMode !== "details" &&
      newDate &&
      newTime
    ) {
      const combinedString = `${newDate}T${newTime}:00`;
      const dateTimeObject = new Date(combinedString);
      combinedDateTimeISO = dateTimeObject.toISOString();
    }

    try {
      if (modalMode === "reschedule") {
        await rescheduleAppointment({
          meetingID: selectedAppointment._id,
          startTime: combinedDateTimeISO,
        });
      } else if (modalMode === "followup") {
        await scheduleAppointment({
          startTime: combinedDateTimeISO,
          patientID: selectedAppointment.patientID._id,
          doctorID: selectedAppointment.doctorID._id,
        });
      } else if (modalMode === "cancel") {
        await cancelAppointment({
          meetingID: selectedAppointment._id,
        });
      }
      setIsModalOpen(false);
      await fetchAppointments();
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCFF] font-sans text-gray-900 pt-24 pb-32">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-blue-200 bg-blue-50 mb-4">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-[11px] font-bold text-blue-800 tracking-wider uppercase">
                Schedule Dashboard
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              My <span className="text-blue-600">Appointments.</span>
            </h1>
            <p className="text-gray-500 font-medium mt-2 text-[15px] max-w-lg">
              {isDoctor
                ? "Manage your patient schedule, join meetings, and review past consultations."
                : "Track your healthcare visits, join virtual rooms, and view your prescriptions."}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-4 bg-white p-2.5 pr-5 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-default">
            <div className="w-12 h-12 rounded-full bg-linear-to-tr from-slate-800 to-slate-950 flex items-center justify-center text-white font-black text-lg shadow-inner ring-2 ring-white">
              {user?.name?.trim()
                ? user.name
                    .trim()
                    .split(" ")
                    .filter(Boolean)
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "NA"}
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-slate-900 leading-tight">
                {user?.name || "Yash"}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                {isDoctor ? "Doctor Profile" : "Patient Profile"}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto no-scrollbar mb-8 pb-2">
          <div className="relative inline-flex bg-slate-100 p-1 rounded-xl">
            <div
              className="absolute top-1 bottom-1 w-28 sm:w-32 bg-white rounded-lg shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out z-0"
              style={{
                transform: `translateX(calc(${activeTabIndex} * 100%))`,
              }}
            />
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative z-10 w-28 sm:w-32 py-2.5 cursor-pointer text-[15px] font-bold transition-colors duration-300 ${
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

        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <Calendar size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              No {activeTab !== "all" ? activeTab : ""} appointments
            </h3>
            <p className="text-slate-500 text-sm max-w-sm">
              You don't have any appointments matching this status at the
              moment.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAppointments.map((appointment) => {
              const personName = isDoctor
                ? appointment?.patientID?.name
                : appointment?.doctorID?.name;

              return (
                <div
                  key={appointment._id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(appointment.displayStatus)}
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-slate-200 bg-white text-slate-500">
                          {appointment.type || "General"}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                        <Clock size={14} className="text-slate-400" />
                        {formatDate(appointment.startTime)}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <div
                        className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-sm font-black text-blue-700 uppercase"
                        title={personName}
                      >
                        {personName
                          ? personName.split(" ")[0].charAt(0) +
                            (personName.split(" ")[1]
                              ? personName.split(" ")[1].charAt(0)
                              : "")
                          : "NA"}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                      {isDoctor ? "Patient Details" : "Doctor Details"}
                    </h4>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          {isDoctor ? (
                            <User size={24} />
                          ) : (
                            <Stethoscope size={24} />
                          )}
                        </div>
                        <div>
                          <h5 className="font-black text-lg text-slate-900">
                            {personName || "Unknown"}
                          </h5>
                          {appointment.displayStatus === "completed" &&
                            appointment.updatedAt && (
                              <p className="text-xs font-bold text-slate-500 mt-0.5">
                                Completed at{" "}
                                {new Date(
                                  appointment.updatedAt,
                                ).toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                        {appointment.displayStatus === "ongoing" && (
                          <button
                            onClick={() => handleJoinRoom(appointment)}
                            className="px-5 py-2.5 bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-md hover:bg-emerald-600 transition-all active:scale-95 flex items-center gap-2"
                          >
                            <Video size={16} className="animate-pulse" /> Join
                            Meeting
                          </button>
                        )}

                        {isDoctor &&
                          (appointment.displayStatus === "upcoming" ||
                            appointment.displayStatus === "ongoing") && (
                            <button
                              onClick={() => handleOpenReschedule(appointment)}
                              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600 text-sm font-bold rounded-lg transition-all active:scale-95 flex items-center gap-2"
                            >
                              <RefreshCw size={16} /> Reschedule
                            </button>
                          )}

                        {appointment.displayStatus === "upcoming" && (
                          <button
                            onClick={() => handleOpenCancel(appointment)}
                            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:border-red-500 hover:text-red-500 hover:bg-red-50 text-sm font-bold rounded-lg transition-all active:scale-95 flex items-center gap-2"
                          >
                            <Trash2 size={16} /> Cancel
                          </button>
                        )}

                        {appointment.displayStatus === "completed" && (
                          <>
                            <button
                              onClick={() => handleOpenDetails(appointment)}
                              className="px-5 py-2.5 bg-slate-900 cursor-pointer text-white text-sm font-bold rounded-lg shadow-md hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2"
                            >
                              <Eye size={16} /> View Details
                            </button>

                            {isDoctor && (
                              <button
                                onClick={() => handleOpenFollowUp(appointment)}
                                className="px-4 py-2.5 bg-white border cursor-pointer border-blue-200 text-blue-600 hover:bg-blue-50 text-sm font-bold rounded-lg transition-all active:scale-95 flex items-center gap-2"
                              >
                                <CalendarPlus size={16} /> Follow-up
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md lg:max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  {modalMode === "reschedule" && (
                    <>
                      <RefreshCw size={20} className="text-blue-500" />{" "}
                      Reschedule Appointment
                    </>
                  )}
                  {modalMode === "followup" && (
                    <>
                      <CalendarPlus size={20} className="text-blue-500" />{" "}
                      Schedule Follow-up
                    </>
                  )}
                  {modalMode === "cancel" && (
                    <>
                      <AlertCircle size={20} className="text-red-500" /> Cancel
                      Appointment
                    </>
                  )}
                  {modalMode === "details" && (
                    <>
                      <FileText size={20} className="text-blue-500" />{" "}
                      Consultation Details
                    </>
                  )}
                </h2>
                {modalMode !== "details" && (
                  <p className="text-sm font-medium text-slate-500 mt-2">
                    {modalMode === "reschedule" &&
                      "Choose a new date and time for "}
                    {modalMode === "followup" && "Book a follow-up visit for "}
                    {modalMode === "cancel" &&
                      "Are you sure you want to cancel the visit with "}
                    <span className="font-black text-slate-700">
                      {isDoctor
                        ? selectedAppointment?.patientID?.name
                        : selectedAppointment?.doctorID?.name}
                    </span>
                    ?
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {modalMode === "details" ? (
              <div className="p-6 space-y-6 overflow-y-auto scrollbar-hide flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block mb-1">
                      Date
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      {new Date(
                        selectedAppointment.startTime,
                      ).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block mb-1">
                      Time
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      {new Date(
                        selectedAppointment.startTime,
                      ).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {selectedAppointment?.notes ? (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Doctor's Notes
                    </h4>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                        {selectedAppointment.notes}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Doctor's Notes
                    </h4>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 border-dashed text-center">
                      <p className="text-sm text-slate-400 font-medium">
                        No notes recorded for this session.
                      </p>
                    </div>
                  </div>
                )}

                {selectedAppointment?.prescribedMedicine?.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Prescribed Medicines (
                      {selectedAppointment.prescribedMedicine.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAppointment.prescribedMedicine.map(
                        (med, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-700 shadow-sm"
                          >
                            <Pill
                              size={14}
                              className="text-emerald-500 mr-1.5"
                            />
                            <span className="capitalize">{med}</span>
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className="p-6 space-y-5">
                {modalMode !== "cancel" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Select Date
                      </label>
                      <input
                        type="date"
                        required
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Select Time
                      </label>
                      <input
                        type="time"
                        required
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                )}

                {modalMode === "cancel" && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-xl font-bold text-sm border border-red-100 flex items-start gap-3">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <p>
                      This action cannot be undone. You will need to book a new
                      appointment if you change your mind.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 px-4 rounded-lg font-bold text-slate-600 bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors"
                  >
                    {modalMode === "cancel" ? "Keep Appointment" : "Close"}
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-3 px-4 rounded-lg font-bold text-white shadow-md transition-all active:scale-95 ${
                      modalMode === "cancel"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {modalMode === "reschedule" && "Confirm Changes"}
                    {modalMode === "followup" && "Book Follow-up"}
                    {modalMode === "cancel" && "Yes, Cancel It"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
