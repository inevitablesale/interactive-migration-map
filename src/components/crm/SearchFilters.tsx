import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
}

export function SearchFilters({ onSearch, onFilter }: SearchFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search practices..."
            className="pl-9"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => onFilter({})}>
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>
    </div>
  );
}