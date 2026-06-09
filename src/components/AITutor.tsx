import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, Terminal, Shield, ArrowRight, BookOpen, RefreshCw } from "lucide-react";
import { Language, UserProgress } from "../types";
import { UI_TRANSLATIONS } from "../data/courses";

interface AITutorProps {
  progress: UserProgress;
  language: Language;
}

export default function AITutor({ progress, language }: AITutorProps) {
  const t = UI_TRANSLATIONS[language];
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: "Security Shell Ready. I am your CyberAI Mentor. Select a topic context above or type any question regarding subnet calculations, Linux command arguments, exploit buffers, or preparation tips for CompTIA Security+ SY0-701."
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [activeSessionTopic, setActiveSessionTopic] = useState("General CyberSecurity");
  const [loading, setLoading] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputVal.trim();
    if (!query || loading) return;

    // Append user message
    const nextMsgs = [...messages, { role: 'user', content: query }];
    setMessages(nextMsgs as any);
    setInputVal("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: messages,
          context: activeSessionTopic
        })
      });
      const data = await response.json();
      
      setMessages([...nextMsgs, { role: 'assistant', content: data.text || "API connection lost. Please verify backend state." }] as any);
    } catch (err) {
      console.error(err);
      setMessages([...nextMsgs, { role: 'assistant', content: "Host unreachable. Please verify GEMINI_API_KEY is configured in the Secrets panel." }] as any);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    { title: "Subnetting Help", text: "Explain how to calculate subnets for a /26 network configuration mask." },
    { title: "Linux Permissions", text: "What does chmod 755 do vs chmod 644? Give some real security application examples." },
    { title: "SQLi Mitigation", text: "Construct a secure parameterized check query using Python code to guard against SQL Injections." },
    { title: "OWASP Top 10", text: "What is command injection and how can I secure node express input arguments?" }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-slate-900 border border-slate-800 rounded-2xl gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bot className="text-cyan-400 w-5.5 h-5.5 animate-pulse" /> CyberAI Academy Assistant
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Accelerate your studies using our integrated real-time Gemini security reference assistant.
          </p>
        </div>

        {/* Topic Context Quick-tags */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {["General CyberSecurity", "Linux System Administration", "Networking (CCNA)", "OWASP API Security", "Prompt Injection Mitigation"].map(topic => (
            <button
              key={topic}
              onClick={() => setActiveSessionTopic(topic)}
              className={`px-3 py-1.5 rounded-xl border transition ${
                activeSessionTopic === topic 
                  ? "bg-cyan-950 text-cyan-400 border-cyan-500/50 font-bold"
                  : "bg-slate-950 text-slate-500 border-slate-900 hover:text-slate-300"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Chat window panel */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col h-[520px] overflow-hidden shadow-2xl">
          <div className="bg-slate-900 p-4 border-b border-slate-800/80 flex justify-between items-center text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Session Target Context: <strong className="text-slate-200">{activeSessionTopic}</strong></span>
            </div>
            
            <button 
              onClick={() => setMessages([{ role: 'assistant', content: "Session buffer purged. Chat initiated." }])}
              className="hover:text-white p-1"
              title="Clear active conversation logs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500 hover:text-cyan-400" />
            </button>
          </div>

          {/* Message log wrapper */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {messages.map((m, idx) => (
              <div 
                key={idx}
                className={`flex gap-3 max-w-[85%] ${
                  m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div className={`p-2.5 rounded-lg shrink-0 flex items-center justify-center border h-9 w-9 ${
                  m.role === 'user' 
                    ? "bg-slate-900 border-slate-800 text-slate-300"
                    : "bg-cyan-950/80 border-cyan-500/20 text-cyan-400"
                }`}>
                  {m.role === 'user' ? <Terminal className="w-4 h-4" /> : <Bot className="w-4.5 h-4.5" />}
                </div>

                <div className={`p-4 rounded-2xl text-xs leading-relaxed space-y-2 whitespace-pre-wrap ${
                  m.role === 'user'
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 border border-cyan-500 text-white"
                    : "bg-slate-900/60 border border-slate-800 text-slate-300"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 mr-auto">
                <div className="p-2.5 bg-cyan-950/80 border border-cyan-500/20 rounded-lg text-cyan-400 shrink-0 h-9 w-9 flex items-center justify-center animate-spin">
                  <span className="text-[11px] font-bold">●</span>
                </div>
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-slate-400 font-mono tracking-wide animate-pulse">
                  Analyzing database schemas / query buffers...
                </div>
              </div>
            )}
            
            <div ref={endRef} />
          </div>

          {/* Prompt Send form */}
          <form onSubmit={handleSend} className="bg-slate-900 p-3 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Query our helper regarding certifications, command paths or scripts..."
              className="flex-1 bg-slate-950 text-xs text-slate-100 placeholder-slate-500 border border-slate-800/80 outline-none rounded-xl px-4 py-3 focus:border-cyan-500/50 transition"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transition disabled:opacity-40 shadow-lg shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Left side suggested prompts cards */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Sparkles className="text-yellow-400 w-4 h-4 animate-spin" />
              <h4 className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">Suggested Prompts</h4>
            </div>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              Click any blueprint below to immediately load it into the console helper:
            </p>

            <div className="space-y-2">
              {samplePrompts.map((p) => (
                <button
                  key={p.title}
                  onClick={() => setInputVal(p.text)}
                  className="w-full text-left p-3.5 bg-slate-950 hover:bg-slate-900/70 border border-slate-900 hover:border-cyan-500/20 rounded-xl transition space-y-1 block"
                >
                  <span className="text-xs font-bold text-slate-200 block flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-cyan-400" /> {p.title}
                  </span>
                  <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                    {p.text}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-cyan-950/20 to-slate-900 border border-cyan-500/10 rounded-xl text-center space-y-2">
            <h5 className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
              <Shield className="w-4 h-4 text-cyan-500" /> Integrated Prompt Filter active
            </h5>
            <p className="text-[10px] text-slate-400 leading-normal">
              Your prompt logs are validated live to safeguard against injection simulations. Use interactive labs to experiment securely over isolated sandboxes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
