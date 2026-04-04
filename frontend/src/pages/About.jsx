import React from 'react';
import { Shield, Activity, Store, Zap, HeartPulse, Bot } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-24 inter-regular">
      
      <section className="bg-white py-20 px-6 sm:px-12 lg:px-24 border-b border-slate-200">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl inter-bold text-slate-900 tracking-tight mb-6">
            Decentralizing Healthcare, <br className="hidden md:block" />
            <span className="text-blue-600">Empowering Local Pharmacies.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            The digital healthcare experience is completely fragmented. We built a platform that unifies the entire pipeline—from secure telemedicine consultations to a real-time bidding marketplace for your prescribed medicines.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl inter-bold text-slate-900 mb-4">How Our Ecosystem Works</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
              <Activity size={28} />
            </div>
            <h3 className="text-xl inter-bold text-slate-900 mb-3">Live Telemedicine</h3>
            <p className="text-slate-600">
              Connect instantly with specialized doctors through secure, real-time WebRTC meeting rooms. Doctors manage secure prescriptions directly within the consultation.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6 text-teal-600">
              <Bot size={28} />
            </div>
            <h3 className="text-xl inter-bold text-slate-900 mb-3">Context-Aware AI</h3>
            <p className="text-slate-600">
              Our integrated AI chatbot provides instant support based strictly on your doctor's secure notes and prescription history, ensuring zero medical hallucinations.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
              <Store size={28} />
            </div>
            <h3 className="text-xl inter-bold text-slate-900 mb-3">Pharmacy Marketplace</h3>
            <p className="text-slate-600">
              Stop hunting for medicines. Your prescription is broadcasted to nearby shopkeepers who bid for your order, giving you the best price and pickup distance.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white py-16 px-6 sm:px-12 lg:px-24 mt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl inter-bold mb-6">Built for Speed and Security</h2>
            <p className="text-slate-300 text-lg mb-6 leading-relaxed">
              Handling sensitive medical data requires a robust architecture. We leverage hybrid cloud infrastructure to ensure persistent, real-time connections for critical consultations, while using stateless serverless endpoints for our high-traffic marketplace bidding.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Shield className="text-emerald-400" size={24} />
                <span className="text-slate-200">End-to-End Encrypted Prescriptions</span>
              </li>
              <li className="flex items-center gap-3">
                <Zap className="text-emerald-400" size={24} />
                <span className="text-slate-200">Atomic MongoDB Updates for Fair Bidding</span>
              </li>
              <li className="flex items-center gap-3">
                <HeartPulse className="text-emerald-400" size={24} />
                <span className="text-slate-200">Automated Patient Allergy Verification</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-500 opacity-10 rounded-full blur-3xl"></div>
            
            <h3 className="text-xl inter-bold text-white mb-4 z-10 relative">Team Kirmada</h3>
            <p className="text-slate-400 z-10 relative">
              This platform was engineered as part of the HACKSAGON 2026 finals. Our goal is to prove that powerful technology doesn't just belong to massive hospital chains—it belongs in our local communities, connecting real people with the care and medicine they need.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;