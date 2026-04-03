import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FeatureCard from "./featureCard";

import recordAnalysisGraphic from "../assets/Record_Analysis.png";
import doctorRoutingGraphic from "../assets/Doctor_Routing.png";
import medicineReminderGraphic from "../assets/Medicine_Reminder.png";
import diseaseDetectionGraphic from "../assets/Disease_Detection.png";
import aiChatGraphic from "../assets/AI_Chat_Support.png";
import emergencyAlertsGraphic from "../assets/Emergency_Alerts.png";

// Custom Health Plus SVG
const HealthPlusIcon = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <path 
      d="M12 4V20M20 12H4" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const InteractiveFeatureCard = ({ item, cardVariants }) => {
  const [isHovered, setIsHovered] = useState(false);

  const hoverParticles = useMemo(() => {
    const colors = [
      "text-emerald-300", 
      "text-green-400", 
      "text-teal-300", 
      "text-emerald-500", 
      "text-lime-400"
    ];
    
    return Array.from({ length: 20 }).map((_, i) => {

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 160 + 100;
      
      return {
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 14 + 10,
        xDrift: Math.cos(angle) * distance,
        yDrift: Math.sin(angle) * distance - 40,
        duration: Math.random() * 1.2 + 1.2,
        delay: Math.random() * 1.5,
        rotation: Math.random() * 360,
      };
    });
  }, []);

  return (
    <motion.div 
      variants={cardVariants} 
      className="relative flex justify-center h-full w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0">
        <AnimatePresence>
          {isHovered && hoverParticles.map((p) => (
            <motion.div
              key={p.id}
              className={`absolute top-1/2 left-1/2 ${p.color}`}
              style={{ 
                width: p.size, 
                height: p.size, 
                marginLeft: -p.size / 2, 
                marginTop: -p.size / 2 
              }}
              initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
              animate={{
                opacity: [0, 0.8, 0], 
                scale: [0.5, 1.2, 0.6], 
                x: [0, p.xDrift], 
                y: [0, p.yDrift], 
                rotate: [0, p.rotation], 
              }}
              exit={{ opacity: 0, scale: 0, transition: { duration: 0.3 } }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeOut",
              }}
            >
              <HealthPlusIcon className="w-full h-full drop-shadow-md" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="relative z-10 w-full h-full transition-transform duration-300 ease-out hover:-translate-y-2">
        <FeatureCard
          title={item.title}
          description={item.description}
          imageSrc={item.imageSrc}
          altText={item.title}
        />
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      title: "Record Analysis",
      description: "Upload reports, get AI insights, and keep your medical history safely stored.",
      imageSrc: recordAnalysisGraphic,
    },
    {
      title: "Doctor Routing",
      description: "Automatically connects you to the right general or specialized doctors.",
      imageSrc: doctorRoutingGraphic,
    },
    {
      title: "Medicine Reminder",
      description: "Never miss a dose with our smart to-do list and active alert system.",
      imageSrc: medicineReminderGraphic,
    },
    {
      title: "Disease Detection",
      description: "AI analyzes your symptoms and identifies possible conditions early.",
      imageSrc: diseaseDetectionGraphic,
    },
    {
      title: "AI Chat Support",
      description: "Intelligent assistant checks doctor notes for risks and schedules follow-ups.",
      imageSrc: aiChatGraphic,
    },
    {
      title: "Emergency Alerts",
      description: "Family members and doctors are instantly notified during high-risk situations.",
      imageSrc: emergencyAlertsGraphic,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 12 } 
    },
  };

  const healthParticles = useMemo(() => {
    const colors = [
      "text-emerald-300", 
      "text-green-400", 
      "text-teal-300", 
      "text-emerald-500", 
      "text-lime-400"
    ];
    
    return Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 16 + 10,
      duration: Math.random() * 8 + 8,
      delay: Math.random() * -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      xDrift: (Math.random() - 0.5) * 60,
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <section className="relative z-10 w-full py-20 lg:py-28 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden bg-white">

      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {healthParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute ${particle.color} opacity-0`}
            style={{
              left: particle.left,
              width: particle.size,
              height: particle.size,
              bottom: "-10%",
            }}
            animate={{
              y: [0, -1500],
              x: [0, particle.xDrift, -particle.xDrift, 0], 
              opacity: [0, 0.4, 0.6, 0], 
              rotate: [particle.rotation, particle.rotation + 90] 
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <HealthPlusIcon className="w-full h-full drop-shadow-sm" />
          </motion.div>
        ))}
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[-5%] w-75 h-75 bg-blue-100/50 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-100 h-100 bg-indigo-50/60 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        <div className="mb-16 md:mb-20 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6 shadow-sm backdrop-blur-sm">
             <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600"></span>
             <span className="text-sm font-bold text-blue-700 tracking-wide uppercase">Core Capabilities</span>
             <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600"></span>
          </div>
          
          <h2 className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[54px] font-black text-gray-900 leading-[1.15] tracking-tight max-w-3xl mb-6">
            Everything you need for{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
              smarter healthcare.
            </span>
          </h2>
          
          <p className="text-lg text-gray-500 font-medium max-w-2xl leading-relaxed">
            Discover our comprehensive suite of AI-powered tools designed to make your health journey more accessible, efficient, and reliable.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-10 md:gap-y-12"
        >
          {features.map((item, index) => (
            <InteractiveFeatureCard 
              key={index} 
              item={item} 
              cardVariants={cardVariants} 
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturesSection;