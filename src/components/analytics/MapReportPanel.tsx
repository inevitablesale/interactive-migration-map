import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

interface MapReportPanelProps {
  selectedState: {
    displayName?: string;
    [key: string]: any;
  };
  onClose: () => void;
}

export const MapReportPanel = ({ selectedState, onClose }: MapReportPanelProps) => {
  console.log('MapReportPanel rendered with selectedState:', selectedState);
  
  return (
    <Card className="absolute top-4 right-4 w-80 bg-black/40 backdrop-blur-md border-white/10 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          {selectedState.displayName || `State ${selectedState.STATEFP}`}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Employment</p>
            <p className="text-lg font-semibold text-white">
              {selectedState.EMP?.toLocaleString() || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Annual Payroll</p>
            <p className="text-lg font-semibold text-white">
              ${selectedState.PAYANN?.toLocaleString() || 'N/A'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Establishments</p>
            <p className="text-lg font-semibold text-white">
              {selectedState.ESTAB?.toLocaleString() || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Median Income</p>
            <p className="text-lg font-semibold text-white">
              ${selectedState.B19013_001E?.toLocaleString() || 'N/A'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Unemployment</p>
            <p className="text-lg font-semibold text-white">
              {selectedState.B23025_004E?.toLocaleString() || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Median Home Value</p>
            <p className="text-lg font-semibold text-white">
              ${selectedState.B25077_001E?.toLocaleString() || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};