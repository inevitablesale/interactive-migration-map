import { TopFirm } from "@/types/rankings";
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
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Business Overview</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-white/80 leading-relaxed">
            {generatedText?.generated_summary || practice.Summary}
          </p>
        </div>
      </div>
    </div>
  );
}