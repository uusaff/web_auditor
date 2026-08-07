"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loginWithGoogle, logout, loading } = useAuth();

  return (
    <main className="relative min-h-screen w-full text-white font-['var(--font-montserrat)'] flex flex-col bg-transparent">

      {/* Hero Content Area */}
      <div className="relative z-10 flex-1 w-full flex flex-col items-center pt-[18vh] px-6">
        
        {/* Typographic Hero */}
        <div className="flex flex-col items-center w-full max-w-[1200px] mt-4 md:mt-12">
          <h1 
            className="flex justify-between w-full text-[22vw] md:text-[260px] font-bold leading-[0.8] text-[#1c3021] font-['VictoryStriker'] uppercase"
            style={{ 
              textShadow: "4px 4px 10px rgba(0,0,0,0.15), 1px 1px 2px rgba(255,255,255,0.2)",
              transform: "scaleY(1.15)", 
              transformOrigin: "bottom"
            }}
          >
            {"PERFECTION".split("").map((char, index) => (
              <span key={index}>{char}</span>
            ))}
          </h1>
          
          <div className="w-full relative h-16 md:h-20 mt-4">
            <h2 className="absolute right-[5%] md:right-[2%] top-0 text-3xl md:text-5xl font-light tracking-[0.2em] text-[#ccb999]">
              IS A COMPUTATION
            </h2>
          </div>
        </div>

        {/* Brief Intro */}
        <div className="mt-auto mb-10 w-full max-w-3xl flex flex-col items-center text-center px-4">
          <p className="text-white/80 font-light text-lg md:text-xl leading-relaxed tracking-wide">
            A context-aware diagnostic engine that goes beyond basic scanners. We deeply map your architecture, bypass enterprise security walls, and generate exact, copy-pasteable code patches to engineer a flawless digital experience.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-[15vh] w-full max-w-[700px] flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            href="/about"
            className="w-full sm:w-auto text-center bg-transparent border border-white/20 hover:border-white/50 hover:bg-white/5 text-white/90 px-8 py-4 rounded-full font-light tracking-widest transition-all text-sm uppercase"
          >
            Want to know us?
          </Link>
          <Link 
            href="/new-audit"
            className="w-full sm:w-auto text-center bg-[#ccb999] hover:bg-[#e0cba8] text-black px-8 py-4 rounded-full font-bold tracking-widest transition-all shadow-[0_0_20px_rgba(204,185,153,0.2)] text-sm uppercase"
          >
            Try our web auditor
          </Link>
        </div>
      </div>
    </main>
  );
}
