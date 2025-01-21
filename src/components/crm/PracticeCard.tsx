import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Users, Building2, DollarSign, PieChart, Eye, X, MessageSquare, Heart, ChartPie } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'owner_engaged':
      return 'bg-green-500';
    case 'negotiation':
      return 'bg-blue-500';
    case 'closed':
      return 'bg-yellow-500';
    case 'not_contacted':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'owner_engaged':
      return 'Owner Engaged';
    case 'negotiation':
      return 'In Negotiation';
    case 'closed':
      return 'Closed';
    case 'not_contacted':
      return 'Not Contacted';
    default:
      return status.replace(/_/g, ' ');
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
    specialities?: string;
  };
  onWithdraw?: (id: string) => void;
  onExpressInterest?: (id: string) => void;
}

export function PracticeCard({ practice, onWithdraw, onExpressInterest }: PracticeCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const hasExpressedInterest = practice.practice_buyer_pool && practice.practice_buyer_pool.length > 0;

  // Parse specialties into an array
  const specialties = practice.specialities ? 
    practice.specialities.split(',').map(s => s.trim()) : 
    ['General Practice'];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl font-semibold">{practice.industry}</CardTitle>
        <Badge className={`${getStatusColor(practice.status)} text-white`}>
          {getStatusDisplay(practice.status)}
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-2">
                    <ChartPie className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">Specialties</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="p-2">
                    {specialties.map((specialty, index) => (
                      <div key={index} className="text-sm">
                        • {specialty}
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
              <Button variant="outline" size="sm" className="w-[110px]">
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Practice Details</DialogTitle>
              </DialogHeader>
              {/* Add detailed view content here */}
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm" className="w-[110px]">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
          
          {hasExpressedInterest ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onWithdraw?.(practice.id)}
              className="w-[110px] text-red-500 hover:text-red-600"
            >
              <X className="mr-2 h-4 w-4" />
              Withdraw
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onExpressInterest?.(practice.id)}
              className="w-[110px] text-blue-500 hover:text-blue-600"
            >
              <Heart className="mr-2 h-4 w-4" />
              Express Interest
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}