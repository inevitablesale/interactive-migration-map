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
  region?: string;
  speciality?: string;
}

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

  const { data: specialities } = useQuery({
    queryKey: ['specialities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canary_firms_data')
        .select('specialities')
        .not('specialities', 'is', null);
      
      if (error) throw error;

      const uniqueSpecialities = Array.from(new Set(data.map(item => item.specialities)))
        .filter(Boolean)
        .sort();

      return uniqueSpecialities;
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
            placeholder="Search firms by speciality..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch(e.target.value);
            }}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => {
                setSearchQuery("");
                onSearch("");
              }}
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
                <Label>Speciality</Label>
                <Select
                  onValueChange={(value) => handleFilterChange('speciality', value)}
                  value={filters.speciality || "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select speciality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialities</SelectItem>
                    {specialities?.map((speciality) => (
                      <SelectItem key={speciality} value={speciality}>
                        {speciality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Region</Label>
                <Select
                  onValueChange={(value) => handleFilterChange('region', value)}
                  value={filters.region || "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="Northeast">Northeast</SelectItem>
                    <SelectItem value="Southeast">Southeast</SelectItem>
                    <SelectItem value="Midwest">Midwest</SelectItem>
                    <SelectItem value="Southwest">Southwest</SelectItem>
                    <SelectItem value="West">West</SelectItem>
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