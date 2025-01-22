import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export default function StateMarketReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: reportData, error } = await supabase
        .from("state_market_reports")
        .select("*")
        .ilike("state_name", `%${searchQuery}%`);

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setData(reportData);
      }
      setLoading(false);
    };

    fetchData();
  }, [searchQuery]);

  return (
    <main className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search by state name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">Filters</Button>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading reports...</p>
      ) : data.length === 0 ? (
        <p className="text-center text-muted-foreground">No reports found</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {data.map((report) => (
            <Card key={report.id} className="p-6">
              <h3 className="text-lg font-semibold">{report.state_name}</h3>
              <p className="text-sm text-gray-500">Report ID: {report.id}</p>
              <p className="mt-2">{report.description}</p>
              <div className="flex justify-between text-sm text-gray-500 border-t pt-4">
                <div>Last updated: {format(new Date(report.updated_at), 'MMM dd, yyyy')}</div>
                <div>{report.status}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
