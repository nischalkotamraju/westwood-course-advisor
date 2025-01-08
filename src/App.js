import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./components/Welcome.js";
import Build from "./components/Build.js";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import Courses from "./components/Courses.js";
import Help from "./components/Help.js";

function App() {
  return (
    <Router>
      <div className="App bg-neutral-900 min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route exact path="/" element={<Courses />} />
            <Route exact path="/intro" element={<Welcome />} />
            <Route exact path="/build" element={<Build />} />
            <Route exact path="/help" element={<Help />} />
            <Route path="*" element={<Courses />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;