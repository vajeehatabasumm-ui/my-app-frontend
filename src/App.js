import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <nav style={{ padding: "10px" }}>
        <Link to="/login" style={{ marginRight: "10px" }}>Sign In</Link>
        <Link to="/register">Sign Up</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
