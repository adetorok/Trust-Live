import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import SponsorLanding from './pages/SponsorLanding';
import SponsorProposal from './pages/SponsorProposal';
import SiteLanding from './pages/SiteLanding';
import SiteProposal from './pages/SiteProposal';
import AuthVerify from './pages/AuthVerify';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/sponsor" element={<SponsorLanding />} />
            <Route path="/sponsor/proposal" element={<SponsorProposal />} />
            <Route path="/site" element={<SiteLanding />} />
            <Route path="/site/proposal" element={<SiteProposal />} />
            <Route path="/auth/verify" element={<AuthVerify />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

