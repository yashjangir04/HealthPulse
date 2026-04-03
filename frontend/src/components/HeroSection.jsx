import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, MessageSquare } from "lucide-react";

// ✅ IMPORT YOUR ASSETS (IMPORTANT)
import vector1 from "../assets/blob1.png"; // change if .png
import vector2 from "../assets/blob2.png";

const words = ["trusted", "accessible", "empowering", "digital"];

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setVisible(true);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-[#FAFCFF]">
      
      {/* Background Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={vector2}
          alt="blob"
          className="absolute top-[-10%] left-[-10%] w-72 md:w-96 opacity-60 mix-blend-multiply blur-3xl"
        />
        <img
          src={vector1}
          alt="blob"
          className="absolute bottom-[-10%] right-[-5%] w-72 md:w-96 opacity-60 mix-blend-multiply blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">

        <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left pt-10 lg:pt-0">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm mb-8 hover:scale-105 transition cursor-pointer">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-sm font-semibold text-blue-800">
              Transforming Rural Healthcare
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-black leading-[1.15] tracking-tight text-[42px] sm:text-[56px] md:text-[68px] lg:text-[76px] text-gray-900 mb-6">
            Your{" "}
            <span
              className={`bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent transition-all duration-500
              ${visible ? "opacity-100" : "opacity-0"}`}
            >
              {words[index]}
            </span>
            <br />
            Health Partner.
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mb-10 leading-relaxed">
            Empowering communities with accessible, AI-driven healthcare insights
            and reliable medical support right at your fingertips.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg hover:-translate-y-1 transition flex items-center justify-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>

            <button className="w-full sm:w-auto px-8 py-4 text-base font-bold text-gray-700 bg-white border-2 border-gray-100 rounded-2xl hover:bg-blue-50 transition">
              How it works
            </button>
          </div>

          {/* Card */}
          <div className="mt-12 w-full max-w-md">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25"></div>

              <div className="relative flex items-center justify-between px-6 py-4 bg-white border rounded-2xl shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <MessageSquare size={20} />
                  </div>

                  <div>
                    <span className="text-sm font-semibold text-gray-900 block">
                      Not feeling well?
                    </span>
                    <span className="text-xs text-blue-600 flex items-center gap-1">
                      Talk to AI <Sparkles size={12} />
                    </span>
                  </div>
                </div>

                <ArrowRight size={16} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}