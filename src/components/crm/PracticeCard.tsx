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
    notes?: string;
  };
  onWithdraw?: (id: string) => void;
  onExpressInterest?: (id: string) => void;
}

export function PracticeCard({ practice, onWithdraw, onExpressInterest }: PracticeCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const hasExpressedInterest = practice.practice_buyer_pool && practice.practice_buyer_pool.length > 0;
  const hasNotes = practice.notes && practice.notes.trim().length > 0;

  const specialties = practice.specialities ? 
    practice.specialities.split(',').map(s => s.trim()) : 
    ['General Practice'];

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[clamp(0.75rem,2vw,1rem)] font-semibold truncate max-w-[60%]">
          {practice.industry}
        </CardTitle>
        <Badge className={`${getStatusColor(practice.status)} text-white px-2 py-0.5 text-[clamp(0.65rem,1.5vw,0.75rem)] whitespace-nowrap ml-2`}>
          {getStatusDisplay(practice.status)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Building2 className="h-4 w-4 flex-shrink-0 text-gray-500" />
            <span className="text-[clamp(0.7rem,1.5vw,0.875rem)] truncate">{practice.region}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <Users className="h-4 w-4 flex-shrink-0 text-gray-500" />
            <span className="text-[clamp(0.7rem,1.5vw,0.875rem)]">{practice.employee_count} employees</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <DollarSign className="h-4 w-4 flex-shrink-0 text-gray-500" />
            <span className="text-[clamp(0.7rem,1.5vw,0.875rem)]">${(practice.annual_revenue / 1000).toFixed(0)}k revenue</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-2">
                  <Clock className="h-4 w-4 flex-shrink-0 text-gray-500" />
                  <span className="text-[clamp(0.7rem,1.5vw,0.875rem)]">Specialties</span>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="p-2">
                    {specialties.map((specialty, index) => (
                      <div key={index} className="text-[clamp(0.65rem,1.5vw,0.75rem)] whitespace-nowrap">
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
          <div className="text-[clamp(0.65rem,1.5vw,0.75rem)] text-gray-500">
            Last update: {format(new Date(practice.last_updated), 'MMM d, yyyy')}
          </div>
          <div className="text-[clamp(0.65rem,1.5vw,0.75rem)]">
            {practice.practice_buyer_pool?.length || 0} interested buyers
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 sm:gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className={`w-full h-[clamp(2rem,4vw,2.5rem)] px-3 text-[clamp(0.7rem,1.5vw,0.875rem)] flex items-center justify-center min-w-0 ${!hasNotes ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!hasNotes}
              >
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">View Notes</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Practice Notes</DialogTitle>
              </DialogHeader>
              <div className="mt-4 whitespace-pre-wrap">
                {practice.notes}
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            className="w-full h-[clamp(2rem,4vw,2.5rem)] px-3 text-[clamp(0.7rem,1.5vw,0.875rem)] flex items-center justify-center min-w-0"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 flex-shrink-0" />
            <span className="hidden sm:inline">View Details</span>
          </Button>
          
          {hasExpressedInterest ? (
            <Button 
              variant="outline" 
              onClick={() => onWithdraw?.(practice.id)}
              className="w-full h-[clamp(2rem,4vw,2.5rem)] px-2 text-[clamp(0.7rem,1.5vw,0.875rem)] text-red-500 hover:text-red-600 flex items-center justify-center"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Withdraw</span>
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => onExpressInterest?.(practice.id)}
              className="w-full h-[clamp(2rem,4vw,2.5rem)] px-2 text-[clamp(0.7rem,1.5vw,0.875rem)] text-blue-500 hover:text-blue-600 flex items-center justify-center"
            >
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Express Interest</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}