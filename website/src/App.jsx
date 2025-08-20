import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.jsx";
import Builder from "./pages/Builder/Builder.jsx";
import "./App.scss";
//import Spline from "@splinetool/react-spline";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/builder" element={<Builder />} />
      </Routes>
    </Router>
  );
}
