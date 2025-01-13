import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Users, Building2, DollarSign, Briefcase } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { PracticeAreaStats } from "@/types/analytics";

export function AnalyticsDashboard() {
  const { data: practiceMetrics, isLoading } = useQuery({
    queryKey: ['practiceMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canary_firms_data')
        .select('specialities, employeeCount, "State Name"')
        .not('specialities', 'is', null);
      
      if (error) throw error;

      // Process specialties data
      const specialtiesMap = new Map<string, PracticeAreaStats>();
      
      data.forEach(firm => {
        if (!firm.specialities) return;
        
        const specialties = firm.specialities.split(',').map(s => s.trim());
        specialties.forEach(specialty => {
          if (!specialtiesMap.has(specialty)) {
            specialtiesMap.set(specialty, {
              name: specialty,
              firmCount: 0,
              totalEmployees: 0,
              avgEmployees: 0,
              states: new Set(),
              marketCoverage: 0
            });
          }
          const stats = specialtiesMap.get(specialty)!;
          stats.firmCount += 1;
          stats.totalEmployees += firm.employeeCount || 0;
          if (firm["State Name"]) {
            stats.states.add(firm["State Name"]);
          }
        });
      });

      // Convert map to array and calculate averages
      return Array.from(specialtiesMap.values())
        .map(stats => ({
          ...stats,
          avgEmployees: Math.round(stats.totalEmployees / stats.firmCount),
          marketCoverage: stats.states.size,
          states: Array.from(stats.states)
        }))
        .sort((a, b) => b.firmCount - a.firmCount)
        .slice(0, 10);
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  const topPractice = practiceMetrics?.[0];

  const metrics = [
    {
      title: "Top Practice Areas",
      value: topPractice?.name || "Loading...",
      change: `${topPractice?.firmCount || 0} firms`,
      icon: Briefcase,
      description: "Most common specialty",
      action: "View all practices"
    },
    {
      title: "Market Coverage",
      value: topPractice?.marketCoverage || 0,
      change: "states",
      icon: Building2,
      description: "Geographic reach of top practice",
      action: "Explore coverage"
    },
    {
      title: "Practice Size",
      value: topPractice?.avgEmployees?.toLocaleString() || "0",
      change: "avg employees",
      icon: Users,
      description: "Average firm size in top practice",
      action: "Size breakdown"
    }
  ];

  const chartData = practiceMetrics?.map(practice => ({
    name: practice.name,
    firms: practice.firmCount,
    employees: practice.avgEmployees
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.title} className="p-4 bg-black/40 border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <metric.icon className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-medium text-white">{metric.title}</h3>
              </div>
              <span className="text-xs text-green-400">{metric.change}</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{metric.description}</span>
              <button className="text-xs text-blue-400 hover:text-blue-300">
                {metric.action} →
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-black/40 border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Practice Area Distribution</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                stroke="#ffffff60"
                fontSize={12}
              />
              <YAxis stroke="#ffffff60" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#000000dd',
                  border: '1px solid #ffffff20',
                  borderRadius: '4px'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="firms" fill="#3b82f6" name="Number of Firms" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6 bg-black/40 border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Top Practice Areas</h3>
          <div className="space-y-4">
            {practiceMetrics?.slice(0, 5).map((practice, index) => (
              <div key={practice.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-400">{index + 1}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{practice.name}</div>
                    <div className="text-xs text-white/60">{practice.firmCount} firms</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">
                    {practice.avgEmployees} avg employees
                  </div>
                  <div className="text-xs text-white/60">
                    {practice.marketCoverage} states
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-black/40 border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Geographic Distribution</h3>
          <div className="space-y-4">
            {practiceMetrics?.[0]?.states.slice(0, 5).map((state, index) => (
              <div key={state} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-sm font-medium text-white">{state}</div>
                </div>
                <div className="text-sm text-white/60">
                  {practiceMetrics?.[0]?.name}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}