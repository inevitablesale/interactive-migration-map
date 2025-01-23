import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterState) => void;
}

export interface FilterState {
  industry?: string;
  minEmployees?: string;
  maxEmployees?: string;
  minRevenue?: string;
  maxRevenue?: string;
  state?: string;
  minValuation?: string;
  maxValuation?: string;
}

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" }
];

export function SearchFilters({ onSearch, onFilter }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({});
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: industries } = useQuery({
    queryKey: ['industries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canary_firms_data')
        .select('"Primary Subtitle"')
        .not('"Primary Subtitle"', 'is', null);
      
      if (error) throw error;

      const uniqueIndustries = Array.from(new Set(data.map(item => item['Primary Subtitle'])))
        .filter(Boolean)
        .sort();

      return uniqueIndustries;
    }
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { 
      ...filters, 
      [key]: value === "all" ? undefined : value 
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const clearFilters = () => {
    setFilters({});
    onFilter({});
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value && value !== "").length;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search firms by specialty (tax, audit, wealth management, etc.)"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => handleSearch("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Firms</SheetTitle>
              <SheetDescription>
                Refine your search with specific criteria
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select
                  onValueChange={(value) => handleFilterChange('industry', value)}
                  value={filters.industry || "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industries?.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>State</Label>
                <Select
                  onValueChange={(value) => handleFilterChange('state', value)}
                  value={filters.state || "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {US_STATES.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Employee Count Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minEmployees || ""}
                    onChange={(e) => handleFilterChange('minEmployees', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxEmployees || ""}
                    onChange={(e) => handleFilterChange('maxEmployees', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Est. Gross Revenue</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minRevenue || ""}
                    onChange={(e) => handleFilterChange('minRevenue', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxRevenue || ""}
                    onChange={(e) => handleFilterChange('maxRevenue', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Est. Valuation</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minValuation || ""}
                    onChange={(e) => handleFilterChange('minValuation', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxValuation || ""}
                    onChange={(e) => handleFilterChange('maxValuation', e.target.value)}
                  />
                </div>
              </div>

              {getActiveFilterCount() > 0 && (
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="mt-2"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}