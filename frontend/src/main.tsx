import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import mainTheme from "./themes/MainTheme";
import { ThemeProvider } from "@mui/material/styles";
import { VoterContextProvider } from "./contexts/VoterContext.tsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <VoterContextProvider>
      <Router>
        <ThemeProvider theme={mainTheme}>
          <ToastContainer />
          <App />
        </ThemeProvider>
      </Router>
    </VoterContextProvider>
  </React.StrictMode>
);
