import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Award, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BadgesAndCalloutsProps {
  companyId: number;
}

const parseMarkdownList = (text: string | null): string[] => {
  if (!text) return [];
  
  // Split by commas if it's a comma-separated string
  if (text.includes(',')) {
    return text.split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .map(item => item.replace(/\*\*/g, ''));
  }
  
  // Otherwise try to parse as markdown list
  return text
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => line.replace(/^\*\s*/, '').replace(/\*\*/g, '').trim());
};

export function BadgesAndCallouts({ companyId }: BadgesAndCalloutsProps) {
  const { data: generatedText, error } = useQuery({
    queryKey: ['firm-generated-text', companyId],
    queryFn: async () => {
      console.log('Fetching generated text for company:', companyId);
      
      const { data, error } = await supabase
        .from('firm_generated_text')
        .select('badges, callouts')
        .eq('company_id', companyId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching generated text:', error);
        throw error;
      }
      
      console.log('Generated text data:', data);
      return data;
    }
  });

  const parsedBadges = parseMarkdownList(generatedText?.badges);
  const parsedCallouts = parseMarkdownList(generatedText?.callouts);

  console.log('Parsed badges:', parsedBadges);
  console.log('Parsed callouts:', parsedCallouts);

  // Only return null if there's no data at all
  if (!generatedText) {
    console.log('No generated text data found');
    return null;
  }

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
                key={`badge-${index}`}
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
            {parsedCallouts.map((callout, index) => {
              const [title, ...descParts] = callout.split(':');
              const description = descParts.join(':').trim();
              
              return (
                <div 
                  key={`callout-${index}`}
                  className="bg-white/5 rounded-lg p-4"
                >
                  <h4 className="font-semibold text-blue-400 mb-2">{title}</h4>
                  {description && <p className="text-white/80 text-sm">{description}</p>}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
