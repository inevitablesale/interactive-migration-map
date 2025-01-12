import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, BuildingIcon, UsersIcon, HomeIcon, DatabaseIcon } from 'lucide-react';

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
  const REPORT_ACCENT_COLOR = '#FFF903'; // Yellow accent color

  useEffect(() => {
    const handleScroll = () => {
      const analysisSection = document.querySelector('.analysis-section');
      if (!analysisSection) return;

      const rect = analysisSection.getBoundingClientRect();
      setShowCard(rect.top > window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!data || !isVisible || !showCard) return null;

  // Calculate derived insights
  const employmentRate = data.EMP && data.B23025_004E ? 
    (data.EMP / data.B23025_004E * 100).toFixed(1) : null;
  
  const avgPayPerEmployee = data.PAYANN && data.EMP ? 
    formatNumber(data.PAYANN / data.EMP) : null;
  
  const businessDensity = data.ESTAB && data.B23025_004E ? 
    (data.ESTAB / (data.B23025_004E / 1000)).toFixed(1) : null;

  return (
    <Card className="absolute bottom-[35%] right-4 w-[350px] bg-black/40 backdrop-blur-md border-white/10 text-white">
      <CardHeader className="py-2 px-4 border-b border-white/10">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <TrendingUpIcon className="w-4 h-4" style={{ color: REPORT_ACCENT_COLOR }} />
          Market Intelligence Report
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-wider" style={{ color: REPORT_ACCENT_COLOR }}>
            Economic Vitality
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 p-3 rounded-lg">
              <div className="flex items-center gap-1 mb-1">
                <BuildingIcon className="w-3 h-3" style={{ color: REPORT_ACCENT_COLOR }} />
                <p className="text-xs text-white">Business Activity</p>
              </div>
              <p className="text-lg font-semibold">{formatNumber(data.ESTAB)} firms</p>
              <p className="text-xs text-gray-400">{businessDensity} per 1k workers</p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <div className="flex items-center gap-1 mb-1">
                <UsersIcon className="w-3 h-3" style={{ color: REPORT_ACCENT_COLOR }} />
                <p className="text-xs text-white">Workforce</p>
              </div>
              <p className="text-lg font-semibold">{employmentRate}%</p>
              <p className="text-xs text-gray-400">Employment rate</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-wider" style={{ color: REPORT_ACCENT_COLOR }}>
            Market Indicators
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-xs text-white mb-1">Annual Payroll</p>
              <p className="text-lg font-semibold">${formatNumber(data.PAYANN)}</p>
              <p className="text-xs text-gray-400">${avgPayPerEmployee} per employee</p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-xs text-white mb-1">Housing Market</p>
              <p className="text-lg font-semibold">${formatNumber(data.B25077_001E)}</p>
              <p className="text-xs text-gray-400">Median home value</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wider" style={{ color: REPORT_ACCENT_COLOR }}>
            Key Insights
          </h3>
          <div className="bg-white/5 p-3 rounded-lg space-y-1">
            <p className="text-xs text-gray-300">
              • Market shows {businessDensity && Number(businessDensity) > 50 ? 'high' : 'moderate'} business density
            </p>
            <p className="text-xs text-gray-300">
              • Workforce participation is {employmentRate && Number(employmentRate) > 65 ? 'above' : 'below'} national average
            </p>
            <p className="text-xs text-gray-300">
              • Housing market indicates {data.B25077_001E && data.B25077_001E > 400000 ? 'premium' : 'accessible'} pricing
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wider" style={{ color: REPORT_ACCENT_COLOR }}>
            Data Sources
          </h3>
          <div className="bg-white/5 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DatabaseIcon className="w-3 h-3" style={{ color: REPORT_ACCENT_COLOR }} />
              <p className="text-xs text-white">Primary Sources</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-300">• US Census Bureau ACS Data</p>
              <p className="text-xs text-gray-300">• Bureau of Labor Statistics</p>
              <p className="text-xs text-gray-300">• County Business Patterns</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StateReportCard;