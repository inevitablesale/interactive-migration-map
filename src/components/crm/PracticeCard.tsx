import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Users, Building2, DollarSign, Clock, Eye, X, MessageSquare, Heart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'engaged':
      return 'bg-emerald-500';
    case 'negotiation':
      return 'bg-blue-500';
    case 'closed':
      return 'bg-yellow-500';
    case 'not_contacted':
    default:
      return 'bg-gray-500';
  }
};

const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'engaged':
      return 'Engaged';
    case 'negotiation':
      return 'In Negotiation';
    case 'closed':
      return 'Closed';
    case 'not_contacted':
    default:
      return 'Not Contacted';
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

  const specialties = practice.specialities ? 
    practice.specialities.split(',').map(s => s.trim()) : 
    ['General Practice'];

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base sm:text-lg font-semibold truncate max-w-[60%]">
          {practice.industry}
        </CardTitle>
        <Badge className={`${getStatusColor(practice.status)} text-white px-2 py-0.5 text-xs whitespace-nowrap ml-2`}>
          {getStatusDisplay(practice.status)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Building2 className="h-4 w-4 flex-shrink-0 text-gray-500" />
            <span className="text-xs sm:text-sm truncate">{practice.region}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <Users className="h-4 w-4 flex-shrink-0 text-gray-500" />
            <span className="text-xs sm:text-sm">{practice.employee_count} employees</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <DollarSign className="h-4 w-4 flex-shrink-0 text-gray-500" />
            <span className="text-xs sm:text-sm">${(practice.annual_revenue / 1000).toFixed(0)}k revenue</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-2">
                  <Clock className="h-4 w-4 flex-shrink-0 text-gray-500" />
                  <span className="text-xs sm:text-sm">Specialties</span>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="p-2">
                    {specialties.map((specialty, index) => (
                      <div key={index} className="text-xs whitespace-nowrap">
                        • {specialty}
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t pt-2 gap-1">
          <div className="text-xs text-gray-500">
            Last update: {format(new Date(practice.last_updated), 'MMM d, yyyy')}
          </div>
          <div className="text-xs">
            {practice.practice_buyer_pool?.length || 0} interested buyers
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 sm:gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full h-8 px-2 text-xs">
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Add Note</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Practice Details</DialogTitle>
              </DialogHeader>
              {/* Add detailed view content here */}
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm" className="w-full h-8 px-2 text-xs">
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">View Details</span>
          </Button>
          
          {hasExpressedInterest ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onWithdraw?.(practice.id)}
              className="w-full h-8 px-2 text-xs text-red-500 hover:text-red-600"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Withdraw</span>
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onExpressInterest?.(practice.id)}
              className="w-full h-8 px-2 text-xs text-blue-500 hover:text-blue-600"
            >
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Express Interest</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}