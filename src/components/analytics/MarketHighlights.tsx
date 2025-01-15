import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function MarketHighlights() {
  const navigate = useNavigate();

  // Fetch top growth markets data
  const { data: growthMarkets } = useQuery({
    queryKey: ['topGrowthRegions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_top_growth_regions')
        .limit(5);
      
      if (error) {
        console.error('Error fetching growth markets:', error);
        throw error;
      }
      return data;
    }
  });

  // Fetch underserved markets data
  const { data: underservedMarkets } = useQuery({
    queryKey: ['underservedRegions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_underserved_regions')
        .limit(5);
      
      if (error) {
        console.error('Error fetching underserved markets:', error);
        throw error;
      }
      return data;
    }
  });

  // Fetch affordable talent hubs data
  const { data: affordableHubs } = useQuery({
    queryKey: ['affordableTalentHubs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_affordable_talent_hubs')
        .limit(5);
      
      if (error) {
        console.error('Error fetching affordable hubs:', error);
        throw error;
      }
      return data;
    }
  });

  const handleRowClick = (region: string, state: string) => {
    try {
      if (!region || !state) {
        toast.error("Invalid region data");
        return;
      }

      // Clean up county name if needed
      const countyName = region.endsWith(" County") ? region : `${region} County`;
      navigate(`/market-report/${encodeURIComponent(countyName)}/${encodeURIComponent(state)}`);
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Unable to navigate to the selected market report");
    }
  };

  return (
    <Card className="col-span-3">
      <Tabs defaultValue="growth" className="p-6">
        <TabsList className="mb-4">
          <TabsTrigger value="growth">Growth Markets</TabsTrigger>
          <TabsTrigger value="underserved">Underserved Markets</TabsTrigger>
          <TabsTrigger value="affordable">Affordable Talent Hubs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="growth">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead>Growth Rate</TableHead>
                <TableHead>Firm Density</TableHead>
                <TableHead>Total Firms</TableHead>
                <TableHead>Population</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {growthMarkets?.map((market) => (
                <TableRow 
                  key={`${market.county_name}-${market.state_name}`}
                  className="cursor-pointer hover:bg-gray-100/5"
                  onClick={() => handleRowClick(market.county_name, market.state_name)}
                >
                  <TableCell className="font-medium">{market.county_name}</TableCell>
                  <TableCell>{market.growth_rate}%</TableCell>
                  <TableCell>{market.firm_density}</TableCell>
                  <TableCell>{market.total_firms}</TableCell>
                  <TableCell>{market.total_population?.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="underserved">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead>Firms per 10k</TableHead>
                <TableHead>Recent Movers</TableHead>
                <TableHead>Market Status</TableHead>
                <TableHead>Opportunity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {underservedMarkets?.map((market) => (
                <TableRow 
                  key={`${market.county_name}-${market.state_name}`}
                  className="cursor-pointer hover:bg-gray-100/5"
                  onClick={() => handleRowClick(market.county_name, market.state_name)}
                >
                  <TableCell className="font-medium">{market.county_name}</TableCell>
                  <TableCell>{market.firms_per_10k_population}</TableCell>
                  <TableCell>{market.recent_movers?.toLocaleString()}</TableCell>
                  <TableCell>{market.market_status}</TableCell>
                  <TableCell>{market.opportunity_status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="affordable">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead>Median Rent</TableHead>
                <TableHead>Accountant Density</TableHead>
                <TableHead>Vacancy Rate</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {affordableHubs?.map((hub) => (
                <TableRow 
                  key={`${hub.county_name}`}
                  className="cursor-pointer hover:bg-gray-100/5"
                  onClick={() => handleRowClick(hub.county_name, 'MT')} // Assuming MT for now, should be dynamic
                >
                  <TableCell className="font-medium">{hub.county_name}</TableCell>
                  <TableCell>${hub.median_rent?.toLocaleString()}</TableCell>
                  <TableCell>{hub.accountant_density}</TableCell>
                  <TableCell>{hub.vacancy_rate}%</TableCell>
                  <TableCell>{Math.round(hub.affordability_score)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </Card>
  );
}