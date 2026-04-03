import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const FeatureCard = ({ title, description, imageSrc, altText }) => {
  return (
    <div className="w-full h-full p-2">
      <motion.div
        // --- CLEAN FRAMER HOVER EFFECT ---
        whileHover={{ 
          y: -10,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        className="relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 flex flex-col h-64 sm:h-72 w-full max-w-sm mx-auto group transition-colors duration-300"
      >
        <div className="relative h-full flex flex-col">
          
          {/* Header: Title + Icon */}
          <div className="flex justify-between items-start gap-4 mb-4">
            <h3 className="text-[20px] sm:text-[22px] font-black text-slate-800 leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0 rounded-2xl bg-blue-50/50 group-hover:bg-blue-600 transition-colors duration-300">
              {imageSrc ? (
                <img 
                  src={imageSrc} 
                  alt={altText} 
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain group-hover:brightness-0 group-hover:invert transition-all" 
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-200" />
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-500 text-sm sm:text-[15px] font-medium leading-relaxed line-clamp-3">
            {description}
          </p>

          {/* Footer Action */}
          <div className="mt-auto flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
            Explore Insights
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FeatureCard;