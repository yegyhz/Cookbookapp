import { useState, useMemo } from 'react';
import { Recipe, Category } from '../types';
import { searchRecipes } from '../services/recipeSearchService';

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
    filteredRecipes: Recipe[];
    handleSearchChange: (term: string, userId: string | undefined) => Promise<void>;
}

export const useRecipeSearch = ({ recipes, favorites }: UseRecipeSearchProps): UseRecipeSearchReturn => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | 'All' | 'Favorites'>('All');
    const [searchResults, setSearchResults] = useState<Recipe[] | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearchChange = async (value: string, userId: string | undefined) => {
        setSearchTerm(value);
        if (value.trim().length > 0 && userId) {
            setIsSearching(true);
            try {
                const data = await searchRecipes(value, userId);
                setSearchResults(data);
            } catch (err) {
                console.error('Error searching recipes:', err);
            } finally {
                setIsSearching(false);
            }
        } else {
            setSearchResults(null);
            setIsSearching(false);
        }
    };

    const filteredRecipes = useMemo(() => {
        const baseRecipes = searchResults || recipes;
        return baseRecipes.filter(r => {
            if (selectedCategory === 'Favorites') return favorites.includes(r.id);
            if (selectedCategory !== 'All') return r.category === selectedCategory;
            return true;
        });
    }, [recipes, searchResults, selectedCategory, favorites]);

    return {
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        searchResults,
        isSearching,
        filteredRecipes,
        handleSearchChange
    };
};
