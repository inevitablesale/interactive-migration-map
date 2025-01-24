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

  // Split the summary into two paragraphs at the first period followed by a space
  const summaryText = generatedText?.generated_summary || practice.Summary || 'No summary available.';
  const firstPeriodIndex = summaryText.indexOf('. ');
  const [firstParagraph, secondParagraph] = firstPeriodIndex !== -1 
    ? [
        summaryText.slice(0, firstPeriodIndex + 1),
        summaryText.slice(firstPeriodIndex + 2)
      ]
    : [summaryText, ''];

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
            <div className="space-y-4">
              <p className="text-white">{firstParagraph}</p>
              {secondParagraph && <p className="text-white">{secondParagraph}</p>}
            </div>
          </div>

          {/* Teaser Section */}
          {generatedText?.teaser && (
            <div>
              <h3 className="text-white/60 mb-2">Key Highlights</h3>
              <p className="text-white">{generatedText.teaser}</p>
            </div>
          )}

          {/* Badges and Callouts sections removed as requested */}
        </div>
      </div>
    </div>
  );
}