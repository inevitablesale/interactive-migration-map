import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import MarketReport from './pages/MarketReport';
import StateMarketReport from './pages/StateMarketReport';
import CountyDetails from './pages/CountyDetails';
import ThankYou from './pages/ThankYou';
import Opportunities from './pages/Opportunities';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/market-report/:county/:state" element={<MarketReport />} />
        <Route path="/state-market-report/:state" element={<StateMarketReport />} />
        <Route path="/county/:state/:county" element={<CountyDetails />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/opportunities" element={<Opportunities />} />
      </Routes>
    </Router>
  );
}

export default App;