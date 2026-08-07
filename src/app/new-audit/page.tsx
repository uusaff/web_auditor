"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewAuditPage() {
  const [url, setUrl] = useState("");
  const [isDeepCrawl, setIsDeepCrawl] = useState(false);
  const router = useRouter();

  const handleAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = `https://${url}`;
    }
    
    const encodedUrl = encodeURIComponent(finalUrl);
    router.push(`/audit/${encodedUrl}?deep=${isDeepCrawl}`);
  };

  return (
    <main className="relative min-h-screen w-full text-white font-['var(--font-montserrat)'] flex flex-col bg-transparent pt-[20vh]">
      
      <div className="relative z-10 flex-1 w-full flex flex-col items-center px-6">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-['VictoryStriker'] text-[#ccb999] tracking-widest mb-4">LAUNCH NEW AUDIT</h1>
          <p className="text-white/60 font-light tracking-wide max-w-xl mx-auto">
            Deploy our autonomous agents to map your architecture, bypass enterprise security, and generate actionable code fixes.
          </p>
        </div>

        {/* Search Input Area */}
        <div className="w-full max-w-[700px] flex flex-col items-center">
          <form onSubmit={handleAudit} className="w-full">
            <input
              type="text"
              placeholder="Enter Your Website URL (i.e Apple.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full h-14 md:h-[60px] rounded-[30px] bg-[#2a302a]/60 backdrop-blur-md border border-white/10 text-white placeholder:text-white/80 text-center text-base md:text-lg font-light focus:outline-none focus:ring-2 focus:ring-white/30 transition-all shadow-2xl"
              required
            />
          </form>
          
          <div className="mt-8 flex items-center justify-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md cursor-pointer hover:bg-black/60 transition-colors" onClick={() => setIsDeepCrawl(!isDeepCrawl)}>
            <div className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${isDeepCrawl ? 'bg-sky-500' : 'bg-white/20'}`}>
              <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-md transform transition-transform ${isDeepCrawl ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            <span className="text-xs font-light tracking-[0.1em] text-white/80">
              Deep Crawl <span className="text-white/40">(Analyzes multiple pages, takes ~20s)</span>
            </span>
          </div>
        </div>

      </div>
    </main>
  );
}
