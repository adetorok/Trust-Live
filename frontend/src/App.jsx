import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Protected from './components/Protected';
import Home from './pages/Home';
import About from './pages/About';
import SponsorLanding from './pages/SponsorLanding';
import SponsorProposal from './pages/SponsorProposal';
import SiteLanding from './pages/SiteLanding';
import SiteProposal from './pages/SiteProposal';
import AuthVerify from './pages/AuthVerify';

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/sponsor" element={<SponsorLanding />} />
            <Route path="/sponsor/proposal" element={<Protected><SponsorProposal /></Protected>} />
            <Route path="/site" element={<SiteLanding />} />
            <Route path="/site/proposal" element={<Protected><SiteProposal /></Protected>} />
            <Route path="/auth/verify" element={<AuthVerify />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}

export default App;

