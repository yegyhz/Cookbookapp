import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, doc, writeBatch, getDoc } from 'firebase/firestore';
import { INITIAL_RECIPES } from '../data';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Database, Check, AlertCircle, Loader } from 'lucide-react';
import { Recipe } from '../types';

interface MigrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MigrationModal: React.FC<MigrationModalProps> = ({ isOpen, onClose }) => {
    const [user] = useAuthState(auth);
    const [migrating, setMigrating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [total, setTotal] = useState(INITIAL_RECIPES.length);
    const [error, setError] = useState<string | null>(null);
    const [complete, setComplete] = useState(false);

    if (!isOpen) return null;

    const handleMigration = async () => {
        if (!user) {
            setError("You must be logged in to migrate data.");
            return;
        }

        setMigrating(true);
        setError(null);
        setProgress(0);

        try {
            const recipesCol = collection(db, 'users', user.uid, 'recipes');
            const batchSize = 400; // Firestore batch limit is 500
            let currentBatch = writeBatch(db);
            let operationCount = 0;
            let migratedCount = 0;

            for (let i = 0; i < INITIAL_RECIPES.length; i++) {
                const recipe = INITIAL_RECIPES[i];
                const docRef = doc(recipesCol, recipe.id);

                // Check if exists (optional, but safer to avoid overwriting edits if IDs match)
                // For bulk migration, we might just set merge: true or just set. 
                // Given the goal is "Migrate src/data.ts", valid strategy is set() 
                // assuming existing data in Firestore is either empty or user wants this data.
                // Let's use set() for simplicity as IDs should be unique.

                currentBatch.set(docRef, recipe);
                operationCount++;
                migratedCount++;

                if (operationCount >= batchSize) {
                    await currentBatch.commit();
                    currentBatch = writeBatch(db);
                    operationCount = 0;
                    setProgress(migratedCount);
                }
            }

            if (operationCount > 0) {
                await currentBatch.commit();
            }

            setProgress(INITIAL_RECIPES.length);
            setComplete(true);

        } catch (err: any) {
            console.error("Migration failed:", err);
            setError(err.message || "Migration failed");
        } finally {
            setMigrating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-100">
                <div className="p-6 bg-stone-50 border-b border-stone-100 flex items-center gap-3">
                    <div className="bg-sky-100 p-2 rounded-lg text-sky-600">
                        <Database size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-stone-800 font-serif">Migrate to Cloud</h2>
                </div>

                <div className="p-6">
                    {!complete ? (
                        <>
                            <p className="text-stone-600 mb-6 leading-relaxed">
                                This will upload all {INITIAL_RECIPES.length} built-in recipes to your personal cloud database.
                                This allows you to edit them and ensures they are safe.
                            </p>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm border border-red-100">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            {migrating ? (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-stone-500">
                                        <span>Uploading...</span>
                                        <span>{Math.round((progress / total) * 100)}%</span>
                                    </div>
                                    <div className="h-4 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                                        <div
                                            className="h-full bg-sky-500 transition-all duration-300 relative overflow-hidden"
                                            style={{ width: `${(progress / total) * 100}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                        </div>
                                    </div>
                                    <p className="text-center text-xs text-stone-400 mt-2">{progress} / {total} recipes</p>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 py-3 bg-white border border-stone-200 text-stone-600 font-bold rounded-xl hover:bg-stone-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleMigration}
                                        className="flex-1 py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 shadow-lg shadow-sky-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Database size={18} />
                                        Start Migration
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-small">
                                <Check size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-stone-800 mb-2">Migration Complete!</h3>
                            <p className="text-stone-500 mb-6">All recipes have been successfully uploaded to Firestore.</p>
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MigrationModal;
