import { Badge } from "@/components/ui/badge";
import { BadgeCheck, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface BadgesAndCalloutsProps {
  generatedText: {
    badges?: string[];
    callouts?: string;
  } | null;
  specialties?: string;
}

export const BadgesAndCallouts = ({ generatedText, specialties }: BadgesAndCalloutsProps) => {
  // Parse badges from generated text or specialties
  const badges = generatedText?.badges
    ? JSON.parse(generatedText.badges)
    : specialties
    ? [specialties]
    : [];

  // Parse callouts from generated text
  const callouts = generatedText?.callouts
    ? JSON.parse(generatedText.callouts)
    : [];

  if (!badges.length && !callouts.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Badges Section */}
      {badges.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Key Highlights</h3>
          <div className="flex flex-wrap gap-3">
            {badges.map((badge, index) => (
              <Badge 
                key={`badge-${index}`}
                variant="secondary" 
                className="px-4 py-2 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 border border-emerald-200/20 backdrop-blur-sm text-black hover:from-emerald-400/30 hover:to-teal-400/30 transition-all duration-300 flex items-center gap-2"
              >
                <BadgeCheck className="w-4 h-4 text-emerald-700" />
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Callouts Section */}
      {callouts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Additional Information</h3>
          <div className="grid gap-4">
            {callouts.map((callout, index) => (
              <Card 
                key={`callout-${index}`}
                className="p-4 bg-black/40 border-white/10 backdrop-blur-sm"
              >
                <div className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-white/80">{callout}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};