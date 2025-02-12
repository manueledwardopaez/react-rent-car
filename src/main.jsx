import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import { StrictMode } from "react";
import { NavBar } from "./components/NavBar.jsx";
/* import { createRoot } from "react-dom/client"; */
import "./index.css";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <NavBar />
      <App />
    </BrowserRouter>
  </StrictMode>
);
