import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building, Users, DollarSign } from "lucide-react";

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
  };
  onWithdraw: () => void;
  onExpressInterest: () => void;
}

export function PracticeCard({ practice, onWithdraw, onExpressInterest }: PracticeCardProps) {
  // Calculate financial metrics based on employee count
  const avgSalaryPerEmployee = 86259; // Industry average
  const annualPayroll = practice.employee_count ? practice.employee_count * avgSalaryPerEmployee : 0;
  const payrollToRevenueRatio = 0.35; // Industry standard: payroll is typically 35% of revenue
  const estimatedRevenue = annualPayroll / payrollToRevenueRatio;
  const ebitdaMargin = 0.25; // Industry average EBITDA margin
  const estimatedEbitda = estimatedRevenue * ebitdaMargin;
  const valuationMultiple = 2.5; // Industry standard multiple for professional services firms
  const estimatedValuation = estimatedEbitda * valuationMultiple;

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  const hasExpressedInterest = practice.status === 'interested';

  // Parse location to get city and state
  const [city, state] = practice.region.includes(",") ? 
    practice.region.split(",").map(part => part.trim()) : 
    [practice.region, ""];

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-white/10">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">{practice.industry}</h3>
            <div className="flex items-center text-sm text-white/60 bg-white/5 px-3 py-1 rounded-full">
              <Building className="h-4 w-4 mr-2" />
              {city}{state ? `, ${state}` : ''}
            </div>
          </div>
          <div className="flex gap-2">
            {hasExpressedInterest && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onWithdraw}
                className="text-white/60 hover:text-white border-white/10 hover:border-white/20 bg-white/5"
              >
                Withdraw
              </Button>
            )}
            <Button 
              size="sm"
              onClick={onExpressInterest}
              className="bg-yellow-400 text-black hover:bg-yellow-500"
            >
              {hasExpressedInterest ? 'Interested' : 'Express Interest'}
            </Button>
            <Link to={`/practice/${practice.id}`}>
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-white/10 text-white hover:bg-white/20"
              >
                View Details
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
            <div className="flex items-center text-sm text-white/60 mb-2">
              <Users className="h-4 w-4 mr-2" />
              Employees
            </div>
            <p className="text-base sm:text-lg font-semibold text-white">{practice.employee_count}</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
            <div className="flex items-center text-sm text-white/60 mb-2">
              <DollarSign className="h-4 w-4 mr-2" />
              Est. Revenue
            </div>
            <p className="text-base sm:text-lg font-semibold text-white">{formatCurrency(estimatedRevenue)}</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
            <div className="flex items-center text-sm text-white/60 mb-2">
              <DollarSign className="h-4 w-4 mr-2" />
              Est. EBITDA
            </div>
            <p className="text-base sm:text-lg font-semibold text-white">{formatCurrency(estimatedEbitda)}</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
            <div className="flex items-center text-sm text-white/60 mb-2">
              <DollarSign className="h-4 w-4 mr-2" />
              Est. Value
            </div>
            <p className="text-base sm:text-lg font-semibold text-white">{formatCurrency(estimatedValuation)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}