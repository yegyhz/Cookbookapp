import React from 'react';
import { LayoutGrid, List, ChevronRight, Search } from 'lucide-react';
import { Recipe, Category } from '../types';
import RecipeCard from './RecipeCard';
import RecipeListItem from './RecipeListItem';

interface RecipeListProps {
  recipes: Recipe[];
  favorites: string[];
  selectedCategory: Category | 'All' | 'Favorites';
  layoutMode: 'grid' | 'list';
  searchTerm: string;
  setView: (view: 'categories' | 'list' | 'detail') => void;
  setLayoutMode: (mode: 'grid' | 'list') => void;
  handleRecipeClick: (recipe: Recipe) => void;
  toggleFavorite: (e: React.MouseEvent, recipeId: string) => void;
  setSearchTerm: (term: string) => void;
}

const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  favorites,
  selectedCategory,
  layoutMode,
  searchTerm,
  setView,
  setLayoutMode,
  handleRecipeClick,
  toggleFavorite,
  setSearchTerm,
}) => {
  return (
    <div className="max-w-7xl mx-auto animate-fade-in h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 text-stone-400 text-sm font-medium mb-1">
            <button onClick={() => setView('categories')} className="hover:text-stone-600 hover:underline">Categories</button>
            <ChevronRight size={14} />
            <span className="text-sky-700">{selectedCategory}</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-stone-800">
            {selectedCategory === 'All' ? 'All Recipes' : selectedCategory}
          </h2>
        </div>

        <div className="flex items-center gap-3 bg-white p-1.5 rounded-lg border border-stone-200 shadow-sm">
          <button
            onClick={() => setLayoutMode('grid')}
            className={`p-2 rounded-md transition-all ${layoutMode === 'grid' ? 'bg-stone-100 text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
            title="Grid View"
          >
            <LayoutGrid size={20} />
          </button>
          <div className="w-px h-6 bg-stone-200"></div>
          <button
            onClick={() => setLayoutMode('list')}
            className={`p-2 rounded-md transition-all ${layoutMode === 'list' ? 'bg-stone-100 text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
            title="List View"
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-stone-400 min-h-[400px]">
          <div className="bg-stone-100 p-6 rounded-full mb-4">
            <Search size={48} className="opacity-50" />
          </div>
          <p className="text-lg font-serif italic mb-2">No recipes found</p>
          <p className="text-sm">Try adjusting your search or category.</p>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="mt-4 text-sky-600 hover:underline font-bold text-sm">
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className={`${layoutMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex flex-col gap-3'} pb-20`}>
          {recipes.map(recipe => (
            layoutMode === 'grid' ? (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => handleRecipeClick(recipe)}
                isFavorite={favorites.includes(recipe.id)}
                onToggleFavorite={(e) => toggleFavorite(e, recipe.id)}
              />
            ) : (
              <RecipeListItem
                key={recipe.id}
                recipe={recipe}
                onClick={() => handleRecipeClick(recipe)}
                isFavorite={favorites.includes(recipe.id)}
                onToggleFavorite={(e) => toggleFavorite(e, recipe.id)}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeList;
