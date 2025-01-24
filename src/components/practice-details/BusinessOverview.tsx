import { TopFirm } from "@/types/rankings";
import { Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface BusinessOverviewProps {
  practice: TopFirm;
}

export function BusinessOverview({ practice }: BusinessOverviewProps) {
  const { data: generatedText } = useQuery({
    queryKey: ['firm-generated-text', practice["Company ID"]],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('firm_generated_text')
        .select('generated_summary, teaser, callouts, badges')
        .eq('company_id', practice["Company ID"])
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

  return (
    <div className="space-y-6">
      <div className="bg-black/40 backdrop-blur-md border-white/10 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-white">Business Overview</h2>
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
        </div>
        
        {/* Generated Summary */}
        <div className="space-y-6">
          <div>
            <h3 className="text-white/60 mb-2 flex items-center gap-2">Summary</h3>
            <p className="text-white">{generatedText?.generated_summary || practice.Summary || 'No summary available.'}</p>
          </div>

          {/* Teaser Section */}
          {generatedText?.teaser && (
            <div>
              <h3 className="text-white/60 mb-2">Key Highlights</h3>
              <p className="text-white">{generatedText.teaser}</p>
            </div>
          )}

          {/* Badges Section */}
          {parsedBadges.length > 0 && (
            <div>
              <h3 className="text-white/60 mb-2">Recognition & Achievements</h3>
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
            </div>
          )}

          {/* Callouts Section */}
          {parsedCallouts.length > 0 && (
            <div>
              <h3 className="text-white/60 mb-2">Notable Features</h3>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}