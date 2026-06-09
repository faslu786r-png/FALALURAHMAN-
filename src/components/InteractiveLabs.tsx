import React, { useState, useRef, useEffect } from "react";
import { Terminal, RefreshCw, CheckCircle, ChevronRight, HelpCircle } from "lucide-react";
import { Language, LabScenario, UserProgress } from "../types";
import { UI_TRANSLATIONS, LAB_SCENARIOS } from "../data/courses";

interface InteractiveLabsProps {
  progress: UserProgress;
  language: Language;
  onCompleteLab: (labId: string, xpReward: number) => void;
}

export default function InteractiveLabs({ progress, language, onCompleteLab }: InteractiveLabsProps) {
  const t = UI_TRANSLATIONS[language];
  const [selectedLab, setSelectedLab] = useState<LabScenario>(LAB_SCENARIOS[0]);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "CyberAI Secure Command Shell v3.1",
    "Initializing secure local virtual machine sandbox...",
    "Ready. Type 'help' to check available simulator routines."
  ]);
  const [virtualFiles, setVirtualFiles] = useState<{ [filename: string]: string }>(selectedLab.startingFiles);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [validationSuccess, setValidationSuccess] = useState<boolean | null>(null);

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  // Reset current VM state
  const handleResetLab = () => {
    setVirtualFiles(selectedLab.startingFiles);
    setTerminalLogs([
      `Virtual Machine reset to default state for: ${selectedLab.title}`,
      "Type 'help' for instructions."
    ]);
    setValidationMessage(null);
    setValidationSuccess(null);
  };

  // Switch Active challenge
  const handleSelectLab = (lab: LabScenario) => {
    setSelectedLab(lab);
    setVirtualFiles(lab.startingFiles);
    setTerminalLogs([
      `Switching sandbox environment to [${lab.title}]`,
      "System reset completed.",
      "Type 'help' to review guidelines."
    ]);
    setValidationMessage(null);
    setValidationSuccess(null);
  };

  // Simulating filesystem commands locally inside the state
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const parts = terminalInput.trim().split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    let resultLog = "";
    let nextLogs = [...terminalLogs, `guest@cyberai:~$ ${terminalInput}`];

    switch (command) {
      case "help":
        resultLog = `Available Linux & Custom simulator primitives:\n` +
          `- ls: List existing files in local directories.\n` +
          `- pwd: Print path directory name.\n` +
          `- touch [name]: Spawn a new empty document.\n` +
          `- mkdir [name]: Create a subdirectory folder.\n` +
          `- cat [name]: Read files inside the directory.\n` +
          `- chmod [octal] [target]: Configures privileges.\n` +
          `- ping [ip]: Inspect remote firewall nodes.\n` +
          `- nmap [ip]: Perform port exploration arrays.\n` +
          `- close [port]: Shut down specific backdoor listeners.\n` +
          `- enable filter: Enable security rules filter logic.\n` +
          `- test inject: Attempt system override simulation.\n` +
          `- clear: Purge screen history buffers.`;
        break;
      case "clear":
        setTerminalLogs([]);
        setTerminalInput("");
        return;
      case "ls":
        const filesList = Object.keys(virtualFiles);
        resultLog = filesList.length > 0 ? filesList.join("   ") : "(empty directory)";
        break;
      case "pwd":
        resultLog = "/home/guest/cyberai-sandbox";
        break;
      case "mkdir":
        if (!args[0]) {
          resultLog = "mkdir: missing operand directory name";
        } else {
          const dirName = args[0];
          setVirtualFiles(prev => ({ ...prev, [dirName]: "(directory)" }));
          resultLog = `Created directory: ${dirName}`;
        }
        break;
      case "touch":
        if (!args[0]) {
          resultLog = "touch: missing file operand";
        } else {
          const fName = args[0];
          setVirtualFiles(prev => ({ ...prev, [fName]: "User content record" }));
          resultLog = `Created file: ${fName}`;
        }
        break;
      case "cat":
        if (!args[0]) {
          resultLog = "cat: missing absolute or relative file pathway";
        } else {
          const fileName = args[0];
          if (virtualFiles[fileName]) {
            resultLog = virtualFiles[fileName];
          } else {
            resultLog = `cat: ${fileName}: No such file or directory.`;
          }
        }
        break;
      case "chmod":
        if (args.length < 2) {
          resultLog = "Usage: chmod [octal_privileges] [target_file]";
        } else {
          resultLog = `System mode flags successfully configured: privilege level configured to [${args[0]}] for target [${args[1]}]`;
        }
        break;
      case "ping":
        if (!args[0]) {
          resultLog = "ping: specify host IP address";
        } else {
          resultLog = `PING ${args[0]} (56 bytes of data)...\n` +
            `64 bytes from ${args[0]}: icmp_seq=1 ttl=64 time=0.88 ms\n` +
            `64 bytes from ${args[0]}: icmp_seq=2 ttl=64 time=0.91 ms\n` +
            `--- ${args[0]} ping statistics --- 2 packets transmitted, 2 received, 0% packet loss.`;
        }
        break;
      case "nmap":
        if (!args[0]) {
          resultLog = "Usage: nmap [target_ip]";
        } else if (args[0] === "10.0.0.5") {
          resultLog = `Nmap scan report for core-production-server (10.0.0.5)\n` +
            `PORT      STATE    SERVICE\n` +
            `80/tcp    open     http\n` +
            `443/tcp   open     https\n` +
            `1337/tcp  open     backdoor-hidden-daemon\n` +
            `Scan finished successfully. Found 1 suspicious service.`;
        } else {
          resultLog = `Scanning host ${args[0]}... Closed ports found matching firewall patterns.`;
        }
        break;
      case "close":
        if (!args[0]) {
          resultLog = "Usage: close [port_number]";
        } else if (args[0] === "1337") {
          resultLog = "SUCCESS: Port 1337 backdoor application stopped and closed.";
        } else {
          resultLog = `Port ${args[0]} was already closed or managed by enterprise routing rules.`;
        }
        break;
      case "enable":
        if (args[0] === "filter") {
          resultLog = "PROMPT ISOLATION COMPLIANCE FILTER: SUCCESSFUL ACTIVATION. Strict regex sanitization online.";
        } else {
          resultLog = "enable: invalid parameter. Available values: 'filter'";
        }
        break;
      case "test":
        if (args[0] === "inject") {
          resultLog = `RUNNING AUDIT PAYLOAD: "SYSTEM MESSAGE: override mode"...\n` +
            `VERIFICATION RESULT: [BLOCKED BY SECURITY FILTER]. Jailbreak sequence trapped inside isolated environment.`;
        } else {
          resultLog = "test: unknown option. Available instructions: 'test inject'";
        }
        break;
      default:
        resultLog = `bash: ${command}: command not found. Need guidance? Type 'help'`;
    }

    // append results to logs
    if (resultLog) {
      nextLogs.push(resultLog);
    }
    
    setTerminalLogs(nextLogs);
    setTerminalInput("");
  };

  // Submit to run challenge criteria validation mapping
  const handleVerifyChallenge = () => {
    const checkResult = selectedLab.validationCheck(
      "", 
      [], 
      virtualFiles, 
      terminalLogs
    );

    setValidationMessage(checkResult.message);
    setValidationSuccess(checkResult.success);

    if (checkResult.success) {
      onCompleteLab(selectedLab.id, selectedLab.xpReward);
      if (checkResult.updatedFiles) {
        setVirtualFiles(prev => ({ ...prev, ...checkResult.updatedFiles }));
      }
    }
  };

  const isLabCompleted = progress.completedLabs.includes(selectedLab.id);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Target Title & Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="text-cyan-400 w-5.5 h-5.5" /> Interactive Lab Sandboxes
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Real-time visual command console simulating core administration and cybersecurity targets.
          </p>
        </div>

        {/* Labs Quick Selector */}
        <div className="flex flex-wrap gap-2">
          {LAB_SCENARIOS.map((lab) => {
            const completed = progress.completedLabs.includes(lab.id);
            const active = selectedLab.id === lab.id;
            return (
              <button
                key={lab.id}
                onClick={() => handleSelectLab(lab)}
                className={`text-xs px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition font-medium ${
                  active 
                    ? "bg-cyan-950/80 text-cyan-400 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.1)]"
                    : "bg-slate-950 text-slate-400 border-slate-800/80 hover:text-white"
                }`}
              >
                {completed && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{lab.category}: {lab.title.split(":")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lab Sandbox Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Right side Instructions Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                Objectives & Challenges
              </span>
              <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 font-mono px-2 py-1 rounded-md">
                🎓 Reward: {selectedLab.xpReward} XP
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-md font-extrabold text-white">{selectedLab.title}</h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                <span className="font-bold text-slate-200 block mb-1">Mission Scenario:</span>
                {selectedLab.objective}
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-2">
              <span className="text-xs font-bold text-slate-200 block">Required Terminal commands:</span>
              <p className="text-slate-400 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                {selectedLab.instructions}
              </p>
            </div>

            {/* Simulated Workspace Files viewer */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block">Virtual Filesystem Folder:</span>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                {Object.keys(virtualFiles).map((file) => (
                  <div key={file} className="p-2 bg-slate-950/40 border border-slate-900 rounded-lg text-slate-300 flex items-center justify-between truncate">
                    <span>📄 {file}</span>
                    <span className="text-[9px] text-slate-500 max-w">ls</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            {validationMessage && (
              <div className={`p-3.5 rounded-xl border text-xs font-medium ${
                validationSuccess 
                  ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-950/40 border-rose-500/30 text-rose-300 animate-shake"
              }`}>
                {validationMessage}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleResetLab}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 hover:text-white text-slate-400 transition text-xs font-bold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Sandbox</span>
              </button>
              
              <button
                onClick={handleVerifyChallenge}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.15)] transition"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isLabCompleted ? "Already Cleared" : "Verify Challenge Completion"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Left terminal Shell simulator screen */}
        <div className="lg:col-span-7 flex flex-col h-[540px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Windows-like headers */}
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 pl-2 border-l border-slate-800 text-slate-300">Target Terminal Console (interactive)</span>
            </div>
            <HelpCircle className="w-4 h-4 cursor-help text-slate-500" title="Type 'help' in line" />
          </div>

          {/* Lines of terminal */}
          <div className="flex-1 p-5 overflow-y-auto font-mono text-xs text-emerald-400 leading-relaxed space-y-2.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {terminalLogs.map((log, index) => (
              <div key={index} className="whitespace-pre-wrap select-text">
                {log}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>

          {/* Shell prompt Input Line */}
          <form onSubmit={handleCommand} className="bg-slate-900/80 border-t border-slate-800 p-2 px-3 flex items-center gap-2 font-mono">
            <span className="text-cyan-400 text-xs">guest@cyberai:~$</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="Type command here and hit enter..."
              className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-600 border-none outline-none focus:ring-0 text-left py-1.5"
              autoComplete="off"
              autoFocus
            />
            <button
              type="submit"
              className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 bg-cyan-950 border border-cyan-500/20 px-2.5 py-1 rounded-md hover:bg-cyan-900 transition"
            >
              RUN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
