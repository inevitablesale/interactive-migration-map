import { useState } from "react";
import { Send, Loader2, Layers, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const layers = [
  { id: 'migration', name: 'Migration Flows', enabled: true },
  { id: 'density', name: 'Firm Density', enabled: false },
  { id: 'wages', name: 'Wage Trends', locked: true },
];

export function ChatBar() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      // TODO: Implement AI chat functionality
      toast({
        title: "Coming soon!",
        description: "AI chat functionality will be implemented soon.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to process your request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setPrompt("");
    }
  };

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-50 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 shadow-xl animate-fade-in">
      <div className="flex items-center gap-2 p-2 border-b border-white/10">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
              <Layers className="h-4 w-4 mr-2" />
              Layers
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2 bg-black/90 border-white/10">
            <div className="space-y-2">
              {layers.map((layer) => (
                <div key={layer.id} className="flex items-center justify-between">
                  <span className="text-sm text-white/80">{layer.name}</span>
                  {layer.locked ? (
                    <Lock className="h-4 w-4 text-yellow-400" />
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-6 px-2 text-xs ${
                        layer.enabled ? 'bg-cyan-500/20 text-cyan-400' : 'text-white/60'
                      }`}
                    >
                      {layer.enabled ? 'On' : 'Off'}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask about market trends, demographics, or navigate to a location..."
          className="flex-1 bg-transparent border-white/20 text-white placeholder:text-white/50"
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={isLoading}
          className="bg-cyan-500 hover:bg-cyan-600 text-white"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}