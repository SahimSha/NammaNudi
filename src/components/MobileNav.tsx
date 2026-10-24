import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Award, Bookmark, BarChart3 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileNav: React.FC = () => {
  const { savedPhraseIds } = useApp();

  const links = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/phrasebook', label: 'Phrases', icon: BookOpen },
    { to: '/quiz', label: 'Quiz', icon: Award },
    { to: '/saved', label: 'Saved', icon: Bookmark, badge: savedPhraseIds.length },
    { to: '/progress', label: 'Progress', icon: BarChart3 }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200/90 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around h-16 px-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 px-1 transition-colors relative ${
                  isActive ? 'text-teal-800 font-bold' : 'text-stone-400 hover:text-stone-600 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-teal-800' : ''}`} />
                    {link.badge !== undefined && link.badge > 0 && (
                      <span className="absolute -top-1 -right-2 bg-amber-500 text-teal-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                        {link.badge > 9 ? '9+' : link.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] mt-1">{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 bg-teal-800 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
