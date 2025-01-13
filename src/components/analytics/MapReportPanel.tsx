import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MapReportPanelProps {
  selectedState?: {
    STATEFP: string;
    B19013_001E: number | null;
    C24010_001E: number | null;
    ESTAB: number | null;
    PAYANN: number | null;
    buyerScore?: number;
  };
  onClose: () => void;
}

export const MapReportPanel = ({ selectedState, onClose }: MapReportPanelProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['buyerProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('buyer_profiles')
        .select('subscription_tier')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const isFreeTier = !profile || profile.subscription_tier === 'free';

  const handleGenerateReport = async () => {
    if (isFreeTier) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to generate detailed reports with firm-level insights.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Generate report content
      const reportContent = {
        stateId: selectedState?.STATEFP,
        metrics: {
          medianIncome: selectedState?.B19013_001E,
          workforce: selectedState?.C24010_001E,
          establishments: selectedState?.ESTAB,
          annualPayroll: selectedState?.PAYANN,
          marketScore: selectedState?.buyerScore
        },
        timestamp: new Date().toISOString()
      };

      // Save report to Supabase
      const { error } = await supabase
        .from('reports')
        .insert({
          title: `Market Analysis Report - State ${selectedState?.STATEFP}`,
          description: "Generated from map analysis",
          content: reportContent,
          visibility: 'private',
          insights_query: `SELECT * FROM state_data WHERE STATEFP = '${selectedState?.STATEFP}'`
        });

      if (error) throw error;

      toast({
        title: "Report Generated",
        description: "Your report has been saved and is ready for download.",
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!selectedState) return null;

  return (
    <Card className="absolute right-4 top-20 w-80 p-6 bg-black/80 backdrop-blur-md border-white/10 space-y-4 z-50">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Region Analysis</h3>
        <button onClick={onClose} className="text-white/60 hover:text-white">&times;</button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/80">Market Metrics</h4>
          <div className="space-y-1 text-sm">
            <p className="text-white/60">
              Establishments: {selectedState.ESTAB?.toLocaleString() || 'N/A'}
            </p>
            <p className="text-white/60">
              Annual Payroll: ${(selectedState.PAYANN || 0).toLocaleString()}
            </p>
            {!isFreeTier && (
              <p className="text-white/60">
                Market Score: {((selectedState.buyerScore || 0) * 100).toFixed(1)}%
              </p>
            )}
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleGenerateReport}
          disabled={isGenerating}
        >
          {isFreeTier && <Lock className="w-4 h-4 mr-2" />}
          {isGenerating ? "Generating..." : "Generate Report"}
          {!isFreeTier && <FileDown className="w-4 h-4 ml-2" />}
        </Button>

        {isFreeTier && (
          <p className="text-xs text-white/40 text-center">
            Upgrade to access detailed reports and firm-level insights
          </p>
        )}
      </div>
    </Card>
  );
};