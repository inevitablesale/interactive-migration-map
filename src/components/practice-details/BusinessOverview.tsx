import { TopFirm } from "@/types/rankings";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

interface BusinessOverviewProps {
  practice: TopFirm;
}

export function BusinessOverview({ practice }: BusinessOverviewProps) {
  const [isAnonymizing, setIsAnonymizing] = useState(false);
  const { toast } = useToast();

  const handleAnonymize = async () => {
    console.log('Starting description generation for practice:', {
      hasSummary: Boolean(practice.Summary),
      hasLocation: Boolean(practice.Location),
      hasSpecialties: Boolean(practice.specialities)
    });

    setIsAnonymizing(true);
    try {
      console.log('Invoking anonymize-summary function with data:', {
        summaryLength: practice.Summary?.length,
        location: practice.Location,
        specialties: practice.specialities
      });

      const { data, error } = await supabase.functions.invoke('anonymize-summary', {
        body: {
          summary: practice.Summary,
          location: practice.Location,
          specialties: practice.specialities
        }
      });

      if (error) throw error;

      console.log('Successfully generated description:', {
        generatedLength: data.description?.length,
        success: Boolean(data.description)
      });

      // Copy the anonymized description to clipboard
      await navigator.clipboard.writeText(data.description);

      toast({
        title: "Summary Anonymized",
        description: "The anonymized description has been copied to your clipboard.",
      });
    } catch (error) {
      console.error('Error generating description:', {
        error,
        errorMessage: error.message,
        practiceId: practice.id
      });
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
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-white">Business Overview</h2>
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={handleAnonymize}
            disabled={isAnonymizing || !practice.Summary}
            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 flex items-center gap-2"
          >
            {isAnonymizing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate AI Description
              </>
            )}
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-white/60 mb-2 flex items-center gap-2">Summary</h3>
            <p className="text-white">{practice.Summary || 'No summary available.'}</p>
          </div>
          {practice.specialities && (
            <div>
              <h3 className="text-white/60 mb-2 flex items-center gap-2">Specialties</h3>
              <p className="text-white">{practice.specialities}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}