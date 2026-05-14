import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import PlayerValuation from './pages/PlayerValuation';
import OpponentIntel from './pages/OpponentIntel';
import HeadToHead from './pages/HeadToHead';
import ZoneIntelligence from './pages/ZoneIntelligence';
import LeagueOverview from './pages/LeagueOverview';
import Chat from './pages/Chat';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/player" element={<PlayerValuation />} />
        <Route path="/opponent" element={<OpponentIntel />} />
        <Route path="/h2h" element={<HeadToHead />} />
        <Route path="/zone" element={<ZoneIntelligence />} />
        <Route path="/league" element={<LeagueOverview />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AnimatedRoutes />
      <Footer />
    </BrowserRouter>
  );
}
