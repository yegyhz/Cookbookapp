import { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { db, auth } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  writeBatch,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { INITIAL_RECIPES } from '../data';

export function useRecipes() {
  const [user] = useAuthState(auth);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const recipesCol = collection(db, 'users', user.uid, 'recipes');
      const unsubscribe = onSnapshot(recipesCol, (snapshot) => {
        const userRecipes = snapshot.docs.map(d => ({ ...d.data(), id: d.id })) as Recipe[];
        if (userRecipes.length === 0) {
          // Seed initial recipes
          const batch = writeBatch(db);
          INITIAL_RECIPES.forEach(recipe => {
            const docRef = doc(recipesCol, recipe.id);
            batch.set(docRef, recipe);
          });
          batch.commit().catch(e => setError((e as Error).message));
        }
        setRecipes(userRecipes);
        setLoading(false);
      }, (e) => setError((e as Error).message));
      return unsubscribe;
    } else {
      setRecipes(INITIAL_RECIPES);
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setFavorites(doc.data().favorites || []);
        } else {
            // Create the user document if it doesn't exist
            setDoc(userDocRef, { favorites: [] }).catch(e => setError((e as Error).message));
        }
      }, (e) => setError((e as Error).message));
      return unsubscribe;
    }
  }, [user]);


  const toggleFavorite = async (recipeId: string) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const isFavorite = favorites.includes(recipeId);
    try {
        await updateDoc(userDocRef, {
            favorites: isFavorite ? arrayRemove(recipeId) : arrayUnion(recipeId)
        });
    } catch (e) {
        setError((e as Error).message);
    }
  };

  const addRecipe = async (newRecipe: Recipe) => {
    if (!user) return;
    const recipesCol = collection(db, 'users', user.uid, 'recipes');
    try {
        await addDoc(recipesCol, newRecipe);
    } catch (e) {
        setError((e as Error).message);
    }
  };

  const updateRecipe = async (updatedRecipe: Recipe) => {
    if (!user) return;
    const recipeDocRef = doc(db, 'users', user.uid, 'recipes', updatedRecipe.id);
    try {
        await updateDoc(recipeDocRef, updatedRecipe);
    } catch (e) {
        setError((e as Error).message);
    }
  }

  const deleteRecipe = async (recipeId: string) => {
    if (!user) return;
    const recipeDocRef = doc(db, 'users', user.uid, 'recipes', recipeId);
    try {
        await deleteDoc(recipeDocRef);
    } catch (e) {
        setError((e as Error).message);
    }
  }

  return {
    recipes,
    favorites,
    loading,
    error,
    toggleFavorite,
    addRecipe,
    updateRecipe,
    deleteRecipe,
  };
}
