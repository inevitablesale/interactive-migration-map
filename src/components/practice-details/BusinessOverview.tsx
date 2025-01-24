import { TopFirm } from "@/types/rankings";
import { Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BusinessOverviewProps {
  practice: TopFirm;
}

export function BusinessOverview({ practice }: BusinessOverviewProps) {
  const { data: generatedText } = useQuery({
    queryKey: ['firm-generated-text', practice["Company ID"]],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('firm_generated_text')
        .select('generated_summary')
        .eq('company_id', practice["Company ID"])
        .single();

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="bg-black/40 backdrop-blur-md border-white/10 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-white">Business Overview</h2>
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-white/60 mb-2 flex items-center gap-2">Summary</h3>
            <p className="text-white">{generatedText?.generated_summary || practice.Summary || 'No summary available.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}