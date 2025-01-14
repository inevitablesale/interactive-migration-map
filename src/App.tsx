import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Analysis from "@/pages/Analysis";
import Opportunities from "@/pages/Opportunities";
import MarketReport from "@/pages/MarketReport";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/market-report/:county/:state" element={<MarketReport />} />
      </Routes>
    </Router>
  );
}

export default App;