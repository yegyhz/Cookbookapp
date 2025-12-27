import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Check } from 'lucide-react';
import { Recipe, Category } from '../types';

interface DashboardLayoutProps {
    selectedCategory: Category | 'All' | 'Favorites';
    setSelectedCategory: (category: Category | 'All' | 'Favorites') => void;
    setShowDataExport: (show: boolean) => void;
    searchTerm: string;
    isSearchFocused: boolean;
    activeSuggestion: number;
    searchSuggestions: Recipe[];
    setMobileMenuOpen: (open: boolean) => void;
    handleSearchChange: (term: string) => void;
    setIsSearchFocused: (focused: boolean) => void;
    handleSearchKeyDown: (e: React.KeyboardEvent) => void;
    handleRecipeClick: (recipe: Recipe) => void;
    setShowAddModal: (show: boolean) => void;
    showSuccessToast: boolean;
    mobileMenuOpen: boolean;
    outletContext: any;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    selectedCategory,
    setSelectedCategory,
    setShowDataExport,
    searchTerm,
    isSearchFocused,
    activeSuggestion,
    searchSuggestions,
    setMobileMenuOpen, // This might need to be state local to Layout
    handleSearchChange,
    setIsSearchFocused,
    handleSearchKeyDown,
    handleRecipeClick,
    setShowAddModal,
    showSuccessToast,
    mobileMenuOpen, // Controlled by App.tsx? No, let's use local state for simplicity if possible, or pass props
    outletContext
}) => {

    // We use the passed setMobileMenuOpen prop to control mobile menu
    // But typically Sidebar handles its own mobile visibility or we wrap it.
    // For now, let's assume Sidebar is hidden on mobile and we use a mobile drawer.
    // However, existing Sidebar logic needs checking.
    // Let's stick to the prompt: Sidebar Left, Header Top, Content Right.

    return (
        <div className="flex bg-stone-50 min-h-screen overflow-hidden font-sans">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-shrink-0 z-20 shadow-xl">
                <Sidebar
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    setShowDataExport={setShowDataExport}
                />
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="relative flex-1 max-w-[85vw] w-64">
                        <Sidebar
                            selectedCategory={selectedCategory}
                            setSelectedCategory={(cat) => { setSelectedCategory(cat); setMobileMenuOpen(false); }}
                            setShowDataExport={setShowDataExport}
                        />
                        {/* Close Button */}
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="absolute top-4 right-[-3rem] p-2 bg-white rounded-full text-stone-900 shadow-lg"
                        >
                            <Check size={20} className="rotate-45" /> {/* X icon replacement */}
                        </button>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <Header
                    searchTerm={searchTerm}
                    isSearchFocused={isSearchFocused}
                    activeSuggestion={activeSuggestion}
                    searchSuggestions={searchSuggestions}
                    setMobileMenuOpen={setMobileMenuOpen}
                    handleSearchChange={handleSearchChange}
                    setIsSearchFocused={setIsSearchFocused}
                    handleSearchKeyDown={handleSearchKeyDown}
                    handleRecipeClick={handleRecipeClick}
                    setShowAddModal={setShowAddModal}
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
                    <Outlet context={outletContext} />

                    {showSuccessToast && (
                        <div className="fixed bottom-8 right-8 bg-stone-900 text-white px-6 py-3 rounded-xl flex items-center gap-3 z-50 shadow-lg animate-slide-up">
                            <Check size={16} /> <span className="text-sm font-medium">Action Successful</span>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
