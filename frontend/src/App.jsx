import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import SponsorDashboard from './pages/SponsorDashboard';
import SiteDashboard from './pages/SiteDashboard';
import FAQ from './pages/FAQ';
import Organization from './pages/Organization';
import OurServices from './pages/OurServices';
import SponsorLanding from './pages/SponsorLanding';
import SiteLanding from './pages/SiteLanding';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/organization" element={<Organization />} />
            <Route path="/services" element={<OurServices />} />
            <Route path="/sponsor" element={<SponsorLanding />} />
            <Route path="/site" element={<SiteLanding />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/sponsor/dashboard" element={<SponsorDashboard />} />
            <Route path="/site/dashboard" element={<SiteDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
