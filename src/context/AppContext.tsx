import React, { createContext, useContext } from 'react';
import { useRecipes } from '../hooks/useRecipes';
import { Recipe } from '../types';

interface AppContextType {
  recipes: Recipe[];
  favorites: string[];
  loading: boolean;
  error: string | null;
  toggleFavorite: (recipeId: string) => void;
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (recipe: Recipe) => void;
  deleteRecipe: (recipeId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const recipeData = useRecipes();

  // Ensure all functions defined in the interface are passed into the provider
  const contextValue: AppContextType = {
    recipes: recipeData.recipes,
    favorites: recipeData.favorites,
    loading: recipeData.loading,
    error: recipeData.error,
    toggleFavorite: recipeData.toggleFavorite,
    addRecipe: recipeData.addRecipe,
    updateRecipe: recipeData.updateRecipe,
    deleteRecipe: recipeData.deleteRecipe,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};