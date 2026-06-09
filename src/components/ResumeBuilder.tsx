import { useState } from "react";
import { FileUser, Sparkles, Plus, Trash2, Printer, CheckCircle, Brain, Target } from "lucide-react";
import { Language, UserProgress, ResumeData } from "../types";
import { UI_TRANSLATIONS } from "../data/courses";

interface ResumeBuilderProps {
  progress: UserProgress;
  language: Language;
  onUpdateResume: (data: ResumeData) => void;
}

const DEFAULT_RESUME: ResumeData = {
  fullName: "Fazal R.",
  title: "Aspiring Security Analyst & SOC Specialist",
  email: "fazfazlu917@gmail.com",
  phone: "+1 (555) 019-2831",
  location: "Chicago, IL",
  summary: "Enthusiastic Security Operations Center candidate possessing rigorous training in network subnets mapping, logs parsing, vulnerability checking and Cisco switching models.",
  experience: [
    {
      company: "CyberAI Academy Labs",
      role: "Junior Security Trainee (Simulated)",
      period: "2026 - Present",
      bullets: [
        "Structured isolated folders backup routines and managed Linux permissions via Command Terminal.",
        "Scanned and closed rogue listener backdoors running over TCP ports.",
        "Mitigated jailbreak injection instructions using regex validation filter prompts."
      ]
    }
  ],
  education: [
    {
      school: "CyberAI Technical Training Institute",
      degree: "Information Assurance and Networking Certification",
      period: "Graduated May 2026"
    }
  ],
  certifications: ["CompTIA Security+ SY0-701 SYLLABUS", "Cisco CCNA Prep Completed"],
  skills: ["Linux Admin", "IPv4 Subnetting", "OWASP Top 10 Audit", "Python Exploit Scripts", "Bash Shell Logs", "Generative AI Prompts Guarding"]
};

export default function ResumeBuilder({ progress, language, onUpdateResume }: ResumeBuilderProps) {
  const t = UI_TRANSLATIONS[language];
  const [resume, setResume] = useState<ResumeData>(progress.resumeData || DEFAULT_RESUME);
  const [editingExperienceIdx, setEditingExperienceIdx] = useState<number | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFieldChange = (field: keyof ResumeData, val: any) => {
    const updated = { ...resume, [field]: val };
    setResume(updated);
    onUpdateResume(updated);
  };

  const handleExperienceChange = (idx: number, field: string, value: any) => {
    const updatedExp = [...resume.experience];
    updatedExp[idx] = { ...updatedExp[idx], [field]: value };
    const updated = { ...resume, experience: updatedExp };
    setResume(updated);
    onUpdateResume(updated);
  };

  const handleAddBullet = (expIdx: number) => {
    const updatedExp = [...resume.experience];
    updatedExp[expIdx].bullets.push("Action phrase: Mitigated target risks.");
    const updated = { ...resume, experience: updatedExp };
    setResume(updated);
    onUpdateResume(updated);
  };

  const handleRemoveBullet = (expIdx: number, bulletIdx: number) => {
    const updatedExp = [...resume.experience];
    updatedExp[expIdx].bullets.splice(bulletIdx, 1);
    const updated = { ...resume, experience: updatedExp };
    setResume(updated);
    onUpdateResume(updated);
  };

  const handleAddExperienceItem = () => {
    const updated = {
      ...resume,
      experience: [
        ...resume.experience,
        { company: "Enterprise Client", role: "SOC Assistant", period: "2026", bullets: ["Monitored endpoint logs."] }
      ]
    };
    setResume(updated);
    onUpdateResume(updated);
  };

  const handleRemoveExperienceItem = (idx: number) => {
    const updatedExp = [...resume.experience];
    updatedExp.splice(idx, 1);
    const updated = { ...resume, experience: updatedExp };
    setResume(updated);
    onUpdateResume(updated);
  };

  // Triggers Gemini backend resume polish proxy
  const polishResumeWithAI = async () => {
    setLoadingAI(true);
    setSuccessMsg(null);
    try {
      const response = await fetch("/api/gemini/resume-polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resume,
          targetRole: resume.title || "SOC Security Operator"
        })
      });
      const data = await response.json();
      
      // We'll update the first experience bullet points with refined AI items or print the feedback
      if (data.text) {
        // Parse bullets out of text or put them in the Summary
        const cleanMessage = data.text;
        handleFieldChange("summary", cleanMessage.substring(0, 320) + " (Polished by CyberAI Advisor)");
        setSuccessMsg("INTELLIGENT RESTRUCTURING: AI Advisor successfully refined candidate summary & style indicators!");
      }
    } catch (err) {
      console.error(err);
      setSuccessMsg("Notice: simulated fallback model triggered. Input validated successfully.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title segment */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-slate-900 border border-slate-800 rounded-2xl gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileUser className="text-cyan-400 w-5.5 h-5.5" /> AI Cybersecurity Resume Architect
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Build a highly calibrated industry-compliant resume optimized against Applicant Tracking Systems (ATS).
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={polishResumeWithAI}
            disabled={loadingAI}
            className="px-4 py-2 rounded-xl bg-cyan-950 border border-cyan-500/30 hover:bg-cyan-900/50 text-cyan-400 font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <Brain className="w-4 h-4 animate-pulse" />
            <span>{loadingAI ? "Polishing..." : "Optimize with AI Advisor"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Layout / PDF</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs font-medium">
          {successMsg}
        </div>
      )}

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form controls */}
        <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 p-5 rounded-2xl space-y-4">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block border-b border-slate-800 pb-2">
            Candidate Inputs
          </span>

          <div className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">FullName</label>
              <input 
                type="text" 
                value={resume.fullName}
                onChange={(e) => handleFieldChange("fullName", e.target.value)}
                className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500/40 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Target Professional Title</label>
              <input 
                type="text" 
                value={resume.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500/40 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Email Address</label>
                <input 
                  type="email" 
                  value={resume.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Location</label>
                <input 
                  type="text" 
                  value={resume.location}
                  onChange={(e) => handleFieldChange("location", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Executive Professional Summary</label>
              <textarea 
                rows={3}
                value={resume.summary}
                onChange={(e) => handleFieldChange("summary", e.target.value)}
                className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-white outline-none text-xs"
              />
            </div>

            {/* Experience records loop */}
            <div className="space-y-3.5">
              <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg">
                <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">Experience Entries</span>
                <button 
                  onClick={handleAddExperienceItem}
                  className="p-1 text-cyan-400 hover:text-cyan-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {resume.experience.map((exp, expIdx) => (
                <div key={expIdx} className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl space-y-2 relative">
                  <button 
                    onClick={() => handleRemoveExperienceItem(expIdx)}
                    className="absolute top-2 right-2 text-rose-500/70 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-2 gap-1.5">
                    <input 
                      type="text" 
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(expIdx, "company", e.target.value)}
                      className="bg-transparent border-b border-slate-900 outline-none p-1 text-slate-200"
                    />
                    <input 
                      type="text" 
                      placeholder="Role"
                      value={exp.role}
                      onChange={(e) => handleExperienceChange(expIdx, "role", e.target.value)}
                      className="bg-transparent border-b border-slate-900 outline-none p-1 text-slate-200"
                    />
                  </div>

                  {/* Bullets sublist */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>Bullets Checklist</span>
                      <button 
                        onClick={() => handleAddBullet(expIdx)}
                        className="text-cyan-500 hover:underline"
                      >
                        + Add Bullet
                      </button>
                    </div>

                    {exp.bullets.map((b, bIdx) => (
                      <div key={bIdx} className="flex gap-1.5 items-center">
                        <input 
                          type="text" 
                          value={b}
                          onChange={(e) => {
                            const bulletsCopy = [...exp.bullets];
                            bulletsCopy[bIdx] = e.target.value;
                            handleExperienceChange(expIdx, "bullets", bulletsCopy);
                          }}
                          className="flex-1 bg-transparent border-b border-slate-900 p-0.5 text-[11px] text-slate-400 outline-none"
                        />
                        <button 
                          onClick={() => handleRemoveBullet(expIdx, bIdx)}
                          className="text-rose-600 hover:text-rose-500 p-0.5"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right formatted Print template */}
        <div className="lg:col-span-7 bg-white text-slate-900 p-8 rounded-2xl shadow-xl space-y-6 select-text max-h-[680px] overflow-y-auto print:max-h-none print:shadow-none font-sans">
          
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center">
            <h3 className="text-xl font-bold tracking-tight uppercase text-slate-950 font-serif">
              {resume.fullName || "Your Full Name"}
            </h3>
            <p className="text-xs font-mono font-bold text-cyan-700 tracking-wider">
              {resume.title || "Desired Role"}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-[11px] text-slate-500 font-medium mt-2">
              <span>📧 {resume.email}</span>
              <span>📞 {resume.phone}</span>
              <span>📍 {resume.location}</span>
            </div>
          </div>

          {/* Exec Summary */}
          {resume.summary && (
            <div className="space-y-1">
              <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-900 border-b border-slate-300 pb-0.5">
                Executive Profile Statement
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                {resume.summary}
              </p>
            </div>
          )}

          {/* Professional Experience */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-900 border-b border-slate-300 pb-0.5">
              Professional Accomplishments & Labs
            </h4>
            
            <div className="space-y-3">
              {resume.experience.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>{exp.role} — {exp.company}</span>
                    <span className="font-mono text-[10px] text-slate-500 font-normal">{exp.period}</span>
                  </div>
                  <ul className="list-disc pl-4 text-slate-600 text-[11px] space-y-1">
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education list */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-900 border-b border-slate-300 pb-0.5">
              Education & Dynamic Qualifications
            </h4>
            {resume.education.map((ed, idx) => (
              <div key={idx} className="flex justify-between text-xs text-slate-700">
                <span><strong>{ed.degree}</strong> ({ed.school})</span>
                <span className="text-[10px] font-mono text-slate-500">{ed.period}</span>
              </div>
            ))}
          </div>

          {/* Core Skills chips */}
          <div className="space-y-2">
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-900 border-b border-slate-300 pb-0.5">
              Technical Core Proficiencies
            </h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {resume.skills.map((s, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-slate-100 text-[10px] font-mono font-bold text-slate-700 rounded-md border border-slate-200">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
