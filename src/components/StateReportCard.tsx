import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StateData {
  STATEFP: string;
  EMP: number | null;
  PAYANN: number | null;
  ESTAB: number | null;
  B19013_001E: number | null;
  B23025_004E: number | null;
  B25077_001E: number | null;
}

interface StateReportCardProps {
  data: StateData | null;
  isVisible: boolean;
}

const formatNumber = (num: number | null) => {
  if (num === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(num);
};

const StateReportCard = ({ data, isVisible }: StateReportCardProps) => {
  const [showCard, setShowCard] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const threshold = window.innerHeight * 0.5; // Hide when scrolled halfway
      setShowCard(scrollPosition < threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!data || !isVisible || !showCard) return null;

  return (
    <Card className="absolute bottom-8 right-8 w-96 bg-black/40 backdrop-blur-md border-white/10 text-white animate-fade-in">
      <CardHeader className="py-3 px-6">
        <CardTitle className="text-xl font-bold">State Report</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 p-6">
        <div>
          <p className="text-sm text-yellow-400 font-medium mb-1">Employment</p>
          <p className="text-lg font-semibold">{formatNumber(data.EMP)}</p>
        </div>
        <div>
          <p className="text-sm text-yellow-400 font-medium mb-1">Annual Payroll</p>
          <p className="text-lg font-semibold">${formatNumber(data.PAYANN)}</p>
        </div>
        <div>
          <p className="text-sm text-yellow-400 font-medium mb-1">Establishments</p>
          <p className="text-lg font-semibold">{formatNumber(data.ESTAB)}</p>
        </div>
        <div>
          <p className="text-sm text-yellow-400 font-medium mb-1">Median Income</p>
          <p className="text-lg font-semibold">${formatNumber(data.B19013_001E)}</p>
        </div>
        <div>
          <p className="text-sm text-yellow-400 font-medium mb-1">Labor Force</p>
          <p className="text-lg font-semibold">{formatNumber(data.B23025_004E)}</p>
        </div>
        <div>
          <p className="text-sm text-yellow-400 font-medium mb-1">Median Home</p>
          <p className="text-lg font-semibold">${formatNumber(data.B25077_001E)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StateReportCard;