import { renderHook, act, waitFor } from '@testing-library/react';
import { useRecipeSearch } from './useRecipeSearch';
import { recipeService } from '../services/api';
import { Category, Recipe } from '../types';

// Mock the recipeService
jest.mock('../services/api', () => ({
    recipeService: {
        search: jest.fn(),
    },
}));

const mockRecipes: Recipe[] = [
    {
        id: '1',
        title: 'Pancakes',
        category: Category.BREAKFAST,
        ingredients: ['Flour', 'Milk'],
        instructions: ['Mix', 'Cook'],
        addedBy: 'Mom',
        timestamp: 12345,
    },
    {
        id: '2',
        title: 'Spaghetti',
        category: Category.MAIN_DISHES,
        ingredients: ['Pasta', 'Tomato Sauce'],
        instructions: ['Boil', 'Serve'],
        addedBy: 'Dad',
        timestamp: 12346,
    },
];

describe('useRecipeSearch', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return initial state correctly', () => {
        const { result } = renderHook(() => useRecipeSearch({ recipes: mockRecipes, favorites: [] }));

        expect(result.current.searchTerm).toBe('');
        expect(result.current.selectedCategory).toBe('All');
        expect(result.current.filteredRecipes).toEqual(mockRecipes);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('should filter by category locally when no search term', () => {
        const { result } = renderHook(() => useRecipeSearch({ recipes: mockRecipes, favorites: [] }));

        act(() => {
            result.current.setSelectedCategory(Category.BREAKFAST);
        });

        expect(result.current.filteredRecipes).toHaveLength(1);
        expect(result.current.filteredRecipes[0].title).toBe('Pancakes');
    });

    it('should perform server-side search when search term is provided', async () => {
        const mockSearchResults = [mockRecipes[1]]; // Search finds Spaghetti
        (recipeService.search as jest.Mock).mockResolvedValue(mockSearchResults);

        const { result } = renderHook(() => useRecipeSearch({ recipes: mockRecipes, favorites: [] }));

        await act(async () => {
            await result.current.handleSearchChange('Spag', 'user-123');
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.searchResults).toEqual(mockSearchResults);
        expect(result.current.filteredRecipes).toEqual(mockSearchResults);
        expect(recipeService.search).toHaveBeenCalledWith('Spag', 'user-123');
    });

    it('should handle search errors gracefully', async () => {
        (recipeService.search as jest.Mock).mockRejectedValue(new Error('Search failed'));

        const { result } = renderHook(() => useRecipeSearch({ recipes: mockRecipes, favorites: [] }));

        await act(async () => {
            await result.current.handleSearchChange('Error', 'user-123');
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('Failed to search recipes');
        expect(result.current.searchResults).toBeNull();
    });

    it('should clear search results when search term is cleared', async () => {
        const { result } = renderHook(() => useRecipeSearch({ recipes: mockRecipes, favorites: [] }));

        // First do a search
        (recipeService.search as jest.Mock).mockResolvedValue([mockRecipes[0]]);
        await act(async () => {
            await result.current.handleSearchChange('Pan', 'user-123');
        });

        // Then clear it
        await act(async () => {
            await result.current.handleSearchChange('', 'user-123');
        });

        expect(result.current.searchTerm).toBe('');
        expect(result.current.searchResults).toBeNull();
        // Should revert to showing all recipes
        expect(result.current.filteredRecipes).toEqual(mockRecipes);
    });
});
