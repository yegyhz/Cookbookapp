import React, { useReducer, useMemo, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { Recipe, Category } from './types';
import { appReducer, initialState } from './reducers/appReducer';
import Intro from './components/Intro';
import PrintLayout from './components/PrintLayout';
import RecipeModal from './components/RecipeModal';
import DataExportModal from './components/DataExportModal';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileMenu from './components/MobileMenu';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import { useRecipeSearch } from './hooks/useRecipeSearch';

// IMPORTANT: Ensure these are the client-side Firebase SDKs, not 'firebase-admin'
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import AuthComponent from './components/Auth';

const App: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
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
    view,
    isPrinting,
    showAddModal,
    editingRecipe,
    mobileMenuOpen,
    showSuccessToast,
    isSearchFocused,
    activeSuggestion,
    showDataExport,
    error,
  } = state;

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync external errors with local state
  useEffect(() => {
    if (recipesError) {
      dispatch({ type: 'SET_ERROR', payload: recipesError });
      setTimeout(() => dispatch({ type: 'SET_ERROR', payload: null }), 5000);
    }
  }, [recipesError]);

  const handleStart = () => {
    navigate('/');
    window.scrollTo(0, 0);
  };

  const handleRecipeClick = (recipe: Recipe) => {
    navigate(`/recipe/${recipe.id}`);
    window.scrollTo(0, 0);
  };

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
  if (!user) {
    return <AuthComponent />;
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {isPrinting && (
        <PrintLayout
          recipes={filteredRecipes}
          onExit={() => dispatch({ type: 'SET_IS_PRINTING', payload: false })}
        />
      )}

      {view === 'intro' && !isPrinting && <Intro onStart={handleStart} />}

      {view !== 'intro' && !isPrinting && (
        <div className="flex h-screen overflow-hidden">
          <Sidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategorySelect}
            setShowDataExport={(s) => dispatch({ type: 'SET_SHOW_DATA_EXPORT', payload: s })}
          />

          <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-stone-50">
            <Header
              searchTerm={searchTerm}
              isSearchFocused={isSearchFocused}
              activeSuggestion={activeSuggestion}
              searchSuggestions={searchSuggestions}
              setMobileMenuOpen={(o) => dispatch({ type: 'SET_MOBILE_MENU_OPEN', payload: o })}
              handleSearchChange={handleSearchChange}
              setIsSearchFocused={(f) => dispatch({ type: 'SET_IS_SEARCH_FOCUSED', payload: f })}
              handleSearchKeyDown={handleSearchKeyDown}
              handleRecipeClick={handleRecipeClick}
              setShowAddModal={(s) => dispatch({ type: 'SET_SHOW_ADD_MODAL', payload: s })}
            />

            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <Outlet context={{
                recipes: filteredRecipes,
                favorites,
                toggleFavorite,
                handleRecipeClick,
                searchTerm,
                setSearchTerm: handleSearchChange, // Note: handleSearchChange takes (value)
                selectedCategory,
                setSelectedCategory: handleCategorySelect,
                layoutMode: state.layoutMode,
                setLayoutMode: (mode: 'grid' | 'list') => dispatch({ type: 'SET_LAYOUT_MODE', payload: mode }),
                setView: (view: any) => dispatch({ type: 'SET_VIEW', payload: view })
              }} />
            </div>

            {showSuccessToast && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-6 py-3 rounded-full flex items-center gap-3 z-50">
                <Check size={12} /> <span>Success</span>
              </div>
            )}
          </main>

          <MobileMenu
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={(o) => dispatch({ type: 'SET_MOBILE_MENU_OPEN', payload: o })}
            setSelectedCategory={handleCategorySelect}
            handleCategorySelect={handleCategorySelect}
            setView={(v) => dispatch({ type: 'SET_VIEW', payload: v })}
          />
        </div>
      )}

      {showAddModal && (
        <RecipeModal
          onClose={() => { dispatch({ type: 'SET_SHOW_ADD_MODAL', payload: false }); dispatch({ type: 'SET_EDITING_RECIPE', payload: null }); }}
          onSave={editingRecipe ? handleUpdateRecipe : handleAddRecipe}
          initialData={editingRecipe || undefined}
        />
      )}

      {showDataExport && (
        <DataExportModal
          isOpen={showDataExport}
          onClose={() => dispatch({ type: 'SET_SHOW_DATA_EXPORT', payload: false })}
          recipes={recipes}
        />
      )}
    </div>
  );
};

export default App;