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

  return (
    <Card className="p-6 bg-[#1A1F2C]/60 backdrop-blur-md border-[#6E59A5]/20">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-[#221F26]/60">
          <TabsTrigger 
            value="growth"
            className="data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]"
          >
            Growth Leaders
          </TabsTrigger>
          <TabsTrigger 
            value="competitive"
            className="data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]"
          >
            Competitive Insights
          </TabsTrigger>
          <TabsTrigger 
            value="service"
            className="data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]"
          >
            Service Specialization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="growth">
          <Table>
            <TableHeader>
              <TableRow className="border-[#6E59A5]/20">
                <TableHead className="text-[#8E9196]">Region</TableHead>
                <TableHead className="text-[#8E9196]">Growth Rate (YoY)</TableHead>
                <TableHead className="text-[#8E9196]">Avg Firms/10k</TableHead>
                <TableHead className="text-[#8E9196]">Avg Payroll</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {growthLeaders.map((item) => (
                <TableRow key={item.region} className="border-[#6E59A5]/20">
                  <TableCell className="text-[#F1F0FB]">{item.region}</TableCell>
                  <TableCell className="text-[#9b87f5]">{item.growthRate}</TableCell>
                  <TableCell>{item.firmDensity}</TableCell>
                  <TableCell>{item.avgPayroll}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="competitive">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead>Firm Density</TableHead>
                <TableHead>Avg Growth Rate</TableHead>
                <TableHead>Economic Stability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitiveInsights.map((item) => (
                <TableRow key={item.region}>
                  <TableCell>{item.region}</TableCell>
                  <TableCell>{item.firmDensity}</TableCell>
                  <TableCell>{item.growthRate}</TableCell>
                  <TableCell>{item.stability}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="service">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead>Specialized Service</TableHead>
                <TableHead>Avg Firms/10k</TableHead>
                <TableHead>Growth Rate (YoY)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceSpecialization.map((item) => (
                <TableRow key={item.region}>
                  <TableCell>{item.region}</TableCell>
                  <TableCell>{item.service}</TableCell>
                  <TableCell>{item.firmDensity}</TableCell>
                  <TableCell>{item.growthRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
