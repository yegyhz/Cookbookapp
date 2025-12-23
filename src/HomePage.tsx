import React from 'react';
import { useOutletContext } from 'react-router-dom';
import CategoryList from './components/CategoryList';
import RecipeList from './components/RecipeList';
import { Recipe } from './types';

interface AppContext {
  recipes: Recipe[];
  favorites: string[];
  toggleFavorite: (e: React.MouseEvent, recipeId: string) => void;
  handleRecipeClick: (recipe: Recipe) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: any;
  setSelectedCategory: (cat: any) => void;
  layoutMode: 'grid' | 'list';
  setLayoutMode: (mode: 'grid' | 'list') => void;
  setView: (view: any) => void;
}

const HomePage: React.FC = () => {
  const {
    recipes,
    favorites,
    toggleFavorite,
    handleRecipeClick,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    layoutMode,
    setLayoutMode,
    setView
  } = useOutletContext<AppContext>();

  return (
    <>
      <CategoryList
        recipes={recipes}
        setView={setView}
        setSelectedCategory={setSelectedCategory}
      />
      <RecipeList
        recipes={recipes}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        handleRecipeClick={handleRecipeClick}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        setView={setView}
      />
    </>
  );
};

export default HomePage;
