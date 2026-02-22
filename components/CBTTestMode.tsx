import React, { useMemo, useState } from 'react';
import { CBTQuestion, ChemistrySection, User } from '../types';
import { addCbtResult, getResultsForUser } from '../services/localStorageService';
import { addCbtResultFirebase, getResultsForUserFirebase } from '../services/firebaseService';

interface Props {
  user: User;
}

const QUESTION_BANK: CBTQuestion[] = [
  {
    id: 'q1',
    section: 'Physical',
    question: 'What is the SI unit of entropy?',
    options: ['J/mol·K', 'J/mol', 'K/mol', 'J/K'],
    correctIndex: 0,
    explanation: 'Entropy is measured in J/mol·K in SI units.',
    difficulty: 'Easy',
  },
  {
    id: 'q2',
    section: 'Physical',
    question: 'For an ideal gas, PV = ? at constant temperature.',
    options: ['nRT', 'nR', 'RT', 'nT'],
    correctIndex: 0,
    explanation: 'Ideal gas law: PV = nRT.',
    difficulty: 'Easy',
  },
  {
    id: 'q3',
    section: 'Inorganic',
    question: 'Which element has the highest electronegativity?',
    options: ['Oxygen', 'Fluorine', 'Chlorine', 'Nitrogen'],
    correctIndex: 1,
    explanation: 'Fluorine is the most electronegative element.',
    difficulty: 'Easy',
  },
  {
    id: 'q4',
    section: 'Inorganic',
    question: 'Coordination number of Fe in [Fe(CN)6]4- is:',
    options: ['2', '4', '6', '8'],
    correctIndex: 2,
    explanation: 'There are 6 ligands around Fe.',
    difficulty: 'Medium',
  },
  {
    id: 'q5',
    section: 'Organic',
    question: 'Which reagent converts alcohol to alkyl chloride?',
    options: ['KMnO4', 'PCl5', 'NaOH', 'NaBH4'],
    correctIndex: 1,
    explanation: 'PCl5 converts alcohols to alkyl chlorides.',
    difficulty: 'Easy',
  },
  {
    id: 'q6',
    section: 'Organic',
    question: 'The major product of hydration of propene is:',
    options: ['1-propanol', '2-propanol', 'propanal', 'propanoic acid'],
    correctIndex: 1,
    explanation: 'Markovnikov addition gives 2-propanol.',
    difficulty: 'Medium',
  },
  {
    id: 'q7',
    section: 'Physical',
    question: 'pH of a 0.001 M HCl solution is approximately:',
    options: ['1', '2', '3', '4'],
    correctIndex: 2,
    explanation: 'pH = -log(10^-3) = 3.',
    difficulty: 'Easy',
  },
  {
    id: 'q8',
    section: 'Organic',
    question: 'Which of the following is aromatic?',
    options: ['Cyclobutadiene', 'Cyclohexane', 'Benzene', 'Cyclooctatetraene'],
    correctIndex: 2,
    explanation: 'Benzene is aromatic (6 π electrons).',
    difficulty: 'Easy',
  },
  {
    id: 'q9',
    section: 'Inorganic',
    question: 'The oxidation state of Mn in KMnO4 is:',
    options: ['+2', '+4', '+6', '+7'],
    correctIndex: 3,
    explanation: 'Mn is +7 in permanganate.',
    difficulty: 'Medium',
  },
  {
    id: 'q10',
    section: 'Physical',
    question: 'Rate constant unit for a first-order reaction is:',
    options: ['mol L^-1 s^-1', 's^-1', 'L mol^-1 s^-1', 'mol L^-1'],
    correctIndex: 1,
    explanation: 'First-order rate constant has units of s^-1.',
    difficulty: 'Medium',
  },
];

const shuffle = <T,>(items: T[]): T[] => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const CBTTestMode: React.FC<Props> = ({ user }) => {
  const [section, setSection] = useState<ChemistrySection | 'All'>('All');
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState<CBTQuestion[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(() => {
    // Note: This will initially use localStorage results, Firebase will sync
    return getResultsForUser(user.id);
  }, [user.id]);

  const loadResultsFromFirebase = async () => {
    try {
      await getResultsForUserFirebase(user.id);
    } catch (error) {
      console.error('Failed to load results from Firebase:', error);
    }
  };

  const startTest = () => {
    const filtered = section === 'All' ? QUESTION_BANK : QUESTION_BANK.filter(q => q.section === section);
    const selected = shuffle(filtered).slice(0, Math.min(count, filtered.length));
    setQuestions(selected);
    setAnswers(new Array(selected.length).fill(-1));
    setSubmitted(false);
  };

  const handleAnswer = (qIdx: number, optionIdx: number) => {
    if (submitted) return;
    setAnswers(prev => {
      const next = [...prev];
      next[qIdx] = optionIdx;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (questions.length === 0) return;
    const score = questions.reduce((acc, q, idx) => (answers[idx] === q.correctIndex ? acc + 1 : acc), 0);
    try {
      await addCbtResultFirebase({
        userId: user.id,
        score,
        total: questions.length,
        answers,
        questionIds: questions.map(q => q.id),
        section,
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit test:', error);
    }
  };

  const avgScore = results.length
    ? Math.round((results.reduce((acc, r) => acc + r.score / r.total, 0) / results.length) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 p-6 shadow-2xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 blur-2xl"></div>
        <div className="relative z-10 text-white">
          <p className="text-xs uppercase tracking-widest text-white/70">CBT Simulator</p>
          <h2 className="text-2xl md:text-3xl font-extrabold">CBT Practice Mode</h2>
          <p className="text-white/80">Simulate a computer-based test and track your performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white/70 rounded-3xl p-6 border border-white/60 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Test Setup</h3>
            <p className="text-sm text-slate-500">Customize your exam and start instantly.</p>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-600">Section</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value as ChemistrySection | 'All')}
              className="w-full px-4 py-2 rounded-xl border border-white/60 bg-white/80"
            >
              <option value="All">All</option>
              <option value="Physical">Physical</option>
              <option value="Inorganic">Inorganic</option>
              <option value="Organic">Organic</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-600">Question Count</label>
            <input
              type="number"
              min={1}
              max={10}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-xl border border-white/60 bg-white/80"
            />
          </div>
          <button
            onClick={startTest}
            className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
          >
            Start Test
          </button>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-4 bg-white/80 border border-white/70">
              <div className="text-xs uppercase tracking-wide text-slate-400">Average</div>
              <div className="text-2xl font-black text-slate-800">{avgScore}%</div>
            </div>
            <div className="rounded-2xl p-4 bg-white/80 border border-white/70">
              <div className="text-xs uppercase tracking-wide text-slate-400">Attempts</div>
              <div className="text-2xl font-black text-slate-800">{results.length}</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {questions.length === 0 && (
            <div className="bg-white/60 rounded-3xl p-12 border border-white/60 shadow-lg text-center text-slate-400">
              Start a test to see questions here.
            </div>
          )}

          {questions.map((q, idx) => (
            <div key={q.id} className="bg-white/80 rounded-3xl p-6 border border-white/60 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">Question {idx + 1}</div>
                  <h4 className="font-semibold text-slate-800">{q.question}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{q.section}</span>
                  {q.difficulty && (
                    <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">{q.difficulty}</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((opt, oIdx) => {
                  const isSelected = answers[idx] === oIdx;
                  const isCorrect = submitted && q.correctIndex === oIdx;
                  const isWrong = submitted && isSelected && q.correctIndex !== oIdx;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(idx, oIdx)}
                      className={`px-4 py-3 rounded-2xl border text-left transition-all ${
                        isCorrect ? 'bg-green-100 border-green-300 text-green-700' :
                        isWrong ? 'bg-red-100 border-red-300 text-red-600' :
                        isSelected ? 'bg-blue-100 border-blue-300 text-blue-700' :
                        'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <div className="mt-4 text-sm text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <span className="font-semibold">Explanation:</span> {q.explanation}
                </div>
              )}
            </div>
          ))}

          {questions.length > 0 && !submitted && (
            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Submit Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CBTTestMode;
