"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, getDocs, limit, orderBy, doc, getDoc } from 'firebase/firestore';

export default function SettingsPage() {
  const { user, loading, logout } = useAuth();
  const { 
    openRouterKey, setOpenRouterKey,
    scrapingDepth, setScrapingDepth,
    domSanitization, setDomSanitization,
    exportFormat, setExportFormat
  } = useSettings();
  
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'engine' | 'usage' | 'security'>('engine');
  
  const [auditHistory, setAuditHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [activating, setActivating] = useState(false);
  const [activateMsg, setActivateMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Fetch Audit History when Usage tab is active
    if (activeTab === 'usage' && user && auditHistory.length === 0) {
      const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
          const q = query(
            collection(db, 'users', user.uid, 'history'),
            orderBy('createdAt', 'desc'),
            limit(10)
          );
          const snap = await getDocs(q);
          const historyData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setAuditHistory(historyData);
        } catch (e) {
          console.error("Failed to fetch history:", e);
        } finally {
          setHistoryLoading(false);
        }
      };
      fetchHistory();
    }
  }, [activeTab, user, auditHistory.length]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ccb999]"></div>
      </div>
    );
  }

  const handlePasswordReset = async () => {
    if (!user.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      alert("Password reset email sent!");
    } catch (error) {
      console.error("Error sending reset email", error);
      alert("Failed to send reset email.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm("Are you sure? This action is irreversible.");
    if (!confirm) return;
    try {
      await deleteUser(user);
      alert("Account deleted.");
      router.push('/');
    } catch (error) {
      console.error("Error deleting account", error);
      alert("Failed to delete account. You may need to log in again to perform this action.");
    }
  };

  const tabs = [
    { id: 'engine', label: 'Engine & API' },
    { id: 'usage', label: 'Usage & Quotas' },
    { id: 'security', label: 'Account & Security' }
  ] as const;

  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2" role="tablist">
        <h1 className="font-victory text-3xl mb-6 text-white tracking-wider">SETTINGS</h1>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-left px-4 py-3 rounded-xl transition-all duration-300 font-montserrat font-medium ${
              activeTab === tab.id 
                ? 'bg-[#1c3021] text-[#ccb999] border-l-4 border-[#ccb999]' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-h-[500px]">
        <div className="bg-[#101b13]/80 backdrop-blur-xl border border-[#ccb999]/20 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden h-full">
          
          <AnimatePresence mode="wait">
            
            {/* ENGINE & API TAB */}
            {activeTab === 'engine' && (
              <motion.div 
                key="engine"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="font-victory text-2xl text-white tracking-wide mb-2">Engine & API Controls</h2>
                  <p className="text-gray-400 font-montserrat text-sm mb-6">Manage how the AI Auditor executes headless scraping and communicates with the LLM.</p>
                </div>

                <div className="space-y-6 max-w-2xl">
                  {/* API KEY */}
                  <div>
                    <label htmlFor="openrouter-key" className="block text-sm font-medium text-gray-300 mb-2 font-montserrat">OpenRouter API Key (BYOK)</label>
                    <input 
                      id="openrouter-key"
                      type="password" 
                      value={openRouterKey}
                      onChange={(e) => setOpenRouterKey(e.target.value)}
                      placeholder="sk-or-v1-..."
                      className="w-full bg-black/50 border border-gray-700 focus:border-[#ccb999] text-white rounded-lg px-4 py-3 font-mono transition-colors outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">Leave blank to use the system default key (subject to strict rate limits).</p>
                  </div>

                  {/* SCRAPING DEPTH */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-gray-800">
                    <div>
                      <label htmlFor="scraping-depth" className="block text-white font-medium font-montserrat">Scraping Depth</label>
                      <p className="text-sm text-gray-400">Full page uses heavily compressed screenshots but captures more layout data.</p>
                    </div>
                    <select 
                      id="scraping-depth"
                      value={scrapingDepth}
                      onChange={(e) => setScrapingDepth(e.target.value as "viewport" | "full")}
                      className="bg-black border border-gray-700 text-white rounded-lg px-4 py-2 outline-none focus:border-[#ccb999]"
                    >
                      <option value="viewport">Viewport Only (Fast)</option>
                      <option value="full">Full Page (Thorough)</option>
                    </select>
                  </div>

                  {/* DOM SANITIZATION */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-gray-800">
                    <div>
                      <h3 className="text-white font-medium font-montserrat">DOM Sanitization</h3>
                      <p className="text-sm text-gray-400">Aggressively strip &lt;script&gt; and &lt;style&gt; tags before sending to LLM.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={domSanitization}
                        onChange={(e) => setDomSanitization(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1c3021]"></div>
                    </label>
                  </div>

                  {/* EXPORT FORMAT */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-gray-800">
                    <div>
                      <label htmlFor="export-format" className="block text-white font-medium font-montserrat">Default Export Format</label>
                      <p className="text-sm text-gray-400">Preferred format when downloading audit reports.</p>
                    </div>
                    <select 
                      id="export-format"
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value as any)}
                      className="bg-black border border-gray-700 text-white rounded-lg px-4 py-2 outline-none focus:border-[#ccb999]"
                    >
                      <option value="dashboard">Dashboard UI</option>
                      <option value="json">Raw JSON</option>
                      <option value="pdf">Formatted PDF (Pro)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* USAGE & QUOTAS TAB */}
            {activeTab === 'usage' && (
              <motion.div 
                key="usage"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="font-victory text-2xl text-white tracking-wide mb-2">Usage & Quotas</h2>
                  <p className="text-gray-400 font-montserrat text-sm mb-6">Monitor your multimodal token usage and access past audits.</p>
                </div>

                {/* Progress Bar (Mocked) */}
                <div className="p-6 rounded-xl bg-gradient-to-r from-[#1c3021] to-black border border-[#1c3021]">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <h3 className="text-white font-medium">Monthly Token Allowance</h3>
                      <p className="text-xs text-gray-400 mt-1">Reset in 14 days</p>
                    </div>
                    <span className="text-[#ccb999] font-medium font-mono text-xl">45%</span>
                  </div>
                  <div className="w-full bg-black/50 rounded-full h-2.5 border border-gray-800 mt-4 overflow-hidden">
                    <div className="bg-[#ccb999] h-2.5 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-right">450k / 1M Tokens Used</p>
                </div>

                {/* Audit History Log */}
                <div>
                  <h3 className="text-white font-medium font-montserrat mb-4">Recent Audit History</h3>
                  
                  {historyLoading ? (
                    <div className="animate-pulse flex flex-col gap-3" aria-busy="true">
                      {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-lg w-full" aria-hidden="true"></div>)}
                    </div>
                  ) : auditHistory.length === 0 ? (
                    <div className="text-center py-12 bg-black/30 rounded-lg border border-dashed border-gray-700">
                      <p className="text-gray-500">No audits found in your history.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-gray-400">
                        <thead className="text-xs text-gray-500 uppercase bg-black/50">
                          <tr>
                            <th className="px-4 py-3 rounded-tl-lg">URL</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Score</th>
                            <th className="px-4 py-3 text-right rounded-tr-lg">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {auditHistory.map((audit, i) => (
                            <tr key={audit.id} className={`border-b border-gray-800 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                              <td className="px-4 py-4 font-medium text-white truncate max-w-[200px]">{audit.url}</td>
                              <td className="px-4 py-4 whitespace-nowrap">{new Date(audit.createdAt).toLocaleDateString()}</td>
                              <td className="px-4 py-4">
                                <span className="px-2 py-1 bg-[#1c3021] text-green-400 rounded-md text-xs font-bold">{audit.overall_health}</span>
                              </td>
                              <td className="px-4 py-4 text-right">
                                <button 
                                  onClick={async () => {
                                    try {
                                      // Fetch the full heavy document from the global cache
                                      const fullDocRef = doc(db, 'audits', audit.reportRef);
                                      const fullDocSnap = await getDoc(fullDocRef);
                                      if (fullDocSnap.exists()) {
                                        const fullData = fullDocSnap.data();
                                        const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `audit-${audit.url.replace(/[^a-z0-9]/gi, '_')}.json`;
                                        a.click();
                                      } else {
                                        alert("Full audit report is no longer available in the cache.");
                                      }
                                    } catch (e) {
                                      console.error("Failed to download full audit:", e);
                                      alert("Error downloading JSON.");
                                    }
                                  }}
                                  className="text-xs text-[#ccb999] hover:text-white transition-colors"
                                >
                                  Download JSON
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ACCOUNT & SECURITY TAB */}
            {activeTab === 'security' && (
              <motion.div 
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8 flex flex-col h-full"
              >
                <div>
                  <h2 className="font-victory text-2xl text-white tracking-wide mb-2">Account & Security</h2>
                  <p className="text-gray-400 font-montserrat text-sm mb-6">Manage your profile, authentication, and security preferences.</p>
                </div>

                {/* Profile Settings */}
                <div className="flex items-center gap-6 p-6 bg-black/30 rounded-xl border border-gray-800">
                  <div className="w-20 h-20 rounded-full bg-[#1c3021] border-2 border-[#ccb999] flex items-center justify-center text-2xl text-[#ccb999] font-bold">
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-medium">{user?.displayName || 'User'}</h3>
                    <p className="text-gray-400">{user?.email}</p>
                    <button className="mt-2 text-sm text-[#ccb999] hover:text-white transition-colors">Edit Profile</button>
                  </div>
                </div>

                {/* Auth Actions */}
                <div className="space-y-4">
                  <button 
                    onClick={handlePasswordReset}
                    className="w-full text-left p-4 rounded-lg bg-black/30 border border-gray-800 hover:border-gray-600 transition-colors flex justify-between items-center group"
                  >
                    <div>
                      <h4 className="text-white font-medium group-hover:text-white transition-colors">Reset Password</h4>
                      <p className="text-sm text-gray-500">Send a password reset link to your email.</p>
                    </div>
                    <span className="text-gray-600 group-hover:text-white">→</span>
                  </button>

                  {/* Pro Activation Code */}
                  <div className="p-4 rounded-lg bg-black/30 border border-gray-800">
                    <h4 className="text-white font-medium mb-2">Activate Pro Access</h4>
                    <p className="text-sm text-gray-500 mb-3">Enter an activation code to unlock Pro features temporarily.</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={activationCode}
                        onChange={(e) => { setActivationCode(e.target.value); setActivateMsg(null); }}
                        placeholder="Enter activation code..."
                        className="flex-1 bg-black/50 border border-gray-700 focus:border-[#ccb999] text-white rounded-lg px-4 py-2 font-mono text-sm transition-colors outline-none"
                      />
                      <button
                        onClick={async () => {
                          if (!activationCode.trim()) return;
                          setActivating(true);
                          setActivateMsg(null);
                          try {
                            const idToken = await user.getIdToken();
                            const res = await fetch('/api/activate', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
                              body: JSON.stringify({ code: activationCode }),
                            });
                            const data = await res.json();
                            if (res.ok) {
                              setActivateMsg(data.message || 'Pro activated!');
                              setActivationCode('');
                            } else {
                              setActivateMsg(data.error || 'Invalid code');
                            }
                          } catch {
                            setActivateMsg('Failed to activate');
                          } finally {
                            setActivating(false);
                          }
                        }}
                        disabled={activating || !activationCode.trim()}
                        className="px-4 py-2 bg-[#ccb999] hover:bg-[#b8a485] disabled:opacity-50 text-black font-bold text-sm rounded-lg transition-colors"
                      >
                        {activating ? '...' : 'Activate'}
                      </button>
                    </div>
                    {activateMsg && (
                      <p className={`text-xs mt-2 ${activateMsg.includes('activated') || activateMsg.includes('Pro') ? 'text-green-400' : 'text-red-400'}`}>
                        {activateMsg}
                      </p>
                    )}
                  </div>
                  
                  <button 
                    onClick={async () => {
                      await logout();
                      router.push('/');
                    }}
                    className="w-full text-left p-4 rounded-lg bg-black/30 border border-gray-800 hover:border-gray-600 transition-colors flex justify-between items-center group"
                  >
                    <div>
                      <h4 className="text-white font-medium group-hover:text-white transition-colors">Sign Out</h4>
                      <p className="text-sm text-gray-500">End your current session.</p>
                    </div>
                    <span className="text-gray-600 group-hover:text-white">→</span>
                  </button>
                </div>

                {/* Danger Zone */}
                <div className="mt-auto pt-8">
                  <div className="border border-red-900/50 rounded-xl overflow-hidden">
                    <div className="bg-red-950/20 p-4 border-b border-red-900/30">
                      <h3 className="text-red-400 font-medium font-montserrat flex items-center gap-2">
                        <span className="text-xl">⚠️</span> Danger Zone
                      </h3>
                    </div>
                    <div className="p-4 bg-black/40 flex justify-between items-center">
                      <p className="text-sm text-gray-400">Once you delete your account, there is no going back. Please be certain.</p>
                      <button 
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 bg-red-900/50 hover:bg-red-700 text-red-200 text-sm font-medium rounded-lg transition-colors border border-red-800"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
