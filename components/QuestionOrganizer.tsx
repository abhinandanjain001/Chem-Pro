import React, { useState } from 'react';
import { Topic } from '../types';
import { categorizeQuestions } from '../services/geminiService';
import { OrganizerLoadingSkeleton } from './SkeletonLoader';

interface Props {
  onTopicsGenerated: (topics: Topic[]) => void;
  existingTopics: Topic[];
}

const QuestionOrganizer: React.FC<Props> = ({ onTopicsGenerated, existingTopics }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [expandedTopic, setExpandedTopic] = useState<number | null>(0);

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const topics = await categorizeQuestions(inputText);
      onTopicsGenerated(topics);
      setInputText('');
    } catch (e) {
      setError("Failed to process text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = (reader.result as string).split(',')[1];
        const topics = await categorizeQuestions("", base64String);
        onTopicsGenerated(topics);
      } catch (err) {
        setError("Failed to process image.");
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
      {/* Upload Section */}
      <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          </div>
          Smart Upload
        </h2>

        <div className="flex gap-2 p-1 bg-slate-100/50 rounded-xl mb-4">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${activeTab === 'text' ? 'bg-white text-blue-600' : 'text-slate-500 hover:bg-white/50'}`}
          >
            Paste Text
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${activeTab === 'image' ? 'bg-white text-blue-600' : 'text-slate-500 hover:bg-white/50'}`}
          >
            Upload Image
          </button>
        </div>

        {activeTab === 'text' ? (
          <div className="space-y-4">
            <textarea
              className="w-full h-48 p-4 rounded-xl border border-white/40 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none resize-none text-sm text-slate-700 placeholder-slate-400 transition-all shadow-inner"
              placeholder="Paste your unorganized chemistry questions here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              onClick={handleProcess}
              disabled={isLoading || !inputText}
              className={`w-full py-3 rounded-xl text-white font-semibold shadow-lg transition-all transform hover:-translate-y-0.5
                ${isLoading || !inputText ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 shadow-blue-500/25'}`}
            >
              {isLoading ? 'Processing...' : 'Organize Content'}
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-xl p-10 text-center hover:bg-blue-50/50 transition-colors">
            {isLoading ? (
              <div className="text-blue-600 font-medium animate-pulse">Analyzing Structure...</div>
            ) : (
              <label className="cursor-pointer block">
                <svg className="w-10 h-10 mx-auto text-blue-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span className="block text-slate-500 mb-2 font-medium">Click to upload Question Image</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <span className="inline-block px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-shadow">Choose File</span>
              </label>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {error}
          </div>
        )}
      </div>

      {/* Output Section */}
      <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-6 flex flex-col h-full">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <div className="p-2 bg-teal-500/10 rounded-lg">
            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          </div>
          Structure Tree
        </h2>

        {existingTopics.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
            <p>No content organized yet.</p>
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
            {existingTopics.map((topic, tIdx) => (
              <div key={tIdx} className="bg-white/60 rounded-xl overflow-hidden border border-white/50 shadow-sm transition-all hover:shadow-md">
                <button
                  onClick={() => setExpandedTopic(expandedTopic === tIdx ? null : tIdx)}
                  className="w-full px-5 py-4 flex justify-between items-center text-left bg-gradient-to-r from-white/50 to-white/80"
                >
                  <span className="font-semibold text-slate-800">{topic.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {topic.subtopics.reduce((acc, sub) => acc + sub.questions.length, 0)} Qs
                    </span>
                    <svg className={`w-5 h-5 text-slate-400 transition-transform ${expandedTopic === tIdx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </button>

                {expandedTopic === tIdx && (
                  <div className="p-4 space-y-4 bg-white/30">
                    {topic.subtopics.map((sub, sIdx) => (
                      <div key={sIdx} className="relative pl-4">
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 to-teal-300 rounded-full"></div>
                        <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">{sub.name}</h4>
                        <div className="space-y-2">
                          {sub.questions.map((q, qIdx) => (
                            <div key={qIdx} className="group p-3 rounded-lg bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all flex justify-between items-start gap-3">
                              <p className="text-sm text-slate-600 leading-relaxed">{q.text}</p>
                              <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide
                                ${q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                  q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                {q.difficulty}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionOrganizer;