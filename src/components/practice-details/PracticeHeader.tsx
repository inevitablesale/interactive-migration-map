import { TopFirm } from "@/types/rankings";

interface PracticeHeaderProps {
  practice: TopFirm;
}

export function PracticeHeader({ practice }: PracticeHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      {practice.logoResolutionResult && (
        <img 
          src={practice.logoResolutionResult} 
          alt={practice["Company Name"] || ''} 
          className="w-16 h-16 rounded-full object-cover ring-2 ring-yellow-400/50"
        />
      )}
      <div>
        <h1 className="text-3xl font-bold text-gradient">{practice["Company Name"]}</h1>
        <p className="text-white/60">{practice["Primary Subtitle"]}</p>
      </div>
    </div>
  );
}