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
  Scale,
  Shield,
  FileText,
  Handshake,
  Graph,
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

// Comprehensive mapping of specialties to icons
const serviceIconMap: Record<string, LucideIcon> = {
  // Tax & Accounting Core Services
  "tax": DollarSign,
  "accounting": Calculator,
  "bookkeeping": Calculator,
  "payroll": Users,
  "audit": Clipboard,
  
  // Advisory & Consulting
  "advisory": Lightbulb,
  "consulting": Briefcase,
  "business": Building2,
  "strategic": Star,
  "management": Briefcase,
  
  // Financial Services
  "financial": PiggyBank,
  "wealth": Wallet,
  "retirement": PiggyBank,
  "planning": Graph,
  
  // Valuation & Analysis
  "valuation": ChartBar,
  "analytics": Graph,
  "analysis": Graph,
  
  // Specialized Services
  "forensic": Search,
  "estate": Home,
  "litigation": Scale,
  "compliance": Shield,
  
  // Documentation & Reporting
  "statements": FileText,
  "reporting": FileText,
  "reviews": FileText,
  "compilations": FileText,
  
  // Risk & Controls
  "risk": Shield,
  "controls": Lock,
  
  // Transaction Services
  "mergers": Handshake,
  "acquisitions": Handshake,
  "diligence": Search,
  
  // Healthcare & Non-profit
  "non-profit": Heart,
  "healthcare": Heart,
  
  // Default
  "default": Building2
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
        const iconKey = Object.keys(serviceIconMap).find(key => service.includes(key)) || 'default';
        const Icon = serviceIconMap[iconKey];

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