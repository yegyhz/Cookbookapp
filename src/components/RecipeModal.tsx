import React, { useState, useEffect } from 'react';
import { X, Check, ChevronDown, Palette } from 'lucide-react';
import { Recipe, Category } from '../types';
import { getAvatarColor } from '../utils';
import DynamicListInput from './DynamicListInput';
import { AVATAR_COLORS, OWNER_COLORS, FAMILY_MEMBERS } from '../constants';

interface RecipeModalProps {
    onClose: () => void;
    onSave: (recipe: Recipe) => void;
    initialData?: Recipe | null;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ onClose, onSave, initialData }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [category, setCategory] = useState<Category>(initialData?.category || Category.MAIN_DISHES);
    const [description, setDescription] = useState(initialData?.description || '');
    const [ingredients, setIngredients] = useState<string[]>(initialData?.ingredients || []);
    const [instructions, setInstructions] = useState<string[]>(initialData?.instructions || []);
    const [addedBy, setAddedBy] = useState(initialData?.addedBy || '');
    const [temp, setTemp] = useState(initialData?.temp || '');
    const [cookTime, setCookTime] = useState(initialData?.cookTime || '');
    const [userColor, setUserColor] = useState(initialData?.userColor || '');
    const [yields, setYields] = useState(initialData?.yields || '');
    const [prepTime, setPrepTime] = useState(initialData?.prepTime || '');
    const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};
        if (!title) newErrors.title = "Title is required.";
        if (!addedBy) newErrors.addedBy = "Recipe owner is required.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const recipeData: Recipe = {
            id: initialData?.id || crypto.randomUUID(),
            title,
            category,
            description,
            ingredients,
            instructions,
            addedBy,
            temp,
            cookTime,
            prepTime,
            yields,
            userColor: userColor || getAvatarColor(addedBy),
            timestamp: initialData?.timestamp || Date.now(),
            imageUrl
        };
        
        onSave(recipeData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-stone-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-8 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-3xl font-serif">{initialData ? 'Edit Recipe' : 'Add Recipe'}</h2>
                    <button onClick={onClose} className="p-2 bg-stone-100 rounded-full"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-2">Title *</label>
                        <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-xl p-3" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-2">Family Member *</label>
                        <select value={addedBy} onChange={e => setAddedBy(e.target.value)} className="w-full border rounded-xl p-3">
                            <option value="">Select Member</option>
                            {FAMILY_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <DynamicListInput label="Ingredients" items={ingredients} onChange={setIngredients} placeholder="Add ingredient..." />
                    <DynamicListInput label="Instructions" items={instructions} onChange={setInstructions} placeholder="Add step..." />
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit" className="bg-sky-700 text-white px-8 py-3 rounded-xl">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecipeModal;