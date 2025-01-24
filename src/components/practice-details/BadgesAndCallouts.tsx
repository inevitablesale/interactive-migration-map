import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Award, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BadgesAndCalloutsProps {
  companyId: number;
}

export function BadgesAndCallouts({ companyId }: BadgesAndCalloutsProps) {
  const { data: generatedText, error } = useQuery({
    queryKey: ['firm-generated-text', companyId],
    queryFn: async () => {
      console.log('Fetching data for company:', companyId);
      
      const { data, error } = await supabase
        .from('firm_generated_text')
        .select('badges, callouts')
        .eq('company_id', companyId)
        .maybeSingle();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Raw data from Supabase:', data);
      return data;
    }
  });

  if (!generatedText) {
    console.log('No generated text found');
    return <div className="text-white/60 text-center py-4">No data available for this company.</div>;
  }

  console.log('Raw badges text:', generatedText.badges);
  console.log('Raw callouts text:', generatedText.callouts);

  // Parse markdown-formatted badges with improved error handling
  const badges = generatedText.badges
    ? generatedText.badges
        .split('\n')
        .map(line => {
          console.log('Processing badge line:', line);
          return line.trim();
        })
        .filter(line => {
          const isValid = line.startsWith('*');
          console.log('Badge line valid?', { line, isValid });
          return isValid;
        })
        .map(line => {
          // Remove markdown formatting (* and **)
          const cleaned = line.replace(/^\*\s*/, '').replace(/\*\*/g, '').trim();
          console.log('Cleaned badge:', { original: line, cleaned });
          return cleaned;
        })
        .filter(badge => badge.length > 0)
    : [];

  console.log('Final parsed badges:', badges);

  // Parse markdown-formatted callouts with improved error handling
  const callouts = generatedText.callouts
    ? generatedText.callouts
        .split('\n')
        .map(line => {
          console.log('Processing callout line:', line);
          return line.trim();
        })
        .filter(line => {
          const isValid = line.startsWith('*');
          console.log('Callout line valid?', { line, isValid });
          return isValid;
        })
        .map(line => {
          // Remove markdown formatting and split into title/description
          const content = line.replace(/^\*\s*/, '').replace(/\*\*/g, '').trim();
          console.log('Cleaned callout line:', { original: line, cleaned: content });
          
          const [title, ...descParts] = content.split(':');
          const result = {
            title: title.trim(),
            description: descParts.join(':').trim()
          };
          console.log('Parsed callout:', result);
          return result;
        })
        .filter(callout => callout.title.length > 0)
    : [];

  console.log('Final parsed callouts:', callouts);

  if (!badges.length && !callouts.length) {
    return <div className="text-white/60 text-center py-4">No badges or callouts available.</div>;
  }

  return (
    <div className="space-y-6">
      {badges.length > 0 && (
        <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Recognition & Achievements</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <Badge 
                key={`badge-${index}`}
                className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                variant="secondary"
              >
                {badge}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {callouts.length > 0 && (
        <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Notable Features</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {callouts.map((callout, index) => (
              <div 
                key={`callout-${index}`}
                className="bg-white/5 rounded-lg p-4"
              >
                <h4 className="font-semibold text-blue-400 mb-2">{callout.title}</h4>
                {callout.description && (
                  <p className="text-white/80 text-sm">{callout.description}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}