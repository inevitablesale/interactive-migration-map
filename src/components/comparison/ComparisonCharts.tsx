import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card } from "@/components/ui/card";

interface ComparisonChartsProps {
  stateData: any[];
  statesList: any[];
}

export function ComparisonCharts({ stateData, statesList }: ComparisonChartsProps) {
  if (!stateData?.length) return null;

  const chartData = stateData.map(state => ({
    name: statesList?.find(s => s.fips_code === state.STATEFP)?.state || `State ${state.STATEFP}`,
    employees: state.EMP || 0,
    payroll: state.PAYANN || 0,
    establishments: state.ESTAB || 0,
    income: state.B19013_001E || 0
  }));

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-black/40 backdrop-blur-md border-white/10">
        <h3 className="text-sm font-medium text-white mb-4">Employment & Establishments</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px'
              }}
            />
            <Legend />
            <Bar dataKey="employees" name="Employees" fill="#3B82F6" />
            <Bar dataKey="establishments" name="Establishments" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-4 bg-black/40 backdrop-blur-md border-white/10">
        <h3 className="text-sm font-medium text-white mb-4">Economic Indicators</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px'
              }}
            />
            <Legend />
            <Bar dataKey="payroll" name="Annual Payroll" fill="#F59E0B" />
            <Bar dataKey="income" name="Median Income" fill="#EC4899" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}