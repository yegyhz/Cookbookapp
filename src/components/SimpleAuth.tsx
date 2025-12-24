import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ChefHat, Lock, User } from 'lucide-react';

const SimpleAuth: React.FC = () => {
    const [username, setUsername] = useState('w_macintosh');
    const [password, setPassword] = useState('Mesg2014');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Convert username to email format for Firebase
        const email = `${username.toLowerCase().replace(/\s+/g, '')}@cookbook.app`;

        try {
            // Try to sign in first
            await signInWithEmailAndPassword(auth, email, password);
        } catch (signInError: any) {
            // If user not found, try to create account
            if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    // Set display name
                    await updateProfile(userCredential.user, {
                        displayName: username
                    });
                } catch (createError: any) {
                    setError("Login failed. Verify credentials.");
                    console.error("Creation Error:", createError);
                }
            } else {
                setError("Login failed. Please try again.");
                console.error("SignIn Error:", signInError);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-stone-200">
                <div className="bg-stone-900 p-8 text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                        <ChefHat size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-white mb-2">The MacIntosh Cookbook</h1>
                    <p className="text-stone-400 text-sm">Private Family Collection</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase text-stone-500 mb-1.5 ml-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all font-medium text-stone-800"
                                    placeholder="Username"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-stone-500 mb-1.5 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all font-medium text-stone-800"
                                    placeholder="Password"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl shadow-lg shadow-stone-200 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                "Enter Kitchen"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SimpleAuth;
