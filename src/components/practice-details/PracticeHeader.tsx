import { TopFirm } from "@/types/rankings";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PracticeHeaderProps {
  practice: TopFirm;
}

export function PracticeHeader({ practice }: PracticeHeaderProps) {
  const { data: generatedText } = useQuery({
    queryKey: ['firm-generated-text', practice["Company ID"]],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('firm_generated_text')
        .select('title')
        .eq('company_id', practice["Company ID"])
        .single();

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="flex items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gradient">
          {generatedText?.title || practice["Company Name"]}
        </h1>
        <p className="text-white/60">{practice["Primary Subtitle"]}</p>
      </div>
    </div>
  );
}