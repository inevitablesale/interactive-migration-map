import { 
  DollarSign, 
  Clipboard, 
  Calculator, 
  Users, 
  Lightbulb, 
  Briefcase, 
  PiggyBank, 
  ChartBar, 
  Search, 
  Home,
  Building2,
  LucideIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const serviceIconMap: Record<string, LucideIcon> = {
  "tax": DollarSign,
  "taxes": DollarSign,
  "audit": Clipboard,
  "auditing": Clipboard,
  "bookkeeping": Calculator,
  "payroll": Users,
  "advisory": Lightbulb,
  "consulting": Briefcase,
  "financial": PiggyBank,
  "valuation": ChartBar,
  "forensic": Search,
  "estate": Home,
  "business": Building2,
};

interface ServiceIconsProps {
  specialities?: string;
}

export function ServiceIcons({ specialities }: ServiceIconsProps) {
  if (!specialities) return null;

  const services = specialities.split(',').map(s => s.trim().toLowerCase());
  
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {services.map((service, index) => {
        // Find the first matching icon by checking if the service includes any of our keywords
        const iconKey = Object.keys(serviceIconMap).find(key => service.includes(key));
        const Icon = iconKey ? serviceIconMap[iconKey] : Building2;

        return (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-1.5 bg-black/20 rounded-md cursor-help hover:bg-black/30 transition-colors">
                  <Icon className="h-4 w-4 text-white/60" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="capitalize">{service}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}