import React, { useReducer, useMemo, useRef, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recipe, Category } from './types';
import { appReducer, initialState } from './reducers/appReducer';
import RecipeModal from './components/RecipeModal';
// import DataExportModal from './components/DataExportModal'; // Lazy loaded

const DataExportModal = lazy(() => import('./components/DataExportModal'));
import { Outlet } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import { useRecipeSearch } from './hooks/useRecipeSearch';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import AuthComponent from './components/Auth';

const App: React.FC = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const { recipes, favorites, error: recipesError, toggleFavorite, addRecipe, updateRecipe, deleteRecipe } = useAppContext();

  // Use custom hook for search and filtering
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredRecipes,
    handleSearchChange: hookHandleSearchChange
  } = useRecipeSearch({ recipes, favorites });

  const [state, dispatch] = useReducer(appReducer, initialState);

  const {
    // view, // Removed view state usage
    // isPrinting, // Removed printing state usage
    showAddModal,
    editingRecipe,
    mobileMenuOpen,
    showSuccessToast,
    isSearchFocused,
    activeSuggestion,
    showDataExport,
  } = state;

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync external errors with local state
  useEffect(() => {
    if (recipesError) {
      dispatch({ type: 'SET_ERROR', payload: recipesError });
      setTimeout(() => dispatch({ type: 'SET_ERROR', payload: null }), 5000);
    }
  }, [recipesError]);

  const handleCategorySelect = (cat: Category | 'All' | 'Favorites') => {
    setSelectedCategory(cat);
    dispatch({ type: 'SET_MOBILE_MENU_OPEN', payload: false });
  };

  const handleAddRecipe = (newRecipe: Recipe) => {
    addRecipe(newRecipe);
    dispatch({ type: 'SET_SHOW_SUCCESS_TOAST', payload: true });
    setTimeout(() => dispatch({ type: 'SET_SHOW_SUCCESS_TOAST', payload: false }), 3000);
  };

  const handleUpdateRecipe = (updatedRecipe: Recipe) => {
    updateRecipe(updatedRecipe);
    dispatch({ type: 'SET_SHOW_SUCCESS_TOAST', payload: true });
    setTimeout(() => dispatch({ type: 'SET_SHOW_SUCCESS_TOAST', payload: false }), 3000);
  };

  const handleSearchChange = (value: string) => {
    // Delegate to hook
    hookHandleSearchChange(value, user?.uid);
  };

  // Note: handleRecipeClick definition is moved to consumers using useNavigate, 
  // BUT we need it here if we want to provide it in context.
  // Actually, handleRecipeClick is effectively "navigate to recipe".
  // Consumers (DashboardLayout components) can use useNavigate directly.
  // However, for compatibility with existing components that expect pass-through props, we can provide a dummy or real one?
  // Let's provide a real one that accepts navigate as dependency? 
  // No, we can't easily. 
  // Better: Components should use useNavigate locally or we pass a wrapper.
  // I will provide a context function that logs or does nothing, expecting components to handle links.
  // Wait, `Header` expects `handleRecipeClick`. 
  // I should define it using useNavigate inside the component that has access to it.
  // App has useNavigate!

  // const navigate = useNavigate(); // App works as a route component so it has router context
  // BUT App is the Layout route. 'navigate' works.

  // Re-instating navigate for handleRecipeClick
  // We need to import useNavigate? Yes.
  // But wait, App is rendered in Router.tsx.

  const handleRecipeClick = (recipe: Recipe) => {
    navigate(`/dashboard/recipe/${recipe.id}`);
    window.scrollTo(0, 0);
  };

  const searchSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return recipes
      .filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5);
  }, [recipes, searchTerm]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchFocused || searchSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      dispatch({ type: 'SET_ACTIVE_SUGGESTION', payload: (activeSuggestion + 1) % searchSuggestions.length });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      dispatch({ type: 'SET_ACTIVE_SUGGESTION', payload: (activeSuggestion - 1 + searchSuggestions.length) % searchSuggestions.length });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestion >= 0) {
        handleRecipeClick(searchSuggestions[activeSuggestion]);
        searchInputRef.current?.blur();
      }
    }
  };

  // Auth Guard
  if (loading) return <div className="flex h-screen items-center justify-center bg-stone-50">Loading...</div>;
  if (!user) {
    return <AuthComponent />;
  }

  const contextValue = {
    recipes: filteredRecipes, // Passing filtered as 'recipes' for display, or raw? Consumers expect 'recipes' usually. 
    // Original App passed 'filteredRecipes' to PrintLayout.
    // But 'recipes' context prop usually means all recipes?
    // Let's pass both.
    allRecipes: recipes,
    favorites,
    toggleFavorite,
    searchTerm,
    setSearchTerm: handleSearchChange,
    selectedCategory,
    setSelectedCategory: handleCategorySelect,

    // UI State & Setters
    mobileMenuOpen,
    setMobileMenuOpen: (o: boolean) => dispatch({ type: 'SET_MOBILE_MENU_OPEN', payload: o }),
    showDataExport,
    setShowDataExport: (s: boolean) => dispatch({ type: 'SET_SHOW_DATA_EXPORT', payload: s }),
    isSearchFocused,
    setIsSearchFocused: (f: boolean) => dispatch({ type: 'SET_IS_SEARCH_FOCUSED', payload: f }),
    activeSuggestion,
    searchSuggestions,
    showSuccessToast,
    setShowAddModal: (s: boolean) => dispatch({ type: 'SET_SHOW_ADD_MODAL', payload: s }),

    // Handlers
    // handleRecipeClick, // We will deal with this
    handleSearchKeyDown,

    // Actions
    addRecipe,
    updateRecipe,
    deleteRecipe,

    // Layout State (if needed)
    layoutMode: state.layoutMode,
    setLayoutMode: (mode: 'grid' | 'list') => dispatch({ type: 'SET_LAYOUT_MODE', payload: mode }),
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <Outlet context={contextValue} />

      {showAddModal && (
        <RecipeModal
          onClose={() => { dispatch({ type: 'SET_SHOW_ADD_MODAL', payload: false }); dispatch({ type: 'SET_EDITING_RECIPE', payload: null }); }}
          onSave={editingRecipe ? handleUpdateRecipe : handleAddRecipe}
          initialData={editingRecipe || undefined}
        />
      )}

      {showDataExport && (
        <Suspense fallback={null}>
          <DataExportModal
            isOpen={showDataExport}
            onClose={() => dispatch({ type: 'SET_SHOW_DATA_EXPORT', payload: false })}
            recipes={recipes}
          />
        </Suspense>
      )}
    </div>
  );
};

export default App;