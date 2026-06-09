import React, { useState } from "react";
import { ShieldCheck, HelpCircle, ChevronRight, CheckCircle, RefreshCcw, Send, Brain, Trophy } from "lucide-react";
import { Language, UserProgress } from "../types";
import { UI_TRANSLATIONS } from "../data/courses";

interface InterviewPrepProps {
  progress: UserProgress;
  language: Language;
}

const INTERVIEW_QUESTIONS = [
  {
    id: "q-1",
    question: "How would you handle a user who reported clicking a suspicious malware link inside their email console?",
    hints: "Address containment, scanning system, checking logs and reporting to SOC tier 2 teams."
  },
  {
    id: "q-2",
    question: "Describe the crucial difference between TCP (Transmission Control Protocol) and UDP (User Datagram Protocol) regarding reliability.",
    hints: "Explicitly mention packet handshakes, acknowledgment parameters and typical protocol channels."
  },
  {
    id: "q-3",
    question: "What steps are required to mitigate common SQL injection vectors inside application APIs?",
    hints: "Focus on compiled queries, strict inputs validation masks and parameters binding mechanisms."
  }
];

export default function InterviewPrep({ progress, language }: InterviewPrepProps) {
  const t = UI_TRANSLATIONS[language];
  const [activeQ, setActiveQ] = useState(INTERVIEW_QUESTIONS[0]);
  const [userAnswer, setUserAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmitValue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || submitting) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/gemini/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: activeQ.question,
          userAnswer: userAnswer
        })
      });
      const data = await response.json();
      setFeedback(data.text || "Connection failed. Please configure GEMINI_API_KEY.");
    } catch (err) {
      console.error(err);
      setFeedback(`### [Simulated Evaluation Feed]
**Technical Score**: 8.5/10 (Requires Secret Setup)
**Review notes**: Excellent emphasis on isolated diagnostics. Make sure you also check routing firewalls.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectQ = (q: any) => {
    setActiveQ(q);
    setUserAnswer("");
    setFeedback(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-slate-900 border border-slate-800 rounded-2xl gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-cyan-400 w-5.5 h-5.5" /> Security Hiring Interview Prep
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Formulate your technical responses and get them validated immediately by our automated AI SOC Hiring Manager.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left selector */}
        <div className="lg:col-span-4 bg-slate-900/40 border border-slate-800 p-5 rounded-2xl space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block border-b border-slate-800 pb-2">
            Scenario Questions
          </span>

          <div className="space-y-2.5">
            {INTERVIEW_QUESTIONS.map((q, idx) => {
              const isActive = activeQ.id === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => handleSelectQ(q)}
                  className={`w-full text-left p-4 rounded-xl border transition text-xs flex flex-col gap-2 ${
                    isActive
                      ? "bg-slate-900 border-cyan-500 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.08)]"
                      : "bg-slate-950 border-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">Probe #{idx + 1}</span>
                  <p className="line-clamp-2 leading-relaxed">{q.question}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right workspace inputs & response logs */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Active Technical Question:</span>
              <h3 className="text-md font-bold text-white leading-relaxed">{activeQ.question}</h3>
            </div>

            <div className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl text-[11px] text-slate-400">
              💡 <span className="font-bold text-slate-300">Hiring Focus Focus tips:</span> {activeQ.hints}
            </div>

            <form onSubmit={handleSubmitValue} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-mono">DRAFT CANDIDATE RESPONSE:</label>
                <textarea
                  rows={4}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Draft your professional response layout here..."
                  className="w-full bg-slate-950 text-xs text-slate-100 placeholder-slate-700 p-4 border border-slate-800 rounded-xl outline-none focus:border-cyan-500/50 transition"
                  disabled={submitting}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !userAnswer.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Analyzing technical keywords..." : "Submit Answer to AI Manager"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Manager feedback feedback */}
          {feedback && (
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 animate-fade-in text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                  Hiring Management Assessment Output
                </span>
              </div>
              <div>{feedback}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
