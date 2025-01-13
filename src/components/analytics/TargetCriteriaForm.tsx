import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export interface TargetCriteria {
  industryType: string;
  minEmployees: number;
  maxEmployees: number;
  targetMarket: string;
}

interface TargetCriteriaFormProps {
  onAnalyze: (criteria: TargetCriteria) => void;
  isAnalyzing: boolean;
}

export function TargetCriteriaForm({ onAnalyze, isAnalyzing }: TargetCriteriaFormProps) {
  const [criteria, setCriteria] = useState<TargetCriteria>({
    industryType: "accounting",
    minEmployees: 1,
    maxEmployees: 1000,
    targetMarket: "all"
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (criteria.minEmployees > criteria.maxEmployees) {
      toast({
        title: "Invalid range",
        description: "Minimum employees cannot be greater than maximum employees",
        variant: "destructive"
      });
      return;
    }
    onAnalyze(criteria);
  };

  return (
    <Card className="bg-black/40 border-white/10">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="industryType">Industry Type</Label>
          <Select
            value={criteria.industryType}
            onValueChange={(value) => setCriteria({ ...criteria, industryType: value })}
          >
            <SelectTrigger id="industryType">
              <SelectValue placeholder="Select industry type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="accounting">Accounting</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minEmployees">Min Employees</Label>
            <Input
              id="minEmployees"
              type="number"
              min={1}
              value={criteria.minEmployees}
              onChange={(e) => setCriteria({ ...criteria, minEmployees: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxEmployees">Max Employees</Label>
            <Input
              id="maxEmployees"
              type="number"
              min={1}
              value={criteria.maxEmployees}
              onChange={(e) => setCriteria({ ...criteria, maxEmployees: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetMarket">Target Market</Label>
          <Select
            value={criteria.targetMarket}
            onValueChange={(value) => setCriteria({ ...criteria, targetMarket: value })}
          >
            <SelectTrigger id="targetMarket">
              <SelectValue placeholder="Select target market" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Markets</SelectItem>
              <SelectItem value="small-business">Small Business</SelectItem>
              <SelectItem value="mid-market">Mid Market</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Analyzing..." : "Run Analysis"}
        </Button>
      </form>
    </Card>
  );
}