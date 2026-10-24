import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Sparkles } from 'lucide-react';
import { PHRASES } from '../data/phrases';
import { CATEGORIES } from '../data/categories';
import { PhraseCard } from '../components/PhraseCard';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(urlQuery);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const clearQuery = () => {
    setQuery('');
    setSearchParams({}, { replace: true });
  };

  const suggestedQueries = [
    'Auto meter',
    'Bus ticket',
    'Masala dosa',
    'Filter coffee',
    'KR Market',
    'Discount',
    'Metro station',
    'Doctor',
    'Fever',
    'Police',
    'WiFi',
    'Leave',
    'Rent house',
    'Namaskara'
  ];

  // Perform search across Kannada, transliteration, english, category, tags, situation, notes
  const results = useMemo(() => {
    const trimmed = query.toLowerCase().trim();
    if (!trimmed && activeCategoryFilter === 'all') return [];

    return PHRASES.filter((p) => {
      // Category filter check
      if (activeCategoryFilter !== 'all' && p.categoryId !== activeCategoryFilter) {
        return false;
      }

      // If empty query but category selected, return all in that category
      if (!trimmed) return true;

      const inKannada = p.kannada.includes(trimmed);
      const inTranslit = p.transliteration.toLowerCase().includes(trimmed);
      const inEnglish = p.english.toLowerCase().includes(trimmed);
      const inSituation = p.situation.toLowerCase().includes(trimmed);
      const inNotes = p.contextNote.toLowerCase().includes(trimmed);
      const inTags = p.tags.some((tag) => tag.toLowerCase().includes(trimmed));

      const category = CATEGORIES.find((c) => c.id === p.categoryId);
      const inCatName = category
        ? category.name.toLowerCase().includes(trimmed) ||
          category.kannadaName.includes(trimmed)
        : false;

      return (
        inKannada ||
        inTranslit ||
        inEnglish ||
        inSituation ||
        inNotes ||
        inTags ||
        inCatName
      );
    });
  }, [query, activeCategoryFilter]);

  return (
    <div className="space-y-6 pb-16">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Instant Phrase Search
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
          Search across Kannada script, English translation, phonetic transliteration, or keywords
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-2.5 rounded-3xl border-2 border-teal-800 shadow-md flex items-center relative">
        <Search className="w-5 h-5 text-teal-800 ml-3 mr-2 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Type in Kannada or English, e.g. 'auto', 'ಬಸ್', 'water', 'doctor'..."
          autoFocus
          className="w-full py-2 bg-transparent text-stone-900 font-medium text-sm sm:text-base focus:outline-none"
        />
        {query && (
          <button
            onClick={clearQuery}
            aria-label="Clear search"
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors mr-2"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggested Search Terms */}
      <div className="space-y-2">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Popular Everyday Queries</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedQueries.map((term) => (
            <button
              key={term}
              onClick={() => handleQueryChange(term)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 border border-stone-200 text-stone-700 hover:text-teal-900 hover:border-teal-300 text-xs font-semibold transition-all shadow-xs"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none pt-2">
        <button
          onClick={() => setActiveCategoryFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeCategoryFilter === 'all'
              ? 'bg-teal-900 text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
          }`}
        >
          All Categories
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategoryFilter(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeCategoryFilter === c.id
                ? 'bg-teal-900 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Search Results */}
      {query.trim() || activeCategoryFilter !== 'all' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 pb-1 border-b border-stone-200">
            <span>
              Found {results.length} phrase{results.length === 1 ? '' : 's'}
              {query.trim() && ` for "${query}"`}
            </span>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((phrase) => (
                <PhraseCard key={phrase.id} phrase={phrase} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-800 text-base">
                No matching Kannada phrases found
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                We couldn't find any phrases matching "{query}". Try searching by individual words like "bus", "money", "food", or browse by situation category.
              </p>
              <button
                onClick={clearQuery}
                className="px-4 py-2 bg-teal-800 text-white rounded-xl text-xs font-bold hover:bg-teal-900 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State with Helpful Tips */
        <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Start searching Kannada phrases
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
              Search works instantly offline. Type in Kannada (e.g. ದೋಸೆ), English (e.g. dosa), or English transliteration (e.g. dose).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
