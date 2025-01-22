import { TopFirm } from "@/types/rankings";

interface BusinessOverviewProps {
  practice: TopFirm;
}

export function BusinessOverview({ practice }: BusinessOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-black/40 backdrop-blur-md border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Business Overview</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-white/60 mb-2">Summary</h3>
            <p className="text-white">{practice.Summary || 'No summary available.'}</p>
          </div>
          {practice.specialities && (
            <div>
              <h3 className="text-white/60 mb-2">Specialties</h3>
              <p className="text-white">{practice.specialities}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}