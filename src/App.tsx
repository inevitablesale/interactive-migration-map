import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Analysis from "@/pages/Analysis";
import Opportunities from "@/pages/Opportunities";
import MarketReport from "@/pages/MarketReport";

function App() {
  console.log("App component rendering");
  
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <LoggedComponent name="Index">
              <Index />
            </LoggedComponent>
          } 
        />
        <Route 
          path="/analysis" 
          element={
            <LoggedComponent name="Analysis">
              <Analysis />
            </LoggedComponent>
          } 
        />
        <Route 
          path="/opportunities" 
          element={
            <LoggedComponent name="Opportunities">
              <Opportunities />
            </LoggedComponent>
          } 
        />
        <Route 
          path="/market-report/:county/:state" 
          element={
            <LoggedComponent name="MarketReport">
              <MarketReport />
            </LoggedComponent>
          } 
        />
      </Routes>
    </Router>
  );
}

// Helper component to log rendering of each page
function LoggedComponent({ name, children }: { name: string; children: React.ReactNode }) {
  console.log(`Rendering ${name} page`);
  if (!children) {
    console.error(`${name} component is empty or undefined`);
    return null;
  }
  return <>{children}</>;
}

export default App;