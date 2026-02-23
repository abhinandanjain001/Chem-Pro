import React, { useState } from 'react';
import { User } from '../types';
import { firebaseSignUp, firebaseSignIn, verifyAdminKey } from '../services/firebaseAuthService';

interface Props {
  onAuthSuccess: (user: User) => void;
}

const AuthPage: React.FC<Props> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    // Check if trying to signup/login as admin without valid key
    if (role === 'admin') {
      if (!adminKey.trim()) {
        setError('Admin key required to access admin role.');
        setLoading(false);
        return;
      }
      if (!verifyAdminKey(adminKey)) {
        setError('Invalid admin key.');
        setLoading(false);
        return;
      }
    }

    try {
      let user;
      if (mode === 'login') {
        const fbUser = await firebaseSignIn(email, password);
        user = {
          id: fbUser.id,
          name: fbUser.name,
          email: fbUser.email,
          role: fbUser.role,
          createdAt: fbUser.createdAt,
        };
      } else {
        const fbUser = await firebaseSignUp(email, password, name, role);
        user = {
          id: fbUser.id,
          name: fbUser.name,
          email: fbUser.email,
          role: fbUser.role,
          createdAt: fbUser.createdAt,
        };
      }
      onAuthSuccess(user);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl p-8">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'signup' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-600">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full px-4 py-3 rounded-xl border border-white/60 bg-white/80 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>
          )}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-xl border border-white/60 bg-white/80 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border border-white/60 bg-white/80 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>
          {mode === 'signup' && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-600">Role</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`px-3 py-1 rounded-lg font-semibold ${role === 'student' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`px-3 py-1 rounded-lg font-semibold ${role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'}`}
                >
                  Admin
                </button>
              </div>
            </div>
          )}

          {role === 'admin' && (
            <div className="space-y-3 p-3 rounded-xl bg-purple-50 border border-purple-100">
              <label className="text-sm font-semibold text-purple-700">Admin Secret Key</label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin secret key"
                className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-white focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
              <div className="text-xs text-purple-600">Admin access requires a secret key.</div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold shadow-lg bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
