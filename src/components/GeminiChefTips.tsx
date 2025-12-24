import React, { useState, useEffect } from 'react';
import { ChefHat } from 'lucide-react';
import { geminiService } from '../services/api';
import { Recipe } from '../types';

interface GeminiChefTipsProps {
    recipe: Recipe;
}

const GeminiChefTips: React.FC<GeminiChefTipsProps> = ({ recipe }) => {
    const [tips, setTips] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset state when recipe changes
    useEffect(() => {
        setTips(null);
        setError(null);
        setLoading(false);
    }, [recipe.id]);

    const getGeminiTips = async () => {
        setLoading(true);
        setError(null);

        try {
            const prompt = `
        You are an expert chef assisting a home cook with a treasured family recipe. 
        Recipe: ${recipe.title}
        Description: ${recipe.description || 'None'}
        Ingredients: ${recipe.ingredients.join(', ')}
        Instructions: ${recipe.instructions.join(', ')}

        Please provide 3 specific, actionable, and helpful "Chef's Tips" for making this recipe perfect. 
        Focus on technique, ingredient selection, or common pitfalls. 
        Keep the tone encouraging and warm, like a grandmother teaching her grandchild.
        Format as a simple list.
      `;

            const data = await geminiService.getTips(prompt);
            setTips(data.text || "No tips generated.");
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Sorry, the chef is busy right now. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100 mt-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                    <ChefHat size={24} />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-800">Chef's Tips</h3>
            </div>

            {!tips && !loading && !error && (
                <button
                    onClick={getGeminiTips}
                    className="w-full py-3 px-4 bg-white border border-amber-200 text-amber-700 font-medium rounded-xl hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
                >
                    <ChefHat size={18} />
                    Ask the Chef for Tips
                </button>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center py-6 text-amber-600/60 animate-pulse">
                    <ChefHat size={32} className="mb-2 animate-bounce" />
                    <span className="text-sm font-medium">The chef is reviewing your recipe...</span>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 text-center">
                    {error}
                    <button
                        onClick={getGeminiTips}
                        className="block mx-auto mt-2 text-xs font-semibold underline hover:no-underline"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {tips && (
                <div className="prose prose-stone prose-sm max-w-none">
                    <div className="whitespace-pre-line text-stone-700 italic leading-relaxed pl-4 border-l-4 border-amber-200">
                        {tips}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeminiChefTips;
