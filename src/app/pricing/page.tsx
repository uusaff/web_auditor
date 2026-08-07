import Link from "next/link";
import Image from "next/image";

export default function PricingPage() {
  return (
    <main className="relative min-h-screen w-full text-white font-['var(--font-montserrat)'] flex flex-col items-center justify-center bg-transparent">

      <div className="relative z-10 text-center flex flex-col items-center px-6">
        <h1 className="text-5xl md:text-7xl font-['VictoryStriker'] text-[#ccb999] tracking-widest mb-6">PRICING</h1>
        <p className="text-white/60 font-light max-w-2xl text-lg mb-12">
          Simple, transparent pricing for teams of all sizes. Upgrade your digital footprint today.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          <div className="p-10 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-md flex flex-col items-center">
            <h3 className="text-2xl font-bold tracking-wider mb-2">Basic</h3>
            <div className="text-4xl font-light mb-6">$0 <span className="text-lg text-white/40">/mo</span></div>
            <ul className="text-white/60 text-sm space-y-4 mb-8 text-left w-full">
              <li>✓ Single Page Analysis</li>
              <li>✓ Basic SEO Scoring</li>
              <li>✗ Deep Web Crawling</li>
            </ul>
            <button className="w-full py-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors mt-auto">Current Plan</button>
          </div>
          <div className="p-10 bg-gradient-to-b from-[#ccb999]/20 to-black/40 border border-[#ccb999]/30 rounded-3xl backdrop-blur-md flex flex-col items-center transform md:-translate-y-4 shadow-2xl">
            <h3 className="text-2xl font-bold tracking-wider mb-2 text-[#ccb999]">Pro</h3>
            <div className="text-4xl font-light mb-6">$49 <span className="text-lg text-white/40">/mo</span></div>
            <ul className="text-white/60 text-sm space-y-4 mb-8 text-left w-full">
              <li>✓ Unlimited Deep Crawling</li>
              <li>✓ Advanced AI Code Fixes</li>
              <li>✓ Private Dashboard History</li>
            </ul>
            <button className="w-full py-3 bg-[#ccb999] text-black font-bold rounded-full hover:bg-[#ccb999]/90 transition-colors mt-auto">Upgrade Now</button>
          </div>
        </div>
        <Link href="/" className="mt-16 text-white/40 hover:text-white transition-colors underline underline-offset-4">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
