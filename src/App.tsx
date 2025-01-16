import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Analysis from "./pages/Analysis";
import MarketReport from "./pages/MarketReport";
import StateMarketReport from "./pages/StateMarketReport";
import Opportunities from "./pages/Opportunities";
import ThankYou from "./pages/ThankYou";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/market-report" element={<MarketReport />} />
        <Route path="/state-market-report" element={<StateMarketReport />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </Router>
  );
}

export default App;