import React, { useState } from "react";
import { MessageSquare, ThumbsUp, PlusCircle, HelpCircle, CornerDownRight, Check, Send, Sparkles } from "lucide-react";
import { Language, ForumPost } from "../types";
import { UI_TRANSLATIONS, FORUM_THREADS } from "../data/courses";

interface CommunityForumProps {
  language: Language;
}

export default function CommunityForum({ language }: CommunityForumProps) {
  const t = UI_TRANSLATIONS[language];
  const [threads, setThreads] = useState<ForumPost[]>(FORUM_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  
  // Create thread forms
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Cybersecurity");
  const [newContent, setNewContent] = useState("");

  // Comment draft
  const [commentText, setCommentText] = useState("");

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreads(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, likes: t.likes + 1 };
      }
      return t;
    }));
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const added: ForumPost = {
      id: `thread-${Date.now()}`,
      title: newTitle,
      author: "fazo_ops (You)",
      role: "Academy Student",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      content: newContent,
      category: newCategory,
      likes: 1,
      repliesCount: 0,
      replies: [],
      timestamp: "Just now"
    };

    setThreads([added, ...threads]);
    setNewTitle("");
    setNewContent("");
    setIsCreatingThread(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeThreadId) return;

    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          repliesCount: t.repliesCount + 1,
          replies: [
            ...t.replies,
            {
              id: `r-${Date.now()}`,
              author: "fazo_ops (You)",
              role: "Academy Student",
              content: commentText,
              timestamp: "Just now"
            }
          ]
        };
      }
      return t;
    }));

    setCommentText("");
  };

  const selectedThread = threads.find(t => t.id === activeThreadId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Upper header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="text-cyan-400 w-5.5 h-5.5" /> Academy Community Forum
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Exchange exam tips, discuss local networking issues, and collaborate on labs.
          </p>
        </div>

        {!isCreatingThread && !activeThreadId && (
          <button
            onClick={() => setIsCreatingThread(true)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Thread</span>
          </button>
        )}
      </div>

      {/* Triggering dynamic view models: Create thread */}
      {isCreatingThread && (
        <form onSubmit={handleCreateThread} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 max-w-2xl mx-auto animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white">{t.newPost}</h3>
            <button 
              type="button" 
              onClick={() => setIsCreatingThread(false)}
              className="text-xs text-slate-500 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">Post Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="How to solve port scan? / CCNA exam question #3?"
                className="w-full bg-slate-950 text-slate-100 placeholder-slate-700 border border-slate-800 rounded-xl px-4 py-2.5 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-4 py-4.5 font-mono outline-none"
                >
                  <option value="Networking">Networking</option>
                  <option value="Linux Core">Linux Core</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Cloud Security">Cloud Security</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Description Body</label>
              <textarea
                required
                rows={5}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Draft the details of your inquiry..."
                className="w-full bg-slate-950 text-slate-200 placeholder-slate-700 border border-slate-800 rounded-xl px-4 py-2 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition"
            >
              Publish Thread
            </button>
          </div>
        </form>
      )}

      {/* Selected Thread detail view */}
      {activeThreadId && selectedThread && (
        <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
          {/* Main post layout */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <button 
                onClick={() => setActiveThreadId(null)}
                className="text-xs text-slate-500 hover:text-cyan-400 font-mono"
              >
                ← Back to catalog list
              </button>

              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-md border border-cyan-500/20">
                {selectedThread.category}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-md font-extrabold text-white leading-relaxed">{selectedThread.title}</h3>
              
              <div className="flex items-center gap-2.5 pt-1">
                <img 
                  src={selectedThread.avatar} 
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-slate-800"
                />
                <div className="text-[11px] font-mono leading-none">
                  <span className="font-bold text-slate-200 block">{selectedThread.author}</span>
                  <span className="text-slate-500">{selectedThread.role} — {selectedThread.timestamp}</span>
                </div>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed pt-2.5">
                {selectedThread.content}
              </p>
            </div>
          </div>

          {/* Comment list */}
          <div className="space-y-3.5 pl-6 border-l-2 border-slate-800">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold block">
              Responses ({selectedThread.replies.length})
            </span>

            {selectedThread.replies.map((rep) => (
              <div key={rep.id} className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <div className="w-5 h-5 bg-slate-950 text-slate-400 rounded-full flex items-center justify-center font-bold font-mono">
                    {rep.author.charAt(0)}
                  </div>
                  <span className="font-bold text-slate-300">{rep.author}</span>
                  <span className="text-slate-600">({rep.role})</span>
                  <span className="text-slate-500 ml-auto">{rep.timestamp}</span>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed">
                  {rep.content}
                </p>
              </div>
            ))}

            {/* Comment Draft Input Form */}
            <form onSubmit={handleAddComment} className="flex gap-2 items-center pt-2">
              <input 
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Type your constructive response here..."
                required
                className="flex-1 bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/40 transition"
              />
              <button
                type="submit"
                className="p-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition shadow-lg shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Forum Post feed index list */}
      {!isCreatingThread && !activeThreadId && (
        <div className="space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block pl-1">
            {t.trendingThreads}
          </span>

          <div className="space-y-4">
            {threads.map((thread) => (
              <div 
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className="group bg-slate-900/40 border border-slate-800 p-5 rounded-2xl cursor-pointer hover:border-slate-700 hover:bg-slate-900/60 transition duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-2.5 max-w-xl md:max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[9px] uppercase font-bold tracking-widest font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-500/10 px-2 py-0.5 rounded-md">
                      {thread.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{thread.timestamp}</span>
                  </div>

                  <h3 className="text-sm font-extrabold text-white group-hover:text-cyan-400 transition leading-snug">
                    {thread.title}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <img 
                      src={thread.avatar} 
                      alt="Avatar" 
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <div className="text-[10px] font-mono text-slate-400 leading-none">
                      <strong className="text-slate-300">{thread.author}</strong> — <span>{thread.role}</span>
                    </div>
                  </div>
                </div>

                {/* Likes / comments chips */}
                <div className="flex items-center gap-3 self-end md:self-auto text-xs font-mono text-slate-500">
                  <button 
                    onClick={(e) => handleLike(thread.id, e)}
                    className="flex items-center gap-1.5 p-2 bg-slate-950/60 border border-slate-900 rounded-xl hover:text-white transition"
                    title="Recommend this debate"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{thread.likes}</span>
                  </button>

                  <div className="flex items-center gap-1.5 p-1.5 px-2.5 bg-slate-950/40 border border-slate-900 rounded-xl">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                    <span>{thread.repliesCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
