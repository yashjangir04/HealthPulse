import React, { useEffect, useRef } from 'react';
import { Shield, Activity, Store, Zap, HeartPulse, Bot, ArrowRight, Users, Clock, Star, Code2, Cpu, Stethoscope } from 'lucide-react';

const About = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-reveal');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Activity size={28} />,
      title: 'Live Telemedicine',
      desc: 'Connect instantly with specialized doctors through secure, real-time WebRTC meeting rooms. Doctors manage secure prescriptions directly within the consultation.',
      color: 'blue',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
      glow: 'group-hover:shadow-blue-100',
    },
    {
      icon: <Bot size={28} />,
      title: 'Context-Aware AI',
      desc: 'Our AI chatbot provides instant support based strictly on your doctor\'s secure notes and prescription history, ensuring zero medical hallucinations.',
      color: 'teal',
      bg: 'bg-teal-50',
      text: 'text-teal-600',
      border: 'border-teal-100',
      glow: 'group-hover:shadow-teal-100',
    },
    {
      icon: <Store size={28} />,
      title: 'Pharmacy Marketplace',
      desc: 'Stop hunting for medicines. Your prescription is broadcasted to nearby shopkeepers who bid for your order, giving you the best price and pickup distance.',
      color: 'indigo',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      glow: 'group-hover:shadow-indigo-100',
    },
    {
      icon: <Stethoscope size={28} />,
      title: 'HP-ID Verified Doctors',
      desc: 'Every doctor on our platform is verified with a Healthcare Professional ID, ensuring you consult only with registered and trustworthy physicians.',
      color: 'rose',
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
      glow: 'group-hover:shadow-rose-100',
    },
    {
      icon: <Cpu size={28} />,
      title: 'AI Symptom Analysis',
      desc: 'Describe your symptoms via voice or text and our LLM-powered engine intelligently routes you to the right specialist, or a general physician if unsure.',
      color: 'purple',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
      glow: 'group-hover:shadow-purple-100',
    },
    {
      icon: <Code2 size={28} />,
      title: 'Multilingual Support',
      desc: 'Interact with the platform in English or Hindi — our voice assistant understands native Indian languages and responds naturally in your preferred tongue.',
      color: 'amber',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      glow: 'group-hover:shadow-amber-100',
    },
  ];

  const stats = [
    { icon: <Users size={22} />, value: '500+', label: 'Doctors Registered', color: 'text-blue-600' },
    { icon: <Star size={22} />, value: '4.8★', label: 'Average Doctor Rating', color: 'text-yellow-500' },
    { icon: <Clock size={22} />, value: '<2 min', label: 'Average Wait Time', color: 'text-teal-600' },
    { icon: <HeartPulse size={22} />, value: '10K+', label: 'Consultations Done', color: 'text-rose-600' },
  ];

  const team = [
    { name: 'Yash Jangir', role: 'Full Stack & AI Lead', initials: 'YJ', gradient: 'from-blue-500 to-indigo-600' },
    { name: 'Team Kirmada', role: 'Design & Architecture', initials: 'TK', gradient: 'from-teal-500 to-cyan-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-20 overflow-x-hidden">

      <style>{`
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .animate-reveal {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-on-scroll:nth-child(2) { transition-delay: 0.1s; }
        .reveal-on-scroll:nth-child(3) { transition-delay: 0.2s; }
        .reveal-on-scroll:nth-child(4) { transition-delay: 0.3s; }
        .reveal-on-scroll:nth-child(5) { transition-delay: 0.4s; }
        .reveal-on-scroll:nth-child(6) { transition-delay: 0.5s; }
      `}</style>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative bg-white py-20 sm:py-28 px-4 sm:px-8 lg:px-24 border-b border-slate-100 overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">HACKSAGON 2026 Finalist</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
            Decentralizing Healthcare,{' '}
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              Empowering Communities.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            The digital healthcare experience is completely fragmented. We built a platform that unifies the entire pipeline — from secure telemedicine consultations to a real-time bidding marketplace for your prescribed medicines.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/connect"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 shadow-lg shadow-blue-200 hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              See It In Action <ArrowRight size={16} />
            </a>
            <a
              href="/account/register"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="reveal-on-scroll bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm text-center hover:shadow-md transition-shadow"
            >
              <div className={`flex justify-center mb-3 ${stat.color}`}>{stat.icon}</div>
              <p className={`text-2xl sm:text-3xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 reveal-on-scroll">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Full Ecosystem</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">How HealthPulse Works</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((feat, i) => (
              <div
                key={i}
                className={`reveal-on-scroll group bg-white p-6 sm:p-8 rounded-2xl border ${feat.border} shadow-sm hover:shadow-xl ${feat.glow} transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`w-14 h-14 ${feat.bg} rounded-xl flex items-center justify-center mb-6 ${feat.text} transition-transform group-hover:scale-110 duration-300`}>
                  {feat.icon}
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-3">{feat.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH SECTION ── */}
      <section className="bg-slate-900 text-white py-16 sm:py-24 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 opacity-5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-600 opacity-5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="reveal-on-scroll">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">Under The Hood</p>
            <h2 className="text-3xl sm:text-4xl font-black mb-6 leading-tight">
              Built for Speed<br className="hidden sm:block" /> and Security.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mb-8 leading-relaxed">
              Handling sensitive medical data requires a robust architecture. We leverage Socket.IO for live consultation sync, Groq's LLM for AI routing, and Sarvam AI for native multilingual voice responses — all under one unified backend.
            </p>
            <ul className="space-y-4">
              {[
                { icon: <Shield size={20} />, text: 'End-to-End Encrypted Prescriptions' },
                { icon: <Zap size={20} />, text: 'Atomic MongoDB Updates for Fair Bidding' },
                { icon: <HeartPulse size={20} />, text: 'Automated Patient Allergy Verification' },
                { icon: <Bot size={20} />, text: 'RAG-based AI grounded in your medical data' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="text-emerald-400 shrink-0">{item.icon}</span>
                  <span className="text-slate-300 text-sm sm:text-base">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Team Card */}
          <div className="reveal-on-scroll space-y-4">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500 opacity-10 rounded-full blur-2xl" />
              <h3 className="text-xl font-black text-white mb-2 relative z-10">Team Kirmada 🏆</h3>
              <p className="text-slate-400 text-sm leading-relaxed relative z-10 mb-6">
                Built at HACKSAGON 2026. Our mission is to prove that powerful healthcare technology doesn't just belong to massive hospital chains — it belongs in our local communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                {team.map((member, i) => (
                  <div key={i} className="flex-1 flex items-center gap-3 bg-slate-700/50 rounded-xl px-4 py-3 border border-slate-600">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-black text-sm shrink-0`}>
                      {member.initials}
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold leading-tight">{member.name}</p>
                      <p className="text-slate-400 text-xs">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech stack badges */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {['React', 'Node.js', 'MongoDB', 'Socket.IO', 'ZegoCloud', 'Groq AI', 'Sarvam AI', 'ChromaDB', 'Flask'].map((tech) => (
                  <span key={tech} className="px-3 py-1 text-xs font-bold bg-slate-700 text-slate-300 rounded-full border border-slate-600">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16 sm:py-20 px-4 sm:px-8 text-center text-white">
        <div className="max-w-3xl mx-auto reveal-on-scroll">
          <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">Ready to experience better healthcare?</h2>
          <p className="text-blue-100 text-base sm:text-lg mb-8 font-medium">
            Join thousands of patients already connecting with verified doctors on HealthPulse.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/account/register"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-black text-blue-700 bg-white hover:bg-blue-50 shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Create Free Account
            </a>
            <a
              href="/connect"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-black text-white border-2 border-white/40 hover:bg-white/10 transition-all"
            >
              Find a Doctor Now
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;