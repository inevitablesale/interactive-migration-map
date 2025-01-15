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

  // Fetch available counties from county_rankings
  const { data: availableCounties } = useQuery({
    queryKey: ['availableCounties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('county_rankings')
        .select('COUNTYNAME, STATEFP')
        .order('COUNTYNAME');
      
      if (error) {
        console.error('Error fetching available counties:', error);
        throw error;
      }
      return data;
    }
  });

  const handleRowClick = (region: string) => {
    try {
      // Only proceed if we have the county data
      const countyName = region.split(",")[0].trim();
      const stateAbbr = region.split(",")[1].trim();
      
      const countyExists = availableCounties?.some(
        county => county.COUNTYNAME === (countyName.endsWith(" County") ? countyName : `${countyName} County`)
      );

      if (!countyExists) {
        toast.error("Market report not available for this region");
        return;
      }

      if (region.includes(",")) {
        const [city, stateAbbr] = region.split(",").map(s => s.trim());
        const stateName = stateMap[stateAbbr] || stateAbbr;
        navigate(`/market-report/${city}/${stateName}`);
      } else if (region.includes("County")) {
        navigate(`/market-report/${encodeURIComponent(region)}/${stateMap['MT']}`);
      } else {
        const stateName = stateMap[region] || region;
        navigate(`/state-market-report/${stateName}`);
      }
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
              {availableCounties?.some(county => county.COUNTYNAME === "Helena County") && (
                <TableRow className="cursor-pointer hover:bg-gray-100/5" onClick={() => handleRowClick("Helena, MT")}>
                  <TableCell className="font-medium">Helena, MT</TableCell>
                  <TableCell>8.2%</TableCell>
                  <TableCell>12.3</TableCell>
                  <TableCell>245</TableCell>
                  <TableCell>85,000</TableCell>
                </TableRow>
              )}
              {availableCounties?.some(county => county.COUNTYNAME === "Jefferson County") && (
                <TableRow className="cursor-pointer hover:bg-gray-100/5" onClick={() => handleRowClick("Jefferson County")}>
                  <TableCell className="font-medium">Jefferson County</TableCell>
                  <TableCell>7.5%</TableCell>
                  <TableCell>10.8</TableCell>
                  <TableCell>180</TableCell>
                  <TableCell>65,000</TableCell>
                </TableRow>
              )}
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
              {availableCounties?.some(county => county.COUNTYNAME === "Gallatin County") && (
                <TableRow className="cursor-pointer hover:bg-gray-100/5" onClick={() => handleRowClick("Gallatin County")}>
                  <TableCell className="font-medium">Gallatin County</TableCell>
                  <TableCell>5.2</TableCell>
                  <TableCell>12,500</TableCell>
                  <TableCell>Underserved</TableCell>
                  <TableCell>High</TableCell>
                </TableRow>
              )}
              {availableCounties?.some(county => county.COUNTYNAME === "Missoula County") && (
                <TableRow className="cursor-pointer hover:bg-gray-100/5" onClick={() => handleRowClick("Missoula County")}>
                  <TableCell className="font-medium">Missoula County</TableCell>
                  <TableCell>6.8</TableCell>
                  <TableCell>8,900</TableCell>
                  <TableCell>Growing</TableCell>
                  <TableCell>Medium</TableCell>
                </TableRow>
              )}
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
              {availableCounties?.some(county => county.COUNTYNAME === "Lewis and Clark County") && (
                <TableRow className="cursor-pointer hover:bg-gray-100/5" onClick={() => handleRowClick("Lewis and Clark County")}>
                  <TableCell className="font-medium">Lewis and Clark County</TableCell>
                  <TableCell>$1,200</TableCell>
                  <TableCell>8.5</TableCell>
                  <TableCell>4.2%</TableCell>
                  <TableCell>85</TableCell>
                </TableRow>
              )}
              {availableCounties?.some(county => county.COUNTYNAME === "Flathead County") && (
                <TableRow className="cursor-pointer hover:bg-gray-100/5" onClick={() => handleRowClick("Flathead County")}>
                  <TableCell className="font-medium">Flathead County</TableCell>
                  <TableCell>$1,350</TableCell>
                  <TableCell>7.2</TableCell>
                  <TableCell>3.8%</TableCell>
                  <TableCell>82</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </Card>
  );
}