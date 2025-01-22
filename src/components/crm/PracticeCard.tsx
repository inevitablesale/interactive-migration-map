import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Building2, ArrowRight } from 'lucide-react';

interface PracticeCardProps {
  practice: {
    name: string;
    location: string;
    state: string;
    employeeCount: number;
    revenue: number;
    description?: string;
  };
}

const PracticeCard: React.FC<PracticeCardProps> = ({ practice }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{practice.name}</h3>
          <div className="flex items-center gap-2 text-gray-400 mt-1">
            <MapPin className="w-4 h-4" />
            <span>{practice.location}, {practice.state}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          <div>
            <p className="text-sm text-gray-400">Employees</p>
            <p className="text-white font-medium">{practice.employeeCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-green-500" />
          <div>
            <p className="text-sm text-gray-400">Revenue</p>
            <p className="text-white font-medium">{formatCurrency(practice.revenue)}</p>
          </div>
        </div>
      </div>

      {practice.description && (
        <p className="text-gray-400 text-sm mb-4">{practice.description}</p>
      )}

      <div className="flex justify-between items-center">
        <Link 
          to={`/county/${practice.state}/${practice.location}`} 
          className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
        >
          View County Details
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Button variant="outline" className="text-white">
          Contact
        </Button>
      </div>
    </Card>
  );
};

export default PracticeCard;