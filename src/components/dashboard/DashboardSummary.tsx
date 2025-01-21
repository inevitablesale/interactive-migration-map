import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function DashboardSummary() {
  const { data: summary } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const { data: practices } = await supabase
        .from('tracked_practices')
        .select(`
          *,
          practice_buyer_pool (*)
        `);

      if (!practices) return { total: 0, pending: 0, avgPoolSize: 0 };

      const total = practices.length;
      const pending = practices.filter(p => p.status === 'pending_response').length;
      const avgPoolSize = practices.reduce((acc, p) => 
        acc + (p.practice_buyer_pool?.length || 0), 0) / (total || 1);

      return { total, pending, avgPoolSize: Math.round(avgPoolSize) };
    }
  });

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Practices</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary?.total || 0}</div>
          <p className="text-xs text-muted-foreground">practices in progress</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Awaiting Response</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary?.pending || 0}</div>
          <p className="text-xs text-muted-foreground">practices pending</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Pool Size</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary?.avgPoolSize || 0}</div>
          <p className="text-xs text-muted-foreground">buyers per practice</p>
        </CardContent>
      </Card>
    </div>
  );
}