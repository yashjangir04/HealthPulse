import { React, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ZegoCloud from "../components/ZegoCloud";
import { FaNoteSticky, FaPhone } from "react-icons/fa6";
import { GiMedicinePills } from "react-icons/gi";
import { GrAttachment } from "react-icons/gr";
import { IoMdSend } from "react-icons/io";
import { IoDocumentTextOutline, IoWarningOutline } from "react-icons/io5";
import { TbPill } from "react-icons/tb";
import { MdBloodtype, MdHeight } from "react-icons/md";
import { FaWeightScale } from "react-icons/fa6";
import { useAuth } from "../auth/AuthContext";
import { endAppointment, getAppointmentDetails } from "../api/appointment";
import { askQuestion } from "../api/bot";
import { rateDoctor } from "../api/doctor";
import { io } from "socket.io-client";
import { Star } from "lucide-react";

const MeetingRoom = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { roomID } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isDoctor = user?.role === "doctor";

  const [notes, setNotes] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [prescriptions, setPrescriptions] = useState([]);
  const [showMedForm, setShowMedForm] = useState(false);
  const [medName, setMedName] = useState("");
  const [medDosage, setMedDosage] = useState("");
  const [medNote, setMedNote] = useState("");
  const [appointmentDetails, setAppointmentDetails] = useState({});

  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState("");
  const [showEmergencyToast, setShowEmergencyToast] = useState(false);

  // NEW: State variables for the AI Prescription Check
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [isCheckingInteractions, setIsCheckingInteractions] = useState(false);
  const [checkResult, setCheckResult] = useState("");

  // NEW: Rating state mapping
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingScore, setRatingScore] = useState(5);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const isInitialMount = useRef(true);

  const [patientData, setPatientData] = useState({
    name: "Loading...",
    profilePic: "/sundar-kanya.png",
    dob: null,
    gender: "",
    bloodGroup: "",
    phoneNumber: "",
    height: 0,
    weight: 0,
    medicalHistory: [],
    medicalSummary: {
      keySymptoms: "Awaiting patient input...",
      diagnosis: "Pending evaluation",
      alert: { hasAlert: false, title: "", description: "" },
    },
    currentMedications: [],
  });

  const socket = useRef(null);

  const customScrollbarClasses = `
    overflow-y-auto 
    [scrollbar-width:thin] 
    [scrollbar-color:#cbd5e1_transparent] 
    [&::-webkit-scrollbar]:w-2.5 
    [&::-webkit-scrollbar-track]:bg-transparent 
    [&::-webkit-scrollbar-thumb]:bg-slate-300 
    [&::-webkit-scrollbar-thumb]:rounded-full 
    hover:[&::-webkit-scrollbar-thumb]:bg-slate-400
  `;

  const calculateAge = (dobString) => {
    if (!dobString) return "--";
    const birthday = new Date(dobString);
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const formatPhoneNumber = (phone) => {
    if (!phone || phone.length !== 10) return phone || "--";
    return `${phone.slice(0, 5)} ${phone.slice(5)}`;
  };

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_BACKEND_ROUTE);

    socket.current.on("connect", () => {
      console.log("connected");
      socket.current.emit("join-room", roomID);
    });

    socket.current.on("update-notes", (data) => {
      setNotes(data);
    });

    socket.current.on("update-prescription", (data) => {
      setPrescriptions(data);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [roomID]);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const result = await getAppointmentDetails({ meetingID: roomID });
        if (result?.data?.patientID) {
          setPatientData((prev) => ({
            ...prev,
            ...result.data.patientID,
          }));
        }
        setAppointmentDetails(result.data);
      } catch (error) {
        console.error("Failed to fetch appointment details:", error);
      }
    };
    fetchAppointmentDetails();
  }, [roomID]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
        setIsOpen(false);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!isDoctor) return;

    const delayDebounceFn = setTimeout(() => {
      console.log("API Call: Saved automatically", { notes, prescriptions });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [notes, prescriptions, isDoctor]);

  const handleEndMeeting = async () => {
    if (isDoctor) {
      await endAppointment({
        meetingID: roomID,
        notes: notes,
        prescriptions: prescriptions,
      });
      navigate("/connect");
    } else {
      // Pop rating instead of leaving instantly
      setShowRatingModal(true);
    }
  };

  const submitRatingAndLeave = async () => {
    if (appointmentDetails?.doctorID?._id) {
      try {
        setIsSubmittingRating(true);
        await rateDoctor(appointmentDetails.doctorID._id, { rating: ratingScore });
      } catch (e) {
        console.error("Failed to rate doctor:", e);
      } finally {
        setIsSubmittingRating(false);
      }
    }
    navigate(`/medicines/${roomID}`);
  };

  const skipRatingAndLeave = () => {
    navigate(`/medicines/${roomID}`);
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    socket.current.emit("update-notes", {
      roomID: roomID,
      notes: e.target.value,
    });
  };

  const handleAddMedicine = () => {
    if (!medName.trim()) return;

    const newMed = { name: medName, dose: medDosage, notes: medNote };
    const updatedPrescriptions = [...prescriptions, newMed];

    setPrescriptions(updatedPrescriptions);
    socket.current.emit("update-prescription", {
      roomID: roomID,
      prescriptions: updatedPrescriptions,
    });

    setMedName("");
    setMedDosage("");
    setMedNote("");
  };

  const handleRemoveMedicine = (indexToRemove) => {
    const updatedPrescriptions = prescriptions.filter(
      (_, index) => index !== indexToRemove,
    );
    setPrescriptions(updatedPrescriptions);
    socket.current.emit("update-prescription", {
      roomID: roomID,
      prescriptions: updatedPrescriptions,
    });
  };

  const handleSendEmergencyAlert = () => {
    if (!emergencyMessage.trim()) return;
    console.log("Emergency Voice Call Triggered:", emergencyMessage);
    setEmergencyMessage("");
    setIsEmergencyModalOpen(false);
    setShowEmergencyToast(true);
    setTimeout(() => setShowEmergencyToast(false), 3000);
  };

  const handleCheckPrescriptions = async () => {
    console.log(appointmentDetails);

    if (prescriptions.length === 0) return;

    setIsCheckModalOpen(true);
    setIsCheckingInteractions(true);
    setCheckResult("");

    const newMedsString = prescriptions
      .map((p) => `${p.name} (${p.dose})`)
      .join(", ");

    // 2. Extract patient data mapped EXACTLY to your Mongoose Schema
    const patientAge = calculateAge(patientData.dob);

    const historyString =
      patientData.medicalHistory?.length > 0
        ? patientData.medicalHistory.join(", ")
        : "No prior medical history";

    // Extract current medications from medicineReminders to check against the new ones
    const currentMedsString =
      patientData.medicineReminders?.length > 0
        ? patientData.medicineReminders.map((m) => m.medicine).join(", ")
        : "None active";

    // Format vitals neatly
    const vitals =
      `${patientData.height ? patientData.height + "cm, " : ""}${patientData.weight ? patientData.weight + "kg" : ""}` ||
      "Unknown";

    // 3. Build the Schema-accurate AI Prompt
    const promptString = `
      Act as a clinical pharmacologist. Analyze the following NEW prescription list for any severe drug interactions or contraindications.
      
      PATIENT CONTEXT:
      - Age/Gender: ${patientAge} years old, ${patientData.gender || "Unknown"}
      - Vitals/Blood: ${vitals} | ${patientData.bloodGroup || "Unknown"}
      - Past Medical History: ${historyString}
      - CURRENTLY TAKING: ${currentMedsString}
      - Additional Context: ${patientData.aiContext || "None"}
      
      NEW PRESCRIPTIONS TO CHECK:
      ${newMedsString}
      
      Based on standard medical guidelines, provide a brief, concise summary of any risks, specifically checking for drug-drug interactions with their "CURRENTLY TAKING" list and contraindications with their medical history, give the answer in 50 words.
    `;

    try {
      const result = await askQuestion({ question: promptString });
      setCheckResult(result.data.response);
    } catch (error) {
      console.error("Failed to check prescriptions:", error);
      setCheckResult(
        "Error connecting to the analysis server. Please try again later.",
      );
    } finally {
      setIsCheckingInteractions(false);
    }
  };

  return (
    <div
      className={`w-full min-h-screen lg:h-screen relative grid grid-cols-1 ${
        isDoctor ? "lg:grid-cols-[1.8fr_1fr]" : ""
      } gap-4 bg-white p-2 lg:p-4`}
    >
      <div className="meetingLeftBox flex flex-col lg:grid lg:grid-rows-2 gap-4 h-full min-h-0">
        <div className="VideoChat relative w-full min-h-[40vh] lg:min-h-0 overflow-hidden rounded-3xl bg-secondary/50 shrink-0 lg:shrink">
          <button
            className="absolute top-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-full poppins-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 cursor-pointer border border-red-400/50 backdrop-blur-sm"
            onClick={handleEndMeeting}
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            End Meeting
          </button>
          <ZegoCloud />
        </div>

        <div className="NotesAndPrescriptionPanel bg-secondary/50 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 rounded-3xl min-h-0">
          <div className="notes flex flex-col gap-2 h-full min-h-0">
            <div className="flex flex-col bg-white rounded-xl p-3 h-full shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 font-bold text-lg mb-2 poppins-semibold shrink-0">
                <FaNoteSticky className="text-ternary" />
                Notes
              </div>

              <div className="bg-[#ebf2ff] rounded-lg p-2 flex flex-col gap-2 flex-1 min-h-0">
                <textarea
                  value={notes}
                  onChange={handleNotesChange}
                  readOnly={!isDoctor}
                  placeholder={
                    isDoctor
                      ? "Type patient notes here..."
                      : "No notes available yet."
                  }
                  className={`w-full h-full bg-white rounded p-2.5 text-sm text-gray-700 outline-none resize-none ${customScrollbarClasses}`}
                />
              </div>
            </div>
          </div>

          <div className="prescription flex flex-col bg-white border-[3px] border-[#ebf2ff] rounded-xl p-3 h-full min-h-0 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 font-bold text-lg mb-2 poppins-semibold shrink-0">
              <div className="flex items-center gap-2">
                <GiMedicinePills className="text-ternary text-2xl" />
                Prescription
              </div>

              {/* NEW: Modified button container to include the Check Interactions button */}
              {isDoctor && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCheckPrescriptions}
                    disabled={prescriptions.length === 0}
                    className={`bg-[#f8faff] hover:bg-[#ebf2ff] text-[#4285f4] border border-[#4285f4]/30 px-3 py-1.5 rounded-lg text-sm poppins-semibold transition-colors flex items-center gap-1 ${prescriptions.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    title="Check AI for Drug Interactions"
                  >
                    Check
                  </button>
                  {!showMedForm && (
                    <button
                      onClick={() => setShowMedForm(true)}
                      className="bg-ternary/10 hover:bg-ternary/20 text-ternary px-3 py-1.5 rounded-lg text-sm poppins-semibold transition-colors flex items-center gap-1"
                    >
                      <span>+</span> Add
                    </button>
                  )}
                </div>
              )}
            </div>

            <div
              className={`bg-[#ebf2ff] rounded-lg p-2 flex flex-col gap-2 flex-1 min-h-0 mb-2 ${customScrollbarClasses}`}
            >
              {prescriptions.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-gray-400 inter-regular text-center">
                    No medicines added yet.
                  </p>
                </div>
              ) : (
                prescriptions.map((med, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start bg-white p-3 rounded-lg shadow-sm border border-gray-100 shrink-0"
                  >
                    <div className="flex items-start gap-2">
                      <TbPill className="text-[#8ab4f8] text-lg shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800 poppins-semibold">
                          {med.name}
                          {med.dose && (
                            <span className="text-gray-500 font-normal inter-regular text-xs ml-1.5">
                              {med.dose}
                            </span>
                          )}
                        </span>
                        {med.notes && (
                          <span className="text-xs text-gray-500 inter-regular mt-0.5">
                            {med.notes}
                          </span>
                        )}
                      </div>
                    </div>

                    {isDoctor && (
                      <button
                        onClick={() => handleRemoveMedicine(index)}
                        className="text-gray-300 hover:text-red-500 text-xl leading-none px-1 rounded transition-colors"
                        title="Remove"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
            {isDoctor && showMedForm && (
              <div className="flex flex-col gap-2 bg-white p-3 rounded-lg shadow-sm border border-[#ebf2ff] shrink-0 animate-fade-in-up">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Medicine Name"
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    className="grow bg-gray-50 border border-gray-200 rounded p-2 text-sm text-gray-700 outline-none focus:border-[#8ab4f8] focus:bg-white transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Dosage"
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                    className="w-22.5 sm:w-27.5 bg-gray-50 border border-gray-200 rounded p-2 text-sm text-gray-700 outline-none focus:border-[#8ab4f8] focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Note (e.g. After meals)"
                    value={medNote}
                    onChange={(e) => setMedNote(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddMedicine()}
                    className="grow bg-gray-50 border border-gray-200 rounded p-2 text-sm text-gray-700 outline-none focus:border-[#8ab4f8] focus:bg-white transition-colors"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-1">
                  <button
                    onClick={() => setShowMedForm(false)}
                    className="text-gray-500 hover:text-gray-700 px-4 py-1.5 rounded text-sm inter-regular transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleAddMedicine}
                    className="bg-ternary hover:bg-quarter transition-colors text-white px-5 py-1.5 rounded text-sm poppins-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isDoctor && (
        <div
          className={`meetingRightBox bg-secondary/50 p-5 rounded-3xl flex flex-col gap-5 max-h-[95vh] lg:max-h-screen ${customScrollbarClasses}`}
        >
          <div className="flex flex-col bg-white rounded-3xl p-5 shadow-sm border border-gray-100 shrink-0">
            <div className="flex items-center gap-2 text-gray-800 font-bold text-lg poppins-semibold mb-4">
              Patient Profile
            </div>

            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
              <img
                src={patientData.profilePic || "/sundar-kanya.png"}
                alt={patientData.name}
                className="w-16 h-16 rounded-full object-cover bg-gray-200 ring-2 ring-[#ebf2ff]"
              />
              <div className="flex flex-col justify-center">
                <h3 className="poppins-semibold text-lg text-gray-900 leading-tight">
                  {patientData.name || "Unknown Patient"}
                </h3>
                <div className="flex items-center text-gray-500 text-sm mt-1 inter-regular">
                  <FaPhone className="text-[#8ab4f8] mr-2 text-xs" />
                  {formatPhoneNumber(patientData.phoneNumber)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-2">
              <div className="bg-[#f8faff] rounded-xl p-3 flex items-center gap-3 border border-[#ebf2ff]">
                <div className="bg-white p-2 rounded-lg text-[#8ab4f8] shadow-sm">
                  <MdHeight className="text-xl" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-400 uppercase tracking-wider poppins-semibold">
                    Height
                  </span>
                  <span className="text-sm text-gray-800 poppins-semibold">
                    {patientData.height ? `${patientData.height} cm` : "--"}
                  </span>
                </div>
              </div>

              <div className="bg-[#f8faff] rounded-xl p-3 flex items-center gap-3 border border-[#ebf2ff]">
                <div className="bg-white p-2 rounded-lg text-[#8ab4f8] shadow-sm">
                  <FaWeightScale className="text-xl" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-400 uppercase tracking-wider poppins-semibold">
                    Weight
                  </span>
                  <span className="text-sm text-gray-800 poppins-semibold">
                    {patientData.weight ? `${patientData.weight} kg` : "--"}
                  </span>
                </div>
              </div>

              <div className="bg-[#fff5f5] rounded-xl p-3 flex items-center gap-3 border border-[#ffe6e6]">
                <div className="bg-white p-2 rounded-lg text-red-400 shadow-sm">
                  <MdBloodtype className="text-xl" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-400 uppercase tracking-wider poppins-semibold">
                    Blood
                  </span>
                  <span className="text-sm text-gray-800 poppins-semibold">
                    {patientData.bloodGroup || "--"}
                  </span>
                </div>
              </div>

              <div className="bg-[#f8faff] rounded-xl p-3 flex items-center gap-3 border border-[#ebf2ff]">
                <div className="bg-white p-2 rounded-lg text-gray-400 shadow-sm font-bold font-serif text-lg leading-none flex items-center justify-center w-9 h-9">
                  {patientData.gender === "Male"
                    ? "M"
                    : patientData.gender === "Female"
                      ? "F"
                      : "-"}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-400 uppercase tracking-wider poppins-semibold">
                    Age
                  </span>
                  <span className="text-sm text-gray-800 poppins-semibold">
                    {calculateAge(patientData.dob)} yrs
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-white rounded-3xl p-5 shadow-sm border border-gray-100 shrink-0">
            <div className="flex items-center gap-2 text-gray-800 font-bold text-lg poppins-semibold mb-3">
              <IoDocumentTextOutline className="text-[#4285f4] text-xl" />
              Medical Status
            </div>

            {patientData.medicalSummary?.alert?.hasAlert && (
              <div className="bg-[#ff4d4f]/10 border border-[#ff4d4f]/30 rounded-xl p-3 flex items-start gap-3 text-red-600 mb-4">
                <IoWarningOutline className="text-2xl shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="poppins-semibold text-sm">
                    {patientData.medicalSummary.alert.title}
                  </span>
                  <span className="inter-regular text-xs mt-0.5 text-red-500/80">
                    {patientData.medicalSummary.alert.description}
                  </span>
                </div>
              </div>
            )}

            <div className="bg-[#f8faff] border border-gray-100 rounded-xl p-4 flex flex-col gap-3 inter-regular text-sm text-gray-700">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-wide poppins-semibold mb-1">
                  Key Symptoms
                </span>
                <span className="text-gray-800">
                  {patientData.medicalSummary?.keySymptoms || "N/A"}
                </span>
              </div>
              <div className="h-px w-full bg-gray-200/50"></div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-wide poppins-semibold mb-1">
                  Diagnosis
                </span>
                <span className="text-gray-800">
                  {patientData.medicalSummary?.diagnosis || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-white rounded-3xl p-5 shadow-sm border border-gray-100 grow min-h-50">
            <div className="flex items-center gap-2 text-gray-800 font-bold text-lg poppins-semibold mb-3">
              <GiMedicinePills className="text-[#4285f4] text-xl" />
              Past Medical History
            </div>

            <div
              className={`bg-[#f8faff] rounded-xl p-2 flex flex-col gap-2 border border-gray-100 grow ${customScrollbarClasses}`}
            >
              {patientData.medicalHistory?.length > 0 ? (
                patientData.medicalHistory.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-100 p-2.5 rounded-lg flex items-center gap-3 shadow-sm shrink-0"
                  >
                    <div className="bg-[#ebf2ff] p-1.5 rounded text-[#4285f4]">
                      <TbPill className="text-lg" />
                    </div>
                    <span className="text-sm text-gray-700 inter-regular">
                      {item}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-400 italic text-sm">
                    No prior medical history found.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="w-full bg-[#ff4d4f] hover:bg-red-600 transition-colors text-white py-3 rounded-xl flex justify-center items-center gap-2 poppins-semibold shadow-sm mt-4 cursor-pointer duration-300"
            >
              <IoWarningOutline className="text-xl" />
              Emergency Alert
            </button>
          </div>
        </div>
      )}

      {/* Existing Emergency Modal */}
      {isEmergencyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-fade-in transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 flex flex-col gap-4 shadow-2xl transform scale-100 animate-fade-in-up">
            <div className="flex items-center gap-3 text-[#ff4d4f] mb-1">
              <div className="bg-red-50 p-2 rounded-full">
                <IoWarningOutline className="text-3xl" />
              </div>
              <h2 className="text-xl poppins-semibold text-gray-900">
                Emergency Voice Alert
              </h2>
            </div>

            <p className="text-sm text-gray-600 inter-regular">
              We will make an automated voice call to the patient's emergency
              contacts and deliver this message immediately.
            </p>

            <textarea
              value={emergencyMessage}
              onChange={(e) => setEmergencyMessage(e.target.value)}
              placeholder={`e.g., ${patientData.name} is in critical condition. Our team is actively monitoring and providing immediate care.`}
              className={`w-full h-32 bg-[#f8faff] border border-gray-200 rounded-xl p-3 text-sm text-gray-700 outline-none focus:border-[#ff4d4f] focus:ring-1 focus:ring-[#ff4d4f] resize-none transition-all ${customScrollbarClasses}`}
            ></textarea>

            <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => {
                  setIsEmergencyModalOpen(false);
                  setEmergencyMessage("");
                }}
                className="px-5 py-2.5 rounded-xl text-sm poppins-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmergencyAlert}
                className="px-6 py-2.5 rounded-xl text-sm poppins-semibold bg-[#ff4d4f] hover:bg-red-600 text-white flex items-center gap-2 transition-colors shadow-md shadow-red-200 cursor-pointer"
              >
                Send Voice Alert
                <IoMdSend className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Drug Interaction Check Modal */}
      {isCheckModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-fade-in transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 flex flex-col gap-4 shadow-2xl transform scale-100 animate-fade-in-up">
            <div className="flex items-center gap-3 text-[#4285f4] mb-1">
              <div className="bg-[#ebf2ff] p-2 rounded-full">
                <IoDocumentTextOutline className="text-3xl" />
              </div>
              <h2 className="text-xl poppins-semibold text-gray-900">
                Interaction Analysis
              </h2>
            </div>

            <div
              className={`w-full min-h-[150px] max-h-[300px] bg-[#f8faff] border border-gray-200 rounded-xl p-4 text-sm text-gray-700 ${customScrollbarClasses}`}
            >
              {isCheckingInteractions ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 opacity-70 py-6">
                  <div className="w-8 h-8 border-4 border-[#4285f4]/30 border-t-[#4285f4] rounded-full animate-spin"></div>
                  <p className="inter-regular">
                    Checking prescriptions against medical database...
                  </p>
                </div>
              ) : (
                <p className="inter-regular whitespace-pre-wrap leading-relaxed">
                  {checkResult}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => setIsCheckModalOpen(false)}
                className="px-6 py-2.5 rounded-xl text-sm poppins-semibold bg-[#4285f4] hover:bg-[#3367d6] text-white transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {showEmergencyToast && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-[#ff4d4f] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-[150] poppins-semibold text-sm animate-fade-in-up transition-all duration-300">
          <IoWarningOutline className="text-xl" />
          Voice Alert Triggered
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 z-[150] poppins-regular text-sm animate-fade-in-up border border-gray-700 transition-all duration-300">
          <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
          Saved automatically
        </div>
      )}

      {/* NEW: Rating Modal for Patient */}
      {showRatingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-fade-in transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 flex flex-col gap-4 shadow-2xl transform scale-100 animate-fade-in-up items-center text-center">
            <h2 className="text-xl poppins-semibold text-gray-900 mb-1">
              Rate your Session
            </h2>
            <p className="text-sm text-gray-500 inter-regular mb-2">
              How was your experience with Dr. {appointmentDetails?.doctorID?.name || "this specific Doctor"}?
            </p>
            
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingScore(star)}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <Star 
                    size={40} 
                    className={star <= ratingScore ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-300"} 
                  />
                </button>
              ))}
            </div>

            <div className="flex w-full gap-3 mt-2 border-t border-gray-100 pt-5">
              <button
                onClick={skipRatingAndLeave}
                disabled={isSubmittingRating}
                className="flex-1 py-3 rounded-xl text-sm poppins-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Skip
              </button>
              <button
                onClick={submitRatingAndLeave}
                disabled={isSubmittingRating}
                className="flex-1 py-3 rounded-xl text-sm poppins-semibold bg-[#4285f4] hover:bg-[#3367d6] text-white transition-colors cursor-pointer flex justify-center items-center gap-2"
              >
                {isSubmittingRating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingRoom;
