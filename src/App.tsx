import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import HomePage from './pages/HomePage';
import RelaxPage from './pages/RelaxPage';
import BreathePage from './pages/BreathePage';
import JournalPage from './pages/JournalPage';
import SleepPage from './pages/SleepPage';
import MoodPage from './pages/MoodPage';
import GamesPage from './pages/GamesPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/relax" element={<RelaxPage />} />
            <Route path="/breathe" element={<BreathePage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/sleep" element={<SleepPage />} />
            <Route path="/mood" element={<MoodPage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
