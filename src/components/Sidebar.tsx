import { 
  LayoutDashboard, 
  Terminal, 
  Award, 
  Bot, 
  Milestone, 
  FileUser, 
  Briefcase, 
  MessageSquare, 
  Trophy, 
  BookOpen, 
  ShieldCheck 
} from "lucide-react";
import { Language } from "../types";
import { UI_TRANSLATIONS } from "../data/courses";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
}

export default function Sidebar({ activeTab, setActiveTab, language }: SidebarProps) {
  const t = UI_TRANSLATIONS[language];

  const menuItems = [
    { id: "dashboard", label: t.dashboard, icon: LayoutDashboard },
    { id: "courses", label: t.courses, icon: BookOpen },
    { id: "labs", label: t.labs, icon: Terminal },
    { id: "certifications", label: t.certification, icon: Award },
    { id: "aitutor", label: t.aiTutor, icon: Bot },
    { id: "roadmaps", label: t.roadmap, icon: Milestone },
    { id: "resumebuilder", label: t.resume, icon: FileUser },
    { id: "interviews", label: t.interviews, icon: ShieldCheck },
    { id: "jobs", label: t.jobs, icon: Briefcase },
    { id: "community", label: t.community, icon: MessageSquare },
  ];

  return (
    <aside className="w-full lg:w-72 bg-slate-950 border-r border-slate-800 text-white flex flex-col justify-between shrink-0">
      <div className="py-6 px-4">
        <div className="text-xs uppercase font-mono tracking-widest text-slate-500 mb-6 px-3">
          Cyber Academy Hub
        </div>
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition text-left text-sm font-medium border ${
                  isActive
                    ? "bg-slate-900 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.08)]"
                    : "border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-6 bg-cyan-500 rounded-full animate-pulse shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 bg-slate-900/60 border-t border-slate-900 flex flex-col gap-2 font-mono text-slate-500 text-[11px] items-center text-center">
        <span>© 2026 CyberAI Academy</span>
        <span className="text-cyan-600/60">Secure Learning Shell v3.1</span>
      </div>
    </aside>
  );
}
