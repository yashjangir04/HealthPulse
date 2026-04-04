import React from "react";
import FeatureCard from "./featureCard";
import { useLanguage } from "../utils/LanguageContext";

import recordAnalysisGraphic from "../assets/Record_Analysis.png";
import doctorRoutingGraphic from "../assets/Doctor_Routing.png";
import medicineReminderGraphic from "../assets/Medicine_Reminder.png";
import diseaseDetectionGraphic from "../assets/Disease_Detection.png";
import aiChatGraphic from "../assets/AI_Chat_Support.png";
import emergencyAlertsGraphic from "../assets/Emergency_Alerts.png";

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

const InteractiveFeatureCard = ({ item }) => {
  return (
    <div className="relative flex justify-center h-full w-full">
      <div className="relative z-10 w-full h-full">
        <FeatureCard
          title={item.title}
          description={item.description}
          imageSrc={item.imageSrc}
          altText={item.title}
        />
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      title: t("feat1Title"),
      description: t("feat1Desc"),
      imageSrc: recordAnalysisGraphic,
    },
    {
      title: t("feat2Title"),
      description: t("feat2Desc"),
      imageSrc: doctorRoutingGraphic,
    },
    {
      title: t("feat3Title"),
      description: t("feat3Desc"),
      imageSrc: medicineReminderGraphic,
    },
    {
      title: t("feat4Title"),
      description: t("feat4Desc"),
      imageSrc: diseaseDetectionGraphic,
    },
    {
      title: t("feat5Title"),
      description: t("feat5Desc"),
      imageSrc: aiChatGraphic,
    },
    {
      title: t("feat6Title"),
      description: t("feat6Desc"),
      imageSrc: emergencyAlertsGraphic,
    },
  ];

  return (
    <section className="relative z-10 w-full py-20 lg:py-28 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden bg-white">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[-5%] w-75 h-75 bg-blue-100/50 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-100 h-100 bg-indigo-50/60 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        <div className="mb-16 md:mb-20 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6 shadow-sm backdrop-blur-sm">
             <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600"></span>
             <span className="text-sm font-bold text-blue-700 tracking-wide uppercase">{t("coreCapabilities")}</span>
             <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600"></span>
          </div>
          
          <h2 className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[54px] font-black text-gray-900 leading-[1.15] tracking-tight max-w-3xl mb-6">
            {t("featuresSectionTitle1")}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
              {t("featuresSectionTitle2")}
            </span>
          </h2>
          
          <p className="text-lg text-gray-500 font-medium max-w-2xl leading-relaxed">
            {t("featuresSectionDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-10 md:gap-y-12">
          {features.map((item, index) => (
            <InteractiveFeatureCard 
              key={index} 
              item={item} 
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;