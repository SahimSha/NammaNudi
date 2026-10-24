import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, History, Trash2, ArrowRight, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PhraseCard } from '../components/PhraseCard';

export const SavedPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'saved' | 'recents'>('saved');
  const {
    savedPhraseIds,
    recentPhraseIds,
    getPhraseById,
    clearRecents
  } = useApp();

  const savedPhrases = savedPhraseIds
    .map((id) => getPhraseById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const recentPhrases = recentPhraseIds
    .map((id) => getPhraseById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Saved & Recent Phrases
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
            Revisit your starred phrases and recently viewed expressions on this device
          </p>
        </div>

        {activeTab === 'recents' && recentPhrases.length > 0 && (
          <button
            onClick={clearRecents}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'saved'
              ? 'bg-amber-400 text-teal-950 shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Bookmark className="w-4 h-4 fill-current" />
          <span>Favourites ({savedPhrases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recents')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'recents'
              ? 'bg-amber-400 text-teal-950 shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Recently Viewed ({recentPhrases.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'saved' ? (
        savedPhrases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPhrases.map((phrase) => (
              <PhraseCard key={phrase.id} phrase={phrase} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
              <Star className="w-7 h-7 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                No saved phrases yet
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Whenever you see a Kannada phrase you want to remember or show to an auto driver, click the ⭐ star icon to pin it here.
              </p>
            </div>
            <Link
              to="/phrasebook"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <span>Explore Phrasebook</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )
      ) : (
        recentPhrases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPhrases.map((phrase) => (
              <PhraseCard key={phrase.id} phrase={phrase} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <History className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                No recent history
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Phrases you tap, listen to, or view in Show-to-Speak mode will automatically appear here for quick access.
              </p>
            </div>
            <Link
              to="/phrasebook"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <span>Explore Phrasebook</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )
      )}
    </div>
  );
};

