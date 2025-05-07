import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import RedirectHandler from "./RedirectHandler";

function Root() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:shortCode" element={<RedirectHandler />} />
      </Routes>
    </Router>
  );
}

export default Root;
