import React, { useRef } from 'react';
import { Search, Plus, Menu } from 'lucide-react';
import { Recipe } from '../types';

interface HeaderProps {
  searchTerm: string;
  isSearchFocused: boolean;
  activeSuggestion: number;
  searchSuggestions: Recipe[];
  setMobileMenuOpen: (open: boolean) => void;
  handleSearchChange: (value: string) => void;
  setIsSearchFocused: (focused: boolean) => void;
  handleSearchKeyDown: (e: React.KeyboardEvent) => void;
  handleRecipeClick: (recipe: Recipe) => void;
  setShowAddModal: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  isSearchFocused,
  activeSuggestion,
  searchSuggestions,
  setMobileMenuOpen,
  handleSearchChange,
  setIsSearchFocused,
  handleSearchKeyDown,
  handleRecipeClick,
  setShowAddModal,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="bg-white border-b border-stone-200 h-16 md:h-20 flex items-center justify-between px-4 md:px-8 z-10 shadow-sm flex-shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-lg">
          <Menu size={24} />
        </button>

        {/* Search Bar */}
        <div className="relative w-full max-w-xl group">
          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${isSearchFocused ? 'text-sky-600' : 'text-stone-400'}`}>
            <Search size={18} />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search recipes, ingredients..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            onKeyDown={handleSearchKeyDown}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-100 border border-transparent rounded-xl focus:bg-white focus:border-sky-300 focus:ring-4 focus:ring-sky-100 outline-none transition-all placeholder:text-stone-400 text-sm md:text-base"
          />

          {/* Search Suggestions Dropdown */}
          {isSearchFocused && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-stone-100 py-2 z-50 overflow-hidden animate-scale-in">
              <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-stone-400">Suggestions</div>
              {searchSuggestions.map((suggestion, idx) => (
                <button
                  key={suggestion.id}
                  onMouseDown={() => handleRecipeClick(suggestion)}
                  className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-sky-50 transition-colors ${activeSuggestion === idx ? 'bg-sky-50 text-sky-700' : 'text-stone-600'}`}
                >
                  <Search size={14} className="opacity-50" />
                  <span className="truncate font-medium">{suggestion.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 pl-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-stone-900 hover:bg-stone-800 text-white p-2.5 md:px-5 md:py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          <span className="hidden md:inline font-medium">Add Recipe</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
