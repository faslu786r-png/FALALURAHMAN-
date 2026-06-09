import { useState } from "react";
import { Briefcase, Search, Badge, MapPin, DollarSign, Calendar, Check, Send, CheckCircle } from "lucide-react";
import { Language, UserProgress } from "../types";
import { UI_TRANSLATIONS, JOB_BOARD } from "../data/courses";

interface JobBoardProps {
  progress: UserProgress;
  language: Language;
}

export default function JobBoard({ progress, language }: JobBoardProps) {
  const t = UI_TRANSLATIONS[language];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const handleApply = (id: string) => {
    if (appliedJobs.includes(id)) return;
    setAppliedJobs(prev => [...prev, id]);
  };

  const filteredJobs = JOB_BOARD.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || job.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(JOB_BOARD.flatMap(job => job.tags)));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Search Header panel */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="text-cyan-400 w-5.5 h-5.5" /> Cyber Security Job Board
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Bridge your academy level directly into enterprise SOC roles and junior penetration testing contracts.
          </p>
        </div>

        {/* Dynamic Search inputs */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search titles, skills, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500/50 transition font-mono"
          />
        </div>
      </div>

      {/* Tags line */}
      <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1.5 rounded-lg border transition ${
            selectedTag === null
              ? "bg-cyan-950 text-cyan-400 border-cyan-500/40 font-bold"
              : "bg-slate-900/40 border-slate-900 text-slate-500 hover:text-slate-300"
          }`}
        >
          All Postings ({JOB_BOARD.length})
        </button>

        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1.5 rounded-lg border transition ${
              selectedTag === tag
                ? "bg-cyan-950 text-cyan-400 border-cyan-500/40 font-bold"
                : "bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300"
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Main Jobs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job) => {
          const isApplied = appliedJobs.includes(job.id);

          return (
            <div 
              key={job.id} 
              className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition duration-300"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-white leading-snug">{job.title}</h3>
                    <p className="text-xs text-slate-400 font-mono font-medium">{job.company}</p>
                  </div>
                  <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 bg-cyan-950 border border-cyan-500/20 px-2 py-0.5 rounded-md shrink-0">
                    {job.type}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-slate-400 text-[11px] font-mono font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> <span className="text-slate-200">{job.salary}</span>
                  </span>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed">
                  {job.description}
                </p>

                {/* Requirements sublist */}
                <div className="space-y-1 bg-slate-950/40 p-3 rounded-xl border border-slate-900">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold block">Qualifications Benchmark:</span>
                  <ul className="list-disc pl-4 text-slate-400 text-[10px] space-y-0.5 leading-normal">
                    {job.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom tag row and submit */}
              <div className="pt-3 border-t border-slate-900 flex justify-between items-center gap-3">
                <div className="flex flex-wrap gap-1">
                  {job.tags.map(t => (
                    <span key={t} className="text-[9px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-900">
                      #{t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleApply(job.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 shrink-0 ${
                    isApplied 
                      ? "bg-emerald-950 border border-emerald-500/30 text-emerald-400 cursor-default" 
                      : "bg-slate-950 hover:bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white"
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle className="w-4.5 h-4.5 text-emerald-400" />
                      <span>Applied (Resume synced)</span>
                    </>
                  ) : (
                    <>
                      <span>Instant Apply</span>
                      <Send className="w-3 h-3 text-cyan-500" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {filteredJobs.length === 0 && (
          <div className="col-span-2 bg-slate-900/20 border border-slate-850 border-dashed p-12 rounded-2xl text-center text-slate-500 font-mono text-xs">
            No listings spotted matching search filters.
          </div>
        )}
      </div>
    </div>
  );
}
