import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import { DocumentSigningFlow } from "./components/DocumentSigningFlow";
import { BetaAccessSection } from "./components/BetaAccessSection";
import { DailyRevealsSection } from "./components/DailyRevealsSection";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BetaAccessSection />} />
        <Route path="/daily-reveals" element={<DailyRevealsSection />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/document-signing" element={<DocumentSigningFlow />} />
      </Routes>
      <Toaster />
    </Router>
  );
}