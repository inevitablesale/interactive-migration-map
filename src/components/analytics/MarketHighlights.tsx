import { useState } from "react";
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

const growthLeaders = [
  {
    region: "Jefferson County",
    growthRate: "+25%",
    firmDensity: "5.5",
    avgPayroll: "$1.8M",
  },
  {
    region: "Helena, MT",
    growthRate: "+22%",
    firmDensity: "4.3",
    avgPayroll: "$1.4M",
  },
  {
    region: "Kalispell, MT",
    growthRate: "+19%",
    firmDensity: "3.8",
    avgPayroll: "$1.2M",
  },
];

const competitiveInsights = [
  {
    region: "Florida",
    firmDensity: "6.5/10k",
    growthRate: "+12%",
    stability: "High",
  },
  {
    region: "Tennessee",
    firmDensity: "5.9/10k",
    growthRate: "+10%",
    stability: "Medium",
  },
  {
    region: "California",
    firmDensity: "4.3/10k",
    growthRate: "+8%",
    stability: "High",
  },
];

const serviceSpecialization = [
  {
    region: "Nebraska",
    service: "Tax Advisory",
    firmDensity: "3.5",
    growthRate: "+15%",
  },
  {
    region: "Colorado",
    service: "Bookkeeping Services",
    firmDensity: "5.7",
    growthRate: "+20%",
  },
  {
    region: "Washington",
    service: "Payroll Management",
    firmDensity: "4.8",
    growthRate: "+18%",
  },
];

export function MarketHighlights() {
  const [activeTab, setActiveTab] = useState("growth");
  const navigate = useNavigate();

  const handleRowClick = (region: string) => {
    // Extract county and state from region string
    if (region.includes(",")) {
      // For format like "Helena, MT"
      const [county, state] = region.split(",").map(s => s.trim());
      navigate(`/market-report/${county}/${state}`);
    } else if (region.includes("County")) {
      // For format like "Jefferson County"
      const [county, _] = region.split(" County");
      navigate(`/market-report/${county}/MT`);
    } else {
      // For single state names
      navigate(`/state-market-report/${region}`);
    }
  };

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
                <TableHead className="text-white/60">Growth Rate (YoY)</TableHead>
                <TableHead className="text-white/60">Avg Firms/10k</TableHead>
                <TableHead className="text-white/60">Avg Payroll</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {growthLeaders.map((item) => (
                <TableRow 
                  key={item.region} 
                  className="border-white/10 cursor-pointer hover:bg-white/5"
                  onClick={() => handleRowClick(item.region)}
                >
                  <TableCell className="text-white">{item.region}</TableCell>
                  <TableCell className="text-blue-400">{item.growthRate}</TableCell>
                  <TableCell className="text-white/80">{item.firmDensity}</TableCell>
                  <TableCell className="text-white/80">{item.avgPayroll}</TableCell>
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
                <TableHead className="text-white/60">Avg Growth Rate</TableHead>
                <TableHead className="text-white/60">Economic Stability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitiveInsights.map((item) => (
                <TableRow 
                  key={item.region} 
                  className="border-white/10 cursor-pointer hover:bg-white/5"
                  onClick={() => handleRowClick(item.region)}
                >
                  <TableCell className="text-white">{item.region}</TableCell>
                  <TableCell>{item.firmDensity}</TableCell>
                  <TableCell className="text-blue-400">{item.growthRate}</TableCell>
                  <TableCell>{item.stability}</TableCell>
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
                <TableHead className="text-white/60">Specialized Service</TableHead>
                <TableHead className="text-white/60">Avg Firms/10k</TableHead>
                <TableHead className="text-white/60">Growth Rate (YoY)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceSpecialization.map((item) => (
                <TableRow 
                  key={item.region} 
                  className="border-white/10 cursor-pointer hover:bg-white/5"
                  onClick={() => handleRowClick(item.region)}
                >
                  <TableCell className="text-white">{item.region}</TableCell>
                  <TableCell>{item.service}</TableCell>
                  <TableCell>{item.firmDensity}</TableCell>
                  <TableCell className="text-blue-400">{item.growthRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </Card>
  );
}