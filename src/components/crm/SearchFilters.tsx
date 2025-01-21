import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
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

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
}

export function SearchFilters({ onSearch, onFilter }: SearchFiltersProps) {
  const [filters, setFilters] = useState({
    industry: '',
    minEmployees: '',
    maxEmployees: '',
    minRevenue: '',
    maxRevenue: '',
    region: '',
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter({
      ...newFilters,
      minEmployees: newFilters.minEmployees ? parseInt(newFilters.minEmployees) : undefined,
      maxEmployees: newFilters.maxEmployees ? parseInt(newFilters.maxEmployees) : undefined,
      minRevenue: newFilters.minRevenue ? parseInt(newFilters.minRevenue) * 1000 : undefined,
      maxRevenue: newFilters.maxRevenue ? parseInt(newFilters.maxRevenue) * 1000 : undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by industry or region..."
            className="pl-9"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Practices</SheetTitle>
              <SheetDescription>
                Refine your search with specific criteria
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select
                  onValueChange={(value) => handleFilterChange('industry', value)}
                  value={filters.industry}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Industries</SelectItem>
                    <SelectItem value="Accounting">Accounting</SelectItem>
                    <SelectItem value="Consulting">Consulting</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Region</Label>
                <Select
                  onValueChange={(value) => handleFilterChange('region', value)}
                  value={filters.region}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Regions</SelectItem>
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
                    value={filters.minEmployees}
                    onChange={(e) => handleFilterChange('minEmployees', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxEmployees}
                    onChange={(e) => handleFilterChange('maxEmployees', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Annual Revenue Range (in thousands)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minRevenue}
                    onChange={(e) => handleFilterChange('minRevenue', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxRevenue}
                    onChange={(e) => handleFilterChange('maxRevenue', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}