import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ChefHat, Lock, User, BookOpen } from 'lucide-react';

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
                    setError(`Creation failed: ${createError.code} - ${createError.message}`);
                    console.error("Creation Error:", createError);
                }
            } else {
                setError(`Login failed: ${signInError.code} - ${signInError.message}`);
                console.error("SignIn Error:", signInError);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative">
            {/* Royal Stewart Tartan Background */}
            <div className="absolute inset-0 z-0 bg-red-900" style={{
                backgroundImage: `
                    repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,0,0,0.5) 50px, rgba(0,0,0,0.5) 56px, transparent 56px, transparent 63px, rgba(0,0,0,0.5) 63px, rgba(0,0,0,0.5) 69px, transparent 69px, transparent 119px, rgba(0,40,0,0.7) 119px, rgba(0,40,0,0.7) 159px, rgba(200,180,0,0.4) 159px, rgba(200,180,0,0.4) 163px, rgba(0,40,0,0.7) 163px, rgba(0,40,0,0.7) 203px),
                    repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(0,0,0,0.5) 50px, rgba(0,0,0,0.5) 56px, transparent 56px, transparent 63px, rgba(0,0,0,0.5) 63px, rgba(0,0,0,0.5) 69px, transparent 69px, transparent 119px, rgba(0,40,0,0.7) 119px, rgba(0,40,0,0.7) 159px, rgba(200,180,0,0.4) 159px, rgba(200,180,0,0.4) 163px, rgba(0,40,0,0.7) 163px, rgba(0,40,0,0.7) 203px)
                `,
                backgroundColor: '#b9121b'
            }}></div>

            <div className="bg-stone-50 max-w-2xl w-full relative z-10 shadow-2xl p-2 border-4 border-stone-800/10">
                <div className="bg-stone-50 border border-stone-200 p-8 md:p-12 text-center">

                    <h1 className="font-serif text-5xl md:text-6xl text-stone-900 mb-2 tracking-tight">Shirley's Kitchen</h1>
                    <p className="font-handwriting text-3xl text-red-700 mb-8 italic">Cooking with Nan</p>

                    <div className="w-24 h-px bg-stone-300 mx-auto mb-8"></div>

                    <h2 className="text-xs font-bold tracking-[0.2em] text-stone-500 uppercase mb-8">
                        A Cherished Collection of Recipes Passed Down Through Generations
                    </h2>

                    <div className="text-justify text-stone-600 font-serif leading-relaxed text-sm md:text-base mb-8 space-y-4 px-4 bg-stone-50/50">
                        <p>
                            My earliest memories of the kitchen are forged links to my Nan, Shirley MacIntosh. It was her domain, a sanctuary where she moved with quiet, purposeful grace, her hands perpetually busy, creating magic from simple ingredients. This book is a labor of love, a deeply personal compilation of her cherished recipes, each one carrying a piece of her spirit, a story waiting to be retold. It's dedicated with particular affection to her daughters, who, like myself, were privileged to learn the art of cooking beside her, absorbing not just her techniques but also her quiet wisdom.
                        </p>
                        <p>
                            These recipes are more than mere instructions; they are a tangible connection to her, a way to recreate the flavors and the moments that defined our family gatherings, moments that now feel precious and fleeting in the passage of time. May each dish you prepare from these pages bring back the warmth of her presence, the comfort of her touch, and the joy of the memories we shared, preserving her legacy for generations to come. This book is a way to hold on to her, to keep her alive in our kitchens and in our hearts.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="max-w-xs mx-auto space-y-4 mb-10">
                        {/* Hidden inputs to support browser autofill but rely on state */}
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-stone-300 focus:border-red-800 outline-none text-center font-serif text-stone-800 placeholder:text-stone-400 text-sm transition-all"
                                placeholder="Username"
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-stone-300 focus:border-red-800 outline-none text-center font-serif text-stone-800 placeholder:text-stone-400 text-sm transition-all"
                                placeholder="Password"
                            />
                        </div>

                        {error && (
                            <div className="text-red-700 text-xs font-serif italic">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#0A4D42] text-white font-serif tracking-widest uppercase text-sm hover:bg-[#083D34] transition-colors shadow-lg shadow-teal-900/20 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <BookOpen size={16} /> Enter Kitchen
                                </>
                            )}
                        </button>
                    </form>

                    <p className="font-serif italic text-stone-800 font-medium">"The secret ingredient is always love."</p>

                </div>
            </div>
        </div>
    );
};

export default SimpleAuth;
