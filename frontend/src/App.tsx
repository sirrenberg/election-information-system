import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import SeatDistribution from "./pages/SeatDistribution";
import Results from "./pages/Results";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/results" element={<Results />} />
        <Route path="/seats" element={<SeatDistribution />} />
        <Route path="/overview" element={<LandingPage />} />
      </Routes>
    </div>
  );
}

export default App;
