import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function PracticeCard({ practice, onWithdraw, onExpressInterest }: {
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
}) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <div>
            <h3 className="font-semibold">{practice.industry}</h3>
            <p className="text-sm text-muted-foreground">{practice.region}</p>
          </div>
          
          <div className="flex gap-8">
            <div>
              <p className="text-muted-foreground text-sm">Employees</p>
              <p className="text-sm">{practice.employee_count}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Revenue</p>
              <p className="text-sm">${practice.annual_revenue.toLocaleString()}</p>
            </div>
            {practice.specialities && (
              <div>
                <p className="text-muted-foreground text-sm">Specialties</p>
                <p className="text-sm">{practice.specialities}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
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
    </div>
  );
}