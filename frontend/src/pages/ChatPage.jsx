import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthContext";
import { Send, Sparkles, User as UserIcon, Loader2, Bot } from "lucide-react";
import { populateDB, resetDB, askQuestion } from "../api/bot";

const INITIAL_MESSAGES = [
  {
    id: "1",
    text: "Hello! I'm your AI Health Assistant. How can I help you today?",
    sender: "ai",
    timestamp: new Date().toISOString(),
  },
];

const ChatPage = () => {
  const { isLoggedIn, user, loading } = useAuth();

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    const initAI = async () => {
      try {
        await populateDB({ personal_info: JSON.stringify(user) });
      } catch (err) {
        console.error("Context Error:", err);
      }
    };

    if (!loading && isLoggedIn && user) initAI();
  }, [loading, isLoggedIn, user]);

  useEffect(() => {
    const handleExit = () => {
      resetDB().catch(() => {});
    };

    window.addEventListener("beforeunload", handleExit);

    return () => {
      window.removeEventListener("beforeunload", handleExit);
      handleExit();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const res = await askQuestion(inputValue);

      const aiMessage = {
        id: Date.now().toString() + "_ai",
        text: res?.answer || "Sorry, I couldn't understand.",
        sender: "ai",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Error getting response.",
          sender: "ai",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-slate-50 pt-24 pb-6 px-4">
      <div className="flex flex-col flex-1 max-w-4xl mx-auto w-full bg-white rounded-3xl shadow-sm border overflow-hidden">

        <div className="p-4 border-b font-bold text-lg flex items-center gap-2">
          <Sparkles className="text-blue-600" />
          AI Health Assistant
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start gap-2 max-w-[70%] ${
                  msg.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div className="p-2 rounded-full bg-white shadow">
                  {msg.sender === "user" ? (
                    <UserIcon size={16} />
                  ) : (
                    <Bot size={16} className="text-blue-600" />
                  )}
                </div>

                <div
                  className={`px-4 py-2 rounded-2xl text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="text-sm text-gray-400">AI is typing...</div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-slate-50 border rounded-2xl p-2 outline-none resize-none"
              rows={1}
              placeholder="Type here..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            <button
              onClick={handleSend}
              className="bg-blue-600 text-white p-3 rounded-xl"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;