import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const VOICE_API = "http://127.0.0.1:5501/api/voice-command";

const VoiceAssistant = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [showStatus, setShowStatus] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  // Auto-hide status bubble after 4s
  useEffect(() => {
    if (showStatus) {
      const t = setTimeout(() => setShowStatus(false), 4000);
      return () => clearTimeout(t);
    }
  }, [showStatus]);

  const flash = (msg) => {
    setStatusText(msg);
    setShowStatus(true);
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const handleToggle = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    // Start recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        flash("Processing your command...");

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const form = new FormData();
        form.append("audio", blob, "command.webm");

        try {
          const res = await fetch(VOICE_API, { method: "POST", body: form });
          const data = await res.json();

          if (!res.ok) throw new Error(data.error || "Server error");

          flash(data.message || "Navigating...");

          if (data.action === "navigate" && data.path) {
            // If chatMessage exists, pass it + the language via router state
            if (data.chatMessage) {
              navigate(data.path, {
                state: {
                  voiceQuery: data.chatMessage,
                  detectedLanguage: data.detectedLanguage || "hi",
                },
              });
            } else {
              navigate(data.path);
            }
          }
        } catch (err) {
          console.error("Voice command error:", err);
          flash(err.message || "Failed to process command");
        } finally {
          setIsProcessing(false);
          stopStream();
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      flash("Listening... speak now");
    } catch (err) {
      console.error("Mic access denied:", err);
      flash("Please allow microphone access");
    }
  };

  return (
    <>
      {/* Status bubble */}
      {showStatus && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 24,
            zIndex: 999999,
            background: "rgba(15,23,42,0.9)",
            backdropFilter: "blur(12px)",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 14,
            fontSize: 13,
            fontWeight: 600,
            maxWidth: 260,
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            animation: "fadeInUp 0.3s ease",
          }}
        >
          {statusText}
        </div>
      )}

      {/* Floating mic button */}
      <button
        onClick={handleToggle}
        disabled={isProcessing}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 999999,
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "none",
          cursor: isProcessing ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 22,
          boxShadow: isRecording
            ? "0 0 0 6px rgba(239,68,68,0.35), 0 8px 30px rgba(239,68,68,0.4)"
            : "0 8px 30px rgba(59,130,246,0.4)",
          background: isRecording
            ? "linear-gradient(135deg, #ef4444, #dc2626)"
            : isProcessing
            ? "linear-gradient(135deg, #94a3b8, #64748b)"
            : "linear-gradient(135deg, #3b82f6, #2563eb)",
          transition: "all 0.3s ease",
          animation: isRecording ? "pulse 1.5s infinite" : "none",
        }}
      >
        {isProcessing ? (
          <FaSpinner style={{ animation: "spin 1s linear infinite" }} />
        ) : isRecording ? (
          <FaMicrophoneSlash />
        ) : (
          <FaMicrophone />
        )}
      </button>

      {/* Inline keyframes */}
      <style>{`
        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          70%  { box-shadow: 0 0 0 18px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default VoiceAssistant;
