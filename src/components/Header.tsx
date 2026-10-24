import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bookmark, Award, HelpCircle, Wifi, WifiOff, BookOpen } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const location = useLocation();
  const isOnline = useOnlineStatus();
  const { savedPhraseIds } = useApp();

  const navLinks = [
    { path: '/phrasebook', label: 'Phrasebook', icon: BookOpen },
    { path: '/quiz', label: 'Practice Quiz', icon: Award },
    { path: '/saved', label: 'Saved', icon: Bookmark, badge: savedPhraseIds.length },
    { path: '/progress', label: 'Progress', icon: Award },
    { path: '/about', label: 'Offline & Help', icon: HelpCircle }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-800 to-teal-950 flex items-center justify-center text-amber-200 font-bold shadow-md shadow-teal-950/10 group-hover:scale-105 transition-transform">
            <span className="font-kannada text-2xl font-black">ನ</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg text-teal-950 tracking-tight">NammaNudi</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300/50">
                MVP
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
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
        <div className="flex items-center space-x-2">
          {/* Online / Offline status badge */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
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
            className="p-2 rounded-xl text-stone-600 hover:text-teal-900 hover:bg-stone-100 transition-colors border border-stone-200 bg-white"
          >
            <Search className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
};

