import React from 'react';

export const ColorScaleLegend = () => (
  <div className="bg-black/40 backdrop-blur-md border-white/10 p-4 rounded-lg mb-6">
    <h3 className="text-white text-sm font-medium mb-3">Metric Color Scale</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <div className="text-xs text-gray-400 mb-1">Population</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-400"></div>
            <span className="text-xs text-white/60">High (&gt;1M)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-300"></div>
            <span className="text-xs text-white/60">Medium (500k-1M)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-200"></div>
            <span className="text-xs text-white/60">Low (&lt;500k)</span>
          </div>
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-400 mb-1">Financial</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-xs text-white/60">High (&gt;$75k)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-300"></div>
            <span className="text-xs text-white/60">Medium ($50k-$75k)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-200"></div>
            <span className="text-xs text-white/60">Low (&lt;$50k)</span>
          </div>
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-400 mb-1">Growth</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            <span className="text-xs text-white/60">High growth (≥5%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span className="text-xs text-white/60">Stable (0-5%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span className="text-xs text-white/60">Declining (&lt;0%)</span>
          </div>
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-400 mb-1">Density</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span className="text-xs text-white/60">High (≥2)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
            <span className="text-xs text-white/60">Medium (1-2)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-400"></div>
            <span className="text-xs text-white/60">Low (&lt;1)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);