import { useState } from "react";
import { Award, CheckCircle, XCircle, ChevronRight, HelpCircle, Trophy, RefreshCcw, FileBadge, ArrowUpRight } from "lucide-react";
import { Language, Exam, UserProgress } from "../types";
import { UI_TRANSLATIONS, CERT_EXAMS } from "../data/courses";

interface CertificationsProps {
  progress: UserProgress;
  language: Language;
  onCompleteExam: (examId: string, score: number, xpReward: number) => void;
}

export default function Certifications({ progress, language, onCompleteExam }: CertificationsProps) {
  const t = UI_TRANSLATIONS[language];
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [answersSubmitted, setAnswersSubmitted] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [examFinished, setExamFinished] = useState(false);
  const [finishedScore, setFinishedScore] = useState(0);
  const [viewingCertificateExamId, setViewingCertificateExamId] = useState<string | null>(null);

  const startExamHandler = (exam: Exam) => {
    setActiveExam(exam);
    setCurrentQIdx(0);
    setSelectedOpt(null);
    setAnswersSubmitted(false);
    setCorrectAnswersCount(0);
    setExamFinished(false);
    setFinishedScore(0);
    setViewingCertificateExamId(null);
  };

  const submitAnswerHandler = () => {
    if (selectedOpt === null || answersSubmitted) return;
    setAnswersSubmitted(true);
    
    const correct = selectedOpt === activeExam!.questions[currentQIdx].correctIndex;
    if (correct) {
      setCorrectAnswersCount(prev => prev + 1);
    }
  };

  const nextQuestionHandler = () => {
    if (!activeExam) return;
    const isLast = currentQIdx === activeExam.questions.length - 1;
    if (isLast) {
      const calculatedScore = Math.round((correctAnswersCount / activeExam.questions.length) * 100);
      setFinishedScore(calculatedScore);
      setExamFinished(true);
      
      // Submit result upstream
      onCompleteExam(activeExam.id, calculatedScore, activeExam.xpReward);
    } else {
      setCurrentQIdx(prev => prev + 1);
      setSelectedOpt(null);
      setAnswersSubmitted(false);
    }
  };

  const getPercentageString = (examId: string) => {
    const highestScore = progress.completedExams[examId];
    return highestScore !== undefined ? `${highestScore}%` : "Not Attempted";
  };

  // Generate certificate display if score is 100%
  const activeViewCert = viewingCertificateExamId 
    ? CERT_EXAMS.find(e => e.id === viewingCertificateExamId) 
    : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Upper header segment */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-slate-900 border border-slate-800 rounded-2xl gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="text-cyan-400 w-5.5 h-5.5" /> Industry Certification Preparation
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Build enterprise grade skills and prepare for world class cybersecurity & networking credentials.
          </p>
        </div>
      </div>

      {!activeExam && !viewingCertificateExamId && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CERT_EXAMS.map((exam) => {
            const highestScore = progress.completedExams[exam.id];
            const hasPassed = highestScore !== undefined && highestScore >= 70;
            const hasPerfectScore = highestScore !== undefined && highestScore === 100;

            return (
              <div 
                key={exam.id}
                className="group bg-slate-900/40 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/70 p-6 rounded-2xl transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold bg-cyan-950/80 border border-cyan-500/20 px-2.5 py-0.5 rounded-md">
                      {exam.code}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      📚 {exam.questions.length} Qs
                    </span>
                  </div>

                  <h3 className="text-md font-bold text-white leading-snug group-hover:text-cyan-400 transition">
                    {exam.title}
                  </h3>
                  
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800">
                    <span className="text-slate-500 font-mono">Attempt Grade:</span>
                    <span className={`font-mono font-bold ${
                      highestScore === undefined ? 'text-slate-600' :
                      highestScore >= 100 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {getPercentageString(exam.id)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => startExamHandler(exam)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white"
                  >
                    <span>{highestScore !== undefined ? "Retry Practice Exam" : "Start Practice Exam"}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  {hasPerfectScore && (
                    <button
                      onClick={() => setViewingCertificateExamId(exam.id)}
                      className="w-full py-2 bg-cyan-950 border border-cyan-500/30 hover:bg-cyan-900/50 text-cyan-400 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                    >
                      <FileBadge className="w-4 h-4" />
                      <span>View Honors Certificate</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Viewing Honors Certificate modal simulator */}
      {viewingCertificateExamId && activeViewCert && (
        <div className="p-1 md:p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6 text-center shadow-2xl relative overflow-hidden max-w-2xl mx-auto">
          {/* Ambient vector stars background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl" />
          
          <div className="border-4 border-double border-cyan-500/30 p-8 rounded-xl md:p-12 space-y-6 bg-slate-950">
            <div className="flex justify-center flex-col items-center">
              <div className="p-4 bg-cyan-950 border border-cyan-500/40 text-cyan-400 rounded-full animate-pulse shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <Trophy className="w-10 h-10" />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-cyan-500 font-bold uppercase mt-4 block">
                Official CyberAI Academy Training Matrix
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs uppercase font-mono tracking-widest text-slate-500">Certificate of Honors Accomplishment</h3>
              <p className="text-slate-400 text-xs">This verifies and certifies that</p>
              <h4 className="text-xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 py-1">
                Guest Operative (fazo_ops)
              </h4>
              <p className="text-slate-400 text-xs">has successfully cleared the certification training criteria for</p>
              <h5 className="text-md md:text-lg font-bold text-white tracking-tight">{activeViewCert.title}</h5>
              <p className="text-[11px] text-slate-500 font-mono mt-1">with an exemplary score of 100% on early simulation</p>
            </div>

            <div className="pt-6 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <div className="text-left">
                <span>Verification ID:</span>
                <span className="text-slate-400 block break-all">CAI-{activeViewCert.code}-2026</span>
              </div>
              <div className="text-right">
                <span>Authorized Signature:</span>
                <span className="text-cyan-500 font-bold block">CyberAI Gen-2 Agent</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setViewingCertificateExamId(null)}
            className="px-6 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition"
          >
            Back to Certifications list
          </button>
        </div>
      )}

      {/* Active practice exam loop */}
      {activeExam && !examFinished && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 tracking-wider">
                Exam Mode: {activeExam.code}
              </span>
              <h3 className="text-md font-bold text-white mt-0.5">{activeExam.title}</h3>
            </div>
            <button
              onClick={() => setActiveExam(null)}
              className="text-xs text-slate-500 hover:text-white font-mono"
            >
              Cancel Exam
            </button>
          </div>

          {/* Question card */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-slate-950 border border-slate-800 px-2 py-1 rounded-md text-slate-400">
                Question {currentQIdx + 1} of {activeExam.questions.length}
              </span>
            </div>

            <p className="text-slate-200 text-sm md:text-md leading-relaxed">
              {activeExam.questions[currentQIdx].question}
            </p>

            {/* Options list */}
            <div className="flex flex-col gap-2.5 pt-2">
              {activeExam.questions[currentQIdx].options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                const isCorrect = idx === activeExam.questions[currentQIdx].correctIndex;
                const isIncorrect = isSelected && !isCorrect;

                let btnStyle = "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700";
                
                if (answersSubmitted) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-950/40 border-emerald-500/60 text-emerald-300 font-semibold";
                  } else if (isIncorrect) {
                    btnStyle = "bg-rose-950/40 border-rose-500/60 text-rose-300";
                  } else {
                    btnStyle = "bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed";
                  }
                } else if (isSelected) {
                  btnStyle = "bg-cyan-950/60 border-cyan-500 text-cyan-300 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.1)]";
                }

                return (
                  <button
                    key={idx}
                    disabled={answersSubmitted}
                    onClick={() => setSelectedOpt(idx)}
                    className={`w-full text-left p-4 rounded-xl border text-xs transition flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {answersSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {answersSubmitted && isIncorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanatory notes */}
          {answersSubmitted && (
            <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1.5 animate-fade-in">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                Technical Justification Guide:
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                {activeExam.questions[currentQIdx].explanation}
              </p>
            </div>
          )}

          {/* Bottom control */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            {!answersSubmitted ? (
              <button
                onClick={submitAnswerHandler}
                disabled={selectedOpt === null}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs disabled:opacity-40 transition"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={nextQuestionHandler}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs transition flex items-center gap-1"
              >
                <span>{currentQIdx === activeExam.questions.length - 1 ? "Finish Exam" : "Next Question"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Finished exam summary splash */}
      {activeExam && examFinished && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 text-center max-w-md mx-auto animate-fade-in shadow-2xl">
          <div className="p-4 bg-cyan-950/60 text-cyan-400 border border-cyan-500/20 rounded-full inline-block">
            <Trophy className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Practice Exam Complete!</h3>
            <p className="text-slate-400 text-xs">You have completed all testing modules for:</p>
            <h4 className="text-sm font-bold text-cyan-300 font-mono">{activeExam.title}</h4>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Your Grade</span>
            <div className={`text-3xl font-black font-mono ${finishedScore >= 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {finishedScore}%
            </div>
            <span className="text-[11px] text-slate-400 block">
              {finishedScore >= 70 ? "🔥 SUCCESS: You passed the recommended baseline!" : "⚠️ baseline under 70%. Review the questions and retry!"}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => startExamHandler(activeExam)}
              className="w-full py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Retry Practice Exam</span>
            </button>

            {finishedScore === 100 && (
              <button
                onClick={() => setViewingCertificateExamId(activeExam.id)}
                className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <FileBadge className="w-4 h-4" />
                <span>Issue Honors Certificate</span>
              </button>
            )}

            <button
              onClick={() => {
                setActiveExam(null);
                setExamFinished(false);
              }}
              className="w-full py-2 bg-transparent text-slate-500 hover:text-slate-300 text-xs font-medium transition"
            >
              Back to Certifications Catalog
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
