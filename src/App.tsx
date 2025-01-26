import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TrackedPractices from "@/pages/TrackedPractices";
import PracticeDetails from "@/pages/PracticeDetails";
import Index from "@/pages/Index";
import Analysis from "@/pages/Analysis";
import Opportunities from "@/pages/Opportunities";
import MarketReport from "@/pages/MarketReport";
import StateMarketReport from "@/pages/StateMarketReport";
import ThankYou from "@/pages/ThankYou";
import Auth from "@/pages/Auth";
import DocSign from "@/pages/DocSign";
import FirmOwners from "@/pages/FirmOwners";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/doc-sign" element={<DocSign />} />
        <Route path="/tracked-practices" element={<TrackedPractices />} />
        <Route path="/practice/:practiceId" element={<PracticeDetails />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/market-report/:county/:state" element={<MarketReport />} />
        <Route path="/state-market-report/:state" element={<StateMarketReport />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/firm-owners" element={<FirmOwners />} />
      </Routes>
    </Router>
  );
}