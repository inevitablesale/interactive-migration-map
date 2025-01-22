import { format } from "date-fns";
import { Building2, Users, DollarSign, Clock, Eye, MessageSquare, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { FirmDetailsSheet } from "./FirmDetailsSheet";

interface Practice {
  id: string;
  industry: string;
  region: string;
  employee_count: number;
  annual_revenue: number;
  service_mix: { [key: string]: number };
  status: string;
  last_updated: string;
  practice_buyer_pool: { id: string }[];
  specialities?: string;
  notes?: string;
}

interface PracticeCardProps {
  practice: Practice;
  onWithdraw?: (id: string) => void;
  onExpressInterest?: (id: string) => void;
  disabled?: boolean;
}

export function PracticeCard({ practice, onWithdraw, onExpressInterest, disabled }: PracticeCardProps) {
  const [selectedNotes, setSelectedNotes] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const hasExpressedInterest = practice.status === 'pending_outreach';
  const hasNotes = practice.notes && practice.notes.trim().length > 0;

  // Generate a three-word title from the industry and specialities
  const generateTitle = () => {
    const words = practice.specialities?.split(/[.,!? ]+/).filter(word => word.length > 2) || [];
    if (words.length >= 2) {
      return `${practice.industry} ${words[0]} ${words[1]}`;
    } else if (words.length === 1) {
      return `${practice.industry} ${words[0]} Practice`;
    }
    return `${practice.industry} Practice`;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">
            {generateTitle()}
          </h3>
          <div className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
            {practice.status === 'pending_outreach' ? 'Contact Pending' : 'Not Contacted'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gray-500" />
            <span>{practice.region}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            <span>{practice.employee_count} employees</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-500" />
            <span>${(practice.annual_revenue || 0).toLocaleString()}k revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <span>{practice.specialities || 'Specialties'}</span>
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-500 border-t pt-4">
          <div>Last update: {format(new Date(practice.last_updated), 'MMM dd, yyyy')}</div>
          <div>{practice.practice_buyer_pool.length} interested buyers</div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant="outline"
            className={`w-full flex items-center justify-center gap-2 ${!hasNotes ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!hasNotes}
            onClick={() => hasNotes && setSelectedNotes(practice.notes)}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">View Notes</span>
          </Button>
          
          <Button 
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setIsDetailsOpen(true)}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">View Details</span>
          </Button>
          
          <Button 
            variant={hasExpressedInterest ? "outline" : "default"}
            className={`w-full flex items-center justify-center gap-2 ${
              hasExpressedInterest ? 'text-gray-500' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            onClick={() => !hasExpressedInterest && onExpressInterest?.(practice.id)}
            disabled={hasExpressedInterest || disabled}
          >
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">
              {hasExpressedInterest ? 'Contact Pending' : 'Express Interest'}
            </span>
          </Button>
        </div>
      </div>

      <Dialog open={!!selectedNotes} onOpenChange={() => setSelectedNotes(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notes</DialogTitle>
          </DialogHeader>
          <div className="mt-4 whitespace-pre-wrap">
            {selectedNotes}
          </div>
        </DialogContent>
      </Dialog>

      <FirmDetailsSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        practice={practice}
      />
    </Card>
  );
}