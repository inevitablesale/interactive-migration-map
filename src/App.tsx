import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Analysis from "@/pages/Analysis";
import Opportunities from "@/pages/Opportunities";
import MarketReport from "@/pages/MarketReport";
import StateMarketReport from "@/pages/StateMarketReport";
import ThankYou from "@/pages/ThankYou";
import Dashboard from "@/pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/market-report/:county/:state" element={<MarketReport />} />
        <Route path="/state-market-report/:state" element={<StateMarketReport />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;