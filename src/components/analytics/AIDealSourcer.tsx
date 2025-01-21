import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { MultiStepForm } from "./deal-sourcer/MultiStepForm";

export const AIDealSourcer = () => {
  const { data: buyerProfiles, isLoading } = useQuery({
    queryKey: ['buyerProfiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('buyer_profiles')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Filter active profiles
  const activeProfiles = buyerProfiles?.filter(profile => 
    profile.subscription_tier !== 'inactive'
  ) || [];

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2">AI Deal Sourcer</h2>
          <p className="text-gray-400">Let our AI help you find the perfect acquisition target.</p>
        </div>
        
        <MultiStepForm profiles={activeProfiles} />
      </div>
    </Card>
  );
};