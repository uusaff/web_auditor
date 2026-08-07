import Link from "next/link";
import Image from "next/image";

export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen w-full text-white font-['var(--font-montserrat)'] flex flex-col items-center justify-center bg-transparent">

      <div className="relative z-10 text-center flex flex-col items-center px-6">
        <h1 className="text-5xl md:text-7xl font-['VictoryStriker'] text-[#1c3021] tracking-widest mb-6">FEATURES</h1>
        <p className="text-white/60 font-light max-w-2xl text-lg mb-12">
          Discover how our autonomous AI agents crawl, analyze, and optimize every aspect of your digital footprint with unprecedented precision.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          {[
            { title: "Deep Crawling", desc: "Our engine traverses your entire sitemap to find hidden architectural flaws." },
            { title: "AI Code Fixes", desc: "Don't just find errors. Get the exact code snippets needed to resolve them instantly." },
            { title: "Performance Profiling", desc: "Simulate load times and render trees to guarantee a lightning-fast user experience." }
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-md hover:bg-white/5 transition-all">
              <h3 className="text-xl font-bold tracking-wider mb-4">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
        <Link href="/" className="mt-16 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-colors">
          Return Home
        </Link>
      </div>
    </main>
  );
}
