import { useState } from "react";
import { LayoutDashboard, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function BuyerDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: firms, isLoading } = useQuery({
    queryKey: ['firms', searchQuery],
    queryFn: async () => {
      console.log("Fetching firms with search:", searchQuery);
      let query = supabase
        .from('canary_firms_data')
        .select('*');
      
      if (searchQuery) {
        query = query.or(`Company Name.ilike.%${searchQuery}%,Primary Subtitle.ilike.%${searchQuery}%,specialities.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(10);
      
      if (error) {
        console.error("Error fetching firms:", error);
        throw error;
      }

      return data;
    }
  });

  return (
    <main className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-2 mb-8">
        <LayoutDashboard className="w-6 h-6 text-blue-500" />
        <h1 className="text-2xl font-bold">Buyer Dashboard</h1>
      </div>
      
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search firms by name, subtitle, or specialties..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading firms...</p>
        ) : firms?.length === 0 ? (
          <p className="text-center text-muted-foreground">No firms found</p>
        ) : (
          firms?.map((firm) => (
            <Card key={firm["Company ID"]} className="p-4">
              <h3 className="font-semibold text-lg mb-2">{firm["Company Name"]}</h3>
              <p className="text-muted-foreground text-sm mb-1">{firm["Primary Subtitle"]}</p>
              {firm.specialities && (
                <p className="text-muted-foreground text-sm">Specialties: {firm.specialities}</p>
              )}
              <div className="mt-2 text-sm text-muted-foreground">
                {firm.Location && <p>Location: {firm.Location}</p>}
                {firm.employeeCount && <p>Employees: {firm.employeeCount}</p>}
              </div>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}