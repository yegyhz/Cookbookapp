import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MobileMenu from '../components/MobileMenu';
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
    // setView removed
    // Context to be passed to Outlet
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
    setMobileMenuOpen,
    handleSearchChange,
    setIsSearchFocused,
    handleSearchKeyDown,
    handleRecipeClick,
    setShowAddModal,
    showSuccessToast,
    mobileMenuOpen,
    // setView removed
    outletContext
}) => {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setShowDataExport={setShowDataExport}
            />

            <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-stone-50">
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

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet context={outletContext} />
                </div>

                {showSuccessToast && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-6 py-3 rounded-full flex items-center gap-3 z-50">
                        <Check size={12} /> <span>Success</span>
                    </div>
                )}
            </main>

            <MobileMenu
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                setSelectedCategory={setSelectedCategory}
                handleCategorySelect={setSelectedCategory}
            />
        </div>
    );
};

export default DashboardLayout;
