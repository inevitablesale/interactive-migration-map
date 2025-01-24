import { TopFirm } from "@/types/rankings";

interface PracticeHeaderProps {
  practice: TopFirm;
  generatedText: {
    title: string | null;
    generated_summary: string | null;
  } | null;
}

export function PracticeHeader({ practice, generatedText }: PracticeHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">
        {generatedText?.title || practice["Company Name"]}
      </h1>
      <p className="text-white/60">{practice["Primary Subtitle"]}</p>
    </div>
  );
}