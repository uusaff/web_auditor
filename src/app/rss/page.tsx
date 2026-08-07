import Link from "next/link";
import Image from "next/image";

export default function RssPage() {
  return (
    <main className="relative min-h-screen w-full text-white font-['var(--font-montserrat)'] flex flex-col items-center justify-center bg-transparent">

      <div className="relative z-10 text-center flex flex-col items-center px-6 max-w-3xl">
        <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mb-8 border border-orange-500/30">
          <svg className="w-10 h-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </div>
        <h1 className="text-5xl md:text-7xl font-['VictoryStriker'] text-white tracking-widest mb-6">RSS FEED</h1>
        <p className="text-white/60 font-light text-lg mb-12">
          Subscribe to our RSS feed to get real-time updates on new algorithm optimizations, feature drops, and the latest web performance best practices directly to your favorite reader.
        </p>
        <button className="px-10 py-4 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-500 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.4)]">
          Copy XML Link
        </button>
        <Link href="/" className="mt-12 text-white/40 hover:text-white transition-colors underline underline-offset-4">
          Return to Hub
        </Link>
      </div>
    </main>
  );
}
