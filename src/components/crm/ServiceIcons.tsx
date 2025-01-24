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
  Scale,
  Shield,
  FileText,
  Handshake,
  BarChart,
  Heart,
  Lock,
  Wallet,
  Star,
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
  "accounting": Calculator,
  "bookkeeping": Calculator,
  "payroll": Users,
  "advisory": Lightbulb,
  "consulting": Briefcase,
  "financial": PiggyBank,
  "planning": BarChart,
  "valuation": ChartBar,
  "forensic": Search,
  "estate": Home,
  "litigation": Scale,
  "compliance": Shield,
  "statements": FileText,
  "reporting": FileText,
  "reviews": FileText,
  "risk": Shield,
  "controls": Lock,
  "mergers": Handshake,
  "acquisitions": Handshake,
  "diligence": Search,
  "non-profit": Heart,
  "healthcare": Heart,
  "wealth": Wallet,
  "retirement": PiggyBank,
  "strategic": Star,
  "management": Briefcase,
  "audit": Clipboard,
  "analytics": ChartBar,
  "analysis": ChartBar
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
        const Icon = iconKey ? serviceIconMap[iconKey] : Star; // Using Star as default icon instead of Building2

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