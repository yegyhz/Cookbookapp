import React from 'react';
import { Pizza, Soup, Croissant, UtensilsCrossed, Leaf, Cake, Droplet, ChevronRight } from 'lucide-react';
import { Category } from '../types';

const CategoryCard: React.FC<{ category: Category; count: number; onClick: () => void }> = ({ category, count, onClick }) => {
    const getIcon = (cat: Category) => {
        switch (cat) {
            case Category.APPETIZERS: return <Pizza size={32} />;
            case Category.SOUPS_SALADS: return <Soup size={32} />;
            case Category.BREADS_MUFFINS: return <Croissant size={32} />;
            case Category.MAIN_DISHES: return <UtensilsCrossed size={32} />;
            case Category.SIDE_DISHES: return <Leaf size={32} />;
            case Category.DESSERTS: return <Cake size={32} />;
            case Category.SAUCES: return <Droplet size={32} />;
            default: return <UtensilsCrossed size={32} />;
        }
    };

    const getCardStyle = (cat: Category) => {
        switch (cat) {
            case Category.APPETIZERS: return "bg-[#FFF8E7] text-stone-800"; // Cream
            case Category.SOUPS_SALADS: return "bg-[#E6FCF5] text-stone-800"; // Mint
            case Category.BREADS_MUFFINS: return "bg-[#FFF4E6] text-stone-800"; // Peach
            case Category.MAIN_DISHES: return "bg-[#FFE8E8] text-stone-800"; // Light Pink
            case Category.SIDE_DISHES: return "bg-[#F0FDF4] text-stone-800"; // Light Green
            case Category.DESSERTS: return "bg-[#FFF0F5] text-stone-800"; // Lavender/Pink
            case Category.SAUCES: return "bg-[#F0F9FF] text-stone-800"; // Light Blue
            default: return "bg-stone-50 text-stone-800";
        }
    };

    const getIconColor = (cat: Category) => {
        switch (cat) {
            case Category.APPETIZERS: return "text-orange-400";
            case Category.SOUPS_SALADS: return "text-emerald-500";
            case Category.BREADS_MUFFINS: return "text-orange-400";
            case Category.MAIN_DISHES: return "text-rose-400";
            case Category.SIDE_DISHES: return "text-lime-600";
            case Category.DESSERTS: return "text-pink-500";
            case Category.SAUCES: return "text-sky-500";
            default: return "text-stone-400";
        }
    };

    return (
        <button
            onClick={onClick}
            className={`group relative p-6 h-64 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 ${getCardStyle(category)} flex flex-col items-center justify-center text-center gap-4 hover:-translate-y-1 overflow-hidden`}
        >
            {/* Main Icon Box */}
            <div className={`bg-white p-4 rounded-2xl shadow-sm mb-2 ${getIconColor(category)} relative z-10`}>
                {getIcon(category)}
            </div>

            <div className="relative z-10">
                <h3 className="font-serif text-xl font-bold mb-1 leading-tight text-stone-900">{category}</h3>
                <span className="inline-block px-3 py-1 bg-white/50 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    {count} Recipes
                </span>
            </div>
        </button>
    );
};

export default CategoryCard;
