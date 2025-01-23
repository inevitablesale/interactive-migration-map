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
    practice_buyer_pool: any[];
    notes: any[];
    specialities?: string;
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
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{practice.industry}</h3>
            <div className="flex items-center text-sm text-gray-600">
              <Building className="h-4 w-4 mr-1" />
              {practice.region}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onWithdraw}
              className="text-gray-600 hover:text-gray-900"
            >
              Withdraw
            </Button>
            <Button 
              size="sm"
              onClick={onExpressInterest}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Express Interest
            </Button>
            <Link to={`/practice/${practice.id}`}>
              <Button variant="secondary" size="sm">
                View Details
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Users className="h-4 w-4 mr-1" />
              Employees
            </div>
            <p className="text-lg font-semibold text-gray-900">{practice.employee_count}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <DollarSign className="h-4 w-4 mr-1" />
              Est. Revenue
            </div>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(estimatedRevenue)}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <DollarSign className="h-4 w-4 mr-1" />
              Est. EBITDA
            </div>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(estimatedEbitda)}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <DollarSign className="h-4 w-4 mr-1" />
              Est. Value
            </div>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(estimatedValuation)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}