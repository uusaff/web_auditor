"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";
import Link from "next/link";
import ScoreGrid from "@/components/dashboard/ScoreGrid";
import AiSuggestions from "@/components/dashboard/AiSuggestions";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function AuditDashboard() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isDeepCrawl = searchParams?.get('deep') === 'true';
  const rawUrl = params?.url as string;
  const decodedUrl = rawUrl && rawUrl !== 'undefined' ? decodeURIComponent(rawUrl) : "apple.com";
  
  // Clean up URL for display (remove https:// or http://)
  const displayUrl = decodedUrl.replace(/^https?:\/\//, '');
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Initializing Engine...');
  const [error, setError] = useState<string | null>(null);
  const { user, loginWithGoogle, logout, loading: authLoading } = useAuth();
  const { openRouterKey, scrapingDepth, domSanitization } = useSettings();
  
  const componentRef = useRef(null);
  
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Audit-Report-${displayUrl}`,
  });

  useEffect(() => {
    async function fetchAudit() {
      try {
        const response = await fetch('/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            url: decodedUrl, 
            deepCrawl: isDeepCrawl,
            userId: user?.uid,
            openRouterKey,
            scrapingDepth,
            domSanitization
          })
        });
        
        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          throw new Error(errData?.details || errData?.error || 'Failed to audit website');
        }
        
        const result = await response.json();
        setData(result);

        // Track in user history if logged in
        if (user) {
          try {
            const historyId = decodedUrl.replace(/[^a-zA-Z0-9]/g, '_');
            await setDoc(doc(db, "users", user.uid, "history", historyId), {
              url: decodedUrl,
              timestamp: Date.now()
            });
          } catch (e) {
            console.error("Failed to save to user history:", e);
          }
        }

      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    // We can only run this if auth is loaded, to make sure user context is correct
    if (!authLoading) {
      fetchAudit();
    }
  }, [decodedUrl, user, authLoading, isDeepCrawl]);

  useEffect(() => {
    if (!loading) return;
    const texts = [
      'Initializing Headless Engine...',
      'Bypassing Security Firewalls...',
      'Scraping DOM & Render Tree...',
      'Aggregating Audit Metrics...',
      'Running OpenRouter AI Analysis...',
      'Finalizing Report...'
    ];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= texts.length - 1) {
        clearInterval(interval);
        setLoadingText(texts[texts.length - 1]);
      } else {
        setLoadingText(texts[i]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <main className="relative min-h-screen w-full text-white font-['var(--font-montserrat)'] flex flex-col bg-transparent">
      {/* Dashboard Content */}
      <div ref={componentRef} className="relative z-10 flex-1 w-full max-w-[1400px] mx-auto pt-12 px-6 md:px-12 pb-24 flex flex-col gap-12 overflow-y-auto print:pt-4 print:pb-0">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <h2 className="text-lg md:text-xl font-light tracking-[0.2em] text-[#ccb999] uppercase mb-2">
              Audit Report
            </h2>
            <h1 className="text-4xl md:text-6xl font-normal tracking-wide text-white/90 truncate max-w-2xl font-['VictoryStriker'] leading-normal pt-2">
              {displayUrl}
            </h1>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-4 mb-2">
              <button 
                onClick={() => handlePrint()}
                className="no-print flex items-center gap-2 px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-xs font-bold tracking-widest uppercase transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Export PDF
              </button>
              <span className="text-sm font-light tracking-[0.1em] text-white/70 uppercase">
                Overall Health
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              {loading ? (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-white/10 animate-pulse mt-2" />
              ) : (
                <>
                  <span className="text-7xl md:text-8xl font-normal font-['VictoryStriker'] text-white drop-shadow-md">
                    {data?.overall_health || 0}
                  </span>
                  <span className="text-2xl md:text-3xl text-white/50 font-light">
                    /100
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        {error ? (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-8 text-center text-red-200">
            <h3 className="text-xl mb-2 font-bold">Audit Failed</h3>
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Scores & Visuals */}
            <div className="lg:col-span-1 flex flex-col gap-8">
              <div className="bg-[#121a14]/40 backdrop-blur-md border border-white/10 rounded-[30px] p-8 shadow-2xl">
                <h3 className="text-sm font-light tracking-[0.2em] text-white/80 uppercase mb-8 text-center">
                  Core Metrics
                </h3>
                <ScoreGrid scores={data?.scores || []} loading={loading} />
              </div>

              <div className="bg-[#121a14]/40 backdrop-blur-md border border-white/10 rounded-[30px] p-8 shadow-2xl flex flex-col">
                <h3 className="text-sm font-light tracking-[0.2em] text-white/80 uppercase mb-6 text-center">
                  Visual Preview
                </h3>
                <div className="w-full aspect-video bg-black/40 rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-center">
                  {/* Browser Header Bar */}
                  <div className="absolute z-10 top-0 w-full h-8 bg-black/60 flex items-center px-4 gap-2 border-b border-white/5 backdrop-blur-sm">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  </div>
                  
                  {loading && !data?.screenshotBase64 ? (
                    <div className="absolute inset-0 w-full h-full pt-8 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ccb999]/10 to-transparent animate-pulse" />
                      <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
                        <svg className="w-8 h-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-white/40 font-light tracking-[0.2em] uppercase text-xs text-center px-4 transition-all duration-500">
                          {loadingText}
                        </span>
                      </div>
                    </div>
                  ) : data?.screenshotBase64 ? (
                    <img 
                      src={`data:image/jpeg;base64,${data.screenshotBase64}`} 
                      alt={`Screenshot of ${decodedUrl}`}
                      className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500 pt-8"
                    />
                  ) : (
                    <span className="text-white/30 font-light tracking-[0.2em] uppercase text-sm mt-6 text-center px-4">
                      Preview not available
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: AI Suggestions */}
            <div className="lg:col-span-2">
              <div className="bg-[#121a14]/40 backdrop-blur-md border border-white/10 rounded-[30px] p-8 md:p-12 shadow-2xl h-full">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                  <h3 className="text-lg md:text-xl font-light tracking-[0.2em] text-[#ccb999] uppercase">
                    AI Optimization Plan
                  </h3>
                  <span className="px-4 py-1.5 bg-black/40 border border-white/10 rounded-full text-xs md:text-sm tracking-wider text-white/70">
                    {loading ? 'Scanning...' : `${data?.suggestions?.length || 0} Issues Found`}
                  </span>
                </div>
                <AiSuggestions suggestions={data?.suggestions || []} loading={loading} />
              </div>
            </div>
            
          </div>
        )}
      </div>
    </main>
  );
}
