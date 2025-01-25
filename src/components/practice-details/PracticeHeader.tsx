import { TopFirm } from "@/types/rankings";

interface PracticeHeaderProps {
  practice: TopFirm;
  generatedText: {
    title: string | null;
    generated_summary: string | null;
  } | null;
}

export function PracticeHeader({ practice, generatedText }: PracticeHeaderProps) {
  const title = generatedText?.title?.replace(/Premier /g, '') || practice["Company Name"];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">
        {title}
      </h1>
      <p className="text-white/60">{practice["Primary Subtitle"]}</p>
    </div>
  );
}