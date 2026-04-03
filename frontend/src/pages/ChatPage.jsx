import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthContext";
import { Send, Bot, Sparkles, User as UserIcon, Loader2 } from "lucide-react";

const INITIAL_MESSAGES = [
  {
    id: "1",
    text: "Hello! I'm your AI Health Assistant. How can I help you today?",
    sender: "ai",
    timestamp: new Date().toISOString(),
  },
];

const ChatPage = () => {
  const { loading } = useAuth();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="flex flex-col h-screen bg-slate-50 pt-24 pb-6 px-4">
      <div className="flex flex-col flex-1 max-w-4xl mx-auto w-full bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b font-bold text-lg flex items-center gap-2"><Sparkles className="text-blue-600"/> AI Health Assistant</div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        
        </div>
        <div className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <textarea className="flex-1 bg-slate-50 border rounded-2xl p-2 outline-none" rows={1} placeholder="Type here..." />
            <button className="bg-blue-600 text-white p-3 rounded-xl"><Send size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;