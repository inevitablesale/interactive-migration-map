import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

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

  // Parse specialties (comma-separated)
  const parseSpecialties = (specialtiesText: string | null) => {
    if (!specialtiesText) return [];
    return specialtiesText.split(',').map(s => s.trim()).filter(Boolean);
  };

  const badges = parseBadges(generatedText.badges);
  const callouts = parseCallouts(generatedText.callouts);
  const specialtiesList = parseSpecialties(specialties);

  console.log('Parsed badges:', badges);
  console.log('Parsed callouts:', callouts);
  console.log('Parsed specialties:', specialtiesList);

  return (
    <div className="space-y-6">
      {/* Badges Display */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <Badge 
              key={`badge-${index}`}
              variant="secondary" 
              className="bg-white/10 text-white hover:bg-white/20"
            >
              {badge}
            </Badge>
          ))}
        </div>
      )}

      {/* Specialties Display */}
      {specialtiesList.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {specialtiesList.map((specialty, index) => (
              <Badge 
                key={`specialty-${index}`}
                variant="secondary" 
                className="bg-white/10 text-white hover:bg-white/20"
              >
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Callouts Display */}
      {callouts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {callouts.map((callout, index) => (
            <Card key={`callout-${index}`} className="p-4 bg-black/40 border-white/10">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
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