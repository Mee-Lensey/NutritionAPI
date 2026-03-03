import { Link, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Analyzer from "./pages/Analyzer.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="wrap">
      <header className="nav">
        <div className="brand">Nutrition App</div>
        <nav className="links">
          <Link to="/">Home</Link>
          <Link to="/analyze">Analyzer</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<Analyzer />} />
      </Routes>

      <footer className="footer">
        <small>Built with React + Edamam API</small>
      </footer>
    </div>
  );
}
