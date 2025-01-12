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
    <Card className="absolute bottom-4 right-4 w-80 bg-black/40 backdrop-blur-md border-white/10 text-white animate-fade-in">
      <CardHeader>
        <CardTitle>State Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-400">Employment</p>
          <p className="text-lg font-semibold">{formatNumber(data.EMP)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Annual Payroll</p>
          <p className="text-lg font-semibold">${formatNumber(data.PAYANN)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Establishments</p>
          <p className="text-lg font-semibold">{formatNumber(data.ESTAB)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Median Household Income</p>
          <p className="text-lg font-semibold">${formatNumber(data.B19013_001E)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Labor Force</p>
          <p className="text-lg font-semibold">{formatNumber(data.B23025_004E)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Median Home Value</p>
          <p className="text-lg font-semibold">${formatNumber(data.B25077_001E)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StateReportCard;