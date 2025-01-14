import { useState } from "react";
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
import type { CountyRanking } from "@/types/analytics";

interface MarketHighlightsProps {
  rankingsData?: CountyRanking[];
}

export function MarketHighlights({ rankingsData }: MarketHighlightsProps) {
  const [activeTab, setActiveTab] = useState("growth");

  // Process rankings data
  const growthLeaders = rankingsData 
    ? [...rankingsData]
        .sort((a, b) => (b.growth_rate || 0) - (a.growth_rate || 0))
        .slice(0, 3)
        .map(region => ({
          region: region.countyname,
          growthRate: `+${region.growth_rate?.toFixed(1)}%`,
          firmDensity: region.firm_density.toFixed(1),
          avgPayroll: `$${((region.total_firms || 0) * 1000).toLocaleString()}`,
        }))
    : [];

  const competitiveInsights = rankingsData
    ? [...rankingsData]
        .sort((a, b) => b.firm_density - a.firm_density)
        .slice(0, 3)
        .map(region => ({
          region: region.countyname,
          firmDensity: `${region.firm_density.toFixed(1)}/10k`,
          growthRate: `+${region.growth_rate?.toFixed(1)}%`,
          stability: region.growth_rate && region.growth_rate > 10 ? "High" : "Medium",
        }))
    : [];

  const serviceSpecialization = rankingsData
    ? [...rankingsData]
        .sort((a, b) => b.total_firms - a.total_firms)
        .slice(0, 3)
        .map(region => ({
          region: region.countyname,
          service: "Professional Services",
          firmDensity: region.firm_density.toFixed(1),
          growthRate: `+${region.growth_rate?.toFixed(1)}%`,
        }))
    : [];

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
                <TableRow key={item.region} className="border-white/10">
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
                <TableRow key={item.region} className="border-white/10">
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
                <TableRow key={item.region} className="border-white/10">
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