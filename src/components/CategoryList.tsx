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
    <div className="max-w-7xl mx-auto animate-fade-in p-8">
      <div className="mb-12 text-center">
        <h2 className="font-serif text-4xl md:text-5xl text-stone-800 mb-4">Welcome to the Kitchen</h2>
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
          className="group relative p-6 h-64 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-stone-200 flex flex-col items-center justify-center text-center gap-4 hover:-translate-y-1 overflow-hidden"
        >
          <div className="bg-stone-50 p-4 rounded-2xl shadow-sm mb-2 text-stone-600 relative z-10">
            <BookOpen size={32} />
          </div>
          <div className="relative z-10">
            <h3 className="font-serif text-xl font-bold mb-1 leading-tight text-stone-900">All Recipes</h3>
            <span className="inline-block px-3 py-1 bg-stone-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-500">
              {safeRecipes.length} Total
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default CategoryList;
