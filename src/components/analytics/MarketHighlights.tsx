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
    <Card className="p-6 bg-[#403E43]/60 backdrop-blur-md border-[#555555]/20">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-[#333333]/60">
          <TabsTrigger 
            value="growth"
            className="data-[state=active]:bg-[#D3E4FD]/20 data-[state=active]:text-[#D3E4FD]"
          >
            Growth Leaders
          </TabsTrigger>
          <TabsTrigger 
            value="competitive"
            className="data-[state=active]:bg-[#D3E4FD]/20 data-[state=active]:text-[#D3E4FD]"
          >
            Competitive Insights
          </TabsTrigger>
          <TabsTrigger 
            value="service"
            className="data-[state=active]:bg-[#D3E4FD]/20 data-[state=active]:text-[#D3E4FD]"
          >
            Service Specialization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="growth">
          <Table>
            <TableHeader>
              <TableRow className="border-[#555555]/20">
                <TableHead className="text-[#C8C8C9]">Region</TableHead>
                <TableHead className="text-[#C8C8C9]">Growth Rate (YoY)</TableHead>
                <TableHead className="text-[#C8C8C9]">Avg Firms/10k</TableHead>
                <TableHead className="text-[#C8C8C9]">Avg Payroll</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {growthLeaders.map((item) => (
                <TableRow key={item.region} className="border-[#555555]/20">
                  <TableCell className="text-[#F1F0FB]">{item.region}</TableCell>
                  <TableCell className="text-[#D3E4FD]">{item.growthRate}</TableCell>
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
              <TableRow className="border-[#555555]/20">
                <TableHead className="text-[#C8C8C9]">Region</TableHead>
                <TableHead className="text-[#C8C8C9]">Firm Density</TableHead>
                <TableHead className="text-[#C8C8C9]">Avg Growth Rate</TableHead>
                <TableHead className="text-[#C8C8C9]">Economic Stability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitiveInsights.map((item) => (
                <TableRow key={item.region} className="border-[#555555]/20">
                  <TableCell className="text-[#F1F0FB]">{item.region}</TableCell>
                  <TableCell>{item.firmDensity}</TableCell>
                  <TableCell className="text-[#D3E4FD]">{item.growthRate}</TableCell>
                  <TableCell>{item.stability}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="service">
          <Table>
            <TableHeader>
              <TableRow className="border-[#555555]/20">
                <TableHead className="text-[#C8C8C9]">Region</TableHead>
                <TableHead className="text-[#C8C8C9]">Specialized Service</TableHead>
                <TableHead className="text-[#C8C8C9]">Avg Firms/10k</TableHead>
                <TableHead className="text-[#C8C8C9]">Growth Rate (YoY)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceSpecialization.map((item) => (
                <TableRow key={item.region} className="border-[#555555]/20">
                  <TableCell className="text-[#F1F0FB]">{item.region}</TableCell>
                  <TableCell>{item.service}</TableCell>
                  <TableCell>{item.firmDensity}</TableCell>
                  <TableCell className="text-[#D3E4FD]">{item.growthRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
