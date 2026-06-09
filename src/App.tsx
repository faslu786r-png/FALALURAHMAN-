import { useState, useEffect } from "react";
import { 
  Menu, 
  X, 
  BookOpen, 
  ChevronRight, 
  CheckCircle, 
  Compass, 
  Sparkles, 
  Search,
  Filter,
  ShieldAlert,
  HelpCircle
} from "lucide-react";

import { Language, UserProgress, ResumeData, Lesson } from "./types";
import { UI_TRANSLATIONS, COURSES_CATEGORIES, ALL_LESSONS } from "./data/courses";

// Components Imports
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import InteractiveLabs from "./components/InteractiveLabs";
import Certifications from "./components/Certifications";
import AITutor from "./components/AITutor";
import CareerRoadmaps from "./components/CareerRoadmaps";
import ResumeBuilder from "./components/ResumeBuilder";
import InterviewPrep from "./components/InterviewPrep";
import JobBoard from "./components/JobBoard";
import CommunityForum from "./components/CommunityForum";

const DEFAULT_PROGRESS: UserProgress = {
  xp: 1500,
  level: 2,
  completedLessons: ["net-fundamentals"],
  completedLabs: [],
  completedExams: {},
  badges: ["badge-welcome"],
  streak: 3,
  lastActiveDate: new Date().toISOString().split('T')[0]
};

export default function App() {
  const [language, setLanguage] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);

  // Syllabus Track States
  const [selectedCategory, setSelectedCategory] = useState("networking");
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [courseSearch, setCourseSearch] = useState("");

  // Load persistence from localStorage on startup
  useEffect(() => {
    const saved = localStorage.getItem("cyberai_user_progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProgress(parsed);
      } catch (err) {
        console.warn("Failed parsing stored user progress configuration: ", err);
      }
    }
  }, []);

  // Sync state to localstorage helper
  const saveProgress = (next: UserProgress) => {
    setProgress(next);
    localStorage.setItem("cyberai_user_progress", JSON.stringify(next));
  };

  // Helper level-up algorithm
  const awardXP = (amount: number) => {
    const nextXP = progress.xp + amount;
    const nextLevel = Math.floor(nextXP / 1000) + 1;
    const leveledUp = nextLevel > progress.level;

    const updated = {
      ...progress,
      xp: nextXP,
      level: nextLevel,
      streak: progress.streak + (leveledUp ? 1 : 0)
    };
    saveProgress(updated);
  };

  const handleCompleteLesson = (lessonId: string, xpReward: number) => {
    if (progress.completedLessons.includes(lessonId)) return;
    
    const nextLessons = [...progress.completedLessons, lessonId];
    const updated = {
      ...progress,
      completedLessons: nextLessons,
      xp: progress.xp + xpReward,
      level: Math.floor((progress.xp + xpReward) / 1000) + 1
    };
    saveProgress(updated);
  };

  const handleCompleteLab = (labId: string, xpReward: number) => {
    if (progress.completedLabs.includes(labId)) return;
    const nextLabs = [...progress.completedLabs, labId];
    const updated = {
      ...progress,
      completedLabs: nextLabs,
      xp: progress.xp + xpReward,
      level: Math.floor((progress.xp + xpReward) / 1000) + 1
    };
    saveProgress(updated);
  };

  const handleCompleteExam = (examId: string, score: number, xpReward: number) => {
    const currentHighest = progress.completedExams[examId] || 0;
    const updatedExams = {
      ...progress.completedExams,
      [examId]: Math.max(currentHighest, score)
    };
    
    // Award XP reward on initial successful clearing
    const initialPass = currentHighest === 0 && score >= 70;
    const calculatedXP = progress.xp + (initialPass ? xpReward : 0);

    const updated = {
      ...progress,
      completedExams: updatedExams,
      xp: calculatedXP,
      level: Math.floor(calculatedXP / 1000) + 1
    };
    saveProgress(updated);
  };

  const handleUpdateResume = (resumeData: ResumeData) => {
    const updated = {
      ...progress,
      resumeData
    };
    saveProgress(updated);
  };

  const handleGoToLesson = (catId: string, lessonId: string) => {
    setSelectedCategory(catId);
    const categoryLessons = ALL_LESSONS[catId] || [];
    const lesson = categoryLessons.find(l => l.id === lessonId);
    if (lesson) {
      setActiveLesson(lesson);
      setActiveTab("courses");
    }
  };

  const t = UI_TRANSLATIONS[language];

  // Map Courses based on search and selected categories
  const currentCategoryLessons = ALL_LESSONS[selectedCategory] || [];
  const filteredLessonsCatalogue = currentCategoryLessons.filter(lesson => 
    lesson.title.toLowerCase().includes(courseSearch.toLowerCase()) || 
    lesson.description.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Platform Header */}
      <Header 
        progress={progress} 
        language={language} 
        setLanguage={setLanguage} 
        tab={activeTab}
      />

      <div className="flex-1 flex flex-col lg:flex-row relative">
        
        {/* Mobile menu panel trigger */}
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-3 flex justify-between items-center z-30 sticky top-[73px]">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            Operational Menu Shell
          </span>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar desktop wrapper */}
        <div className="hidden lg:block">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} language={language} />
        </div>

        {/* Mobile sliding Sidebar panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute inset-y-0 left-0 w-72 bg-slate-950 z-50 border-r border-slate-850 shadow-2xl animate-slide-in">
            <div className="p-3 border-b border-slate-900 flex justify-end">
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-500 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileMenuOpen(false);
              }} 
              language={language} 
            />
          </div>
        )}

        {/* Main Content View routing */}
        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-x-hidden">
          
          {activeTab === "dashboard" && (
            <Dashboard 
              progress={progress} 
              language={language} 
              onNavigate={setActiveTab}
              onStartLesson={handleGoToLesson}
            />
          )}

          {activeTab === "courses" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              
              {/* Category selector row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {COURSES_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setActiveLesson(null);
                      }}
                      className={`text-center p-4 rounded-xl border transition flex flex-col items-center justify-between gap-1.5 h-24 ${
                        isActive
                          ? "bg-gradient-to-br from-cyan-950 to-slate-900 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                          : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <BookOpen className="w-5 h-5" />
                      <span className="text-xs font-bold leading-tight truncate w-full">{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Category content mapping splits */}
              {!activeLesson ? (
                <div className="space-y-4">
                  
                  {/* Filter and search row */}
                  <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="space-y-0.5">
                      <h3 className="text-md font-extrabold text-white">
                        {COURSES_CATEGORIES.find(c => c.id === selectedCategory)?.name} Curriculum
                      </h3>
                      <p className="text-xs text-slate-400">Expand and read core security reference books.</p>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={courseSearch}
                        onChange={(e) => setCourseSearch(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 pl-9 pr-3 py-2 text-xs rounded-xl text-white placeholder-slate-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Syllabus Card Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredLessonsCatalogue.map((lesson) => {
                      const completed = progress.completedLessons.includes(lesson.id);
                      return (
                        <div 
                          key={lesson.id}
                          className="group bg-slate-900/40 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 p-5 rounded-2xl transition flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <span className={`text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-md ${
                                lesson.difficulty === 'Beginner' ? 'text-green-400 bg-green-950/20' :
                                lesson.difficulty === 'Intermediate' ? 'text-amber-400 bg-amber-950/20' : 'text-rose-400 bg-rose-950/20'
                              }`}>
                                {lesson.difficulty}
                              </span>
                              
                              {completed && (
                                <span className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5" /> Checked
                                </span>
                              )}
                            </div>

                            <h4 className="text-sm font-extrabold text-white group-hover:text-cyan-400 transition leading-snug">
                              {lesson.title}
                            </h4>
                            <p className="text-slate-400 text-xs leading-normal">
                              {lesson.description}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-950 flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 font-mono font-bold">💎 Earn: {lesson.xpReward} XP</span>
                            <button
                              onClick={() => setActiveLesson(lesson)}
                              className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-cyan-500 text-cyan-400 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                            >
                              <span>{t.startLesson}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Focused Single Course Viewer with Markdown content markup design */
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 animate-fade-in">
                  
                  {/* View Header */}
                  <div className="flex justify-between items-center border-b border-slate-850 pb-4">
                    <button
                      onClick={() => setActiveLesson(null)}
                      className="text-xs text-slate-500 hover:text-cyan-400 font-mono"
                    >
                      ← Back to curriculum log
                    </button>

                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 border border-cyan-500/20 px-2.5 py-1 rounded-md">
                      REWARD: {activeLesson.xpReward} XP
                    </span>
                  </div>

                  {/* Core markdown styled text output container */}
                  <div className="prose prose-invert text-slate-350 max-w-none text-xs md:text-sm leading-relaxed space-y-4">
                    <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-2">{activeLesson.title}</h3>
                    <div className="whitespace-pre-wrap font-sans text-slate-305">
                      {activeLesson.content}
                    </div>
                  </div>

                  {/* Marking complete call-to-action */}
                  <div className="pt-6 border-t border-slate-850 flex justify-end gap-3">
                    <button
                      onClick={() => setActiveLesson(null)}
                      className="px-5 py-2.5 bg-transparent text-slate-400 hover:text-white text-xs font-bold transition"
                    >
                      Close Lesson
                    </button>

                    <button
                      onClick={() => {
                        handleCompleteLesson(activeLesson.id, activeLesson.xpReward);
                        setActiveLesson(null);
                      }}
                      disabled={progress.completedLessons.includes(activeLesson.id)}
                      className={`px-6 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                        progress.completedLessons.includes(activeLesson.id)
                          ? "bg-slate-950 border border-slate-900 text-slate-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{progress.completedLessons.includes(activeLesson.id) ? "Already checked" : t.completeAndEarn}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "labs" && (
            <InteractiveLabs 
              progress={progress} 
              language={language} 
              onCompleteLab={handleCompleteLab}
            />
          )}

          {activeTab === "certifications" && (
            <Certifications 
              progress={progress} 
              language={language} 
              onCompleteExam={handleCompleteExam}
            />
          )}

          {activeTab === "aitutor" && (
            <AITutor progress={progress} language={language} />
          )}

          {activeTab === "roadmaps" && (
            <CareerRoadmaps progress={progress} language={language} />
          )}

          {activeTab === "resumebuilder" && (
            <ResumeBuilder 
              progress={progress} 
              language={language} 
              onUpdateResume={handleUpdateResume}
            />
          )}

          {activeTab === "interviews" && (
            <InterviewPrep progress={progress} language={language} />
          )}

          {activeTab === "jobs" && (
            <JobBoard progress={progress} language={language} />
          )}

          {activeTab === "community" && (
            <CommunityForum language={language} />
          )}

        </main>
      </div>
    </div>
  );
}
