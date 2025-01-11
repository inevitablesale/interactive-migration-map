import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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