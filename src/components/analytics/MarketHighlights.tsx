import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function MarketHighlights() {
  const [activeTab, setActiveTab] = useState("growth");

  const { data: growthLeaders } = useQuery({
    queryKey: ['growthLeaders'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_top_growth_regions');
      if (error) throw error;
      return data;
    }
  });

  const { data: competitiveInsights } = useQuery({
    queryKey: ['competitiveInsights'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_competitive_analysis');
      if (error) throw error;
      return data;
    }
  });

  const { data: serviceSpecialization } = useQuery({
    queryKey: ['serviceSpecialization'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_service_distribution');
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-black/60">
          <TabsTrigger 
            value="growth"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            Growth Leaders
          </TabsTrigger>
          <TabsTrigger 
            value="competitive"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            Competitive Insights
          </TabsTrigger>
          <TabsTrigger 
            value="service"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            Service Specialization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="growth">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white/60">Region</TableHead>
                <TableHead className="text-white/60">Growth Rate</TableHead>
                <TableHead className="text-white/60">Firms/10k Population</TableHead>
                <TableHead className="text-white/60">Total Population</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {growthLeaders?.map((item) => (
                <TableRow key={`${item.county_name}-${item.state_name}`} className="border-white/10">
                  <TableCell className="text-white">{`${item.county_name}, ${item.state_name}`}</TableCell>
                  <TableCell className="text-blue-400">{`${item.growth_rate}%`}</TableCell>
                  <TableCell className="text-white/80">{item.firm_density.toFixed(1)}</TableCell>
                  <TableCell className="text-white/80">{item.total_population.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="competitive">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white/60">Region</TableHead>
                <TableHead className="text-white/60">Firm Density</TableHead>
                <TableHead className="text-white/60">Market Concentration</TableHead>
                <TableHead className="text-white/60">Competition Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitiveInsights?.map((item) => (
                <TableRow key={item.statefp} className="border-white/10">
                  <TableCell className="text-white">State {item.statefp}</TableCell>
                  <TableCell>{(item.total_firms / 10000).toFixed(1)}/10k</TableCell>
                  <TableCell className="text-blue-400">{`${item.market_concentration.toFixed(1)}%`}</TableCell>
                  <TableCell>{item.competition_level}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="service">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white/60">Region</TableHead>
                <TableHead className="text-white/60">Service Type</TableHead>
                <TableHead className="text-white/60">Specialty Count</TableHead>
                <TableHead className="text-white/60">Market Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceSpecialization?.map((item, index) => (
                <TableRow key={`${item.statefp}-${index}`} className="border-white/10">
                  <TableCell className="text-white">State {item.statefp}</TableCell>
                  <TableCell>{item.specialities}</TableCell>
                  <TableCell className="text-white/80">{item.specialty_count.toLocaleString()}</TableCell>
                  <TableCell className="text-blue-400">{`${item.specialty_percentage.toFixed(1)}%`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </Card>
  );
}