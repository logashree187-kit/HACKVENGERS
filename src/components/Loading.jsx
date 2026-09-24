import React from 'react';

export default function Loading({ count = 3, label = 'Fetching real-time records...' }) {
  return (
    <div className="w-full py-10 flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center mb-3">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider animate-pulse">
        {label}
      </p>

      {/* Modern Skeleton Cards Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 max-w-7xl">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 animate-pulse"
          >
            <div className="flex justify-between items-center">
              <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
              <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
            </div>
            <div className="h-5 w-3/4 bg-slate-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-slate-100 rounded"></div>
              <div className="h-3.5 w-4/5 bg-slate-100 rounded"></div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <div className="h-3.5 w-24 bg-slate-200 rounded"></div>
              <div className="h-7 w-20 bg-slate-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}