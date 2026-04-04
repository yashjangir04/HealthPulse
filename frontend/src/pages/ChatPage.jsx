import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthContext";
import { Send, Bot, Sparkles, User as UserIcon, Loader2 } from "lucide-react";
import { populateDB, resetDB, askQuestion } from "../api/bot"; // Ensure resetDB is imported

const INITIAL_MESSAGES = [
  {
    id: "1",
    text: "Hello! I'm your AI Health Assistant. How can I help you today? You can ask me about your prescriptions, schedule, or general health tips.",
    sender: "ai",
    timestamp: new Date().toISOString(),
  },
];

const ChatPage = () => {
  const { isLoggedIn, loading, user } = useAuth();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleExit = () => {

      resetDB().catch((err) => console.error("Failed to reset DB on exit:", err));
    };

    window.addEventListener("beforeunload", handleExit);

    return () => {
      window.removeEventListener("beforeunload", handleExit);
      handleExit();
    };
  }, []); 

  useEffect(() => {
    if (loading) return;

    if (isLoggedIn) {
      callExtraAPI();
    }
  }, [loading, isLoggedIn]);

  const callExtraAPI = async () => {
    try {
      const response = await populateDB({
        personal_info: JSON.stringify(user),
      });
    } catch (err) {
      console.error("Extra API failed:", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;

    const newUserMsg = {
      id: Date.now().toString(),
      text: userText,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await askQuestion({ question: userText });

      const data = response.data;

      const newAiMsg = {
        id: (Date.now() + 1).toString(),
        text: data.response || "Sorry, I couldn't process that response.",
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, newAiMsg]);

    } catch (error) {
      console.error("Failed to fetch AI response:", error);

      const errorMessage = error.response?.data?.error || "I'm having trouble connecting to the server right now. Please try again later.";

      const errorMsg = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 pt-20 lg:pt-24 pb-6 px-4 sm:px-6 lg:px-8">

      <div className="flex flex-col flex-1 max-w-4xl mx-auto w-full bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg leading-tight">AI Health Assistant</h2>
              <p className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scroll-smooth">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";

            return (
              <div
                key={msg.id}
                className={`flex gap-4 max-w-[85%] ${
                  isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >

                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm mt-1 ${
                  isUser ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-blue-600"
                }`}>
                  {isUser ? <UserIcon size={16} /> : <Bot size={18} />}
                </div>

                <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-5 py-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 mt-1.5 px-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-4 max-w-[80%] mr-auto animate-in fade-in zoom-in duration-300">
              <div className="shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm text-blue-600 mt-1">
                <Bot size={18} />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <form
            onSubmit={handleSendMessage}
            className="flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-3xl p-2 pl-4 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all shadow-sm"
          >
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none outline-none text-[15px] text-slate-800 placeholder:text-slate-400 py-2.5"
              rows={1}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="shrink-0 w-11 h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl flex items-center justify-center transition-colors shadow-sm disabled:shadow-none"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-3">
             <p className="text-[10px] font-medium text-slate-400">
               AI can make mistakes. Please verify important medical information.
             </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ChatPage;