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

  // Return the raw data for now to debug
  return (
    <div className="space-y-6">
      <pre className="text-white whitespace-pre-wrap">
        <h3>Badges Raw Data:</h3>
        {JSON.stringify(generatedText.badges, null, 2)}
      </pre>
      <pre className="text-white whitespace-pre-wrap">
        <h3>Callouts Raw Data:</h3>
        {JSON.stringify(generatedText.callouts, null, 2)}
      </pre>
    </div>
  );
}