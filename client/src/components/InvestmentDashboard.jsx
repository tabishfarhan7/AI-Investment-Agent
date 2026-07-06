// src/components/InvestmentDashboard.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Database, LayoutTemplate, Settings, Terminal, ChevronRight, Play, Square, Code, LineChart } from "lucide-react";
import { cn } from "../lib/utils"; // Import our utility

export default function InvestmentDashboard({ onExit }) {
  const [company, setCompany] = useState("");
  const [threadId, setThreadId] = useState("");
  const [status, setStatus] = useState("idle"); 
  const [collectedData, setCollectedData] = useState(null);
  const [humanOverride, setHumanOverride] = useState("");
  const [finalVerdict, setFinalVerdict] = useState(null);

  // For the UI Sidebar
  const [activeTab, setActiveTab] = useState("terminal");

  const API_BASE = "http://localhost:5000/api/research";

  const startResearch = async (e) => {
    e.preventDefault();
    if (!company.trim()) return;

    const generatedThread = `thread_${Date.now()}`;
    setThreadId(generatedThread);
    setStatus("searching");

    try {
      const response = await fetch(`${API_BASE}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, threadId: generatedThread }),
      });
      const data = await response.json();

      if (data.status === "paused") {
        setCollectedData(data.collectedData);
        setStatus("paused");
      }
    } catch (error) {
      console.error("Failed running pipeline:", error);
      setStatus("idle");
    }
  };

  const resumeResearch = async () => {
    setStatus("searching");
    try {
      const response = await fetch(`${API_BASE}/resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId, humanOverride }),
      });
      const data = await response.json();

      if (data.status === "complete") {
        setFinalVerdict(data.result);
        setStatus("complete");
      }
    } catch (error) {
      console.error("Failed resuming graph:", error);
      setStatus("paused");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans flex flex-col overflow-hidden selection:bg-blue-500/30">
      
      {/* Top Application Bar */}
      <header className="h-14 border-b border-white/5 bg-[#0a0a0c] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onExit}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-white/5 transition-colors group"
          >
             <div className="w-3 h-3 border-t-2 border-l-2 border-zinc-500 group-hover:border-zinc-300 transform -rotate-45" />
          </button>
          
          <div className="h-4 w-[1px] bg-white/10" />
          
          <div className="flex items-center gap-2 text-sm">
             <div className="w-4 h-4 rounded-[4px] bg-gradient-to-tr from-blue-600 to-indigo-400"></div>
             <span className="font-semibold text-white tracking-wide">Kaizen</span>
             <ChevronRight className="w-4 h-4 text-zinc-600" />
             <span className="text-zinc-500 font-medium">analysis_protocol</span>
          </div>
        </div>

        {/* Global Status Badge */}
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold border",
            status === "searching" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
            status === "paused" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
            status === "complete" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
            "bg-white/5 border-white/10 text-zinc-400"
          )}>
            {status === "searching" && <Activity className="w-3.5 h-3.5 animate-pulse" />}
            {status === "paused" && <Square className="w-3.5 h-3.5" />}
            {status === "complete" && <Play className="w-3.5 h-3.5" />}
            SYSTEM: {status.toUpperCase()}
          </div>
        </div>
      </header>

      {/* Main Application Area (Sidebar + Content) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar (Navigation) */}
        <aside className="w-16 border-r border-white/5 bg-[#0a0a0c] flex flex-col items-center py-4 gap-4 z-20">
          <SidebarIcon icon={Terminal} label="Terminal" active={activeTab === "terminal"} onClick={() => setActiveTab("terminal")} />
          <SidebarIcon icon={Database} label="Data Store" active={activeTab === "data"} onClick={() => setActiveTab("data")} />
          <SidebarIcon icon={LineChart} label="Metrics" active={activeTab === "metrics"} onClick={() => setActiveTab("metrics")} />
          
          <div className="flex-1" /> {/* Spacer */}
          
          <SidebarIcon icon={Settings} label="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
        </aside>

        {/* Second Sidebar (Contextual Menu) - Hidden on mobile */}
        <aside className="hidden md:flex w-64 border-r border-white/5 bg-[#0a0a0c]/50 flex-col py-4 z-10">
          <div className="px-4 mb-4">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Explorer</h2>
          </div>
          
          <div className="flex flex-col space-y-0.5">
            <ExplorerItem title="1_Initialize_Agents" active={status === "idle"} />
            <ExplorerItem title="2_Data_Retrieval" active={status === "searching"} />
            <ExplorerItem title="3_Human_Validation" active={status === "paused"} />
            <ExplorerItem title="4_Final_Synthesis" active={status === "complete"} />
          </div>
        </aside>

        {/* Main Content / Canvas */}
        <main className="flex-1 relative overflow-y-auto bg-[#050505]">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
          
          <div className="p-8 max-w-4xl mx-auto relative z-10">
            
            <AnimatePresence mode="wait">
              {/* STAGE 1: IDLE */}
              {status === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="border border-white/10 rounded-xl bg-[#0a0a0c]/80 backdrop-blur-md overflow-hidden shadow-2xl">
                    <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                      <Code className="w-4 h-4 text-blue-400" />
                      <h2 className="text-sm font-semibold text-white">run_valuation.sh</h2>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-zinc-400 mb-6 font-medium">
                        Enter target equity ticker. System will deploy parallel agents for fundamental extraction and thesis generation.
                      </p>
                      <form onSubmit={startResearch} className="flex gap-3">
                        <input
                          type="text"
                          placeholder="e.g., TSLA, AAPL..."
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium placeholder:text-zinc-600"
                        />
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                        >
                          Execute Payload
                        </button>
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STAGE 2: SEARCHING / LOADING */}
              {status === "searching" && (
                <motion.div
                  key="searching"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="border border-blue-500/20 rounded-xl bg-[#0a0a0c]/80 backdrop-blur-md overflow-hidden shadow-[0_0_40px_rgba(37,99,235,0.1)] relative">
                    {/* Scanning line animation */}
                    <motion.div 
                      className="absolute left-0 right-0 h-[2px] bg-blue-500/50 shadow-[0_0_10px_rgba(37,99,235,0.8)]"
                      initial={{ top: 0 }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    
                    <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-400" />
                      <h2 className="text-sm font-semibold text-white">Agent_Mesh_Executing</h2>
                    </div>
                    <div className="p-8 space-y-4">
                      {/* Fake Terminal Logs */}
                      <TerminalLog text="[SYS] Initializing LangGraph checkpointer..." delay={0} />
                      <TerminalLog text="[AGENT:Fundamental] Fetching SEC filings & balance sheets..." delay={0.5} />
                      <TerminalLog text="[AGENT:Sentiment] Analyzing real-time news velocity..." delay={1} />
                      <TerminalLog text="[AGENT:Bull/Bear] Generating synthetic thesis nodes..." delay={1.5} />
                      
                      <div className="mt-8 space-y-3 animate-pulse opacity-50">
                        <div className="h-2 bg-white/10 rounded-full w-3/4"></div>
                        <div className="h-2 bg-white/10 rounded-full w-1/2"></div>
                        <div className="h-2 bg-white/10 rounded-full w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STAGE 3: HUMAN INTERRUPT */}
              {status === "paused" && collectedData && (
                <motion.div
                  key="paused"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Extracted Data Panel */}
                  <div className="border border-white/10 rounded-xl bg-[#0a0a0c]/80 backdrop-blur-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-zinc-400" />
                        <h2 className="text-sm font-semibold text-white">{collectedData.companyName} : Raw_Output</h2>
                      </div>
                      <span className="text-xs text-zinc-500 font-mono">id: {threadId.slice(-6)}</span>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-full">
                         <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Fundamentals</h3>
                         <div className="bg-black/50 border border-white/5 p-4 rounded-lg text-xs font-mono text-zinc-300 h-32 overflow-y-auto">
                           {collectedData.fundamentals}
                         </div>
                      </div>
                      
                      <div>
                         <h3 className="text-xs font-bold text-emerald-500/70 uppercase tracking-wider mb-2">Node: Bull</h3>
                         <div className="bg-emerald-950/10 border border-emerald-500/10 p-4 rounded-lg text-xs font-mono text-emerald-400/80 h-48 overflow-y-auto">
                           {collectedData.bullThesis}
                         </div>
                      </div>
                      
                      <div>
                         <h3 className="text-xs font-bold text-rose-500/70 uppercase tracking-wider mb-2">Node: Bear</h3>
                         <div className="bg-rose-950/10 border border-rose-500/10 p-4 rounded-lg text-xs font-mono text-rose-400/80 h-48 overflow-y-auto">
                           {collectedData.bearThesis}
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Override Form */}
                  <div className="border border-amber-500/30 rounded-xl bg-amber-950/10 overflow-hidden relative shadow-[0_0_30px_rgba(245,158,11,0.05)]">
                    <div className="px-6 py-4 border-b border-amber-500/20 flex items-center gap-2 bg-amber-500/5">
                      <Settings className="w-4 h-4 text-amber-500" />
                      <h2 className="text-sm font-semibold text-amber-500">Judge_Override_Required</h2>
                    </div>
                    
                    <div className="p-6">
                      <textarea
                        className="w-full bg-black/60 border border-amber-500/20 rounded-lg p-4 text-sm font-mono text-amber-100 focus:outline-none focus:border-amber-500/50 transition-all min-h-[100px] resize-none mb-6 placeholder:text-amber-700/50"
                        placeholder="// Inject custom constraints before final synthesis..."
                        value={humanOverride}
                        onChange={(e) => setHumanOverride(e.target.value)}
                      />
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setStatus("idle")}
                          className="px-6 py-2.5 rounded-lg text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          Abort
                        </button>
                        <button
                          onClick={resumeResearch}
                          className="bg-amber-500 text-black px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                        >
                          Execute Synthesis
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STAGE 4: COMPLETE */}
              {status === "complete" && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="border border-white/10 rounded-xl bg-[#0a0a0c]/80 backdrop-blur-md overflow-hidden shadow-2xl relative">
                    {/* Success subtle glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[100px] bg-blue-500/20 blur-[60px]" />
                    
                    <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2 bg-white/[0.02] relative z-10">
                      <Terminal className="w-4 h-4 text-white" />
                      <h2 className="text-sm font-semibold text-white">Final_Verdict.json</h2>
                    </div>
                    
                    <div className="p-6 relative z-10">
                      <div className="bg-[#050505] border border-white/10 p-6 rounded-lg text-sm font-mono text-blue-300/90 whitespace-pre-wrap overflow-x-auto">
                        {finalVerdict ? JSON.stringify(finalVerdict, null, 2) : "Error"}
                      </div>
                      
                      <div className="mt-8 flex justify-end">
                        <button
                          onClick={() => {
                            setCompany("");
                            setFinalVerdict(null);
                            setCollectedData(null);
                            setHumanOverride("");
                            setStatus("idle");
                          }}
                          className="bg-white text-black px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors"
                        >
                          Reset Pipeline
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>
        </main>
      </div>
    </div>
  );
}

// --- Small Helper Components ---

function SidebarIcon({ icon: Icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "relative p-3 rounded-xl transition-all duration-200 group flex items-center justify-center",
        active ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
      )}
      title={label}
    >
      <Icon className="w-5 h-5 stroke-[1.5]" />
      {active && (
        <motion.div 
          layoutId="active-sidebar"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full"
        />
      )}
    </button>
  );
}

function ExplorerItem({ title, active }) {
  return (
    <div className={cn(
      "px-4 py-1.5 flex items-center gap-2 text-sm cursor-default transition-colors",
      active ? "text-blue-400 bg-blue-500/10 border-r-2 border-blue-500" : "text-zinc-500"
    )}>
      <div className={cn("w-1.5 h-1.5 rounded-full", active ? "bg-blue-400" : "bg-zinc-700")} />
      <span className="font-mono text-xs">{title}</span>
    </div>
  );
}

function TerminalLog({ text, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="text-xs font-mono text-zinc-400 flex items-start gap-3"
    >
      <span className="text-blue-500/50 mt-0.5">❯</span>
      {text}
    </motion.div>
  );
}