import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const toggleForm = () => {
      setIsLogin(!isLogin);
      setError(null);
      setName('');
      setEmail('');
      setPassword('');
  }

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
        <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text animate-shimmer">
                YKJ-AI
            </h1>
            <p className="mt-2 text-slate-400 text-lg">
                Create & Brainstorm with AI
            </p>
        </header>
        <div className="bg-slate-800/50 rounded-2xl p-8 shadow-2xl border border-slate-700 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-center text-slate-200 mb-6">
                {isLogin ? 'Welcome Back!' : 'Create an Account'}
            </h2>
            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-300 text-sm p-3 rounded-lg mb-4 text-center">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-slate-700 border-2 border-slate-600 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-700 border-2 border-slate-600 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-slate-700 border-2 border-slate-600 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                    type="submit"
                    className="w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                    {isLogin ? 'Login' : 'Register'}
                </button>
            </form>
            <p className="text-center text-sm text-slate-400 mt-6">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button onClick={toggleForm} className="font-semibold text-purple-400 hover:underline ml-1">
                    {isLogin ? 'Register here' : 'Login here'}
                </button>
            </p>
        </div>
    </div>
  );
};

export default Auth;
