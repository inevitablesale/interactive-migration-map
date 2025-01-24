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
        .select('*')
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

  // Parse callouts from markdown format
  const parseCallouts = (calloutsText: string | null) => {
    if (!calloutsText) return [];
    
    // Split by newline and filter out empty lines
    return calloutsText.split('\n')
      .filter(line => line.trim().startsWith('*'))
      .map(line => {
        // Extract the title and description
        const match = line.match(/\*\*([^:]+):\*\*\s*(.*)/);
        if (match) {
          return {
            title: match[1].trim(),
            description: match[2].trim()
          };
        }
        return null;
      })
      .filter(Boolean); // Remove any null values
  };

  const callouts = parseCallouts(generatedText.callouts);

  return (
    <div className="space-y-6">
      {/* Raw Data Display */}
      <Card className="p-4 bg-black/40 border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Raw Callouts Data:</h3>
        <pre className="text-white/70 whitespace-pre-wrap text-sm">
          {generatedText.callouts || 'No callouts data'}
        </pre>
      </Card>

      {/* Parsed Callouts Display */}
      {callouts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {callouts.map((callout, index) => (
            <Card key={index} className="p-4 bg-black/40 border-white/10">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">{callout.title}</h4>
                  <p className="text-sm text-white/70 mt-1">{callout.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}