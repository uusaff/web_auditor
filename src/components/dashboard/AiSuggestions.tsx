import React, { useState } from 'react';

type SuggestionType = {
  title: string;
  description: string;
  severity: string;
  fix_code?: string;
};

export default function AiSuggestions({ suggestions, loading = false, isPro = false }: { suggestions: SuggestionType[], loading?: boolean, isPro?: boolean }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  
  // GitHub PR Modal State
  const [prModalState, setPrModalState] = useState<{ isOpen: boolean, index: number | null, loading: boolean, error: string | null, prUrl: string | null }>({
    isOpen: false, index: null, loading: false, error: null, prUrl: null
  });
  const [repoDetails, setRepoDetails] = useState({ repoPath: '', filePath: '', token: '' });

  const handleCreatePR = async () => {
    if (prModalState.index === null) return;
    setPrModalState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const fixCode = suggestions[prModalState.index].fix_code;
      const res = await fetch('/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...repoDetails, fixCode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create PR');
      
      setPrModalState(prev => ({ ...prev, loading: false, prUrl: data.url }));
    } catch (err: any) {
      setPrModalState(prev => ({ ...prev, loading: false, error: err.message }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-10">
        {[1,2,3].map((i) => (
          <div key={i} className="flex gap-8 group relative animate-pulse">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full mt-2 bg-white/20" />
              {i !== 3 && <div className="w-[1px] h-full bg-white/10 mt-4 mb-2" />}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-24 h-6 rounded-full bg-white/10" />
                <div className="w-48 h-6 rounded-md bg-white/10" />
              </div>
              <div className="w-full h-4 rounded bg-white/5 mb-2 max-w-3xl" />
              <div className="w-3/4 h-4 rounded bg-white/5 mb-6 max-w-2xl" />
              <div className="w-32 h-9 rounded-full bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-white/40 font-light tracking-widest uppercase text-sm">
        No suggestions found.
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'crucial': return 'bg-red-500 text-white/90 border-red-500/30';
      case 'normal': return 'bg-[#ccb999] text-black border-[#ccb999]/30';
      case 'optional': return 'bg-sky-500 text-white/90 border-sky-500/30';
      default: return 'bg-white/20 text-white border-white/10';
    }
  };

  const getSeverityDot = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'crucial': return 'bg-red-500';
      case 'normal': return 'bg-[#ccb999]';
      case 'optional': return 'bg-sky-500';
      default: return 'bg-white/50';
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {suggestions.map((item, i) => (
        <div key={i} className="flex gap-8 group relative">
          
          {/* Subtle Timeline Node */}
          <div className="flex flex-col items-center">
            <div className={`w-2 h-2 rounded-full mt-2 border border-white/50 ${getSeverityDot(item.severity)}`} />
            {i !== suggestions.length - 1 && (
              <div className="w-[1px] h-full bg-gradient-to-b from-white/20 to-transparent mt-4 mb-2" />
            )}
          </div>

          {/* Content Box */}
          <div className="flex-1 pb-4">
            <div className="flex items-center gap-4 mb-3">
              <span className={`text-[10px] uppercase tracking-[0.2em] font-medium px-3 py-1 rounded-full border ${getSeverityColor(item.severity)}`}>
                {item.severity}
              </span>
              <h4 className="text-xl font-normal tracking-wide text-white/90">
                {item.title}
              </h4>
            </div>
            
            <p className="text-[15px] font-light text-white/60 leading-relaxed max-w-3xl mb-6">
              {item.description}
            </p>
            
            {/* AI Action Button (Elegant Variant) */}
            <button 
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className="px-6 py-2.5 bg-black/60 hover:bg-black border border-[#ccb999]/30 hover:border-[#ccb999]/80 rounded-full text-xs tracking-[0.15em] text-[#ccb999] transition-all flex items-center gap-3 shadow-lg"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              {expandedIndex === i ? 'Hide AI Fix' : 'Apply AI Fix'}
            </button>

            {expandedIndex === i && item.fix_code && (
              <div className="mt-6 p-6 bg-black/80 rounded-xl border border-white/10 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 to-[#ccb999]" />
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs tracking-widest uppercase text-white/40">Suggested Code Fix</span>
                  {isPro && (
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setPrModalState({ isOpen: true, index: i, loading: false, error: null, prUrl: null })}
                        className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-2 border border-orange-500/30 px-3 py-1 rounded-full"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                        Create PR
                      </button>
                      <button 
                        onClick={() => navigator.clipboard.writeText(item.fix_code || '')}
                        className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <pre className={`font-mono text-sm text-sky-200 overflow-x-auto whitespace-pre-wrap leading-relaxed ${!isPro ? 'filter blur-md select-none opacity-50' : ''}`}>
                    <code>{item.fix_code}</code>
                  </pre>
                  
                  {!isPro && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 rounded-lg">
                      <div className="bg-[#121a14]/95 p-6 rounded-2xl border border-orange-500/30 text-center shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
                        <svg className="w-8 h-8 text-orange-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <h4 className="text-white text-lg tracking-wide mb-2 font-bold">Pro Feature Locked</h4>
                        <p className="text-white/60 text-sm mb-6 max-w-xs">Upgrade to Pro to unlock copy-paste React/Tailwind code solutions and 1-click GitHub PR deployment.</p>
                        <button className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-[#ccb999] hover:from-orange-500 hover:to-white text-black font-bold uppercase tracking-widest text-xs rounded-full transition-all shadow-lg w-full">
                          Upgrade to Pro
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {expandedIndex === i && !item.fix_code && (
              <div className="mt-6 p-4 bg-black/80 rounded-xl border border-white/10 text-sm font-light text-white/50">
                No code fix available for this suggestion.
              </div>
            )}

          </div>

        </div>
      ))}

      {/* GitHub PR Modal */}
      {prModalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121a14] border border-white/10 rounded-2xl w-full max-w-lg p-8 shadow-2xl relative">
            <button 
              onClick={() => setPrModalState(prev => ({ ...prev, isOpen: false }))}
              className="absolute top-6 right-6 text-white/50 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-normal tracking-wide text-white/90 mb-6 flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              Deploy Fix to GitHub
            </h3>
            
            {prModalState.prUrl ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="text-xl font-bold mb-2 text-white">Pull Request Opened!</h4>
                <p className="text-white/60 text-sm mb-8">The AI fix has been successfully appended to the branch and a PR has been generated.</p>
                <a href={prModalState.prUrl} target="_blank" rel="noreferrer" className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-colors w-full">
                  View Pull Request
                </a>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div>
                  <label className="text-xs font-bold tracking-widest text-white/50 uppercase mb-2 block">Repository Path</label>
                  <input type="text" placeholder="e.g. uusaff/ai-auditor" value={repoDetails.repoPath} onChange={(e) => setRepoDetails({...repoDetails, repoPath: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500/50 text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest text-white/50 uppercase mb-2 block">File to Patch</label>
                  <input type="text" placeholder="e.g. frontend/src/app/page.tsx" value={repoDetails.filePath} onChange={(e) => setRepoDetails({...repoDetails, filePath: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500/50 text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest text-white/50 uppercase mb-2 block flex justify-between">
                    <span>GitHub Access Token</span>
                    <a href="https://github.com/settings/tokens/new" target="_blank" rel="noreferrer" className="text-sky-500 hover:underline">Get Token</a>
                  </label>
                  <input type="password" placeholder="ghp_..." value={repoDetails.token} onChange={(e) => setRepoDetails({...repoDetails, token: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500/50 text-white" />
                  <p className="text-[10px] text-white/40 mt-2 font-light">Token requires `repo` scope to create branches and PRs. It is never stored on our servers.</p>
                </div>

                {prModalState.error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs mt-2">
                    {prModalState.error}
                  </div>
                )}

                <button 
                  onClick={handleCreatePR}
                  disabled={prModalState.loading || !repoDetails.repoPath || !repoDetails.filePath || !repoDetails.token}
                  className="mt-4 px-6 py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2"
                >
                  {prModalState.loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating PR...
                    </>
                  ) : (
                    'Deploy Fix'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
