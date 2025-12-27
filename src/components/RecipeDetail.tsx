import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Share2, Printer, Heart, Clock, Users, ChefHat } from 'lucide-react';
import { Recipe } from '../types';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useRecipes } from '../hooks/useRecipes';
import GeminiChefTips from './GeminiChefTips';

const RecipeDetail: React.FC = () => {
    const { recipeId } = useParams<{ recipeId: string }>();
    const navigate = useNavigate();
    const { recipes, loading, error, favorites, toggleFavorite, deleteRecipe } = useRecipes();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (!loading && recipeId) {
            const foundRecipe = recipes.find(r => r.id === recipeId);
            if (foundRecipe) setRecipe(foundRecipe);
            else navigate('/');
        }
    }, [recipeId, recipes, loading, navigate]);

    const handleBack = () => navigate(-1);

    const handleShare = async () => {
        if (!recipe) return;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: recipe.title,
                    text: `Check out this recipe for ${recipe.title}!`,
                    url: window.location.href
                });
            } catch (err) { console.error('Error sharing:', err); }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleDelete = () => {
        if (recipe) {
            deleteRecipe(recipe.id);
            navigate('/');
        }
    };

    if (loading) return <div className="text-center p-12 text-stone-500">Loading recipe...</div>;
    if (error) return <div className="text-center p-12 text-red-500">Error: {error}</div>;
    if (!recipe) return <div className="text-center p-12 text-stone-500">Recipe not found.</div>;

    const isRecipeFavorite = favorites.includes(recipe.id);

    return (
        <div className="max-w-3xl mx-auto bg-white min-h-[50vh] animate-fade-in pb-12">
            <DeleteConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                recipeTitle={recipe.title}
            />

            {/* Navigation & Actions */}
            <div className="flex justify-between items-center mb-8 sticky top-0 py-4 bg-white/95 backdrop-blur z-20 print:hidden border-b border-stone-100">
                <button onClick={handleBack} className="p-2 text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-2">
                    <ArrowLeft size={20} /> <span className="font-medium text-sm">Back</span>
                </button>
                <div className="flex gap-2">
                    <button onClick={() => setShowDeleteConfirm(true)} className="p-2 text-stone-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 size={20} />
                    </button>
                    <button onClick={handleShare} className="p-2 text-stone-400 hover:text-stone-900 transition-colors" title="Share">
                        <Share2 size={20} />
                    </button>
                    <button onClick={() => window.print()} className="p-2 text-stone-400 hover:text-stone-900 transition-colors" title="Print">
                        <Printer size={20} />
                    </button>
                    <button onClick={() => toggleFavorite(recipe.id)} className={`p-2 transition-colors ${isRecipeFavorite ? 'text-rose-500' : 'text-stone-400 hover:text-rose-400'}`} title="Favorite">
                        <Heart size={20} fill={isRecipeFavorite ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>

            {/* Header Section */}
            <header className="mb-12 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-600 mb-6">
                    {recipe.category}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-stone-900 mb-6 leading-tight tracking-tight">{recipe.title}</h1>

                {recipe.description && (
                    <p className="text-lg text-stone-600 italic max-w-2xl mx-auto mb-8 leading-relaxed">
                        {recipe.description}
                    </p>
                )}

                {/* Metadata Grid */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-12 py-6 border-y border-stone-100 max-w-2xl mx-auto">
                    {recipe.prepTime && (
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Prep Time</span>
                            <span className="font-medium text-stone-900 flex items-center gap-2"><Clock size={16} className="text-sage-500" /> {recipe.prepTime}</span>
                        </div>
                    )}
                    {recipe.cookTime && (
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Cook Time</span>
                            <span className="font-medium text-stone-900 flex items-center gap-2"><Clock size={16} className="text-sage-500" /> {recipe.cookTime}</span>
                        </div>
                    )}
                    {recipe.servings && (
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Servings</span>
                            <span className="font-medium text-stone-900 flex items-center gap-2"><Users size={16} className="text-sage-500" /> {recipe.servings} people</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Image (Optional but subtle if present) */}
            {recipe.imageUrl && (
                <div className="mb-12 rounded-xl overflow-hidden shadow-sm aspect-video bg-stone-100">
                    <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                </div>
            )}

            {/* Content Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2px_2fr] gap-8 md:gap-12">

                {/* Ingredients Left Panel */}
                <div>
                    <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-3">
                        Ingredients
                    </h3>
                    <ul className="space-y-3 text-stone-700 text-sm md:text-base leading-relaxed">
                        {recipe.ingredients.map((ing, i) => (
                            <li key={i} className="flex gap-3 pb-3 border-b border-dashed border-stone-100 last:border-0">
                                <span className="w-1.5 h-1.5 bg-sage-400 rounded-full mt-2 flex-shrink-0" />
                                <span>{ing}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Divider Line */}
                <div className="hidden md:block bg-stone-100 rounded-full h-full"></div>

                {/* Instructions Right Panel */}
                <div>
                    <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-3">
                        Instructions
                    </h3>
                    <ol className="space-y-8">
                        {recipe.instructions.map((step, i) => (
                            <li key={i} className="relative pl-6 border-l-2 border-stone-100 hover:border-sage-300 transition-colors">
                                <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-stone-200 text-[9px] font-bold text-stone-400 flex items-center justify-center">
                                    {i + 1}
                                </span>
                                <p className="text-stone-700 leading-relaxed text-sm md:text-base">{step}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            <div className="mt-16 pt-8 border-t border-stone-100 print:hidden">
                <GeminiChefTips recipe={recipe} />
            </div>

            <div className="mt-8 text-center">
                <p className="text-xs text-stone-400 flex items-center justify-center gap-2">
                    <ChefHat size={14} />
                    Recipe from the collection of <span className="font-medium text-stone-600">{recipe.source || "Nan"}</span>
                </p>
            </div>
        </div>
    );
};

export default RecipeDetail;
