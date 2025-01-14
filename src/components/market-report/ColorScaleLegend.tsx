import React from 'react';

export const ColorScaleLegend = () => (
  <div className="bg-black/40 backdrop-blur-md border-white/10 px-4 py-2 rounded-lg mb-4 flex items-center gap-4">
    <span className="text-white text-sm font-medium">Metric Scale:</span>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
        <span className="text-xs text-white/60">High</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
        <span className="text-xs text-white/60">Strong</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
        <span className="text-xs text-white/60">Average</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-orange-400"></div>
        <span className="text-xs text-white/60">Below Avg</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-400"></div>
        <span className="text-xs text-white/60">Low</span>
      </div>
    </div>
  </div>
);