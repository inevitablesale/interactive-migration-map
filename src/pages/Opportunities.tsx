import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Users,
  TrendingUp,
  Building2,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Map from "@/components/Map";

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
  'https://images.unsplash.com/photo-1518770660439-4636190af475',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
];

interface FirmFilters {
  state?: string;
  employeeMin?: number;
  employeeMax?: number;
  specialization?: string;
}

export default function Opportunities() {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FirmFilters>({});
  const [employeeRange, setEmployeeRange] = useState([0, 100]);

  // Updated query to use correct column name
  const { data: states } = useQuery({
    queryKey: ['states'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canary_firms_data')
        .select('"State Name"')
        .not('State Name', 'is', null)
        .order('State Name');
      
      if (error) {
        console.error('Error fetching states:', error);
        throw error;
      }
      
      // Get unique state names
      const uniqueStates = [...new Set(data.map(d => d['State Name']))];
      return uniqueStates;
    }
  });

  // Query to fetch firms based on filters
  const { data: firms, isLoading } = useQuery({
    queryKey: ['opportunities', filters],
    queryFn: async () => {
      let query = supabase
        .from('canary_firms_data')
        .select('*')
        .order('employeeCount', { ascending: false });

      if (filters.state) {
        query = query.eq('State Name', filters.state);
      }
      if (filters.employeeMin) {
        query = query.gte('employeeCount', filters.employeeMin);
      }
      if (filters.employeeMax) {
        query = query.lte('employeeCount', filters.employeeMax);
      }
      if (filters.specialization) {
        query = query.ilike('specialities', `%${filters.specialization}%`);
      }

      const { data, error } = await query.limit(10);
      
      if (error) {
        console.error('Error fetching firms:', error);
        throw error;
      }
      
      return data;
    },
    enabled: true // Always fetch initial data
  });

  const getRandomPlaceholder = () => {
    return PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
  };

  const handleSaveOpportunity = () => {
    toast({
      title: "Premium Feature",
      description: "Upgrade to save opportunities",
    });
  };

  const handleContactFirm = () => {
    toast({
      title: "Premium Feature",
      description: "Upgrade to contact firms",
    });
  };

  const handleEmployeeRangeChange = (value: number[]) => {
    setEmployeeRange(value);
    setFilters(prev => ({
      ...prev,
      employeeMin: value[0],
      employeeMax: value[1]
    }));
  };

  const handleStateChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      state: value
    }));
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-white/10 p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Firm Opportunities</h1>
          <p className="text-white/60">
            Discover curated acquisition opportunities tailored to your preferences
          </p>
        </div>
      </div>

      <div className="container mx-auto py-8">
        {/* Filters */}
        <Card className="bg-black/40 backdrop-blur-sm border-white/10 p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-white/60" />
            <h2 className="text-lg font-semibold text-white">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/80">State</label>
              <Select
                onValueChange={handleStateChange}
                value={filters.state}
              >
                <SelectTrigger className="h-12 bg-black/60 border-white/10 text-white ring-offset-black">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="bg-black/95 border-white/10 text-white">
                  {states?.map((state) => (
                    <SelectItem 
                      key={state} 
                      value={state}
                      className="hover:bg-white/10 focus:bg-white/10 focus:text-white"
                    >
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-white/80">Employee Count Range</label>
              <Slider
                defaultValue={[0, 100]}
                max={100}
                step={1}
                value={employeeRange}
                onValueChange={handleEmployeeRangeChange}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-white/60">
                <span>{employeeRange[0]}</span>
                <span>{employeeRange[1]}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-white/80">Specialization</label>
              <Input
                className="h-12 bg-black/60 border-white/10 text-white placeholder:text-white/40"
                placeholder="Enter specialization"
                onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
              />
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <p className="text-white/60">Loading opportunities...</p>
          </div>
        )}

        {/* No Results State */}
        {!isLoading && firms?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-white/60">No firms found matching your criteria.</p>
          </div>
        )}

        {/* Firm Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {firms?.map((firm) => (
            <Card 
              key={firm["Company ID"]} 
              className="bg-black/40 backdrop-blur-sm border-white/10 p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex gap-6">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={firm.logoResolutionResult || firm.originalCoverImage || getRandomPlaceholder()}
                    alt={`${firm["Company Name"]} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{firm["Company Name"]}</h3>
                    <div className="flex items-center gap-2 text-white/60">
                      <MapPin className="w-4 h-4" />
                      <span>{firm["State Name"]}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="text-sm text-white/60">Employees</div>
                        <div className="text-white font-medium">{firm.employeeCount}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-green-400" />
                      <div>
                        <div className="text-sm text-white/60">Specialties</div>
                        <div className="text-white font-medium line-clamp-1">
                          {firm.specialities || "General Practice"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-yellow-400" />
                      <div>
                        <div className="text-sm text-white/60">Growth</div>
                        <div className="flex items-center gap-1">
                          {Math.random() > 0.5 ? (
                            <>
                              <ArrowUpRight className="w-4 h-4 text-green-400" />
                              <span className="text-green-400">+{Math.floor(Math.random() * 30)}%</span>
                            </>
                          ) : (
                            <>
                              <ArrowDownRight className="w-4 h-4 text-red-400" />
                              <span className="text-red-400">-{Math.floor(Math.random() * 30)}%</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="text-sm text-white/60">Revenue/Employee</div>
                        <div className="text-white font-medium">
                          ${Math.floor(80 + Math.random() * 40)}K
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="secondary" 
                      className="w-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                      onClick={handleSaveOpportunity}
                    >
                      Save Opportunity
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="w-full bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      onClick={handleContactFirm}
                    >
                      Contact Firm
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Map Section */}
        <Card className="bg-black/40 backdrop-blur-sm border-white/10 overflow-hidden h-[500px]">
          <Map />
        </Card>
      </div>
    </div>
  );
}
