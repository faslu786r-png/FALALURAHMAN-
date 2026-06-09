import { 
  Plus, 
  Terminal, 
  Award, 
  Bot, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Zap, 
  ArrowUpRight, 
  CheckCircle2, 
  BookOpen, 
  Sparkles,
  Users2,
  Calendar,
  Trophy
} from "lucide-react";
import { Language, UserProgress } from "../types";
import { UI_TRANSLATIONS, COURSES_CATEGORIES, ALL_LESSONS } from "../data/courses";

interface DashboardProps {
  progress: UserProgress;
  language: Language;
  onNavigate: (tab: string) => void;
  onStartLesson?: (catId: string, lessonId: string) => void;
}

export default function Dashboard({ progress, language, onNavigate, onStartLesson }: DashboardProps) {
  const t = UI_TRANSLATIONS[language];

  // Derive simple statistics
  const totalLessons = Object.values(ALL_LESSONS).flat().length;
  const completedCount = progress.completedLessons.length;
  const progressPercent = Math.round((completedCount / (totalLessons || 1)) * 100);

  // Suggested courses that are NOT yet completed
  const recommendedLessons: { category: string; categoryName: string; lesson: any }[] = [];
  Object.entries(ALL_LESSONS).forEach(([catId, lessons]) => {
    const categoryName = COURSES_CATEGORIES.find(c => c.id === catId)?.name || catId;
    lessons.forEach(l => {
      const isCompleted = progress.completedLessons.includes(l.id);
      if (!isCompleted && recommendedLessons.length < 3) {
        recommendedLessons.push({
          category: catId,
          categoryName,
          lesson: l
        });
      }
    });
  });

  // Recent Badges
  const badges = [
    { id: "badge-welcome", name: "Genesis Shield", icon: "🛡️", desc: "Initiated your cyber armor" },
    { id: "badge-linux-1", name: "Bash Commando", icon: "🐚", desc: "Mastered Linux core navigation" },
    { id: "badge-net-1", name: "Subnet Overlord", icon: "🌐", desc: "Solved a complex IPv4 masking" },
    { id: "badge-ai-sec", name: "AI Prompeteer", icon: "🤖", desc: "Thwarted prompt injection tests" }
  ];

  const earnedBadges = badges.filter(b => progress.completedLessons.length > 0 || progress.completedLabs.length > 0);

  return (
    <div className="space-y-8 animate-fade-in p-1 md:p-3">
      {/* Dynamic Welcome Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold tracking-wider uppercase text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 rounded-full">
              <Sparkles className="w-3.5 h-3.5 animate-spin" /> Operational Shell Online
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Advance Your Cyber, Linux & AI Skills
            </h2>
            <p className="text-slate-400 text-sm max-w-xl">
              Equip yourself with elite industry knowledge. Clear interactive challenges, complete practice exams, and get mentored by our integrated Security AI Assistant.
            </p>
          </div>
          
          <button 
            onClick={() => onNavigate("aitutor")}
            className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm px-6 py-3.5 rounded-xl border border-cyan-400/30 transition shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.45)] whitespace-nowrap self-start md:self-auto"
          >
            <Bot className="w-5 h-5 text-white" />
            <span>Consult AI Security Tutor</span>
            <ArrowUpRight className="w-4 h-4 text-cyan-200" />
          </button>
        </div>
      </div>

      {/* High impact Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between shadow-md">
          <div className="space-y-2">
            <span className="text-xs text-slate-500 font-mono tracking-wider uppercase">Level Reach</span>
            <div className="text-2xl font-black text-white font-mono">Lv {progress.level}</div>
            <p className="text-xs text-slate-400">{progress.xp} Total XP earned</p>
          </div>
          <div className="p-3 bg-cyan-950/60 text-cyan-400 border border-cyan-500/20 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between shadow-md">
          <div className="space-y-2">
            <span className="text-xs text-slate-500 font-mono tracking-wider uppercase">Academy Progress</span>
            <div className="text-2xl font-black text-white font-mono">{progressPercent}%</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1 max-w-32">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
          <div className="p-3 bg-amber-950/60 text-amber-400 border border-amber-500/20 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between shadow-md">
          <div className="space-y-2">
            <span className="text-xs text-slate-500 font-mono tracking-wider uppercase">Labs Terminated</span>
            <div className="text-2xl font-black text-white font-mono">
              {progress.completedLabs.length} <span className="text-sm font-normal text-slate-500">Targets</span>
            </div>
            <p className="text-xs text-emerald-400 font-mono">100% Sandbox Sandbox</p>
          </div>
          <div className="p-3 bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <Terminal className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between shadow-md">
          <div className="space-y-2">
            <span className="text-xs text-slate-500 font-mono tracking-wider uppercase">Sert Prep Exam</span>
            <div className="text-2xl font-black text-white font-mono">
              {Object.keys(progress.completedExams).length} <span className="text-sm font-normal text-slate-500">Cleared</span>
            </div>
            <p className="text-xs text-slate-400">Ready for exam centers</p>
          </div>
          <div className="p-3 bg-rose-950/60 text-rose-400 border border-rose-500/20 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Learning Paths & Active Tracks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="text-cyan-400 w-5 h-5" /> Recommended Study Plan
            </h3>
            <button 
              onClick={() => onNavigate("courses")}
              className="text-xs text-cyan-400 font-mono font-bold hover:underline py-1"
            >
              Explore Course Shells →
            </button>
          </div>

          <div className="space-y-4">
            {recommendedLessons.map(({ category, categoryName, lesson }) => (
              <div 
                key={lesson.id}
                className="group relative bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70 p-5 rounded-2xl transition duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-2 max-w-md md:max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md">
                      {categoryName}
                    </span>
                    <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-md ${
                      lesson.difficulty === 'Beginner' ? 'text-green-400 bg-green-950/20' :
                      lesson.difficulty === 'Intermediate' ? 'text-amber-400 bg-amber-950/20' : 'text-rose-400 bg-rose-950/20'
                    }`}>
                      {lesson.difficulty}
                    </span>
                  </div>
                  <h4 className="text-md font-bold text-white group-hover:text-cyan-400 transition">
                    {lesson.title}
                  </h4>
                  <p className="text-slate-400 text-xs line-clamp-2">
                    {lesson.description}
                  </p>
                </div>

                <button
                  onClick={() => onStartLesson && onStartLesson(category, lesson.id)}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-700 bg-slate-950 group-hover:border-cyan-500/40 text-slate-300 group-hover:text-white group-hover:bg-cyan-950/30 text-xs font-bold rounded-xl transition whitespace-nowrap"
                >
                  <span>Launch Study</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {recommendedLessons.length === 0 && (
              <div className="bg-slate-900/20 border border-slate-800 border-dashed p-8 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">All Syllabus Lessons Cleared!</h4>
                <p className="text-xs text-slate-400">Head over to Practice Exams to validate your skills!</p>
              </div>
            )}
          </div>

          {/* Quick Labs Track snippet */}
          <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="text-cyan-400 w-4 h-4" /> Next Practical Lab Challenge
                </h4>
                <p className="text-xs text-slate-400">Live bash interface verification tests</p>
              </div>
              <button 
                onClick={() => onNavigate("labs")}
                className="text-xs bg-slate-950 border border-slate-800 hover:border-cyan-500 text-cyan-400 font-mono font-bold px-3 py-1.5 rounded-xl transition"
              >
                Open Terminal
              </button>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-cyan-500">LAB-LINUX-CORE #1</span>
              <h5 className="text-xs font-bold text-slate-200">Set Backup Permissions & Create Secret File</h5>
              <div className="flex gap-4 font-mono text-[10px] text-slate-400 mt-2">
                <span>⚡ 150 XP</span>
                <span>🛠️ Linux Commands</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Gamification, Badges and Leaderboard Snippet */}
        <div className="space-y-6">
          {/* AI Helper Banner */}
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/30 p-5 rounded-2xl space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-indigo-500/20 pointer-events-none">
              <Bot className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1 px-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono rounded-lg">
                ONLINE TUTOR
              </div>
            </div>
            <h4 className="text-sm font-bold text-white">Ask anything about Cyber, Linux commands or CCNA Subnetting rules</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our chatbot maintains exact reference guides relating to certifications, OWASP payloads and exam tips.
            </p>
            <button 
              onClick={() => onNavigate("aitutor")}
              className="text-xs font-bold text-cyan-400 bg-slate-950 border border-slate-800 hover:border-cyan-500 px-4 py-2 rounded-xl transition w-full"
            >
              Start Chat Session
            </button>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Trophy className="text-yellow-400 w-4.5 h-4.5" /> Earned Badges
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {earnedBadges.length > 0 ? (
                earnedBadges.map(b => (
                  <div key={b.id} className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl flex flex-col items-center text-center space-y-1">
                    <span className="text-2xl">{b.icon}</span>
                    <span className="text-[11px] font-bold text-slate-200 truncate w-full">{b.name}</span>
                    <span className="text-[9px] text-slate-500 leading-none">{b.desc}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 col-span-2 text-center py-4">No badges unlocked yet. Clear lessons or labs to start equipping.</p>
              )}
            </div>
          </div>

          {/* Mini Leaderboard snippet */}
          <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Users2 className="text-cyan-400 w-4.5 h-4.5" /> Top Academy Operatives
              </h4>
              <button 
                onClick={() => onNavigate("community")}
                className="text-[10px] text-cyan-500 hover:underline"
              >
                In Chat
              </button>
            </div>
            
            <div className="space-y-2.5">
              {[
                { rank: 1, name: "SecOps_Overlord", xp: 4890, self: false },
                { rank: 2, name: "fazo_ops (You)", xp: progress.xp || 1500, self: true },
                { rank: 3, name: "root_exploiter", xp: 1240, self: false },
                { rank: 4, name: "Alice_CCNA", xp: 950, self: false },
              ].sort((a,b) => b.xp - a.xp).map((user, idx) => (
                <div 
                  key={user.name} 
                  className={`flex items-center justify-between p-2 rounded-lg text-xs ${
                    user.self ? 'bg-cyan-950/30 border border-cyan-500/30 font-bold' : 'bg-slate-950/40 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono w-4">{idx + 1}</span>
                    <span className={user.self ? "text-cyan-400" : "text-slate-300"}>{user.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">{user.xp} XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
