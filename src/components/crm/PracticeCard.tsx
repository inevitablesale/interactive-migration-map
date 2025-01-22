import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{practice.industry}</h3>
          <p className="text-sm text-muted-foreground">{practice.region}</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={onWithdraw}>
            Withdraw
          </Button>
          <Button size="sm" onClick={onExpressInterest}>
            Express Interest
          </Button>
          <Link to={`/practice/${practice.id}`}>
            <Button variant="secondary" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
        <div>
          <p className="text-muted-foreground">Employees</p>
          <p>{practice.employee_count}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Est. Gross Revenue</p>
          <p>{formatCurrency(estimatedRevenue)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Est. EBITDA</p>
          <p>{formatCurrency(estimatedEbitda)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Est. Valuation</p>
          <p>{formatCurrency(estimatedValuation)}</p>
        </div>
      </div>
    </div>
  );
}