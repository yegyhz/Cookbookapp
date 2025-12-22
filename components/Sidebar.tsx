import React from 'react';
import { BookOpen, LayoutGrid, Heart, ChevronRight, LogOut, FileJson } from 'lucide-react';
import { Category } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  selectedCategory: Category | 'All' | 'Favorites';
  setSelectedCategory: (category: Category | 'All' | 'Favorites') => void;
  setShowDataExport: (show: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  setSelectedCategory,
  setShowDataExport,
}) => {
  const [user] = useAuthState(auth);
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategorySelect = (cat: Category | 'All' | 'Favorites') => {
    setSelectedCategory(cat);
    navigate('/list'); // Ensure we switch to list view
  }

  return (
    <aside className="hidden md:flex w-64 flex-col bg-stone-900 text-stone-300 border-r border-stone-800 z-20 shadow-xl">
      {/* Logo/Header */}
      <div className="p-6 border-b border-stone-800">
        <h1 className="font-serif text-2xl text-stone-100 mb-1">Shirley’s Kitchen</h1>
        <p className="text-xs text-stone-500 uppercase tracking-widest">Family Cookbook</p>
        {user && <p className="text-xs text-stone-400 mt-2">Welcome, {user.email}</p>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
        <button
          onClick={() => { navigate('/categories'); setSelectedCategory('All'); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/categories' ? 'bg-sky-900/50 text-white shadow-inner border border-sky-800/50' : 'hover:bg-stone-800 hover:text-white'}`}
        >
          <LayoutGrid size={18} />
          <span className="font-medium">Categories</span>
        </button>

        <button
          onClick={() => { navigate('/list'); setSelectedCategory('All'); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/list' && selectedCategory === 'All' ? 'bg-stone-800 text-white shadow-inner' : 'hover:bg-stone-800 hover:text-white'}`}
        >
          <BookOpen size={18} />
          <span className="font-medium">All Recipes</span>
        </button>

        <button
          onClick={() => { navigate('/list'); setSelectedCategory('Favorites'); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${selectedCategory === 'Favorites' ? 'bg-rose-900/30 text-rose-100 shadow-inner border border-rose-900/50' : 'hover:bg-stone-800 hover:text-white'}`}
        >
          <Heart size={18} className={selectedCategory === 'Favorites' ? 'fill-current' : ''} />
          <span className="font-medium">Favorites</span>
        </button>

        <div className="pt-6 mt-6 border-t border-stone-800">
          <h3 className="px-4 text-xs font-bold uppercase tracking-widest text-stone-600 mb-3">Categories</h3>
          {Object.values(Category).map(cat => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-all ${selectedCategory === cat && location.pathname === '/list' ? 'bg-stone-800 text-sky-400' : 'hover:bg-stone-800/50 hover:text-stone-200'}`}
            >
              <span className="truncate">{cat}</span>
              {selectedCategory === cat && <ChevronRight size={14} />}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-stone-800 bg-stone-950/50 text-xs text-stone-600 text-center flex flex-col gap-2">
        <button
          onClick={() => setShowDataExport(true)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-stone-800 hover:text-stone-400 transition-colors"
        >
          <FileJson size={14} /> Developer Data
        </button>
        <button onClick={logOut} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-red-900/50 hover:text-red-100 transition-colors">
            <LogOut size={14} /> Sign Out
        </button>
        <p>&copy; 2024 MacIntosh Family</p>
      </div>
    </aside>
  );
};

export default Sidebar;
