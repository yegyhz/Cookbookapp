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
}

const HomePage: React.FC = () => {
  const { recipes, favorites, toggleFavorite, handleRecipeClick } = useOutletContext<AppContext>();

  return (
    <>
      <CategoryList />
      <RecipeList
        recipes={recipes}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        handleRecipeClick={handleRecipeClick}
      />
    </>
  );
};

export default HomePage;
