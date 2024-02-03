import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import SeatDistribution from "./pages/SeatDistribution";
import Results from "./pages/Results";
import Overview from "./pages/Overview";
import Login from "./pages/Login";
import { useContext } from "react";
import { VoterContext } from "./contexts/VoterContext";
import Vote from "./pages/Vote";

function App() {
  const { voter } = useContext(VoterContext);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/results" element={<Results />} />
        <Route path="/results/:id" element={<Results />} />
        <Route path="/seats" element={<SeatDistribution />} />
        <Route path="/overview" element={<Overview />} />

        <Route path="/login" element={<Login />} />

        {voter && <Route path="/vote" element={<Vote />} />}
      </Routes>
    </div>
  );
}

export default App;
