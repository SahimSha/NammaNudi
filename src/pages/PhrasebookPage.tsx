import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, BookOpen, Layers } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { PHRASES } from '../data/phrases';
import { PhraseCard } from '../components/PhraseCard';
import { CategoryIcon } from '../components/CategoryIcon';


export const PhrasebookPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormality, setSelectedFormality] = useState<string>('all');

  const selectedCategory = CATEGORIES.find((c) => c.id === selectedCategoryId);

  const handleSelectCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  // Filter phrases
  const filteredPhrases = useMemo(() => {
    return PHRASES.filter((p) => {
      // Category match
      if (selectedCategoryId !== 'all' && p.categoryId !== selectedCategoryId) {
        return false;
      }

      // Formality match
      if (selectedFormality !== 'all' && p.formality !== selectedFormality) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesKannada = p.kannada.includes(query);
        const matchesTranslit = p.transliteration.toLowerCase().includes(query);
        const matchesEnglish = p.english.toLowerCase().includes(query);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(query));
        const matchesSituation = p.situation.toLowerCase().includes(query);

        return (
          matchesKannada ||
          matchesTranslit ||
          matchesEnglish ||
          matchesTags ||
          matchesSituation
        );
      }

      return true;
    });
  }, [selectedCategoryId, selectedFormality, searchQuery]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-teal-800 mb-1">
          <BookOpen className="w-4 h-4 text-teal-700" />
          <span>Everyday Situation Phrasebook</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Practical Everyday Kannada
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
          Browse verified, context-rich expressions across real-world Karnataka life
        </p>
      </div>

      {/* Category Pills (Horizontal Scroll on Mobile) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleSelectCategory('all')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
            selectedCategoryId === 'all'
              ? 'bg-teal-900 text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Situations ({PHRASES.length})</span>
        </button>

        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const count = PHRASES.filter((p) => p.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                isSelected
                  ? 'bg-teal-900 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <CategoryIcon iconName={cat.iconName} className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isSelected ? 'bg-amber-400 text-teal-950' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Category Banner (if specific category chosen) */}
      {selectedCategory && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start space-x-3.5 min-w-0">
            <div
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: `${selectedCategory.accentColor}18`,
                color: selectedCategory.accentColor
              }}
            >
              <CategoryIcon iconName={selectedCategory.iconName} className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-stone-900 truncate">
                  {selectedCategory.name}
                </h2>
                <span className="font-kannada text-xs sm:text-sm font-bold text-teal-800">
                  ({selectedCategory.kannadaName})
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">
                {selectedCategory.description}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
            <span className="text-xs font-semibold text-stone-400">
              {filteredPhrases.length} phrases shown
            </span>
          </div>
        </div>
      )}

      {/* Search & Formality Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter phrases in current view..."
            className="w-full pl-10 pr-4 py-2 bg-stone-50 text-stone-900 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-700 transition-all border border-stone-200 min-h-[40px]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 min-h-[32px] px-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Formality Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
          <Filter className="w-3.5 h-3.5 text-stone-400 ml-1 shrink-0" />
          <span className="text-xs text-stone-400 font-semibold mr-1 shrink-0">Tone:</span>
          {['all', 'polite', 'casual', 'formal'].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedFormality(level)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors min-h-[36px] shrink-0 ${
                selectedFormality === level
                  ? 'bg-amber-400 text-teal-950 shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Phrases Grid */}
      {filteredPhrases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPhrases.map((phrase) => (
            <PhraseCard
              key={phrase.id}
              phrase={phrase}
              showCategoryBadge={selectedCategoryId === 'all'}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-800 text-base">No phrases found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search query or reset the filters to see available Kannada phrases.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedFormality('all');
              handleSelectCategory('all');
            }}
            className="px-4 py-2 bg-teal-800 text-white rounded-xl text-xs font-bold hover:bg-teal-900 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
