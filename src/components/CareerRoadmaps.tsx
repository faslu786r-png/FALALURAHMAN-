import { useState } from "react";
import { Milestone, ArrowRight, ShieldAlert, CheckCircle, ChevronDown, Award } from "lucide-react";
import { Language, UserProgress } from "../types";
import { UI_TRANSLATIONS, CAREER_ROADMAPS } from "../data/courses";

interface CareerRoadmapsProps {
  progress: UserProgress;
  language: Language;
}

export default function CareerRoadmaps({ progress, language }: CareerRoadmapsProps) {
  const t = UI_TRANSLATIONS[language];
  const [selectedPath, setSelectedPath] = useState(CAREER_ROADMAPS[0]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-slate-900 border border-slate-800 rounded-2xl gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Milestone className="text-cyan-400 w-5.5 h-5.5" /> Career Learning Roadmaps
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Choose your target deployment track and systematically unlock necessary certifications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CAREER_ROADMAPS.map((track) => {
          const isActive = selectedPath.role === track.role;
          return (
            <button
              key={track.role}
              onClick={() => setSelectedPath(track)}
              className={`text-left p-5 rounded-2xl border transition flex flex-col justify-between space-y-4 ${
                isActive 
                  ? "bg-slate-900 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                  : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">Career TRACK</span>
                <h3 className="text-sm font-extrabold text-white leading-tight">{track.role}</h3>
              </div>
              
              <div className="flex items-center justify-between text-xs font-mono font-bold tracking-tight pt-2 border-t border-slate-900">
                <span className="text-slate-500">Avg Base Salary:</span>
                <span className="text-emerald-400">{track.salary}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Roadmap flow visually */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-2 border-b border-slate-800 pb-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">Recommended Step progression for:</span>
          <h3 className="text-lg font-black text-white">{selectedPath.role}</h3>
          <p className="text-slate-400 text-xs leading-relaxed max-w-2xl">{selectedPath.description}</p>
        </div>

        {/* Milestones Flow */}
        <div className="relative border-l border-slate-800 ml-4 md:ml-6 pl-6 space-y-8 py-2">
          {selectedPath.steps.map((step, idx) => {
            // Simulated calculation for unlocked milestones
            const isUnlocked = progress.completedLessons.length >= idx;
            
            return (
              <div key={idx} className="relative group">
                {/* Node counter */}
                <div className={`absolute -left-[35px] top-0 w-7 h-7 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition z-10 ${
                  isUnlocked 
                    ? "bg-cyan-950 text-cyan-400 border-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                    : "bg-slate-950 text-slate-600 border-slate-900"
                }`}>
                  {idx + 1}
                </div>

                <div className="space-y-1 my-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className={`text-sm font-bold transition ${isUnlocked ? 'text-slate-100' : 'text-slate-600'}`}>
                      {step.title}
                    </h4>
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                      isUnlocked 
                        ? 'text-cyan-400 bg-cyan-950/40 border-cyan-500/20' 
                        : 'text-slate-600 bg-slate-950 border-slate-900'
                    }`}>
                      {step.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {isUnlocked 
                      ? "Recommended status: Active or Completed training path." 
                      : "Clear preceding baseline modules to unlock this track milestone successfully."
                    }
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
