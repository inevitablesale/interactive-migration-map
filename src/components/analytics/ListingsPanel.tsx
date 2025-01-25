import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Building, Users, DollarSign } from "lucide-react";

interface ListingsPanelProps {
  practices?: any[];
  isLoading?: boolean;
}

export function ListingsPanel({ practices = [], isLoading = false }: ListingsPanelProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("all");
  const [filteredPractices, setFilteredPractices] = useState(practices);
  
  // Replace isFreeTier references with a constant
  const isFreeTier = true; // Default to free tier

  useEffect(() => {
    if (selectedTab === "all") {
      setFilteredPractices(practices);
    } else {
      setFilteredPractices(practices.filter(practice => practice.status === selectedTab));
    }
  }, [selectedTab, practices]);

  const handleViewDetails = (practiceId: string) => {
    if (isFreeTier && filteredPractices.length > 3) {
      toast({
        title: "Upgrade Required",
        description: "Please upgrade to view more practices.",
        variant: "destructive",
      });
      return;
    }
    navigate(`/practice/${practiceId}`);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
      <TabsList>
        <TabsTrigger value="all">All Listings</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="closed">Closed</TabsTrigger>
      </TabsList>

      <TabsContent value={selectedTab}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPractices.map((practice, index) => (
            <Card key={practice.id} className="p-4">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">{practice.industry}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Building className="h-4 w-4 mr-2" />
                    {practice.region}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{practice.employee_count} employees</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>{formatCurrency(practice.annual_revenue)}</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <Button
                    onClick={() => handleViewDetails(practice.id)}
                    className="w-full"
                    variant={isFreeTier && index >= 3 ? "secondary" : "default"}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}