import { TopFirm } from "@/types/rankings";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface PracticeTeaserProps {
  practice: TopFirm;
}

export function PracticeTeaser({ practice }: PracticeTeaserProps) {
  const { data: generatedText } = useQuery({
    queryKey: ['firm-generated-text', practice["Company ID"]],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('firm_generated_text')
        .select('teaser, badges, callouts')
        .eq('company_id', practice["Company ID"])
        .single();

      if (error) throw error;
      return data;
    }
  });

  const badges = generatedText?.badges ? JSON.parse(generatedText.badges) : [];
  const callouts = generatedText?.callouts ? JSON.parse(generatedText.callouts) : [];

  return (
    <div className="space-y-6 mb-6">
      {generatedText?.teaser && (
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <p className="text-lg text-white leading-relaxed">{generatedText.teaser}</p>
        </div>
      )}
      
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge: string, index: number) => (
            <Badge 
              key={index}
              variant="secondary" 
              className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
            >
              {badge}
            </Badge>
          ))}
        </div>
      )}

      {callouts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {callouts.map((callout: string, index: number) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-white/80"
            >
              {callout}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}