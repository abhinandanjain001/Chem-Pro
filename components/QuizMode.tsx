import React, { useState } from 'react';
import { Topic, QuizQuestion, ChemistrySection, QuizDifficulty } from '../types';
import { generateQuizFromTopics, generateJEEQuiz, generateRoast } from '../services/geminiService';
import { QuizLoadingSkeleton } from './SkeletonLoader';

interface Props {
  topics: Topic[];
}

const JEE_SYLLABUS: Record<ChemistrySection, string[]> = {
  Physical: [
    "Mole Concept", "Atomic Structure", "Gaseous State", "Thermodynamics",
    "Chemical Equilibrium", "Ionic Equilibrium", "Redox Reactions", "Solid State",
    "Solutions", "Electrochemistry", "Chemical Kinetics", "Surface Chemistry"
  ],
  Inorganic: [
    "Periodic Classification", "Chemical Bonding", "Hydrogen", "s-Block Elements",
    "p-Block Elements", "d- and f-Block Elements", "Coordination Compounds",
    "General Principles of Metallurgy", "Qualitative Analysis"
  ],
  Organic: [
    "General Organic Chemistry", "Isomerism", "Hydrocarbons", "Haloalkanes & Haloarenes",
    "Alcohols, Phenols & Ethers", "Aldehydes, Ketones & Carboxylic Acids", "Amines",
    "Biomolecules", "Polymers", "Chemistry in Everyday Life"
  ]
};

const QuizMode: React.FC<Props> = ({ topics }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'jee'>('upload');

  // Roast Mode State
  const [roastMode, setRoastMode] = useState(true); // Default ON for fun!
  const [currentRoast, setCurrentRoast] = useState<string | null>(null);
  const [loadingRoast, setLoadingRoast] = useState(false);

  // JEE Config State
  const [jeeSections, setJeeSections] = useState<ChemistrySection[]>([]);
  const [jeeDifficulty, setJeeDifficulty] = useState<QuizDifficulty>('JEE Main');
  const [jeeCount, setJeeCount] = useState<number>(10);
  const [selectedSubTopics, setSelectedSubTopics] = useState<string[]>([]);

  const toggleSection = (section: ChemistrySection) => {
    setJeeSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const toggleSubTopic = (topic: string) => {
    setSelectedSubTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const startUploadedQuiz = async () => {
    if (topics.length === 0) {
      alert("Please organize some questions in the 'Organize' tab first.");
      return;
    }
    setLoading(true);
    try {
      const generated = await generateQuizFromTopics(topics);
      initializeQuiz(generated);
    } catch (e) {
      alert("Failed to generate quiz.");
    } finally {
      setLoading(false);
    }
  };

  const startJEEQuiz = async () => {
    if (jeeSections.length === 0) {
      alert("Please select at least one branch of chemistry.");
      return;
    }
    setLoading(true);
    try {
      const generated = await generateJEEQuiz(jeeSections, jeeDifficulty, jeeCount, selectedSubTopics);
      initializeQuiz(generated);
    } catch (e) {
      alert("Failed to generate JEE quiz.");
    } finally {
      setLoading(false);
    }
  };

  const initializeQuiz = (generatedQuestions: QuizQuestion[]) => {
    setQuestions(generatedQuestions);
    setSelectedAnswers(new Array(generatedQuestions.length).fill(-1));
    setIsStarted(true);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setShowHint(false);
  };

  const handleAnswer = async (optionIndex: number) => {
    if (quizFinished) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);

    // Generate roast if wrong answer and roast mode is on
    const question = questions[currentQuestionIndex];
    const isWrong = optionIndex !== question.correctAnswerIndex;

    if (roastMode && isWrong) {
      setLoadingRoast(true);
      setCurrentRoast(null);

      try {
        const roast = await generateRoast(
          question.questionText,
          question.options[question.correctAnswerIndex],
          question.options[optionIndex],
          question.topic || 'Chemistry'
        );
        setCurrentRoast(roast);
      } catch (error) {
        console.error('Failed to generate roast:', error);
        setCurrentRoast("That answer was more unstable than a carbocation in water. Try again! 💧");
      } finally {
        setLoadingRoast(false);
      }
    } else {
      setCurrentRoast(null); // Clear roast if correct answer
    }
  };

  const handleNext = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setShowHint(false);
    setCurrentRoast(null); // Clear roast when moving to next question
  };

  const handlePrev = () => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
    setShowHint(false);
    setCurrentRoast(null); // Clear roast when going back
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((acc, ans, idx) => {
      return ans === questions[idx].correctAnswerIndex ? acc + 1 : acc;
    }, 0);
  };

  const getPerformanceStats = () => {
    const stats: Record<string, { total: number; correct: number }> = {};
    const difficultyStats: Record<string, { total: number; correct: number }> = {
      'Easy': { total: 0, correct: 0 },
      'Medium': { total: 0, correct: 0 },
      'Hard': { total: 0, correct: 0 }
    };

    questions.forEach((q, idx) => {
      const isCorrect = selectedAnswers[idx] === q.correctAnswerIndex;

      // Topic Stats
      const topicName = q.topic || 'General';
      if (!stats[topicName]) {
        stats[topicName] = { total: 0, correct: 0 };
      }
      stats[topicName].total += 1;
      if (isCorrect) stats[topicName].correct += 1;

      // Difficulty Stats
      const diff = q.difficulty || 'Medium'; // Default to medium if missing
      if (difficultyStats[diff]) {
        difficultyStats[diff].total += 1;
        if (isCorrect) difficultyStats[diff].correct += 1;
      }
    });

    return { topicStats: stats, difficultyStats };
  };

  if (!isStarted && !loading) {
    return (
      <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 animate-fadeIn overflow-hidden">

        {/* Tab Switcher */}
        <div className="flex border-b border-white/40">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-4 text-center font-bold text-sm transition-all
            ${activeTab === 'upload' ? 'bg-white/60 text-blue-600 border-b-2 border-blue-500' : 'text-slate-500 hover:bg-white/30'}`}
          >
            Review Uploads
          </button>
          <button
            onClick={() => setActiveTab('jee')}
            className={`flex-1 py-4 text-center font-bold text-sm transition-all
            ${activeTab === 'jee' ? 'bg-white/60 text-teal-600 border-b-2 border-teal-500' : 'text-slate-500 hover:bg-white/30'}`}
          >
            AI JEE Simulation
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'upload' ? (
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-blue-500/30">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Contextual Review</h2>
              <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                Generate a quiz based specifically on the documents or text you uploaded in the Organizer tab.
              </p>
              <button
                onClick={startUploadedQuiz}
                disabled={topics.length === 0}
                className={`px-10 py-3 rounded-xl font-bold text-lg transition-all transform hover:translate-y-[-2px] shadow-xl w-full sm:w-auto
                  ${topics.length === 0 ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-500/30'}`}
              >
                {topics.length === 0 ? 'No Content Uploaded' : 'Generate Review Quiz'}
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800">JEE Mock Test Generator</h2>
                <p className="text-sm text-slate-500 mt-1">Configure your exam parameters</p>
              </div>

              {/* Sections */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">1. Select Subjects</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(['Organic', 'Inorganic', 'Physical'] as ChemistrySection[]).map(section => (
                    <button
                      key={section}
                      onClick={() => toggleSection(section)}
                      className={`p-4 rounded-xl border-2 font-bold transition-all flex flex-col items-center gap-2
                          ${jeeSections.includes(section)
                          ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-md'
                          : 'border-white/50 bg-white/40 text-slate-500 hover:bg-white/60'}`}
                    >
                      {/* Simple Icons */}
                      {section === 'Organic' && <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>}
                      {section === 'Inorganic' && <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>}
                      {section === 'Physical' && <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>}
                      {section}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Selection (Conditionally Rendered) */}
              {jeeSections.length > 0 && (
                <div className="bg-white/30 rounded-xl p-6 border border-white/40">
                  <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">2. Select Syllabus Topics (Optional)</label>
                  <div className="space-y-6">
                    {jeeSections.map(section => (
                      <div key={section}>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{section} Chemistry</h4>
                        <div className="flex flex-wrap gap-2">
                          {JEE_SYLLABUS[section].map(topic => (
                            <button
                              key={topic}
                              onClick={() => toggleSubTopic(topic)}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border
                                  ${selectedSubTopics.includes(topic)
                                  ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/25'
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
                            >
                              {topic}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Difficulty & Count */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">3. Difficulty Level</label>
                  <div className="flex bg-slate-100/50 p-1 rounded-xl">
                    {(['JEE Main', 'JEE Advanced'] as QuizDifficulty[]).map(level => (
                      <button
                        key={level}
                        onClick={() => setJeeDifficulty(level)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${jeeDifficulty === level ? 'bg-white shadow-sm text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">4. Number of Questions: {jeeCount}</label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={jeeCount}
                    onChange={(e) => setJeeCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                    <span>5</span>
                    <span>15</span>
                    <span>30</span>
                  </div>
                </div>
              </div>

              <button
                onClick={startJEEQuiz}
                className="w-full py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg shadow-teal-500/25 transition-all transform hover:-translate-y-0.5"
              >
                Create Simulation {selectedSubTopics.length > 0 && `(${selectedSubTopics.length} topics)`}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return <QuizLoadingSkeleton />;
  }

  if (quizFinished) {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;
    const { topicStats, difficultyStats } = getPerformanceStats();

    return (
      <div className="bg-white/50 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8 max-w-4xl mx-auto animate-fadeIn">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-700 mb-4">Assessment Complete</h2>
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white border-4 border-teal-100 shadow-inner mb-4">
            <span className={`text-5xl font-black ${percentage >= 80 ? 'text-teal-500' : percentage >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
              {Math.round(percentage)}%
            </span>
          </div>
          <p className="text-slate-600 font-medium text-lg">
            You scored {score} out of {questions.length}
          </p>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Difficulty Analysis */}
          <div className="bg-white/70 p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Performance by Difficulty
            </h3>
            <div className="space-y-4">
              {Object.entries(difficultyStats).map(([diff, stat]) => stat.total > 0 && (
                <div key={diff}>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>{diff}</span>
                    <span>{Math.round((stat.correct / stat.total) * 100)}% ({stat.correct}/{stat.total})</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${diff === 'Easy' ? 'bg-green-400' : diff === 'Medium' ? 'bg-yellow-400' : 'bg-red-400'}`}
                      style={{ width: `${(stat.correct / stat.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {Object.values(difficultyStats).every(s => s.total === 0) && (
                <p className="text-xs text-slate-400 italic">No difficulty metadata available</p>
              )}
            </div>
          </div>

          {/* Topic Analysis */}
          <div className="bg-white/70 p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
              Topic Breakdown
            </h3>
            <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
              {Object.entries(topicStats).map(([topic, stat]) => (
                <div key={topic} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 truncate max-w-[150px]" title={topic}>{topic}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${stat.correct === stat.total ? 'bg-green-100 text-green-700' : stat.correct === 0 ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                      {stat.correct}/{stat.total}
                    </span>
                  </div>
                </div>
              ))}
              {Object.keys(topicStats).length === 0 && (
                <p className="text-xs text-slate-400 italic">No topic metadata available</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-bold text-slate-700 text-lg border-b border-slate-200 pb-2">Detailed Solutions</h3>
          {questions.map((q, idx) => (
            <div key={idx} className={`p-6 rounded-xl border-l-4 shadow-sm bg-white/70 ${selectedAnswers[idx] === q.correctAnswerIndex ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <div className="flex justify-between items-start mb-4 gap-4">
                <p className="font-bold text-slate-800 text-lg">{idx + 1}. {q.questionText}</p>
                <div className="flex gap-2 flex-shrink-0">
                  {q.difficulty && (
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide border
                      ${q.difficulty === 'Easy' ? 'bg-green-50 text-green-600 border-green-200' :
                        q.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                      {q.difficulty}
                    </span>
                  )}
                  {q.topic && (
                    <span className="text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide bg-blue-50 text-blue-600 border border-blue-200 max-w-[100px] truncate">
                      {q.topic}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className={`text-sm px-4 py-3 rounded-lg flex justify-between items-center border
                    ${oIdx === q.correctAnswerIndex ? 'bg-green-100 border-green-200 text-green-800 font-bold' :
                      (oIdx === selectedAnswers[idx] && oIdx !== q.correctAnswerIndex) ? 'bg-red-100 border-red-200 text-red-800 line-through' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                    <span>{opt}</span>
                    {oIdx === q.correctAnswerIndex && <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800 text-sm">
                <span className="font-bold uppercase tracking-wide text-xs text-blue-500 block mb-1">Explanation</span>
                {q.explanation}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setIsStarted(false)}
          className="mt-10 w-full py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors shadow-lg"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const question = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      {/* Progress + Roast Mode Toggle */}
      <div className="mb-8">
        <div className="flex justify-between items-center text-sm font-bold text-slate-500 mb-2">
          <span>Question {currentQuestionIndex + 1}/{questions.length}</span>

          {/* Roast Mode Toggle */}
          <button
            onClick={() => setRoastMode(!roastMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all transform hover:scale-105 ${roastMode
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
              : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
              }`}
          >
            <span className="text-base">{roastMode ? '🔥' : '😴'}</span>
            <span>Roast Mode {roastMode ? 'ON' : 'OFF'}</span>
          </button>
        </div>
        <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 sm:p-10 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl"></div>

        <h3 className="text-2xl font-bold text-slate-800 mb-8 leading-snug relative z-10">
          {question.questionText}
        </h3>

        <div className="space-y-4 relative z-10">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 group flex items-center
                ${selectedAnswers[currentQuestionIndex] === idx
                  ? 'border-teal-500 bg-teal-50/50 text-teal-800 shadow-md'
                  : 'border-transparent bg-white/70 hover:bg-white hover:shadow-md text-slate-600'}`}
            >
              <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mr-4 transition-colors
                 ${selectedAnswers[currentQuestionIndex] === idx ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300'}`}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="font-medium text-lg">{option}</span>
            </button>
          ))}
        </div>

        {/* Roast Section - Shows when wrong answer is selected */}
        {roastMode && selectedAnswers[currentQuestionIndex] !== -1 && selectedAnswers[currentQuestionIndex] !== question.correctAnswerIndex && (
          <div className="mt-6 animate-fadeIn">
            {loadingRoast ? (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-pulse text-2xl">🔥</div>
                  <div className="flex-1">
                    <div className="h-4 bg-orange-200/50 rounded animate-shimmer bg-gradient-to-r from-orange-200 via-orange-100 to-orange-200 bg-[length:200%_100%]"></div>
                  </div>
                </div>
              </div>
            ) : currentRoast && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-xl p-5 shadow-lg shadow-orange-500/10 relative overflow-hidden">
                {/* Fire background decoration */}
                <div className="absolute top-0 right-0 text-6xl opacity-10 pointer-events-none">🔥</div>

                <div className="relative z-10">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl animate-pulse">🔥</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-black text-orange-600 uppercase tracking-wider">Roasted!</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-orange-300 to-transparent"></div>
                      </div>
                      <p className="text-orange-900 font-medium text-base leading-relaxed italic">
                        {currentRoast}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-orange-200">
                    <p className="text-xs text-orange-600 font-semibold">
                      💡 Try again or check the hint below!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hint Section */}
        <div className="mt-8 pt-6 border-t border-slate-200/50">
          {showHint ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 animate-fadeIn">
              <div className="flex items-center gap-2 mb-1 text-yellow-700 font-bold text-xs uppercase tracking-wide">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Hint
              </div>
              <p className="text-yellow-800 text-sm italic">{question.hint}</p>
            </div>
          ) : (
            <button
              onClick={() => setShowHint(true)}
              className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
              Need a Hint?
            </button>
          )}
        </div>

        <div className="mt-8 flex justify-between items-center relative z-10">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-500 font-medium transition-colors"
          >
            Previous
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-10 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all shadow-lg hover:shadow-xl"
            >
              Next Question
            </button>
          ) : (
            <button
              onClick={() => setQuizFinished(true)}
              disabled={selectedAnswers.includes(-1)}
              className="px-10 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-teal-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Finish Assessment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizMode;
