import React, { useEffect, useState } from "react";
import { PiPillFill, PiPlusBold, PiTrashBold, PiXBold } from "react-icons/pi";
import { IoIosArrowForward } from "react-icons/io";
import { useAuth } from "../auth/AuthContext";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const MediList = () => {
  const { user } = useAuth();

  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  const date = new Date().getDate();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const [hour , setHour] = useState(new Date().getHours());
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/medications", {
        withCredentials: true,
      });
      if (response.data.success) {
        setMedications(response.data.medications);
      }
    } catch (err) {
      console.error("Failed to fetch meds:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExtend = async (medId, missedCount) => {
  try {
    // We calculate how many extra days are needed based on missed doses
    // If they missed 6 doses and take 2 per day, they need 3 extra days.
    const response = await axios.post(`/api/medications/extend`, {
      medicationId: medId,
      extraDays: 2 // You can make this dynamic or just a flat +2 days
    }, { withCredentials: true });

    if (response.data.success) {
      fetchMedications(); // This will refresh the list and hide the red alert
    }
  } catch (err) {
    console.error("Extension failed:", err);
  }
};

useEffect(() => {
    if (user) {
      fetchMedications();
    }
    
const interval = setInterval(() => {
    const now = new Date();
    setHour(now.getHours());

    if (now.getMinutes() === 0) {
      fetchMedications();
    }
  }, 60000);

    return () => clearInterval(interval);
  }, [user]);


  // const [medications, setMedications] = useState([
  //   {
  //     name: "Metformin 500 mg",
  //     schedule: {
  //       M: "taken",
  //       A: "immediate",
  //       E: "not-prescribed",
  //       N: "not-prescribed",
  //     },
  //   },
  //   {
  //     name: "Glimepiride 1 mg",
  //     schedule: {
  //       M: "not-prescribed",
  //       A: "not-prescribed",
  //       E: "later",
  //       N: "not-prescribed",
  //     },
  //   },
  //   {
  //     name: "Atorvastatin 10 mg",
  //     schedule: {
  //       M: "not-prescribed",
  //       A: "not-prescribed",
  //       E: "not-prescribed",
  //       N: "later",
  //     },
  //   },
  //   {
  //     name: "Alosartan 50 mg",
  //     schedule: {
  //       M: "missed",
  //       A: "not-prescribed",
  //       E: "not-prescribed",
  //       N: "not-prescribed",
  //     },
  //   },
  // ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMed, setNewMed] = useState({
    name: "",
    durationDays: 7,
    daysOfWeek: [],
    schedule: {
      M: "not-prescribed",
      A: "not-prescribed",
      E: "not-prescribed",
      N: "not-prescribed",
    },
  });

  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleDayToggle = (day) => {
    setNewMed(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day) 
        ? prev.daysOfWeek.filter(d => d !== day) 
        : [...prev.daysOfWeek, day]
    }));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "taken":
        return "bg-green-100 text-green-600 border-green-200";
      case "missed":
        return "bg-red-100 text-red-600 border-red-200";
      case "immediate":
        return "bg-orange-100 text-orange-600 border-orange-200";
      case "later":
        return "bg-blue-100 text-blue-600 border-blue-200";
      default:
        return "bg-gray-100 text-gray-400 border-gray-200";
    }
  };

const handleSlotClick = async (medId, slot, currentStatus) => {
  if (currentStatus === "immediate" || currentStatus === "later") {
    try {
      const response = await axios.patch(`/api/medications/update-status`, {
        medicationId: medId, // This is the mongo _id
        slot: slot,
        status: "taken"
      }, { withCredentials: true });

      if (response.data.success) {
        fetchMedications(); // Refresh from DB
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  }
};

const handleDelete = async (medId) => {
  try {
    const response = await axios.delete(`/api/medications/${medId}`, {
      withCredentials: true 
    });
    if (response.data.success) {
      // Filter by _id instead of index
      setMedications(prev => prev.filter(m => m._id !== medId));
    }
  } catch (err) {
    console.error("Delete failed:", err);
  }
};

  const handleToggleSlot = (slot) => {
    setNewMed((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [slot]:
          prev.schedule[slot] === "not-prescribed" ? "later" : "not-prescribed",
      },
    }));
  };

const handleAddSubmit = async () => {
    if (!newMed.name.trim()) return;

    const duration = parseInt(newMed.durationDays) || 7;
    const payload = {
      medicine: newMed.name,
      schedule: newMed.schedule,
      durationDays: newMed.durationDays,
      daysOfWeek: newMed.daysOfWeek.length > 0 ? newMed.daysOfWeek : allDays // Your specific days requirement
    };

    try {
      // JOINING POINT: Sending data to Backend
        const response = await axios.post("/api/medications/add", payload, {
        withCredentials: true // Important: This sends your JWT token cookie
      });

      if (response.data.success) {
        // Important: Re-fetch to apply the backend "Today" filter immediately
        fetchMedications(); 
        setIsModalOpen(false);
        setNewMed({ name: "", durationDays: 7, daysOfWeek: [], schedule: { M: "not-prescribed", A: "not-prescribed", E: "not-prescribed", N: "not-prescribed" } });
      }
    } catch (err) {
      console.error("Join failed:", err);
    }
  };

  return (
    <div className="poppins-regular w-full min-h-screen flex flex-col gap-6 p-4 md:p-6 items-center relative bg-secondary">
      <div className="medilistWrapper flex flex-col gap-10 bg-white p-4 rounded-3xl w-full">
        <div className="mediList-top flex flex-col md:flex-row justify-between items-center w-full gap-4 md:gap-0">
          <div className="mediList-top-left-section flex flex-row gap-4 md:gap-5 items-center">
            <div className="bg-blue-100 p-3 fancy-border-radius-1">
              <PiPillFill className="text-[32px] text-blue-500" />
            </div>
            <div className="mediL-top-text flex flex-col text-center md:text-left">
              <h1 className="poppins-semibold text-xl md:text-2xl text-gray-800">
                Medication Reminder
              </h1>
              <h3 className="text-gray-400 text-xs md:text-sm">
                Keep track of your daily medications.
              </h3>
            </div>
          </div>
          <div className="mediList-top-right-section flex flex-row items-center gap-3">
            <img
              src="sundar-kanya.png"
              alt="avatar"
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <h1 className="text-lg font-semibold text-gray-700 leading-tight">
              {user.name}
            </h1>
          </div>
        </div>

        <div className="w-full bg-white rounded-3xl p-4 md:p-6 border border-secondary/80">
          <div className="flex flex-col xl:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium w-full xl:w-auto text-center">
              Your today's Medication schedule
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
              <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium text-center flex-1">
                Date : {date}-{months[month]}-{year}
              </div>
              <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg text-sm font-medium text-center  text-nowrap flex-1">
                Current time slot:{" "}
            {hour >= 5 && hour < 12 ? "Morning" : 
            hour >= 12 && hour < 17 ? "Afternoon" : 
            hour >= 17 && hour < 21 ? "Evening" : 
            "Night"}
              </div>
            </div>
          </div>
          <div className="w-full overflow-x-auto pb-4">
            <div className="min-w-162.5">
              <div className="grid grid-cols-5 gap-4 mb-4 px-4 text-gray-500 font-medium text-sm md:text-base">
                <div className="col-span-1">Medicine</div>
                <div className="text-center">Morning(M)</div>
                <div className="text-center">Afternoon(A)</div>
                <div className="text-center">Evening(E)</div>
                <div className="text-center">Night(N)</div>
              </div>

              <div className="flex flex-col gap-3">
{medications.map((med) => (
  <div key={med._id} className="flex flex-col bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-sm relative group mb-4">
    
    {/* Row 1: The Main Grid (Medicine Name + Slots) */}
    <div className="grid grid-cols-5 gap-4 items-center">
      
      {/* Medicine Name & Delete */}
      <div className="flex items-center justify-between col-span-1 pr-2">
        <div className="flex items-center gap-2 font-semibold text-gray-700 text-sm md:text-base">
          <IoIosArrowForward className="text-gray-400 shrink-0" />
          <span className="truncate" title={med.medicine}>
            {med.medicine}
          </span>
        </div>
        <button
          onClick={() => handleDelete(med._id)}
          className="text-red-300 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 cursor-pointer"
          title="Delete Medication"
        >
          <PiTrashBold size={16} />
        </button>
      </div>

      {/* Schedule Slots (M, A, E, N) */}
      {["M", "A", "E", "N"].map((slot) => (
        <div key={slot} className="flex justify-center">
          <div
            onClick={() => handleSlotClick(med._id, slot, med.schedule[slot])}
            className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center border font-bold text-sm md:text-base 
              ${med.schedule[slot] === "immediate" ? "cursor-pointer" : ""} 
              ${getStatusClass(med.schedule[slot])}`}
          >
            {slot}
          </div>
        </div>
      ))}
    </div>

    {/* Row 2: Extension Alert (Only shows if needed) */}
    {med.needsExtension && (
      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-start gap-2">
          <span className="text-red-600 mt-0.5">⚠️</span>
          <div>
            <p className="text-red-800 text-xs font-bold">Treatment Period Ended</p>
            <p className="text-red-700 text-[10px] leading-tight">
              You missed {med.missedCount} doses. Finish your course?
            </p>
          </div>
        </div>
        <button 
          onClick={() => handleExtend(med._id, med.missedCount)}
          className="whitespace-nowrap px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-lg transition-colors shadow-sm"
        >
          Continue for {med.missedCount} doses
        </button>
      </div>
    )}
  </div>
))}

                {medications.length === 0 && (
                  <div className="text-center py-6 text-gray-400 text-sm">
                    No medications scheduled. Add one below!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Add Button */}
          <div className="flex justify-center mt-6 md:mt-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 text-sm md:text-base cursor-pointer"
            >
              <PiPlusBold /> Add Medication
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-2 mt-2 mb-8 bg-white p-4 rounded-2xl">
        <div className="flex flex-wrap justify-center md:justify-between gap-3 md:gap-6 text-xs md:text-sm font-medium text-gray-500 px-4">
          <div className="flex items-center gap-2 px">
            <span className="w-5 h-5 rounded bg-green-100 flex items-center justify-center text-[10px] text-green-600 border border-green-200">
              M
            </span>{" "}
            Taken
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-red-100 flex items-center justify-center text-[10px] text-red-600 border border-red-200">
              M
            </span>{" "}
            Missed
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-orange-100 flex items-center justify-center text-[10px] text-orange-600 border border-orange-200">
              M
            </span>{" "}
            Take Immediately
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center text-[10px] text-blue-600 border border-blue-200">
              M
            </span>{" "}
            Take later
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 border border-gray-200">
              M
            </span>{" "}
            Don't take
          </div>
        </div>
      </div>

      {/* --- Add Medication Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-6 animate-fade-in-up overflow-y-auto max-h-[95vh]">
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl poppins-semibold text-gray-800 flex items-center gap-2">
                <PiPillFill className="text-blue-500" /> Add New Medicine
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors cursor-pointer"
              >
                <PiXBold />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">
                Medicine Name
              </label>
              <input
                type="text"
                placeholder="e.g. Paracetamol 500mg"
                value={newMed.name}
                onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-700"
                autoFocus
              />
            </div>

            {/* 2. Custom Duration (Days) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-600">
          Treatment Duration (How many days?)
        </label>
        <input
          type="number"
          min="1"
          placeholder="Enter number of days"
          value={newMed.durationDays || ""}
          onChange={(e) => setNewMed({ ...newMed, durationDays: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-700"
        />
      </div>

      {/* 3. Specific Days Selection */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-600">
          Specific Days
        </label>
        <div className="flex flex-wrap gap-2">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
            const isDaySelected = newMed.daysOfWeek?.includes(day);
            return (
              <button
                key={day}
                onClick={() => {
                  const updatedDays = isDaySelected
                    ? newMed.daysOfWeek.filter((d) => d !== day)
                    : [...(newMed.daysOfWeek || []), day];
                  setNewMed({ ...newMed, daysOfWeek: updatedDays });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  isDaySelected
                    ? "bg-blue-100 text-blue-600 border-blue-300 shadow-sm scale-105"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {day.slice(0, 3)}
              </button>
            );
          })}
        </div>
      </div>

            {/* Schedule Selectors */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-600">
                Select Schedule (Click to toggle)
              </label>
              <div className="flex justify-between gap-2">
{["M", "A", "E", "N"].map((slot) => {
  // Check if this slot is currently selected in the newMed state
  const isSelected = newMed.schedule[slot] !== "not-prescribed";
  
  return (
    <button
      key={slot}
      type="button" // Prevents accidental form submission
      onClick={() => handleToggleSlot(slot)} // Uses the correct toggle function
      className={`flex-1 aspect-square rounded-2xl flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 cursor-pointer ${
        isSelected
          ? "bg-blue-100 text-blue-600 border-blue-300 shadow-sm scale-105"
          : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
      }`}
    >
      {slot}
    </button>
  );
})}
              </div>
              <p className="text-xs text-center text-gray-400 mt-1">
                Selected slots will be scheduled as "Take later".
              </p>
            </div>

            <button
              onClick={handleAddSubmit}
              disabled={!newMed.name.trim()}
              className="w-full bg-blue-600 text-white font-medium py-3 rounded-xl mt-2 hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed cursor-pointer"
            >
              Save Medication
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediList;
