import Link from "next/link";
import Image from "next/image";

export default function EnterprisePage() {
  return (
    <main className="relative min-h-screen w-full text-white font-['var(--font-montserrat)'] flex flex-col items-center justify-center bg-transparent">

      <div className="relative z-10 text-center flex flex-col items-center px-6 max-w-3xl">
        <div className="w-20 h-20 bg-sky-500/20 rounded-full flex items-center justify-center mb-8 border border-sky-500/30">
          <svg className="w-10 h-10 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 className="text-5xl md:text-7xl font-['VictoryStriker'] text-white tracking-widest mb-6">ENTERPRISE</h1>
        <p className="text-white/60 font-light text-lg mb-12">
          Scale your auditing capabilities with custom SLAs, dedicated infrastructure, and seamless API integrations. We build bespoke AI solutions for Fortune 500 companies.
        </p>
        <button className="px-10 py-4 bg-sky-600 text-white font-bold rounded-full hover:bg-sky-500 transition-colors shadow-[0_0_20px_rgba(2,132,199,0.4)]">
          Contact Sales
        </button>
        <Link href="/" className="mt-12 text-white/40 hover:text-white transition-colors underline underline-offset-4">
          Return to Application
        </Link>
      </div>
    </main>
  );
}
