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
  return text
    .split('\n')
    .filter(line => line.trim().startsWith('*'))
    .map(line => line.replace('* ', '').trim());
};

export function BadgesAndCallouts({ companyId }: BadgesAndCalloutsProps) {
  const { data: generatedText } = useQuery({
    queryKey: ['firm-generated-text', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('firm_generated_text')
        .select('badges, callouts')
        .eq('company_id', companyId.toString())
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const parsedBadges = parseMarkdownList(generatedText?.badges);
  const parsedCallouts = parseMarkdownList(generatedText?.callouts);

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
            {parsedBadges.map((badge, index) => {
              // Remove markdown bold syntax
              const cleanBadge = badge.replace(/\*\*/g, '');
              return (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                >
                  {cleanBadge}
                </Badge>
              );
            })}
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
              // Split into title and description
              const [title, ...descParts] = callout.split(':');
              const description = descParts.join(':').trim();
              const cleanTitle = title.replace(/\*\*/g, '');
              
              return (
                <div 
                  key={index}
                  className="bg-white/5 rounded-lg p-4"
                >
                  <h4 className="font-semibold text-blue-400 mb-2">{cleanTitle}</h4>
                  <p className="text-white/80 text-sm">{description}</p>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}