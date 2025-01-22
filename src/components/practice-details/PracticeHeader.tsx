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
          alt={practice.company_name} 
          className="w-16 h-16 rounded-full object-cover"
        />
      )}
      <div>
        <h1 className="text-3xl font-bold">{practice.company_name}</h1>
        <p className="text-muted-foreground">{practice.primarySubtitle}</p>
      </div>
    </div>
  );
}