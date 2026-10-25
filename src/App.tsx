import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { Toast } from './components/Toast';
import { PhraseDetailModal } from './components/PhraseDetailModal';
import { ShowToSpeakModal } from './components/ShowToSpeakModal';
import { PronunciationPracticeModal } from './components/PronunciationPracticeModal';

import { HomePage } from './pages/HomePage';
import { PhrasebookPage } from './pages/PhrasebookPage';
import { SearchPage } from './pages/SearchPage';
import { QuizPage } from './pages/QuizPage';
import { SavedPage } from './pages/SavedPage';
import { ProgressPage } from './pages/ProgressPage';
import { ConversationSimulatorPage } from './pages/ConversationSimulatorPage';
import { AboutPage } from './pages/AboutPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col selection:bg-teal-700 selection:text-white">
          {/* Header Navigation */}
          <Header />

          {/* Main Content Area */}
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 pb-20 md:pb-12">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/phrasebook" element={<PhrasebookPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/conversations" element={<ConversationSimulatorPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer (Desktop / Tablet) */}
          <footer className="hidden md:block border-t border-stone-200/80 bg-white py-8 text-center text-xs text-stone-500">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <span className="font-kannada font-black text-teal-900 text-lg">ನ</span>
                <span className="font-extrabold text-stone-900">NammaNudi</span>
                <span className="text-stone-400">— Learn it. Say it. Use it.</span>
              </div>
              <p className="text-stone-500">
                Kannada Digital Innovation Hackathon 2026 • Problem Statement 3: Kannada in Everyday Life
              </p>
              <div className="flex items-center space-x-4 text-stone-400">
                <span>100% Offline PWA</span>
                <span>•</span>
                <span>Zero Paid APIs</span>
              </div>
            </div>
          </footer>

          {/* Bottom Mobile Navigation */}
          <MobileNav />

          {/* Modals & Popovers */}
          <PhraseDetailModal />
          <ShowToSpeakModal />
          <PronunciationPracticeModal />
          <Toast />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
