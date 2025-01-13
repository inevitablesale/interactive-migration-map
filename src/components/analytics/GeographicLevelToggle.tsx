import { MapPin } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GeographicLevel } from "@/types/geography";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GeographicLevelToggleProps {
  value: GeographicLevel;
  onChange: (value: GeographicLevel) => void;
}

export const GeographicLevelToggle = ({ value, onChange }: GeographicLevelToggleProps) => {
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ['buyerProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('buyer_profiles')
        .select('subscription_tier')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const isFreeTier = !profile || profile.subscription_tier === 'free';

  const handleValueChange = (newValue: GeographicLevel) => {
    if (isFreeTier && newValue === 'county') {
      toast({
        title: "Premium Feature",
        description: "Upgrade to access county-level data analysis.",
        variant: "default",
      });
      return;
    }
    onChange(newValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white/80">View Data By:</label>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={handleValueChange}
        className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-1"
      >
        <ToggleGroupItem
          value="state"
          className="data-[state=on]:bg-blue-500/20 data-[state=on]:text-blue-400"
        >
          <MapPin className="w-4 h-4 mr-2" />
          State
        </ToggleGroupItem>
        <ToggleGroupItem
          value="msa"
          className="data-[state=on]:bg-blue-500/20 data-[state=on]:text-blue-400"
        >
          <MapPin className="w-4 h-4 mr-2" />
          MSA
        </ToggleGroupItem>
        <ToggleGroupItem
          value="county"
          className="data-[state=on]:bg-blue-500/20 data-[state=on]:text-blue-400"
        >
          <MapPin className="w-4 h-4 mr-2" />
          County
          {isFreeTier && (
            <span className="ml-1 text-xs text-yellow-500">PRO</span>
          )}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};