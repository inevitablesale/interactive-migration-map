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
  const valuationMultiple = 1.0; // Conservative valuation multiple
  const estimatedValuation = estimatedRevenue * valuationMultiple;

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white/90 mb-1">{practice.industry}</h3>
            <div className="flex items-center text-sm text-white/70">
              <Building className="h-4 w-4 mr-1" />
              {practice.region}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onWithdraw}
              className="text-white/70 hover:text-white border-white/20 hover:border-white/40 hover:bg-white/5"
            >
              Withdraw
            </Button>
            <Button 
              size="sm"
              onClick={onExpressInterest}
              className="bg-yellow-400 text-black hover:bg-yellow-500"
            >
              Express Interest
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

        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
            <div className="flex items-center text-sm text-white/70 mb-1">
              <Users className="h-4 w-4 mr-1" />
              Employees
            </div>
            <p className="text-lg font-semibold text-white">{practice.employee_count}</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
            <div className="flex items-center text-sm text-white/70 mb-1">
              <DollarSign className="h-4 w-4 mr-1" />
              Est. Revenue
            </div>
            <p className="text-lg font-semibold text-white">{formatCurrency(estimatedRevenue)}</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
            <div className="flex items-center text-sm text-white/70 mb-1">
              <DollarSign className="h-4 w-4 mr-1" />
              Est. EBITDA
            </div>
            <p className="text-lg font-semibold text-white">{formatCurrency(estimatedEbitda)}</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
            <div className="flex items-center text-sm text-white/70 mb-1">
              <DollarSign className="h-4 w-4 mr-1" />
              Est. Value
            </div>
            <p className="text-lg font-semibold text-white">{formatCurrency(estimatedValuation)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}