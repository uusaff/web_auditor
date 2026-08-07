import React from 'react';

type ScoreType = {
  label: string;
  score: number;
  color: string;
};

export default function ScoreGrid({ scores, loading = false }: { scores: ScoreType[], loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-x-6 gap-y-10">
        {[1,2,3,4].map((i) => (
          <div key={i} className="flex flex-col items-center justify-center gap-4">
            <div className="w-[100px] h-[100px] rounded-full bg-white/5 animate-pulse border border-white/10" />
            <div className="w-20 h-3 rounded-full bg-white/10 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (!scores || scores.length === 0) {
    return <div className="text-white/50 text-center text-sm tracking-widest mt-12">No data available</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10">
      {scores.map((item, i) => (
        <div key={i} className="flex flex-col items-center justify-center gap-4">
          <div className="relative w-[100px] h-[100px] flex items-center justify-center">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90 drop-shadow-lg" viewBox="0 0 36 36">
              <path
                className="text-white/5"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Progress Circle */}
              <path
                strokeWidth="1.5"
                strokeDasharray={`${item.score}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                className={`transition-all duration-1000 ease-out ${item.color === 'text-[#ccb999]' ? 'text-[#ccb999]' : 'text-white'}`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className={`absolute text-3xl font-normal font-['VictoryStriker'] tracking-wide ${item.color}`}>
              {item.score}
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-white/50 font-light text-center">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
