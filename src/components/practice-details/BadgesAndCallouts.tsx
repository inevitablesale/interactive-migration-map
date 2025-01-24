import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BadgesAndCalloutsProps {
  generatedText?: {
    badges?: string;
    callouts?: string;
  };
  specialties?: string;
}

export const BadgesAndCallouts = ({ generatedText, specialties }: BadgesAndCalloutsProps) => {
  // Safely parse JSON with error handling
  const parseBadgesAndCallouts = (jsonString?: string) => {
    if (!jsonString) return [];
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return [];
    }
  };

  const badges = parseBadgesAndCallouts(generatedText?.badges);
  const callouts = parseBadgesAndCallouts(generatedText?.callouts);

  return (
    <div className="space-y-6">
      {/* Badges */}
      <div className="flex flex-wrap gap-3">
        {badges.map((badge: string, index: number) => (
          <Badge
            key={index}
            className="bg-gray-800/60 text-white hover:bg-gray-700/60 px-4 py-1.5 text-sm font-medium"
          >
            <Check className="w-4 h-4 mr-1.5 text-yellow-400" />
            {badge}
          </Badge>
        ))}
      </div>

      {/* Callouts */}
      <div className="grid gap-4 md:grid-cols-3">
        {callouts.map((callout: any, index: number) => (
          <div
            key={index}
            className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-4 border border-white/5"
          >
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-5 h-5 text-yellow-400" />
              <h4 className="font-semibold text-white">{callout.title}</h4>
            </div>
            <p className="text-sm text-white/70">{callout.description}</p>
          </div>
        ))}
      </div>

      {/* Specialties */}
      {specialties && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-white/60 mb-3">Specialties</h4>
          <div className="flex flex-wrap gap-2">
            {specialties.split(',').map((specialty, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-gray-800/60 text-white hover:bg-gray-700/60"
              >
                {specialty.trim()}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};