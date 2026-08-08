"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const PLANS = [
  { name: "Free Trial", monthly: 0, annual: 0, desc: "Predict bottlenecks and optimize team" },
  { name: "Business", monthly: 299, annual: 239, desc: "Predict bottlenecks and optimize team", popular: true },
  { name: "Enterprise", monthly: 999, annual: 799, desc: "Predict bottlenecks and optimize team" },
];

const FEATURES = [
  { label: "Streamline up to five workflows.", avail: [true, true, true] },
  { label: "Manage project tasks effectively.", avail: [true, true, true] },
  { label: "Dashboard with real-time updates.", avail: [true, true, true] },
  { label: "Get easy notifications and reminders.", avail: [true, true, true] },
  { label: "Basic email support available.", avail: [true, true, false] },
  { label: "10 GB of file storage.", avail: [false, true, false] },
];

const FAQS = [
  { q: "Is there a free trial available?", a: "Yes! You can try it free with full access to core features. No credit card is required to start your trial & no complex setup needed." },
  { q: "Can I upgrade or downgrade my plan later?", a: "Yes, you can change your plan at any time from your account settings. Changes take effect on your next billing cycle." },
  { q: "Is my data safe and secure?", a: "All data is encrypted in transit and at rest, with regular backups and access controls in place." },
  { q: "Can my team collaborate within the platform?", a: "Yes, every paid plan includes shared workspaces, roles, and permissions for team collaboration." },
  { q: "How can I get support if I encounter an issue?", a: "Reach out through in-app chat or email — response times depend on your plan tier." },
];

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5 text-white">
    <path d="M4 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CrossIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5 text-white/40">
    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planName: string) => {
    if (planName === "Free Trial") {
      window.location.href = "/new-audit";
      return;
    }
    
    if (!user) {
      alert("Please log in to upgrade your plan.");
      return;
    }

    setLoadingPlan(planName);
    try {
      const idToken = await user.getIdToken();
      
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          plan: planName,
          isAnnual
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to initiate checkout");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <main className="relative min-h-screen w-full text-white font-['var(--font-montserrat)'] flex flex-col items-center bg-transparent pt-12 md:pt-20">
      
      {/* HERO SECTION */}
      <section className="text-center px-6 max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-white/70 mb-6">
          <div className="w-2 h-2 rounded-full bg-[#1c3021]"></div>
          Pricing Plan
        </div>
        <h1 className="text-5xl md:text-7xl font-['VictoryStriker'] text-[#1c3021] tracking-widest mb-6 uppercase">
          Explore Our Affordable Pricing!
        </h1>
        <p className="text-white/60 font-light text-lg mb-10 max-w-2xl mx-auto">
          Discover tools built to simplify tasks, reduce friction, and keep your creative momentum flowing.
        </p>

        {/* BILLING TOGGLE */}
        <div className="inline-flex items-center p-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
          <button 
            onClick={() => setIsAnnual(false)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${!isAnnual ? 'bg-[#1c3021] text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setIsAnnual(true)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${isAnnual ? 'bg-[#1c3021] text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
          >
            Annual
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${isAnnual ? 'bg-white/20 text-white' : 'bg-[#1c3021]/30 text-[#ccb999]'}`}>
              Save 20%
            </span>
          </button>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1100px] mx-auto px-6 mb-24 items-start w-full">
        {PLANS.map((plan, i) => (
          <div key={i} className={`flex flex-col p-6 md:p-8 rounded-[24px] backdrop-blur-md transition-all ${plan.popular ? 'bg-gradient-to-b from-[#1c3021]/40 to-black/60 border border-[#1c3021] shadow-2xl md:-translate-y-4' : 'bg-black/40 border border-white/10'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-lg font-bold ${plan.popular ? 'text-[#ccb999]' : 'text-white'}`}>{plan.name}</span>
              {plan.popular && <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-[#1c3021] text-white">Popular</span>}
            </div>
            <p className="text-white/50 text-sm mb-6">{plan.desc}</p>
            <div className="flex items-end gap-1.5 mb-8">
              <span className="text-5xl font-bold font-['var(--font-montserrat)'] tracking-tighter">
                ${isAnnual ? plan.annual : plan.monthly}
              </span>
              <span className="text-white/50 text-sm pb-1.5">/ Month</span>
            </div>
            <button 
              onClick={() => handleSubscribe(plan.name)}
              disabled={loadingPlan === plan.name}
              className={`w-full py-3.5 rounded-full text-sm font-bold transition-colors mb-8 ${plan.popular ? 'bg-[#1c3021] text-white hover:bg-[#1c3021]/80' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'} ${loadingPlan === plan.name ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loadingPlan === plan.name ? "Processing..." : (plan.name === "Free Trial" ? "Start For Free" : "Upgrade Now")}
            </button>
            <span className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Features Included</span>
            <ul className="flex flex-col gap-3">
              {FEATURES.map((feat, j) => {
                const isOn = feat.avail[i];
                return (
                  <li key={j} className={`flex items-start gap-3 text-sm ${isOn ? 'text-white/80' : 'text-white/30'}`}>
                    <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${isOn ? 'bg-[#1c3021]' : 'bg-white/10'}`}>
                      {isOn ? <CheckIcon /> : <CrossIcon />}
                    </div>
                    {feat.label}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>

      {/* COMPARISON TABLE */}
      <section className="w-full max-w-[1100px] mx-auto px-6 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-white/70 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#1c3021]"></div>
            Compare Plan
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-['VictoryStriker'] text-[#1c3021] tracking-wider uppercase">Discover The Best Coaching Plan</h2>
          <p className="text-white/60 text-sm max-w-lg mx-auto">The efficiency of starting projects and improves teamwork.</p>
        </div>

        <div className="border border-white/10 rounded-3xl overflow-hidden bg-black/20 backdrop-blur-sm overflow-x-auto shadow-2xl">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-8 w-1/3">
                  <div className="text-sm font-bold text-white/80 mb-2">Features</div>
                  <div className="text-xs text-white/40 font-normal">Choose the perfect plan tailored to your team's size.</div>
                </th>
                {PLANS.map((plan, i) => (
                  <th key={i} className="p-8 text-center w-[22%]">
                    <div className="text-sm font-bold text-white/80 mb-2">{plan.name}</div>
                    <div className="text-2xl font-bold text-[#ccb999]">
                      ${isAnnual ? plan.annual : plan.monthly} <span className="text-xs text-white/40 font-normal">/ Month</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feat, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="p-6 text-sm text-white/80">{feat.label}</td>
                  {feat.avail.map((isOn, j) => (
                    <td key={j} className="p-6 text-center">
                      <div className={`mx-auto w-5 h-5 rounded-full flex items-center justify-center ${isOn ? 'bg-[#1c3021]' : 'bg-white/10'}`}>
                        {isOn ? <CheckIcon /> : <CrossIcon />}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="w-full max-w-3xl mx-auto px-6 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-white/70 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#1c3021]"></div>
            FAQ
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-['VictoryStriker'] text-[#1c3021] tracking-wider uppercase">Frequently Asked Questions</h2>
          <p className="text-white/60 text-sm max-w-lg mx-auto">Got Questions? Here's Everything You Need to Know About Getting Started</p>
        </div>

        <div className="flex flex-col gap-4">
          {FAQS.map((faq, i) => {
            const isOpen = openFaqIndex === i;
            return (
              <div key={i} className="border border-white/10 rounded-2xl bg-black/40 backdrop-blur-sm overflow-hidden transition-all hover:border-white/20">
                <button 
                  onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#1c3021] shrink-0"></div>
                    <span className="font-semibold text-white/90 text-sm md:text-base">{faq.q}</span>
                  </div>
                  <svg 
                    className={`w-5 h-5 text-white/40 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <p className="px-6 pb-6 pt-0 text-sm text-white/50 pl-12 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="w-full max-w-5xl mx-auto px-6 mb-24">
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-12 md:p-16 text-center backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1c3021]/20 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">

            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-['VictoryStriker'] text-[#ccb999] tracking-wider uppercase">Latest Updates & Insights</h2>
            <p className="text-white/60 text-sm max-w-lg mx-auto mb-10">Discover the Stories, Tips, and Insights That Matter Most</p>

            <form onSubmit={(e) => e.preventDefault()} className="flex items-center max-w-md mx-auto bg-black/40 border border-white/10 rounded-full p-1.5 shadow-2xl">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-transparent border-none text-white text-sm px-5 py-3 outline-none placeholder:text-white/30"
                required
              />
              <button type="submit" className="px-6 py-3 rounded-full bg-[#1c3021] hover:bg-[#1c3021]/80 text-white text-sm font-bold transition-colors">
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </section>
      
    </main>
  );
}
