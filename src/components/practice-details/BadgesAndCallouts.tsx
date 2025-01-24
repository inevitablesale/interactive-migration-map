import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Award, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BadgesAndCalloutsProps {
  companyId: number;
}

export function BadgesAndCallouts({ companyId }: BadgesAndCalloutsProps) {
  const { data: generatedText } = useQuery({
    queryKey: ['firm-generated-text', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('firm_generated_text')
        .select('badges, callouts')
        .eq('company_id', companyId)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  // Parse badges and callouts if they're stored as strings
  const parsedBadges = generatedText?.badges ? 
    (typeof generatedText.badges === 'string' ? 
      generatedText.badges.split(',').map(b => b.trim()) : 
      generatedText.badges) : 
    [];

  const parsedCallouts = generatedText?.callouts ? 
    (typeof generatedText.callouts === 'string' ? 
      generatedText.callouts.split(',').map(c => c.trim()) : 
      generatedText.callouts) : 
    [];

  if (!parsedBadges.length && !parsedCallouts.length) return null;

  return (
    <div className="space-y-6">
      {parsedBadges.length > 0 && (
        <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Recognition & Achievements</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {parsedBadges.map((badge, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
              >
                {badge}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {parsedCallouts.length > 0 && (
        <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Notable Features</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parsedCallouts.map((callout, index) => (
              <div 
                key={index}
                className="bg-white/5 rounded-lg p-3 text-white"
              >
                {callout}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}