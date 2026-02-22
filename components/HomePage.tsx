
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="animate-fadeIn pb-10">
      {/* Hero Section with Vibrant Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 shadow-2xl mb-12">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-teal-400/20 blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-16 gap-10">

          <div className="flex-1 text-center md:text-left text-white">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-xs font-bold uppercase tracking-wider mb-4">
              AI-Powered Learning
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Master Chemistry with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-cyan-200">
                Amit Jain
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed max-w-lg">
              Your personalized AI tutor. I organize your chaos, visualize the invisible, and challenge your intellect to prepare you for the toughest exams.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-sm font-medium">Online & Ready</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <span className="text-sm font-medium">Top Rated AI</span>
              </div>
            </div>
          </div>

          {/* 3D Molecule Animation Container */}
          <div className="flex-1 flex justify-center items-center w-full max-w-sm">
            <div className="relative w-64 h-64 md:w-80 md:h-80 perspective-1000">
              {/* Central Nucleus */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full shadow-[0_0_40px_rgba(255,165,0,0.6)] animate-pulse z-20 flex items-center justify-center">
                  <span className="text-2xl font-black text-white/90">C</span>
                </div>
              </div>

              {/* Electron Rings */}
              {/* Ring 1 */}
              <div className="absolute inset-0 rounded-full border border-cyan-400/30 w-full h-full animate-[spin_4s_linear_infinite] border-t-2 border-t-cyan-300">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_cyan]"></div>
              </div>

              {/* Ring 2 (Rotated) */}
              <div className="absolute inset-0 rounded-full border border-purple-400/30 w-full h-full animate-[spin_6s_linear_infinite_reverse] rotate-45 border-r-2 border-r-purple-300 transform" style={{ transform: 'rotateX(60deg) rotateY(45deg)' }}>
                <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-400 rounded-full shadow-[0_0_15px_purple]"></div>
              </div>

              {/* Ring 3 (Rotated) */}
              <div className="absolute inset-0 rounded-full border border-emerald-400/30 w-full h-full animate-[spin_5s_linear_infinite] -rotate-45 border-l-2 border-l-emerald-300 transform" style={{ transform: 'rotateX(-60deg) rotateY(-45deg)' }}>
                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_15px_emerald]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="col-span-1 md:col-span-2 space-y-8">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/60 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </span>
              About Amit Jain
            </h2>
            <div className="prose prose-slate text-slate-600 leading-relaxed">
              <p className="mb-4">
                With <strong>25+ years of experience</strong> in teaching chemistry, Amit Jain has guided thousands of students to success in competitive exams. His expertise spans across all branches of chemistry, with a special focus on JEE Main & Advanced preparation.
              </p>
              <p className="mb-4">
                Amit Jain's teaching methodology combines traditional problem-solving techniques with modern AI-powered tools, helping students break down complex molecular orbital theories into bite-sized visual concepts that are easy to understand and remember.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <h4 className="font-bold text-blue-800 mb-1">Teaching Style</h4>
                  <p className="text-sm text-blue-600">Socratic Method & Visual Decomposition</p>
                </div>
                <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                  <h4 className="font-bold text-teal-800 mb-1">Specialization</h4>
                  <p className="text-sm text-teal-600">Organic Mechanisms & Physical Kinetics</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Concepts Indexed', value: '10k+', color: 'text-blue-600' },
              { label: 'Active Students', value: '500+', color: 'text-purple-600' },
              { label: 'Exam Accuracy', value: '99%', color: 'text-green-600' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/50 backdrop-blur rounded-2xl p-6 text-center shadow-sm border border-white/50">
                <div className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* History / Timeline Column */}
        <div className="bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-xl rounded-2xl p-8 border border-white/60 shadow-lg flex flex-col h-full">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Evolution Log</h3>
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 flex-1">
            {[
              { year: 'v1.0', title: 'The Genesis', desc: 'Initial database compilation of IUPAC standards.' },
              { year: 'v2.4', title: 'Cognitive Upgrade', desc: 'Integrated advanced reasoning for organic synthesis problems.' },
              { year: 'v3.0', title: 'Visual Cortex', desc: 'Added real-time SVG generation for molecular visualization.' },
              { year: 'Now', title: 'Amit Jain', desc: 'Full persona integration with adaptive testing capabilities.' },
            ].map((item, idx) => (
              <div key={idx} className="relative pl-8">
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${idx === 3 ? 'bg-teal-500 animate-pulse' : 'bg-slate-300'}`}></div>
                <span className="text-xs font-bold text-slate-400 block mb-1">{item.year}</span>
                <h4 className="font-bold text-slate-700 text-sm">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                <svg className="w-full h-full text-slate-400 p-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500">Developer Note</div>
                <div className="text-sm font-medium text-slate-700">"Built for the curious mind."</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
