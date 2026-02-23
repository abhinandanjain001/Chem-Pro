
import React, { useMemo, useState, useEffect } from 'react';
import { AppView, Topic, User } from './types';
import QuestionOrganizer from './components/QuestionOrganizer';
import DiagramGenerator from './components/DiagramGenerator';
import QuizMode from './components/QuizMode';
import HomePage from './components/HomePage';
import NotesPage from './components/NotesPage';
import CBTTestMode from './components/CBTTestMode';
import ProfilePage from './components/ProfilePage';
import AuthPage from './components/AuthPage';
import ChatBot from './components/ChatBot';
import AdminPanel from './components/AdminPanel';
import { getCurrentUser, firebaseSignOut } from './services/firebaseAuthService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = getCurrentUser((fbUser) => {
      if (fbUser) {
        setUser({
          id: fbUser.id,
          name: fbUser.name,
          email: fbUser.email,
          role: fbUser.role,
          createdAt: fbUser.createdAt,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const navViews = useMemo(() => (['home', 'organizer', 'diagrams', 'quiz', 'notes', 'cbt', 'chat', ...(user?.role === 'admin' ? ['admin'] : []), 'profile'] as AppView[]), [user?.role]);

  const handleTopicsGenerated = (newTopics: Topic[]) => {
    // Merge new topics with existing ones
    setTopics(prev => [...prev, ...newTopics]);
  };

  const handleLogout = async () => {
    await firebaseSignOut();
    setUser(null);
    setCurrentView('auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading Chem Pro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans selection:bg-teal-200 selection:text-teal-900 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 fixed inset-0 overflow-auto">
      
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[100px]"></div>
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-teal-400/20 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] rounded-full bg-purple-400/20 blur-[100px]"></div>
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button onClick={() => setCurrentView('home')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
              C
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight">
              Chem Pro
            </span>
          </button>
          
          <nav className="hidden sm:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-2xl border border-white/50">
            {navViews.map((view) => {
              // Hide admin button from non-admin users
              if (view === 'admin' && user?.role !== 'admin') return null;
              return (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all capitalize
                  ${currentView === view 
                    ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              >
                {view}
              </button>
              );
            })}
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <>
                <div className="text-sm font-semibold text-slate-600">{user.name}</div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setCurrentView('auth')}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="sm:hidden p-2 rounded-xl bg-slate-100/50 hover:bg-slate-200/50"
          >
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}></path>
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="sm:hidden fixed inset-0 bg-black/50 z-40 top-20"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="sm:hidden fixed left-0 top-20 bottom-0 w-64 bg-white/95 backdrop-blur-xl border-r border-white/60 shadow-lg z-40 overflow-y-auto custom-scrollbar">
            <div className="p-4 space-y-2">
              {navViews.map((view) => {
                if (view === 'admin' && user?.role !== 'admin') return null;
                return (
                  <button
                    key={view}
                    onClick={() => {
                      setCurrentView(view);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold capitalize transition-all ${
                      currentView === view
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {view}
                  </button>
                );
              })}
              <div className="border-t border-slate-200 mt-4 pt-4">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm font-semibold text-slate-600">{user.name}</div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setSidebarOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setCurrentView('auth');
                      setSidebarOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-12 sm:pb-12">
        <div className="animate-fadeIn">
          {(!user || currentView === 'auth') && (
            <AuthPage
              onAuthSuccess={(loggedInUser) => {
                setUser(loggedInUser);
                setCurrentView('home');
              }}
            />
          )}

          {user && currentView === 'home' && <HomePage />}
          
          {user && currentView === 'organizer' && (
            <div className="space-y-2">
               <div className="mb-8 text-center sm:text-left">
                 <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Question Organizer</h1>
                 <p className="text-lg text-slate-500 mt-3 font-medium">Upload raw content to structure your chemistry knowledge base.</p>
               </div>
               <QuestionOrganizer onTopicsGenerated={handleTopicsGenerated} existingTopics={topics} />
            </div>
          )}
          
          {user && currentView === 'diagrams' && (
             <div className="space-y-2">
               <div className="mb-8 text-center">
                 <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Interactive Visuals</h1>
                 <p className="text-lg text-slate-500 mt-3 font-medium">Simulate complex reactions and structures with AI-generated animations.</p>
               </div>
               <DiagramGenerator />
             </div>
          )}
          
          {user && currentView === 'quiz' && (
             <div className="space-y-2">
               <div className="mb-8 text-center">
                 <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Smart Assessment</h1>
                 <p className="text-lg text-slate-500 mt-3 font-medium">Test your mastery of the material with adaptive quizzes.</p>
               </div>
               <QuizMode topics={topics} />
             </div>
          )}

          {user && currentView === 'notes' && <NotesPage user={user} />}
          {user && currentView === 'cbt' && <CBTTestMode user={user} />}
          {user && currentView === 'chat' && <ChatBot user={user} />}
          {user && user.role === 'admin' && currentView === 'admin' && <AdminPanel onClose={() => setCurrentView('home')} />}
          {user && currentView === 'profile' && <ProfilePage user={user} />}
        </div>
      </main>
    </div>
  );
};

export default App;
