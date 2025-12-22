import React from 'react';
import { BookOpen } from 'lucide-react';
import { Recipe, Category } from '../types';
import CategoryCard from './CategoryCard';

interface CategoryListProps {
  recipes: Recipe[];
  setView: (view: 'categories' | 'list' | 'detail') => void;
  setSelectedCategory: (category: Category | 'All' | 'Favorites') => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  recipes,
  setView,
  setSelectedCategory,
}) => {
  const safeRecipes = recipes || [];
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-10 text-center md:text-left">
        <h2 className="font-serif text-3xl md:text-4xl text-stone-800 mb-3">Welcome to the Kitchen</h2>
        <p className="text-stone-500 text-lg">Select a category to explore Nan's collection.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Object.values(Category).map((cat) => {
          const count = safeRecipes.filter(r => r.category === cat).length;
          return (
            <CategoryCard
              key={cat}
              category={cat}
              count={count}
              onClick={() => { setSelectedCategory(cat); setView('list'); }}
            />
          );
        })}
        {/* All Recipes Card */}
        <button
          onClick={() => { setSelectedCategory('All'); setView('list'); }}
          className="group relative p-8 h-64 rounded-[2rem] border border-stone-200 shadow-sm hover:shadow-2xl transition-all duration-500 bg-white flex flex-col items-center justify-center text-center gap-6 hover:-translate-y-2 overflow-hidden"
        >
          <div className="bg-stone-50 p-5 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300 ring-4 ring-stone-100 relative z-10 text-stone-700">
            <BookOpen size={32} />
          </div>
          <div className="relative z-10 text-stone-800">
            <h3 className="font-serif text-2xl font-bold mb-2">All Recipes</h3>
            <span className="inline-block px-3 py-1 bg-stone-100 rounded-full text-xs font-bold uppercase tracking-widest text-stone-600">
              {safeRecipes.length} Total
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default CategoryList;
