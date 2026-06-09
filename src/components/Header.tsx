import { Shield, Flame, Trophy, Sparkles, Languages } from "lucide-react";
import { Language, UserProgress } from "../types";
import { UI_TRANSLATIONS } from "../data/courses";

interface HeaderProps {
  progress: UserProgress;
  language: Language;
  setLanguage: (lang: Language) => void;
  tab: string;
}

export default function Header({ progress, language, setLanguage, tab }: HeaderProps) {
  const t = UI_TRANSLATIONS[language];
  
  // Calculate level progress
  const currentLevelXP = (progress.level - 1) * 1000;
  const nextLevelXP = progress.level * 1000;
  const levelProgress = ((progress.xp - currentLevelXP) / 1000) * 100;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white py-4 px-6 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-cyan-950 border border-cyan-500 rounded-xl text-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-pulse">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            CyberAI Academy
          </h1>
          <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">
            {t.welcome}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 md:gap-6">
        {/* Streak Meter */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-orange-500/30 text-orange-400 font-mono text-sm max-h-12 hover:border-orange-500/50 transition">
          <Flame className="w-4 h-4 text-orange-500" />
          <span>{progress.streak} {t.streak}</span>
        </div>

        {/* Level and XP Progress */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs text-slate-400 font-mono uppercase">{t.level} {progress.level}</span>
            </div>
            <span className="text-sm font-bold text-slate-200">{progress.xp} <span className="text-xs text-slate-500 font-normal">{t.xp}</span></span>
          </div>
          <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" 
              style={{ width: `${Math.min(100, Math.max(5, levelProgress))}%` }}
            />
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
          <Languages className="w-4 h-4 text-slate-400" />
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-transparent text-sm text-slate-300 focus:outline-none cursor-pointer pr-1 font-mono"
          >
            <option value="en" className="bg-slate-950 text-white">EN</option>
            <option value="ml" className="bg-slate-950 text-white">ML (മലയാളം)</option>
            <option value="ar" className="bg-slate-950 text-white">AR (العربية)</option>
          </select>
        </div>
      </div>
    </header>
  );
}
