import React, { useState } from 'react';
import { generateAnimatedSVG } from '../services/geminiService';
import { GeneratedDiagram } from '../types';
import { DiagramLoadingSkeleton } from './SkeletonLoader';

const DiagramGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<GeneratedDiagram[]>([]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const code = await generateAnimatedSVG(topic);
      setHistory(prev => [{ code, prompt: topic }, ...prev]);
      setTopic('');
    } catch (e) {
      alert("Failed to generate diagram.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
          Animated Concept Visualizer
        </h2>
        <p className="text-slate-600 mb-8 max-w-lg mx-auto">
          Enter a chemistry process (e.g., "Electrolysis of Water", "Ionic Bonding") to generate a real-time animated SVG simulation.
        </p>

        <div className="flex gap-3 relative">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Describe the reaction or structure..."
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/60 bg-white/70 focus:bg-white focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none text-slate-800 placeholder-slate-400 shadow-inner"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !topic}
            className={`px-8 py-3 rounded-xl text-white font-bold tracking-wide shadow-lg transition-all transform hover:-translate-y-0.5
              ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 shadow-teal-500/30'}`}
          >
            {loading ? 'Simulating...' : 'Visualize'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {history.map((item, idx) => (
          <div key={idx} className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 overflow-hidden">
            <div className="px-6 py-4 bg-white/50 border-b border-white/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 capitalize">{item.prompt}</h3>
              <span className="text-xs font-semibold bg-teal-100 text-teal-700 px-2 py-1 rounded">Animated SVG</span>
            </div>

            <div className="p-8 flex justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 min-h-[300px]">
              <div
                className="w-full max-w-md"
                dangerouslySetInnerHTML={{ __html: item.code }}
              />
            </div>
          </div>
        ))}
      </div>

      {loading && <DiagramLoadingSkeleton />}

      {history.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 opacity-60">
          <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
          </div>
          <p className="text-lg text-slate-500 font-medium">No visualizations generated yet</p>
          <p className="text-sm text-slate-400">Try searching for "Hydrogen Bonding" or "Galvanic Cell"</p>
        </div>
      )}
    </div>
  );
};

export default DiagramGenerator;