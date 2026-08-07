"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function AboutPage() {
  const { user, loginWithGoogle, logout, loading: authLoading } = useAuth();

  const fadeIn: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <>
      {/* SEO Meta Data for the head (Next.js 13+ standard would be metadata export in layout/page, but for client component we can just use title if needed or rely on a layout wrapper. Here we inject basic standard meta for client side) */}
      <title>About AI Auditor | Advanced Technical SEO & AI Code Fixes</title>
      <meta name="description" content="AI Auditor by Usaf's Creations maps your architecture, bypasses enterprise security, and generates exact code fixes." />

      <main className="relative min-h-screen w-full text-white font-['var(--font-montserrat)'] flex flex-col bg-transparent">
        {/* Content Container */}
        <div className="relative z-10 flex-1 w-full max-w-[1200px] mx-auto px-6 md:px-12 py-24 pb-32">
          
          {/* 1. The Hero Section (The Hook) */}
          <motion.header 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex flex-col items-center text-center mb-32"
          >
            <h1 
              className="flex justify-between w-full text-[15vw] md:text-[180px] font-bold leading-[0.8] text-[#ccb999] font-['VictoryStriker'] uppercase mt-4 mb-8"
              style={{ 
                textShadow: "4px 4px 10px rgba(0,0,0,0.5), 1px 1px 2px rgba(255,255,255,0.2)",
                transform: "scaleY(1.15)", 
                transformOrigin: "bottom"
              }}
            >
              {"ABOUT US".split("").map((char, index) => (
                <span key={index}>{char === " " ? "\u00A0" : char}</span>
              ))}
            </h1>
            <h2 className="text-2xl md:text-3xl text-white font-light tracking-[0.2em] uppercase mb-6">
              Beyond Basic Scanners
            </h2>
            <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-4xl mx-auto tracking-wide">
              AI Auditor by Usaf's Creations doesn’t just tell you what’s broken. We map your architecture, bypass enterprise security, and generate exact, copy-pasteable code fixes to engineer a flawless web experience.
            </p>
          </motion.header>

          {/* 2. The Core Pillars (Feature Grid) */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-32"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Deep-Crawl AI Engine",
                  desc: "Most scanners stop at the front door. Our engine crawls up to three layers deep into your architecture, mapping internal linking structures and analyzing DOM context exactly like a human engineer would."
                },
                {
                  title: "Context-Aware Intelligence",
                  desc: "Rule-based SEO is dead. Powered by advanced LLMs, AI Auditor analyzes your site's unique branding, layout, and user experience, delivering prioritized, context-aware insights rather than generic warnings."
                },
                {
                  title: "Instant AI Code Fixes",
                  desc: "We bridge the gap between auditing and engineering. Instead of simply flagging a contrast issue, we generate the exact React or HTML/Tailwind code snippet needed to fix it—ready to be dropped straight into your codebase."
                },
                {
                  title: "Enterprise-Grade Scraping",
                  desc: "Security walls shouldn't block your diagnostics. Utilizing Playwright and headless browser technology with dynamic User-Agents, our stealth-mode scrapers effortlessly bypass enterprise bot-protection like Cloudflare."
                },
                {
                  title: "Client-Ready Pitch Decks",
                  desc: "Built for agencies and freelancers. With a single click, transform complex technical audits into stunning, dark-mode PDF pitch decks designed to close deals and impress prospective clients."
                },
                {
                  title: "Historical Health Tracking",
                  desc: "Backed by secure Google Authentication and Firebase infrastructure, your private dashboard maintains a continuous ledger of past audits, allowing you to track performance optimizations and regressions over time."
                }
              ].map((feature, i) => (
                <motion.article 
                  key={i} 
                  variants={fadeIn}
                  className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <h3 className="text-xl font-bold tracking-widest text-white mb-4 uppercase text-sm text-[#ccb999]">{feature.title}</h3>
                  <p className="text-white/60 font-light leading-relaxed text-sm">{feature.desc}</p>
                </motion.article>
              ))}
            </div>
          </motion.section>

          {/* 3. The Philosophy (Why We Win) */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="mb-32 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent blur-3xl -z-10 rounded-[100px]" />
            <div className="bg-[#121a14]/60 border border-white/10 backdrop-blur-xl rounded-[40px] p-10 md:p-16">
              <h2 className="text-3xl md:text-5xl font-['VictoryStriker'] tracking-widest text-[#ccb999] mb-8">
                We Provide Solutions, Not Just Symptoms
              </h2>
              <div className="space-y-6 text-white/70 font-light leading-relaxed md:text-lg">
                <p>
                  Legacy tools like Lighthouse and Ahrefs run on rigid, outdated rule sets. They hand you a list of abstract problems—"Your buttons lack contrast" or "Word count is low"—and leave you to figure out the rest.
                </p>
                <p>
                  AI Auditor was built to act as a senior developer looking over your shoulder. When we find a UI flaw, we don't just flag it; we provide the exact <code className="bg-black/40 text-orange-400 px-2 py-1 rounded mx-1 text-sm">&lt;button className="bg-white text-black"&gt;</code> fix. By feeding raw DOM structures directly into an advanced AI, we understand the context of your application, separate crucial blocking issues from optional tweaks, and give you the actionable intelligence needed to deploy faster.
                </p>
              </div>
            </div>
          </motion.section>

          {/* 4. The Vision (Roadmap) */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeIn} className="text-4xl md:text-6xl font-['VictoryStriker'] tracking-widest text-center text-white mb-16">
              The Future of Automated Auditing
            </motion.h2>

            <div className="space-y-8 max-w-4xl mx-auto relative">
              {/* Timeline Line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#ccb999] via-white/10 to-transparent -translate-x-1/2" />

              {[
                {
                  phase: "Phase 1",
                  title: "One-Click GitHub Integration",
                  desc: "Closing the loop between audit and deployment. Soon, clicking 'Apply AI Fix' will automatically connect to your repository and open a Pull Request with the corrected code, entirely eliminating manual patching."
                },
                {
                  phase: "Phase 2",
                  title: "Scheduled Automated Audits",
                  desc: "Continuous integration for your SEO and UX. Add your production URL, and our engine will run automated Sunday-night crawls, alerting you Monday morning if a weekend deployment caused a health score regression."
                },
                {
                  phase: "Phase 3",
                  title: "Competitor Benchmarking Intelligence",
                  desc: "Enter your URL alongside a rival's. The AI will cross-analyze both architectures, generating a targeted battle plan detailing exactly what they are doing better—from load speeds to keyword density—and how to engineer a superior experience."
                }
              ].map((item, i) => (
                <motion.article 
                  key={i} 
                  variants={fadeIn}
                  className={`flex flex-col md:flex-row gap-8 items-start relative z-10 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="flex-1 w-full" />
                  
                  {/* Timeline Node */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-black border-2 border-[#ccb999] -translate-x-1/2 mt-6 shadow-[0_0_15px_rgba(204,185,153,0.5)]" />
                  
                  <div className={`flex-1 w-full pl-16 md:pl-0 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 text-left'}`}>
                    <div className="bg-black/40 border border-white/5 backdrop-blur-sm rounded-3xl p-8 hover:border-[#ccb999]/30 transition-colors">
                      <span className="text-[#ccb999] text-xs font-bold tracking-widest uppercase mb-2 block">{item.phase}</span>
                      <h3 className="text-xl font-bold tracking-wide text-white mb-4">{item.title}</h3>
                      <p className="text-white/50 font-light text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>

        </div>
      </main>
    </>
  );
}
