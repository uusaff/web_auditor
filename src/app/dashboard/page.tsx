"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function UserDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Fetch history
  useEffect(() => {
    async function fetchHistory() {
      if (!user) return;
      try {
        const q = query(
          collection(db, "users", user.uid, "history"),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const items: any[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setHistory(items);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (user) {
      fetchHistory();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#101b13] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-sky-400/30 border-t-sky-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full text-white font-['var(--font-montserrat)'] flex flex-col bg-transparent">
      {/* Dashboard Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-['VictoryStriker'] tracking-wide mb-4">YOUR AUDIT HISTORY</h1>
          <p className="text-white/60 font-light">View all the websites you've successfully analyzed.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse border border-white/10"></div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-sky-400/20 bg-[#101b13]/40 text-center mx-auto mt-8 w-full max-w-2xl">
            <div className="w-12 h-12 rounded-full bg-sky-400/10 flex items-center justify-center text-sky-400 mb-4 text-2xl">
              🔍
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">No audits performed yet</h3>
            <p className="text-sm text-gray-400 max-w-sm mb-6">
              Scan your first web app to unlock UX, performance, and accessibility insights.
            </p>
            <Link
              href="/new-audit"
              className="bg-sky-400 hover:bg-sky-500 text-black font-medium px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Run Your First Scan
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item) => (
              <Link 
                href={`/audit/${encodeURIComponent(item.url)}`} 
                key={item.id}
                className="group relative h-48 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex flex-col p-6 hover:bg-white/10 transition-all hover:border-white/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#101b13] to-transparent opacity-50"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="text-xs font-light text-white/40 mb-2">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                  <h3 className="text-2xl font-['VictoryStriker'] tracking-wide truncate mt-auto">
                    {item.url.replace(/^https?:\/\//, '')}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-sky-400 font-medium">View Report</span>
                    <svg className="w-5 h-5 text-sky-400 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
