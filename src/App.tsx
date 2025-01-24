import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import DocumentSigningFlow from "./components/DocumentSigningFlow";
import TrackedPractices from "./pages/TrackedPractices"; // Assuming this is the path for tracked practices

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/sign-documents" element={<DocumentSigningFlow />} />
        <Route path="/tracked-practices" element={<TrackedPractices />} />
      </Routes>
    </Router>
  );
}
