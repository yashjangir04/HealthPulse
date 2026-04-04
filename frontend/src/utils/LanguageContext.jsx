import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    // Navbar
    home: "Home",
    aboutUs: "About Us",
    signIn: "Sign In",
    getStarted: "Get Started",
    dashboard: "Dashboard",
    signOut: "Sign Out",

    // Sidebar
    profile: "Profile",
    aiHelp: "AI Help",
    reports: "Reports",
    contacts: "Contacts",
    reminder: "Reminder",
    appointments: "Appointments",
    connect: "Connect",
    orders: "Orders",
    myOrders: "My Orders",
    logout: "Logout",
    login: "Login",
    online: "Online",

    // Chat Page
    aiHealthAssistant: "AI Health Assistant",
    chatOnline: "Online",
    chatWelcome: "Hello! I'm your AI Health Assistant. How can I help you today? You can ask me about your prescriptions, schedule, or general health tips.",
    typeMessage: "Type your message...",
    aiDisclaimer: "AI can make mistakes. Please verify important medical information.",

    // Features Section
    coreCapabilities: "Core Capabilities",
    featuresSectionTitle1: "Everything you need for ",
    featuresSectionTitle2: "smarter healthcare.",
    featuresSectionDesc: "Discover our comprehensive suite of AI-powered tools designed to make your health journey more accessible, efficient, and reliable.",
    exploreInsights: "Explore Insights",
    feat1Title: "Record Analysis",
    feat1Desc: "Upload reports, get AI insights, and keep your medical history safely stored.",
    feat2Title: "Doctor Routing",
    feat2Desc: "Automatically connects you to the right general or specialized doctors.",
    feat3Title: "Medicine Reminder",
    feat3Desc: "Never miss a dose with our smart to-do list and active alert system.",
    feat4Title: "Disease Detection",
    feat4Desc: "AI analyzes your symptoms and identifies possible conditions early.",
    feat5Title: "AI Chat Support",
    feat5Desc: "Intelligent assistant checks doctor notes for risks and schedules follow-ups.",
    feat6Title: "Emergency Alerts",
    feat6Desc: "Family members and doctors are instantly notified during high-risk situations.",

    // Footer
    footerDesc: "Empowering your healthcare journey with modern, intuitive, and secure digital health solutions.",
    product: "Product",
    features: "Features",
    pricing: "Pricing",
    caseStudies: "Case studies",
    reviews: "Reviews",
    updates: "Updates",
    support: "Support",
    gettingStarted: "Getting started",
    helpCenter: "Help center",
    serverStatus: "Server status",
    reportBug: "Report a bug",
    chatSupport: "Chat support",
    contactUs: "Contact Us",
    copyright: "Copyright © 2026 HealthPulse. All Rights Reserved.",
    termsConditions: "Terms & Conditions",
    privacyPolicy: "Privacy Policy",

    // Misc
    loading: "Loading...",
  },
  hi: {
    // Navbar
    home: "होम",
    aboutUs: "हमारे बारे में",
    signIn: "साइन इन",
    getStarted: "शुरू करें",
    dashboard: "डैशबोर्ड",
    signOut: "साइन आउट",

    // Sidebar
    profile: "प्रोफाइल",
    aiHelp: "AI सहायता",
    reports: "रिपोर्ट",
    contacts: "संपर्क",
    reminder: "रिमाइंडर",
    appointments: "अपॉइंटमेंट",
    connect: "कनेक्ट",
    orders: "ऑर्डर",
    myOrders: "मेरे ऑर्डर",
    logout: "लॉगआउट",
    login: "लॉगिन",
    online: "ऑनलाइन",

    // Chat Page
    aiHealthAssistant: "AI स्वास्थ्य सहायक",
    chatOnline: "ऑनलाइन",
    chatWelcome: "नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता/सकती हूँ? आप मुझसे अपनी दवाइयों, शेड्यूल या स्वास्थ्य सुझावों के बारे में पूछ सकते हैं।",
    typeMessage: "अपना संदेश लिखें...",
    aiDisclaimer: "AI गलतियाँ कर सकती है। कृपया महत्वपूर्ण चिकित्सा जानकारी की पुष्टि करें।",

    // Features Section
    coreCapabilities: "मुख्य सुविधाएं",
    featuresSectionTitle1: "स्मार्ट स्वास्थ्य सेवा के लिए ",
    featuresSectionTitle2: "सब कुछ आपके पास।",
    featuresSectionDesc: "AI-संचालित टूल्स का हमारा व्यापक सूट खोजें जो आपकी स्वास्थ्य यात्रा को अधिक सुलभ, कुशल और विश्वसनीय बनाने के लिए डिज़ाइन किया गया है।",
    exploreInsights: "अधिक जानें",
    feat1Title: "रिकॉर्ड विश्लेषण",
    feat1Desc: "रिपोर्ट अपलोड करें, AI इनसाइट्स पाएं, और अपना मेडिकल इतिहास सुरक्षित रखें।",
    feat2Title: "डॉक्टर रूटिंग",
    feat2Desc: "स्वचालित रूप से सही सामान्य या विशेषज्ञ डॉक्टरों से जोड़ता है।",
    feat3Title: "दवा रिमाइंडर",
    feat3Desc: "स्मार्ट टू-डू लिस्ट और सक्रिय अलर्ट सिस्टम से कोई खुराक न छूटे।",
    feat4Title: "रोग पहचान",
    feat4Desc: "AI आपके लक्षणों का विश्लेषण करता है और संभावित स्थितियों की जल्दी पहचान करता है।",
    feat5Title: "AI चैट सहायता",
    feat5Desc: "बुद्धिमान सहायक डॉक्टर नोट्स की जाँच करता है और फॉलो-अप शेड्यूल करता है।",
    feat6Title: "आपातकालीन अलर्ट",
    feat6Desc: "उच्च जोखिम स्थितियों में परिवार के सदस्यों और डॉक्टरों को तुरंत सूचित किया जाता है।",

    // Footer
    footerDesc: "आधुनिक, सहज और सुरक्षित डिजिटल स्वास्थ्य समाधानों के साथ आपकी स्वास्थ्य यात्रा को सशक्त बनाना।",
    product: "उत्पाद",
    features: "विशेषताएं",
    pricing: "मूल्य निर्धारण",
    caseStudies: "केस स्टडीज़",
    reviews: "समीक्षाएं",
    updates: "अपडेट",
    support: "सहायता",
    gettingStarted: "शुरू करना",
    helpCenter: "सहायता केंद्र",
    serverStatus: "सर्वर स्थिति",
    reportBug: "बग रिपोर्ट करें",
    chatSupport: "चैट सहायता",
    contactUs: "संपर्क करें",
    copyright: "कॉपीराइट © 2026 HealthPulse। सर्वाधिकार सुरक्षित।",
    termsConditions: "नियम और शर्तें",
    privacyPolicy: "गोपनीयता नीति",

    // Misc
    loading: "लोड हो रहा है...",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const t = (key) => translations[language]?.[key] || translations.en[key] || key;

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "hi" : "en"));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
