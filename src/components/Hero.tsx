import { ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white px-4">
      <div className="text-center max-w-4xl">
        <p className="text-cyan-400 text-sm md:text-base tracking-wider mb-4">AI-POWERED MARKET INTELLIGENCE</p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text">Find Tomorrow's</span>
          <br />
          <span className="text-white">Opportunities Today</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
          Detect acquisition signals in accounting practices before they list. Our AI analyzes millions of data points to identify growth patterns.
        </p>
        <button 
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="group flex flex-col items-center text-white/80 hover:text-white transition-colors"
        >
          <span className="text-sm uppercase tracking-wider mb-2">Explore the Map</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </button>
      </div>
    </div>
  );
}