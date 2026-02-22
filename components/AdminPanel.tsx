import React, { useState } from 'react';
import { verifyAdminKey, isAdminVerified, logoutAdmin } from '../services/localStorageService';
import { getNotes } from '../services/localStorageService';
import { Note } from '../types';

const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [verified, setVerified] = useState(isAdminVerified());
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>(getNotes());

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (verifyAdminKey(keyInput)) {
      setVerified(true);
      setKeyInput('');
    } else {
      setError('Invalid admin key.');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setVerified(false);
    onClose();
  };

  if (!verified) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white/70 rounded-3xl p-8 border border-white/60 shadow-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Admin Access</h2>
            <p className="text-slate-500 mt-1">Enter the secret key to access admin panel.</p>
          </div>
          <form onSubmit={handleKeySubmit} className="space-y-4">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Enter admin secret key"
              className="w-full px-4 py-3 rounded-xl border border-white/60 bg-white/80 focus:ring-2 focus:ring-purple-400 outline-none"
            />
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Unlock Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-purple-600 to-orange-500 p-6 shadow-2xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl"></div>
        <div className="relative z-10 flex items-center justify-between text-white">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/70">Restricted Access</p>
            <h2 className="text-2xl md:text-3xl font-extrabold">Admin Control Panel</h2>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/20 hover:bg-white/30"
          >
            Logout Admin
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/70 rounded-3xl p-6 border border-white/60 shadow-xl">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">System Stats</h3>
          <div className="space-y-3">
            <div className="rounded-2xl p-4 bg-white/80 border border-white/70">
              <div className="text-xs uppercase tracking-wide text-slate-400">Total Notes</div>
              <div className="text-3xl font-black text-slate-800">{notes.length}</div>
            </div>
            <div className="rounded-2xl p-4 bg-white/80 border border-white/70">
              <div className="text-xs uppercase tracking-wide text-slate-400">Admin Verified</div>
              <div className="text-sm font-semibold text-green-600">✓ Active</div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 rounded-3xl p-6 border border-white/60 shadow-xl">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Admin Features</h3>
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-green-50 border border-green-100">
              <div className="text-sm font-semibold text-green-800">✓ Add/Edit Notes</div>
            </div>
            <div className="p-3 rounded-xl bg-green-50 border border-green-100">
              <div className="text-sm font-semibold text-green-800">✓ Manage Content</div>
            </div>
            <div className="p-3 rounded-xl bg-green-50 border border-green-100">
              <div className="text-sm font-semibold text-green-800">✓ View All Data</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/70 rounded-3xl p-6 border border-white/60 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Notes Overview</h3>
        {notes.length === 0 && (
          <div className="text-center text-slate-400">No notes published.</div>
        )}
        <div className="space-y-2">
          {notes.slice(0, 5).map(note => (
            <div key={note.id} className="p-3 rounded-xl bg-white/80 border border-white/70">
              <div className="font-semibold text-slate-800">{note.title}</div>
              <div className="text-xs text-slate-400">By {note.authorName}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
