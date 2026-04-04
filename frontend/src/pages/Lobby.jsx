import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { io } from "socket.io-client";
import { 
  Activity, 
  X, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  Clock,
  User,
  Stethoscope
} from "lucide-react";

const Lobby = () => {
  const navigate = useNavigate();
  const { speciality } = useParams();
  const { user } = useAuth();
  
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [elapsedTime, setElapsedTime] = useState(0);
  const isDoctor = user?.role === "doctor";
  useEffect(() => {

    const timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    

    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      if (isDoctor) {
        socket.emit("enter-doctor", {
          _id: user._id,
          speciality: user.specialization.toLowerCase(),
          socket: socket.id,
        });
      } else {
        socket.emit("enter-patient", {
          _id: user._id,
          requirement: speciality.toLowerCase(),
          socket: socket.id,
        });
      }
    });

    socket.on("matched", (data) => {
      navigate(`/meeting/${data.roomID}`);
    });

    socket.on("disconnect", () => {
      if (isDoctor) {
        socket.emit("leave-doctor", `Doctor disconnected : ${socket.id} ❌`);
      } else {
        socket.emit("leave-patient", `Patient disconnected : ${socket.id} ❌`);
      }
    });

    return () => {
      clearInterval(timer);
      if (isDoctor) {
        socket.emit("leave-doctor", { _id: user._id, requirement: speciality, socket: socket.id });
      } else {
        socket.emit("leave-patient", { _id: user._id, requirement: speciality, socket: socket.id });
      }
      socket.disconnect();
    };
  }, [navigate, user, speciality, isDoctor]);

  const handleCancel = () => {
    navigate(-1); 
  };

  const handleTryAgain = () => {
    setConnectionStatus("connecting");
    setElapsedTime(0);
    window.location.reload(); 
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  return (
    <div className="min-h-screen bg-[#FAFCFF] font-sans text-gray-900 pt-24 pb-32">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
<<<<<<< HEAD
       
=======
        
>>>>>>> 24bd186c8b62faae10dc7f81cb9fb4278e15ef23
        <div className="mb-10 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-blue-200 bg-blue-50 mb-4">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-[11px] font-bold text-blue-800 tracking-wider uppercase">
                Live Matchmaking
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              Waiting <span className="text-blue-600">Room.</span>
            </h1>
            <p className="text-gray-500 font-medium mt-2 text-[15px] max-w-lg">
              {isDoctor
                ? "Your virtual clinic is open. We are currently routing a patient to your room."
                : "You are in the secure queue. We are finding the best available specialist for you."}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-4 bg-white p-2.5 pr-5 rounded-full border border-slate-200 shadow-sm cursor-default">
            <div className="w-12 h-12 rounded-full bg-linear-to-tr from-slate-800 to-slate-950 flex items-center justify-center text-white font-black text-lg shadow-inner ring-2 ring-white">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : "YA"}
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

        <div className="max-w-lg mx-auto mt-8">
          <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-8 sm:p-12 border border-slate-100 text-center relative overflow-hidden">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-48 bg-blue-50 blur-3xl rounded-full opacity-60 pointer-events-none"></div>

            {connectionStatus === "connecting" && (
              <div className="flex flex-col items-center w-full animate-in fade-in duration-500 relative z-10">

                <div className="relative flex justify-center items-center w-40 h-40 mb-10 mt-2">
                  
                  <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-40" style={{ animationDuration: "2s" }}></div>
                  <div className="absolute inset-4 bg-blue-200 rounded-full animate-ping opacity-50" style={{ animationDelay: "0.5s", animationDuration: "2s" }}></div>
                  <div className="absolute inset-8 bg-blue-300 rounded-full animate-ping opacity-60" style={{ animationDelay: "1s", animationDuration: "2s" }}></div>
                  
                  <div className="relative z-10 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40 ring-4 ring-white">
                    {isDoctor ? (
                      <Stethoscope size={28} className="text-white animate-pulse" />
                    ) : (
                      <User size={28} className="text-white animate-pulse" />
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {isDoctor ? (
                      <>Waiting for <span className="text-blue-600">Patient</span>...</>
                    ) : (
                      <>Finding <span className="text-blue-600 capitalize">{speciality}</span>...</>
                    )}
                  </h2>
                  <p className="text-slate-500 font-medium text-sm px-2">
                    {isDoctor
                      ? `Please hold on. We are connecting you with a patient needing a ${speciality}.`
                      : "Please hold on while we establish a secure connection to an available doctor."}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 mb-10 w-full">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-500">
                    <Clock size={14} className="text-blue-500" />
                    {formatTime(elapsedTime)}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-[11px] font-bold text-emerald-600">
                    <ShieldCheck size={14} />
                    End-to-End Encrypted
                  </div>
                </div>

                <button
                  onClick={handleCancel}
                  className="w-full py-4 px-4 rounded-xl cursor-pointer font-bold text-slate-600 bg-white border-2 border-slate-200 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  {isDoctor ? "Close Clinic" : "Cancel Search"}
                </button>
              </div>
            )}

            {connectionStatus === "failed" && (
              <div className="flex flex-col items-center w-full animate-in zoom-in-95 fade-in duration-300 relative z-10">
                
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8 border-4 border-white shadow-sm ring-1 ring-red-100 mt-4">
                  <AlertCircle size={40} className="text-red-500" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 tracking-tight">
                  {isDoctor ? "No Patients Waiting" : "No Doctors Available"}
                </h2>
                
                <p className="text-slate-500 font-medium text-sm mb-10 px-2">
                  {isDoctor 
                    ? "There are currently no patients in the queue for this specialty. Please try again later."
                    : `All our ${speciality}s are currently busy. Please try again or go back to select another option.`}
                </p>

                <div className="w-full space-y-3">
                  <button
                    onClick={handleTryAgain}
                    className="w-full py-4 px-4 rounded-xl font-black text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={18} />
                    Try Again
                  </button>

                  <button
                    onClick={handleCancel}
                    className="w-full py-4 px-4 rounded-xl font-black text-slate-600 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Lobby;