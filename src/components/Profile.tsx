import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { X, Save, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Spinner from './Spinner'; // Import the Spinner component

interface UserProfile {
  email: string;
  displayName: string;
  // Add other profile fields here, e.g., avatarUrl, bio
}

const Profile: React.FC = () => {
  const [user] = useAuthState(auth);
  const [appError, setAppError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
          setNewDisplayName(docSnap.data().displayName || '');
        } else {
          // Fallback if no profile exists
          const defaultProfile = { email: user.email || '', displayName: user.email?.split('@')[0] || 'New User' };
          setProfile(defaultProfile);
          setNewDisplayName(defaultProfile.displayName);
        }
      } catch (e: any) {
        setAppError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    if (newDisplayName.trim() === '') {
      setAppError("Display name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        displayName: newDisplayName,
      });
      setProfile(prev => prev ? { ...prev, displayName: newDisplayName } : null);
      setIsEditing(false);
      setAppError(null); // Clear any previous errors
    } catch (e: any) {
      setAppError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading profile...</div>;
  }

  if (!user || !profile) {
    return <div className="text-center p-8 text-red-500">Please sign in to view your profile.</div>;
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10 animate-fade-in">
      <h2 className="font-serif text-3xl font-bold text-stone-900 mb-6 flex items-center gap-3">
        <User size={32} className="text-sky-600" /> User Profile
      </h2>

      {appError && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md mb-4 flex items-center gap-2" role="alert">
          <X size={16} /> {appError}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Email</label>
          <p className="text-stone-700 text-lg">{profile.email}</p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Display Name</label>
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="flex gap-2">
              <input
                type="text"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                className="flex-1 border border-stone-300 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <button
                type="submit"
                className="bg-sky-600 text-white px-4 py-2 rounded-md flex items-center gap-1 hover:bg-sky-700"
                disabled={loading}
              >
                {loading && <Spinner size="small" color="white" />} <Save size={18} /> Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-stone-300 text-stone-800 px-4 py-2 rounded-md hover:bg-stone-400"
              >
                <X size={18} /> Cancel
              </button>
            </form>
          ) : (
            <div className="flex justify-between items-center">
              <p className="text-stone-700 text-lg">{profile.displayName}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="text-sky-600 hover:text-sky-800 text-sm font-medium"
              >
                Edit
              </button>
            </div>
          )}
        </div>
        {/* Add more profile fields here */}
      </div>
    </div>
  );
};

export default Profile;
