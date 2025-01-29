import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Clock, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function DashboardSummary() {
  const { data: summary } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return { total: 0, pending: 0, responded: 0 };

      // Get the user's interests
      const { data: userInterests } = await supabase
        .from('canary_firm_interests')
        .select(`
          *,
          canary_firms_data!inner (*)
        `)
        .eq('user_id', user.id);

      if (!userInterests) return { total: 0, pending: 0, responded: 0 };

      const total = userInterests.length;
      const notInterested = userInterests.filter(i => 
        i.status === 'not_interested'
      ).length;
      const connected = userInterests.filter(i => 
        i.status === 'interested'
      ).length;

      return { total, notInterested, connected };
    }
  });

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Shortlisted Practices</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary?.total || 0}</div>
          <p className="text-xs text-muted-foreground">practices in progress</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Not Interested</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary?.notInterested || 0}</div>
          <p className="text-xs text-muted-foreground">practices not interested</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Connected</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary?.connected || 0}</div>
          <p className="text-xs text-muted-foreground">practices connected</p>
        </CardContent>
      </Card>
    </div>
  );
}