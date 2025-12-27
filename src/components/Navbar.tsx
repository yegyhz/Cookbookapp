import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart, User, LogOut, Menu, X, ChefHat } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Recipe } from '../types';

interface NavbarProps {
    totalRecipes: number;
    favoritesCount: number;
    searchTerm: string;
    isSearchFocused: boolean;
    activeSuggestion: number;
    searchSuggestions: Recipe[];
    handleSearchChange: (value: string) => void;
    setIsSearchFocused: (focused: boolean) => void;
    handleSearchKeyDown: (e: React.KeyboardEvent) => void;
    handleRecipeClick: (recipe: Recipe) => void;
}

const Navbar: React.FC<NavbarProps> = ({
    totalRecipes,
    favoritesCount,
    searchTerm,
    isSearchFocused,
    activeSuggestion,
    searchSuggestions,
    handleSearchChange,
    setIsSearchFocused,
    handleSearchKeyDown,
    handleRecipeClick,
}) => {
    const [user] = useAuthState(auth);
    const { logOut } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
            <div className="max-w-5xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center text-white">
                            <ChefHat size={16} />
                        </div>
                        <div>
                            <h1 className="font-serif font-bold text-lg md:text-xl text-stone-900 tracking-tight leading-none">Shirley&rsquo;s Kitchen</h1>
                            <p className="text-[10px] uppercase tracking-widest text-stone-500 font-medium hidden sm:block">Family Cookbook</p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
                        <NavLink to="/list" className={({ isActive }) => `hover:text-stone-900 transition-colors ${isActive ? 'text-stone-900 font-semibold' : ''}`}>
                            All Recipes ({totalRecipes})
                        </NavLink>
                        <NavLink to="/categories" className={({ isActive }) => `hover:text-stone-900 transition-colors ${isActive ? 'text-stone-900 font-semibold' : ''}`}>
                            Categories
                        </NavLink>
                        <NavLink to="/list" onClick={() => { /* setFavorites filter logic could go here or via URL params */ }} className="flex items-center gap-1.5 hover:text-stone-900 transition-colors">
                            Favorites <span className="bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded-full text-xs">{favoritesCount}</span>
                        </NavLink>
                    </div>


                    {/* Search & Profile */}
                    <div className="flex items-center gap-4">
                        {/* Compact Search Bar */}
                        <div className="relative group hidden sm:block">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                    onKeyDown={handleSearchKeyDown}
                                    className="w-48 pl-9 pr-4 py-1.5 bg-stone-100 border border-transparent rounded-full text-sm focus:bg-white focus:border-stone-300 focus:ring-2 focus:ring-stone-100 outline-none transition-all placeholder:text-stone-400"
                                />
                            </div>
                            {/* Suggestions */}
                            {isSearchFocused && searchSuggestions.length > 0 && (
                                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-100 py-2 overflow-hidden animate-scale-in origin-top-right">
                                    {searchSuggestions.map((suggestion, idx) => (
                                        <button
                                            key={suggestion.id}
                                            onMouseDown={() => handleRecipeClick(suggestion)}
                                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-stone-50 transition-colors ${activeSuggestion === idx ? 'bg-stone-50 text-stone-900' : 'text-stone-600'}`}
                                        >
                                            <span className="truncate">{suggestion.title}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-stone-600">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        {/* Sign Out (Desktop) */}
                        <button onClick={logOut} className="hidden md:flex p-2 text-stone-400 hover:text-stone-600" title="Sign Out">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-stone-200 bg-white">
                    <div className="px-4 py-4 space-y-4">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Search recipes..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-stone-100 rounded-lg text-sm outline-none"
                            />
                        </div>
                        <div className="flex flex-col space-y-2 text-sm font-medium text-stone-600">
                            <NavLink to="/list" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-stone-100">All Recipes</NavLink>
                            <NavLink to="/categories" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-stone-100">Categories</NavLink>
                            <NavLink to="/list" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-stone-100">Favorites ({favoritesCount})</NavLink>
                            <button onClick={logOut} className="py-2 text-left text-red-600">Sign Out</button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
