import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building, Users } from "lucide-react";

interface PracticeCardProps {
  practice: {
    id: string;
    industry: string;
    region: string;
    employee_count: number;
    annual_revenue: number;
    service_mix: Record<string, number>;
    status: string;
    last_updated: string;
    generated_title?: string;
  };
  onWithdraw: () => void;
  onExpressInterest: () => void;
}

export function PracticeCard({ practice }: PracticeCardProps) {
  // Parse location to get city and state
  const [city, state] = practice.region.includes(",") ? 
    practice.region.split(",").map(part => part.trim()) : 
    [practice.region, ""];

  return (
    <div className="min-h-[200px] sm:min-h-[250px] w-full bg-black/40 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-white/10">
      <div className="p-4 sm:p-6 h-full flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 sm:mb-6">
          <div className="w-full sm:w-auto">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{practice.generated_title || practice.industry}</h3>
            <div className="flex items-center text-sm text-white/60 bg-white/5 px-3 py-1 rounded-full w-fit">
              <Building className="h-4 w-4 mr-2" />
              {city}{state ? `, ${state}` : ''}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Link to={`/practice/${practice.id}`} className="w-full sm:w-auto">
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-white/10 text-white hover:bg-white/20 w-full"
              >
                View Details
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-auto">
          <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
            <div className="flex items-center text-sm text-white/60 mb-2">
              <Users className="h-4 w-4 mr-2" />
              Employees
            </div>
            <p className="text-base sm:text-lg font-semibold text-white truncate">{practice.employee_count}</p>
          </div>
        </div>
      </div>
    </div>
  );
}