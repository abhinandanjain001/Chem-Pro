import React, { useMemo, useState, useEffect } from 'react';
import { User, CBTResult } from '../types';
import { getNotes } from '../services/localStorageService';
import { getResultsForUserFirebase } from '../services/firebaseService';

interface Props {
  user: User;
}

const ProfilePage: React.FC<Props> = ({ user }) => {
  const [results, setResults] = useState<CBTResult[]>([]);
  
  useEffect(() => {
    const loadResults = async () => {
      const fbResults = await getResultsForUserFirebase(user.id);
      setResults(fbResults);
    };
    loadResults();
  }, [user.id]);
  const notesCount = getNotes().length;

  const average = results.length
    ? Math.round((results.reduce((acc, r) => acc + r.score / r.total, 0) / results.length) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
            <p className="text-slate-500">{user.email} • {user.role.toUpperCase()}</p>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wide text-slate-400">Member Since</div>
            <div className="text-sm font-semibold text-slate-700">{new Date(user.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/70 rounded-2xl p-6 border border-white/60 shadow-lg">
          <div className="text-xs uppercase tracking-wide text-slate-400">CBT Attempts</div>
          <div className="text-3xl font-black text-slate-800">{results.length}</div>
        </div>
        <div className="bg-white/70 rounded-2xl p-6 border border-white/60 shadow-lg">
          <div className="text-xs uppercase tracking-wide text-slate-400">Average Accuracy</div>
          <div className="text-3xl font-black text-slate-800">{average}%</div>
        </div>
        <div className="bg-white/70 rounded-2xl p-6 border border-white/60 shadow-lg">
          <div className="text-xs uppercase tracking-wide text-slate-400">Notes Available</div>
          <div className="text-3xl font-black text-slate-800">{notesCount}</div>
        </div>
      </div>

      <div className="bg-white/70 rounded-2xl p-6 border border-white/60 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent CBT Performance</h3>
        {results.length === 0 && (
          <div className="text-slate-400">No CBT attempts yet.</div>
        )}
        <div className="space-y-3">
          {results.slice(0, 5).map(result => (
            <div key={result.id} className="flex items-center justify-between p-3 rounded-xl bg-white/80 border border-white/60">
              <div>
                <div className="text-sm font-semibold text-slate-700">{result.section} Test</div>
                <div className="text-xs text-slate-400">{new Date(result.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-sm font-bold text-slate-700">{result.score}/{result.total}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
