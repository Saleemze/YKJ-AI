import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="text-center mb-4 relative">
      <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text animate-shimmer">
        YKJ-AI
      </h1>
      <p className="mt-2 text-slate-400 text-lg">
        {user ? `Welcome, ${user.name}!` : 'Create & Brainstorm with AI'}
      </p>
      {user && (
        <div className="absolute top-0 right-0 h-full flex items-center">
            <button 
                onClick={logout}
                className="px-4 py-2 bg-slate-700 text-slate-300 font-semibold rounded-lg text-sm hover:bg-slate-600 transition-colors duration-200"
            >
                Logout
            </button>
        </div>
      )}
    </header>
  );
};

export default Header;