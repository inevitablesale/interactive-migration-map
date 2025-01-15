import { KeyInsightsPanel } from "@/components/analytics/KeyInsightsPanel";
import { MarketHighlights } from "@/components/analytics/MarketHighlights";
import React from "react";

export default function Analysis() {
  return (
    <div className="min-h-screen bg-[#111111]">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <KeyInsightsPanel />
        <MarketHighlights />
      </div>
    </div>
  );
}