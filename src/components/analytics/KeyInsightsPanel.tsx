import { ValueInsights } from "./insights/ValueInsights";
import { GrowthInsights } from "./insights/GrowthInsights";
import { TalentInsights } from "./insights/TalentInsights";

export function KeyInsightsPanel() {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Trending Insights</h2>
      <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6">
        <ValueInsights />
        <GrowthInsights />
        <TalentInsights />
      </div>
    </section>
  );
}