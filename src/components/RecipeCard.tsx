import React from 'react';
import { Clock, Users, Heart, ChefHat } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
    recipe: Recipe;
    onClick: (recipe: Recipe) => void;
    isFavorite: boolean;
    onToggleFavorite: (e: React.MouseEvent, recipeId: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, isFavorite, onToggleFavorite }) => {
    return (
        <div
            onClick={() => onClick(recipe)}
            className="group bg-white rounded-xl border border-stone-200 hover:border-stone-300 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
        >
            <div className="p-6 flex flex-col flex-1">
                {/* Header: Category & Favorite */}
                <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-2.5 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                        {recipe.category}
                    </span>
                    <button
                        onClick={(e) => onToggleFavorite(e, recipe.id)}
                        className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-red-500 bg-red-50' : 'text-stone-300 hover:bg-stone-50 hover:text-stone-400'
                            }`}
                    >
                        <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                    </button>
                </div>

                {/* Title & Metadata */}
                <div className="flex-1">
                    <h3 className="font-serif text-xl font-bold text-stone-900 mb-2 leading-tight group-hover:text-sage-700 transition-colors">
                        {recipe.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-stone-500 font-medium mb-4">
                        {recipe.prepTime && (
                            <div className="flex items-center gap-1.5">
                                <Clock size={14} />
                                <span>{recipe.prepTime}</span>
                            </div>
                        )}
                        {recipe.servings && (
                            <div className="flex items-center gap-1.5">
                                <Users size={14} />
                                <span>{recipe.servings} pp</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer: Author/Tags */}
                <div className="pt-4 border-t border-stone-100 mt-2">
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                        <ChefHat size={14} />
                        <span>From the kitchen of {recipe.source || "Nan"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;
