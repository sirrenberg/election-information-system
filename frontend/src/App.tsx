import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/results" element={<LandingPage />} />
        <Route path="/seats" element={<LandingPage />} />
        <Route path="/overview" element={<LandingPage />} />
      </Routes>
    </div>
  );
}

export default App;
