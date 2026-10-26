import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Bookmark,
  Award,
  HelpCircle,
  Wifi,
  WifiOff,
  BookOpen,
  MessageSquare,
  Menu,
  X,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const location = useLocation();
  const isOnline = useOnlineStatus();
  const { savedPhraseIds } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(location.pathname);

  // Close mobile drawer during render when route changes
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setIsMobileMenuOpen(false);
  }

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { path: '/phrasebook', label: 'Phrasebook', icon: BookOpen },
    { path: '/conversations', label: 'Conversations', icon: MessageSquare, badgeLabel: 'Interactive' },
    { path: '/quiz', label: 'Practice Quiz', icon: Award },
    { path: '/saved', label: 'Saved & SRS', icon: Bookmark, badge: savedPhraseIds.length },
    { path: '/progress', label: 'Progress', icon: BarChart3 },
    { path: '/about', label: 'Offline & Help', icon: HelpCircle }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-teal-800 to-teal-950 flex items-center justify-center text-amber-200 font-bold shadow-md shadow-teal-950/10 group-hover:scale-105 transition-transform flex-shrink-0">
            <span className="font-kannada text-xl sm:text-2xl font-black">ನ</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-extrabold text-base sm:text-lg text-teal-950 tracking-tight">NammaNudi</span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300/50">
                MVP
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-stone-500 font-medium hidden xs:block truncate">
              Everyday Kannada Companion
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-800 text-white shadow-sm'
                    : 'text-stone-600 hover:text-teal-900 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                      isActive ? 'bg-amber-400 text-teal-950' : 'bg-teal-100 text-teal-900'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons & Status */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Online / Offline status badge */}
          <div
            className={`flex items-center space-x-1.5 px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
            title={
              isOnline
                ? 'Online — Service worker cached for offline use'
                : 'Offline mode active — Phrases and progress work completely offline'
            }
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Offline Ready</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>Offline</span>
              </>
            )}
          </div>

          {/* Quick Search Shortcut */}
          <Link
            to="/search"
            aria-label="Search Kannada phrases"
            className="p-2 rounded-xl text-stone-600 hover:text-teal-900 hover:bg-stone-100 transition-colors border border-stone-200 bg-white min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden p-2 rounded-xl text-stone-700 hover:text-teal-950 hover:bg-stone-100 transition-colors border border-stone-200 bg-white min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-teal-900" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200/90 bg-[#FAF8F5] px-4 pt-3 pb-5 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between px-2 pb-2 text-xs font-bold text-stone-400 uppercase tracking-wider">
            <span>Navigation Menu</span>
            <span className="text-[10px] font-kannada text-teal-800">ಮೆನು</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${
                    isActive
                      ? 'bg-teal-800 text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-100 active:bg-stone-200'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {link.badgeLabel && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-400 text-teal-950">
                        {link.badgeLabel}
                      </span>
                    )}
                    {link.badge !== undefined && link.badge > 0 && (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-amber-400 text-teal-950' : 'bg-teal-100 text-teal-900'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-stone-200/70 flex items-center justify-between text-[11px] text-stone-500 px-2">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Offline-First Everyday Kannada</span>
            </span>
            <span className="font-mono text-stone-400">Hackathon 2026</span>
          </div>
        </div>
      )}
    </header>
  );
};

