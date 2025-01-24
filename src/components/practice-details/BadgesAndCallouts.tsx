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
      console.log('Starting fetch for company ID:', companyId);
      
      // First, let's check if the company exists
      const { data: companyCheck } = await supabase
        .from('canary_firms_data')
        .select('Company ID')
        .eq('Company ID', companyId)
        .single();
      
      console.log('Company check result:', companyCheck);

      // Now fetch the generated text
      const { data, error } = await supabase
        .from('firm_generated_text')
        .select('*')  // Select all columns to see what we get
        .eq('company_id', companyId)
        .maybeSingle();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Complete data from firm_generated_text:', data);
      return data;
    }
  });

  if (error) {
    console.error('Query error:', error);
    return <div className="text-white/60 text-center py-4">Error loading badges and callouts.</div>;
  }

  if (!generatedText) {
    console.log('No generated text found for company ID:', companyId);
    return <div className="text-white/60 text-center py-4">No badges or callouts available for this company.</div>;
  }

  return (
    <div className="space-y-6">
      <pre className="text-white whitespace-pre-wrap">
        <h3>Complete Generated Text Data:</h3>
        {JSON.stringify(generatedText, null, 2)}
      </pre>
    </div>
  );
}