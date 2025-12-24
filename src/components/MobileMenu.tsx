import React from 'react';
import { BookOpen, LayoutGrid, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../types';

interface MobileMenuProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  // setView removed, using router
  setSelectedCategory: (category: Category | 'All' | 'Favorites') => void;
  handleCategorySelect: (category: Category | 'All' | 'Favorites') => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  setSelectedCategory,
  handleCategorySelect,
}) => {
  const navigate = useNavigate();
  if (!mobileMenuOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
      <div className="relative w-64 bg-stone-900 text-stone-300 h-full shadow-2xl animate-slide-right flex flex-col">
        <div className="p-6 border-b border-stone-800 flex justify-between items-center">
          <span className="font-serif text-xl text-stone-100">Menu</span>
          <button onClick={() => setMobileMenuOpen(false)}><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <button
            onClick={() => { navigate('/dashboard'); setSelectedCategory('All'); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 text-stone-100"
          >
            <LayoutGrid size={18} /> Categories
          </button>
          <button
            onClick={() => { navigate('/dashboard'); setSelectedCategory('All'); setMobileMenuOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 text-stone-100"
          >
            <BookOpen size={18} /> All Recipes
          </button>
          <div className="border-t border-stone-800 my-2 pt-2">
            {Object.values(Category).map(cat => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className="w-full text-left px-4 py-3 text-sm hover:bg-stone-800 rounded-lg"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
