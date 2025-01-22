import { TopFirm } from "@/types/rankings";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface BusinessOverviewProps {
  practice: TopFirm;
}

export function BusinessOverview({ practice }: BusinessOverviewProps) {
  const [isAnonymizing, setIsAnonymizing] = useState(false);
  const { toast } = useToast();

  const handleAnonymize = async () => {
    setIsAnonymizing(true);
    try {
      const { data, error } = await supabase.functions.invoke('anonymize-summary', {
        body: {
          summary: practice.Summary,
          location: practice.Location,
          specialties: practice.specialities
        }
      });

      if (error) throw error;

      // Copy the anonymized description to clipboard
      await navigator.clipboard.writeText(data.description);

      toast({
        title: "Summary Anonymized",
        description: "The anonymized description has been copied to your clipboard.",
      });
    } catch (error) {
      console.error('Error anonymizing summary:', error);
      toast({
        title: "Error",
        description: "Failed to anonymize the summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnonymizing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/40 backdrop-blur-md border-white/10 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-white">Business Overview</h2>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={handleAnonymize}
            disabled={isAnonymizing || !practice.Summary}
            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
          >
            {isAnonymizing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Anonymizing...
              </>
            ) : (
              'Anonymize Summary'
            )}
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-white/60 mb-2">Summary</h3>
            <p className="text-white">{practice.Summary || 'No summary available.'}</p>
          </div>
          {practice.specialities && (
            <div>
              <h3 className="text-white/60 mb-2">Specialties</h3>
              <p className="text-white">{practice.specialities}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}