import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const FeatureCard = ({ title, description, imageSrc, altText }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  // Dynamic light source tracking for the shimmer effect
  const lightX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const lightY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (event) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: '1200px' }} className="w-full h-full p-2 group">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          background: "linear-gradient(white, white) padding-box, linear-gradient(135deg, rgba(96,165,250,0.4), rgba(67,56,202,0.4)) border-box",
        }}
        className="relative bg-white/80 backdrop-blur-2xl p-8 rounded-[3rem] border-[1.5px] border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)] flex flex-col justify-between cursor-pointer overflow-hidden transition-all duration-500 h-64 sm:h-72 w-full max-w-sm mx-auto group"
      >
        {/* Holographic Spotlight Effect */}
        <motion.div
          style={{
            background: useTransform(
              [lightX, lightY],
              ([lx, ly]) => `radial-gradient(circle at ${lx}% ${ly}%, rgba(99,102,241,0.15) 0%, transparent 60%)`
            ),
          }}
          className="absolute inset-0 pointer-events-none z-0"
        />

        <div className="z-10 relative h-full flex flex-col">
          {/* Header: Title + Elevated Icon */}
          <div className="flex justify-between items-start gap-4 mb-4">
            <h3 
              className="text-[20px] sm:text-[23px] font-[900] text-slate-800 leading-[1.2] tracking-tight group-hover:text-blue-600 transition-colors duration-300"
              style={{ transform: 'translateZ(40px)' }}
            >
              {title}
            </h3>
            
            {/* Sunken Icon Well */}
            <div 
              className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0 rounded-2xl bg-slate-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-slate-100 relative overflow-visible"
              style={{ transform: 'translateZ(20px)' }}
            >
              {imageSrc ? (
                <img 
                  src={imageSrc} 
                  alt={altText} 
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-6" 
                  style={{ 
                    mixBlendMode: 'multiply',
                    transform: 'translateZ(50px)' // Pops the image above the well
                  }}
                />
              ) : (
                <div className="w-full h-full rounded-xl border-2 border-dashed border-slate-200" />
              )}
            </div>
          </div>

          {/* Description */}
          <p 
            className="text-slate-500 text-sm sm:text-[15px] font-medium leading-relaxed line-clamp-3 group-hover:text-slate-600 transition-colors duration-300 pr-2"
            style={{ transform: 'translateZ(30px)' }}
          >
            {description}
          </p>

          {/* Footer Action Hint */}
          <div 
            className="mt-auto flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0"
            style={{ transform: 'translateZ(45px)' }}
          >
            Explore Insights
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Ambient Bottom Glow */}
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </motion.div>
    </div>
  );
};

export default FeatureCard;