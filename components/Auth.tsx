import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import Spinner from './Spinner'; // Import the Spinner component

const Auth: React.FC = () => {
  const { error, loading, signUp, signIn, logOut } = useAuth(); // Destructure loading from useAuth
  const [user] = useAuthState(auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSigningUp) {
      await signUp(email, password);
    } else {
      await signIn(email, password);
    }
  };

  if (user) {
    return (
      <div className="p-4">
        <p>Welcome, {user.email}</p>
        <button onClick={logOut} disabled={loading} className="bg-red-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2">
          {loading && <Spinner size="small" color="white" />} Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{isSigningUp ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2">
          {loading && <Spinner size="small" color="white" />} {isSigningUp ? 'Sign Up' : 'Sign In'}
        </button>
        <button
          type="button"
          onClick={() => setIsSigningUp(!isSigningUp)}
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isSigningUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
        {error && <p className="text-red-500" role="alert">{error}</p>}
      </form>
    </div>
  );
};

export default Auth;
