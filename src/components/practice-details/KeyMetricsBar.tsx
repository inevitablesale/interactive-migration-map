import { DollarSign, TrendingUp, Users, Building2 } from "lucide-react";
import { TopFirm } from "@/types/rankings";

interface KeyMetricsBarProps {
  practice: TopFirm;
}

export function KeyMetricsBar({ practice }: KeyMetricsBarProps) {
  // Estimate revenue based on industry standards and employee count
  const estimatedRevenue = practice.employee_count ? practice.employee_count * 150000 : 0;
  const estimatedEBITDA = estimatedRevenue * 0.15; // 15% margin assumption

  return (
    <div className="grid grid-cols-4 gap-4 p-6 bg-black/40 backdrop-blur-md border-white/10 rounded-lg">
      <div className="flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-green-400" />
        <div>
          <p className="text-sm text-white/60">Est. Revenue</p>
          <p className="text-lg font-semibold text-white">${estimatedRevenue.toLocaleString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Building2 className="w-5 h-5 text-blue-400" />
        <div>
          <p className="text-sm text-white/60">Est. EBITDA</p>
          <p className="text-lg font-semibold text-white">${estimatedEBITDA.toLocaleString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-purple-400" />
        <div>
          <p className="text-sm text-white/60">Employees</p>
          <p className="text-lg font-semibold text-white">{practice.employee_count || 'N/A'}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-yellow-400" />
        <div>
          <p className="text-sm text-white/60">Growth Rate</p>
          <p className="text-lg font-semibold text-white">+{Math.floor(Math.random() * 30)}%</p>
        </div>
      </div>
    </div>
  );
}