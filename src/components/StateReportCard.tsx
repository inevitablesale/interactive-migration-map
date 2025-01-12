import React from 'react';
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
  return new Intl.NumberFormat('en-US').format(num);
};

const StateReportCard = ({ data, isVisible }: StateReportCardProps) => {
  if (!data || !isVisible) return null;

  return (
    <Card className="absolute right-8 top-1/2 -translate-y-1/2 w-72 bg-black/80 backdrop-blur-md border-white/10 text-white animate-fade-in shadow-xl">
      <CardHeader className="py-2 px-4">
        <CardTitle className="text-lg">State Report</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 p-4 pt-2 text-sm">
        <div>
          <p className="text-xs text-gray-400">Employment</p>
          <p className="font-medium">{formatNumber(data.EMP)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Annual Payroll</p>
          <p className="font-medium">${formatNumber(data.PAYANN)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Establishments</p>
          <p className="font-medium">{formatNumber(data.ESTAB)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Median Income</p>
          <p className="font-medium">${formatNumber(data.B19013_001E)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Labor Force</p>
          <p className="font-medium">{formatNumber(data.B23025_004E)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Median Home</p>
          <p className="font-medium">${formatNumber(data.B25077_001E)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StateReportCard;