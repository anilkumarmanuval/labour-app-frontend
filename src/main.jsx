import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// ✅ AUTH
import { AuthProvider } from "./context/AuthContext";

// ✅ Enable dark mode
document.documentElement.classList.add("dark");

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb"
    },
    background: {
      default: "#f1f5f9"
    }
  },
  shape: {
    borderRadius: 10
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <AuthProvider>

      <ThemeProvider theme={theme}>
        <CssBaseline />

        <BrowserRouter>
          <App />
        </BrowserRouter>

      </ThemeProvider>

    </AuthProvider>

  </React.StrictMode>
);