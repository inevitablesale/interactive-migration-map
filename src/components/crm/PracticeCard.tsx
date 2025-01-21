import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Users, Building2, DollarSign, PieChart, Eye, X, MessageSquare } from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'owner_engaged':
      return 'bg-green-500';
    case 'negotiation':
      return 'bg-blue-500';
    case 'closed':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
};

interface PracticeCardProps {
  practice: {
    id: string;
    industry: string;
    region: string;
    employee_count: number;
    annual_revenue: number;
    service_mix: { [key: string]: number };
    status: string;
    last_updated: string;
    practice_buyer_pool?: { id: string }[];
  };
  onWithdraw?: (id: string) => void;
}

export function PracticeCard({ practice, onWithdraw }: PracticeCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl font-semibold">{practice.industry}</CardTitle>
        <Badge className={`${getStatusColor(practice.status)} text-white`}>
          {practice.status.replace('_', ' ')}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{practice.region}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{practice.employee_count} employees</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">${(practice.annual_revenue / 1000).toFixed(0)}k revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {Object.entries(practice.service_mix)
                .map(([key, value]) => `${value}% ${key}`)
                .join(', ')}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Last update: {format(new Date(practice.last_updated), 'MMM d, yyyy')}
          </div>
          <div className="text-sm">
            {practice.practice_buyer_pool?.length || 0} interested buyers
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Practice Details</DialogTitle>
              </DialogHeader>
              {/* Add detailed view content here */}
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm">
            <MessageSquare className="mr-2 h-4 w-4" />
            Add Note
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onWithdraw?.(practice.id)}
          >
            <X className="mr-2 h-4 w-4" />
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}