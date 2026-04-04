import { useState, useEffect, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Float } from "@react-three/drei";
import { ArrowRight, Sparkles, MessageSquare } from "lucide-react";

import vector1 from "../assets/blob1.png";
import vector2 from "../assets/blob2.png";
import Heart from "../components/Heart";

const words = ["trusted", "accessible", "empowering", "digital"];

// --- Custom component for automatic & mouse-tracked rotation ---
function InteractiveModel({ children }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // 1. Get mouse coordinates relative to the canvas (-1 to 1)
    const targetX = (state.pointer.x * Math.PI) / 4; 
    const targetY = (state.pointer.y * Math.PI) / 4;

    // 2. Add base continuous rotation (speed 0.5) + the mouse offset
    const expectedY = (time * 0.5) + targetX;
    
    // 3. Smoothly interpolate the rotation so it glides naturally
    groupRef.current.rotation.y += (expectedY - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.05;
  });

  return <group ref={groupRef}>{children}</group>;
}

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Handle the text rotation effect
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
      
      {/* Background HTML Elements (Safely OUTSIDE the Canvas) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={vector2}
          alt="blob"
          className="absolute top-[-10%] left-[-10%] w-75 md:w-125 opacity-60 mix-blend-multiply blur-3xl animate-blob"
        />
        <img
          src={vector1}
          alt="blob"
          className="absolute bottom-[-10%] right-[-5%] w-75 md:w-150 opacity-60 mix-blend-multiply blur-3xl animate-blob animation-delay-2000"
        />
        <div className="absolute top-[20%] right-[20%] w-50 h-50 bg-indigo-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
        
        {/* Left Side: UI & Text Content */}
        <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left pt-10 lg:pt-0">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm mb-8 transition-transform hover:scale-105 cursor-pointer">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-sm font-semibold text-blue-800">Transforming Rural Healthcare</span>
          </div>

          <h1 className="font-black leading-[1.15] tracking-tight text-[42px] sm:text-[56px] md:text-[68px] lg:text-[76px] xl:text-[84px] text-gray-900 mb-6">
            Your{" "}
            <div className="inline-grid grid-cols-1 grid-rows-1 align-bottom">
              <span
                className={`col-start-1 row-start-1 bg-linear-to-r from-blue-600 via-indigo-600 to-blue-600 bg-size-[200%_auto] bg-clip-text text-transparent animate-gradient transition-all duration-500 ease-out pb-2
                ${visible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 -translate-y-4 blur-sm"}`}
              >
                {words[index]}
              </span>
            </div>
            <br />
            Health Partner.
          </h1>

          <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mb-10 leading-relaxed">
            Empowering communities with accessible, AI-driven healthcare insights and reliable medical support right at your fingertips.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-[0_8px_25px_-8px_rgba(79,70,229,0.6)] hover:shadow-[0_12px_35px_-8px_rgba(79,70,229,0.7)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="w-full sm:w-auto px-8 py-4 text-base font-bold text-gray-700 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:border-blue-100 hover:bg-blue-50/50 hover:text-blue-700 transition-all duration-300">
              How it works
            </button>
          </div>

          <div className="mt-12 w-full max-w-md lg:max-w-sm">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border border-white rounded-2xl shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <MessageSquare size={20} className="animate-pulse" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-gray-900">Not feeling well?</span>
                    <span className="text-xs font-medium text-blue-600 flex items-center gap-1">
                      Talk to our AI Assistant <Sparkles size={12} />
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: 3D Canvas */}
        <div className="relative w-full lg:w-[45%] h-100 md:h-125 lg:h-175 flex items-center justify-center mt-10 lg:mt-0">
          <div className="absolute inset-0 bg-linear-to-tr from-blue-100/40 to-indigo-50/40 rounded-full blur-3xl -z-10 transform scale-75"></div>
          
          {/* Strictly 3D elements inside the Canvas */}
          <Canvas camera={{ position: [0, 0, 9], fov: 45 }} className="w-full h-full drop-shadow-2xl">
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
            <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#4f46e5" />
            
            <Suspense fallback={null}>
              <Environment preset="city" />
              <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1.5}>
                {/* The Heart is wrapped in the interactive tracker */}
                <InteractiveModel>
                  <Heart scale={1.8} />
                </InteractiveModel>
              </Float>
              <ContactShadows 
                position={[0, -1.5, 0]} 
                opacity={0.4} 
                scale={10} 
                blur={2.5} 
                far={4} 
                color="#1e1b4b"
              />
            </Suspense>
          </Canvas>
        </div>
        
      </div>
    </div>
  );
}