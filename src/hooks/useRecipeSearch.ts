import { useState, useMemo } from 'react';
import { Recipe, Category } from '../types';
import { recipeService } from '../services/api';

interface UseRecipeSearchProps {
    recipes: Recipe[];
    favorites: string[];
}

interface UseRecipeSearchReturn {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCategory: Category | 'All' | 'Favorites';
    setSelectedCategory: (category: Category | 'All' | 'Favorites') => void;
    searchResults: Recipe[] | null;
    isSearching: boolean;
    loading: boolean;
    error: string | null;
    filteredRecipes: Recipe[];
    handleSearchChange: (term: string, userId: string | undefined) => Promise<void>;
}

export const useRecipeSearch = ({ recipes, favorites }: UseRecipeSearchProps): UseRecipeSearchReturn => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | 'All' | 'Favorites'>('All');

    // Server search state
    const [searchResults, setSearchResults] = useState<Recipe[] | null>(null);
    const [loading, setLoading] = useState(false); // aka isSearching
    const [error, setError] = useState<string | null>(null);

    const handleSearchChange = async (value: string, userId: string | undefined) => {
        setSearchTerm(value);
        setError(null);

        if (value.trim().length > 0 && userId) {
            setLoading(true);
            try {
                const data = await recipeService.search(value, userId);
                setSearchResults(data);
            } catch (err) {
                console.error('Error searching recipes:', err);
                setError('Failed to search recipes');
                setSearchResults(null);
            } finally {
                setLoading(false);
            }
        } else {
            setSearchResults(null);
            setLoading(false);
        }
    };

    const filteredRecipes = useMemo(() => {
        // If searching, use searchResults (or empty if null/loading).
        // If not searching (empty term), use all recipes.
        // BUT strict requirement: server-side search only returns matches.

        // Edge case: searchTerm exists but results null?
        // If loading, maybe show previous? or empty?
        // Let's go with: if searchTerm, use results || [].
        // If !searchTerm, use recipes.

        const baseRecipes = searchTerm.trim() ? (searchResults || []) : recipes;

        return baseRecipes.filter(r => {
            if (selectedCategory === 'Favorites') return favorites.includes(r.id);
            if (selectedCategory !== 'All') return r.category === selectedCategory;
            return true;
        });
    }, [recipes, searchResults, selectedCategory, favorites, searchTerm]);

    return {
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        searchResults,
        isSearching: loading, // alias for compat
        loading,
        error,
        filteredRecipes,
        handleSearchChange
    };
};
