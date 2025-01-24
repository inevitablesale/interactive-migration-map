import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building, Users, DollarSign } from "lucide-react";
import { ServiceIcons } from "./ServiceIcons";

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
    avgSalaryPerEmployee?: number;
    COUNTYFP?: number;
    STATEFP?: number;
    COUNTYNAME?: string;
    specialities?: string;
  };
  onWithdraw: () => void;
  onExpressInterest: () => void;
}

export function PracticeCard({ practice }: PracticeCardProps) {
  // Parse location to get city and state
  const [city, state] = practice.region.includes(",") ? 
    practice.region.split(",").map(part => part.trim()) : 
    [practice.region, ""];

  // Calculate revenue using exact same logic as KeyMetricsBar
  const avgSalaryPerEmployee = practice.avgSalaryPerEmployee ? practice.avgSalaryPerEmployee * 1000 : 86259 * 1000;
  const annualPayroll = practice.employee_count ? practice.employee_count * avgSalaryPerEmployee : 0;
  const payrollToRevenueRatio = 0.35;
  const estimatedRevenue = annualPayroll * (1/payrollToRevenueRatio);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  return (
    <div className="group relative min-h-[200px] sm:min-h-[250px] w-full bg-gradient-to-br from-[#1A1F2C] to-[#221F26] backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#9b87f5]/10 hover:border-[#9b87f5]/20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      
      <div className="relative p-4 sm:p-6 h-full flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 sm:mb-6">
          <div className="w-full sm:w-auto">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 group-hover:text-[#9b87f5] transition-colors duration-300">
              {practice.generated_title || practice.industry}
            </h3>
            <div className="flex items-center text-sm text-white/60 bg-black/20 px-3 py-1 rounded-full w-fit border border-white/5">
              <Building className="h-4 w-4 mr-2 text-[#0EA5E9]" />
              {city}{state ? `, ${state}` : ''}
            </div>
            {practice.specialities && (
              <ServiceIcons specialities={practice.specialities} />
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Link to={`/practice/${practice.id}`} className="w-full sm:w-auto">
              <Button 
                variant="secondary" 
                size="sm"
                className="w-full bg-[#8B5CF6] hover:bg-[#9b87f5] text-white border-none transition-all duration-300"
              >
                View Details
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-4">
          <div className="bg-black/20 rounded-lg p-3 sm:p-4 border border-white/5 hover:border-[#9b87f5]/20 transition-colors duration-300">
            <div className="flex items-center text-sm text-white/60 mb-2">
              <Users className="h-4 w-4 mr-2 text-[#33C3F0]" />
              Employees
            </div>
            <p className="text-base sm:text-lg font-semibold text-white">{practice.employee_count}</p>
          </div>

          <div className="bg-black/20 rounded-lg p-3 sm:p-4 border border-white/5 hover:border-[#9b87f5]/20 transition-colors duration-300">
            <div className="flex items-center text-sm text-white/60 mb-2">
              <DollarSign className="h-4 w-4 mr-2 text-[#0EA5E9]" />
              Est. Gross Revenue
            </div>
            <p className="text-base sm:text-lg font-semibold text-white">{formatCurrency(estimatedRevenue)}</p>
            <p className="text-xs text-white/40 mt-1">Based on payroll data</p>
          </div>
        </div>
      </div>
    </div>
  );
}