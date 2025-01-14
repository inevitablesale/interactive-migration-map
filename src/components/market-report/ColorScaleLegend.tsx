import React from 'react';

export const ColorScaleLegend = () => (
  <div className="bg-black/40 backdrop-blur-md border-white/10 p-4 rounded-lg mb-4">
    <h3 className="text-white text-sm font-medium mb-2">Metric Color Scale</h3>
    <div className="flex flex-wrap gap-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
        <span className="text-xs text-white/60">High Performance (≥80th)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
        <span className="text-xs text-white/60">Strong (60-80th)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        <span className="text-xs text-white/60">Average (40-60th)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-orange-400"></div>
        <span className="text-xs text-white/60">Below Average (20-40th)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <span className="text-xs text-white/60">Low (≤20th)</span>
      </div>
    </div>
  </div>
);