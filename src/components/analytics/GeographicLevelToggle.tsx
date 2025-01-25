import { MapPin } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GeographicLevel } from "@/types/geography";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";

interface GeographicLevelToggleProps {
  value: GeographicLevel;
  onChange: (value: GeographicLevel) => void;
}

export const GeographicLevelToggle = ({ value, onChange }: GeographicLevelToggleProps) => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter');

  const { data: profile } = useQuery({
    queryKey: ['buyerProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('deal_sourcing_forms')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const isFreeTier = !profile || profile.buyer_type === 'free';

  const handleFilterChange = (filter: string) => {
    if (isFreeTier && filter === 'opportunities') {
      toast({
        title: "Premium Feature",
        description: "Upgrade to access advanced analytics and opportunities.",
        variant: "default",
      });
      return;
    }
    setSearchParams({ filter });
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white/80">Analysis Type:</label>
      <ToggleGroup
        type="single"
        value={activeFilter || 'market-entry'}
        onValueChange={handleFilterChange}
        className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-1"
      >
        <ToggleGroupItem
          value="market-entry"
          className="data-[state=on]:bg-blue-500/20 data-[state=on]:text-blue-400"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Market Entry
        </ToggleGroupItem>
        <ToggleGroupItem
          value="growth-strategy"
          className="data-[state=on]:bg-blue-500/20 data-[state=on]:text-blue-400"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Growth Strategy
        </ToggleGroupItem>
        <ToggleGroupItem
          value="opportunities"
          className="data-[state=on]:bg-blue-500/20 data-[state=on]:text-blue-400"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Opportunities
          {isFreeTier && (
            <span className="ml-1 text-xs text-yellow-500">PRO</span>
          )}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};