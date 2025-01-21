import { Header } from "@/components/Header";
import { CommandBar } from "@/components/CommandBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Search } from "lucide-react";
import Map from "@/components/Map";

export default function Analysis() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: counties } = useQuery({
    queryKey: ["counties", searchQuery],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("county_data")
        .select("COUNTYNAME, STATEFP, STNAME")
        .ilike("COUNTYNAME", `%${searchQuery}%`)
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: searchQuery.length > 2,
  });

  const handleCountyClick = (county: string, state: string) => {
    navigate(`/market-report/${county}/${state}`);
  };

  return (
    <div className="min-h-screen bg-[#111111]">
      <Header />
      <CommandBar />
      
      <div className="max-w-7xl mx-auto p-6 pt-32">
        <div className="relative">
          <div className="absolute inset-0 -z-10">
            <Map />
          </div>
          
          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Market Analysis</h1>
            
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for a county..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/40 border-white/10 text-white"
              />
            </div>

            {counties && counties.length > 0 && (
              <div className="mt-4 space-y-2">
                {counties.map((county) => (
                  <Button
                    key={`${county.COUNTYNAME}-${county.STATEFP}`}
                    variant="ghost"
                    className="w-full justify-between text-white hover:bg-white/10"
                    onClick={() => handleCountyClick(county.COUNTYNAME, county.STNAME)}
                  >
                    <span>{county.COUNTYNAME}, {county.STNAME}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}