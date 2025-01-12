import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, BuildingIcon, UsersIcon, HomeIcon } from 'lucide-react';

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
    <Card className="absolute bottom-8 right-8 w-[450px] bg-black/40 backdrop-blur-md border-white/10 text-white animate-fade-in">
      <CardHeader className="py-3 px-6 border-b border-white/10">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <TrendingUpIcon className="w-5 h-5 text-yellow-400" />
          Market Intelligence Report
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Economic Vitality Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-yellow-400 uppercase tracking-wider">Economic Vitality</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BuildingIcon className="w-4 h-4 text-cyan-400" />
                <p className="text-sm text-cyan-400">Business Activity</p>
              </div>
              <p className="text-2xl font-semibold">{formatNumber(data.ESTAB)} firms</p>
              <p className="text-sm text-gray-400 mt-1">
                {businessDensity} businesses per 1k workers
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <UsersIcon className="w-4 h-4 text-green-400" />
                <p className="text-sm text-green-400">Workforce</p>
              </div>
              <p className="text-2xl font-semibold">{employmentRate}%</p>
              <p className="text-sm text-gray-400 mt-1">
                Employment rate
              </p>
            </div>
          </div>
        </div>

        {/* Market Indicators Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-yellow-400 uppercase tracking-wider">Market Indicators</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-sm text-purple-400 mb-1">Annual Payroll</p>
              <p className="text-2xl font-semibold">${formatNumber(data.PAYANN)}</p>
              <p className="text-sm text-gray-400 mt-1">
                ${avgPayPerEmployee} per employee
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-sm text-orange-400 mb-1">Housing Market</p>
              <p className="text-2xl font-semibold">${formatNumber(data.B25077_001E)}</p>
              <p className="text-sm text-gray-400 mt-1">
                Median home value
              </p>
            </div>
          </div>
        </div>

        {/* Key Insights Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-yellow-400 uppercase tracking-wider">Key Insights</h3>
          <div className="bg-white/5 p-4 rounded-lg space-y-2">
            <p className="text-sm text-gray-300">
              • Market shows {businessDensity && Number(businessDensity) > 50 ? 'high' : 'moderate'} business density
            </p>
            <p className="text-sm text-gray-300">
              • Workforce participation is {employmentRate && Number(employmentRate) > 65 ? 'above' : 'below'} national average
            </p>
            <p className="text-sm text-gray-300">
              • Housing market indicates {data.B25077_001E && data.B25077_001E > 400000 ? 'premium' : 'accessible'} pricing
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StateReportCard;