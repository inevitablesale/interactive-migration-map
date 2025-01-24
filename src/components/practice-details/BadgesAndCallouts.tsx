import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle, BadgeCheck } from "lucide-react";

interface BadgesAndCalloutsProps {
  generatedText: {
    badges: string | null;
    callouts: string | null;
  };
  specialties?: string | null;
}

export function BadgesAndCallouts({ generatedText, specialties }: BadgesAndCalloutsProps) {
  console.log('BadgesAndCallouts rendered with data:', generatedText);
  
  // Parse badges (handles both newlines and commas)
  const parseBadges = (badgesText: string | null) => {
    if (!badgesText) return [];
    return badgesText
      .split(/[\n,]/) // Split on newlines or commas
      .map(badge => badge.trim())
      .filter(Boolean); // Remove empty strings
  };

  // Parse callouts (title: description format)
  const parseCallouts = (calloutsText: string | null) => {
    if (!calloutsText) return [];
    
    return calloutsText
      .split('.,')  // Split on period + comma
      .map(entry => {
        const [title, description] = entry.split(':').map(part => part.trim());
        // Remove trailing period if it exists
        const cleanDescription = description?.replace(/\.$/, '');
        return { title, description: cleanDescription };
      })
      .filter(({ title, description }) => title && description); // Only return complete entries
  };

  const badges = parseBadges(generatedText.badges);
  const callouts = parseCallouts(generatedText.callouts);

  console.log('Parsed badges:', badges);
  console.log('Parsed callouts:', callouts);

  return (
    <div className="space-y-6">
      {/* Badges Display */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {badges.map((badge, index) => (
            <Badge 
              key={`badge-${index}`}
              variant="secondary" 
              className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 text-gray-900 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 flex items-center gap-2"
            >
              <BadgeCheck className="w-4 h-4 text-[#8B5CF6] hover:text-[#D946EF] transition-colors duration-300" />
              {badge}
            </Badge>
          ))}
        </div>
      )}

      {/* Callouts Display */}
      {callouts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {callouts.map((callout, index) => (
            <Card key={`callout-${index}`} className="p-4 bg-black/40 border-white/10">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#0EA5E9] hover:text-[#F97316] transition-colors duration-300 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">{callout.title}</h4>
                  <p className="text-sm text-white/70 mt-1">{callout.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}