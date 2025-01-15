import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Lightbulb, TrendingUp, AlertTriangle, Target } from "lucide-react";
import { toast } from "sonner";

interface GeminiInsightsProps {
  marketData: any;
}

export function GeminiInsights({ marketData }: GeminiInsightsProps) {
  const { data: insights, isLoading } = useQuery({
    queryKey: ['geminiInsights', marketData],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke('analyze-market-gemini', {
          body: { marketData }
        });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching Gemini insights:', error);
        toast.error('Failed to load AI insights');
        throw error;
      }
    },
    enabled: !!marketData
  });

  if (isLoading) {
    return (
      <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
          <div className="h-4 bg-white/10 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  if (!insights) return null;

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
      <h3 className="text-lg font-semibold text-white mb-6">AI Market Insights</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-400 mt-1" />
            <div>
              <h4 className="font-medium text-white mb-2">Opportunities</h4>
              <p className="text-sm text-white/60">{insights.opportunities}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-green-400 mt-1" />
            <div>
              <h4 className="font-medium text-white mb-2">Growth Potential</h4>
              <p className="text-sm text-white/60">{insights.growth}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-1" />
            <div>
              <h4 className="font-medium text-white mb-2">Risk Factors</h4>
              <p className="text-sm text-white/60">{insights.risks}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-purple-400 mt-1" />
            <div>
              <h4 className="font-medium text-white mb-2">Strategic Recommendations</h4>
              <p className="text-sm text-white/60">{insights.recommendations}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}