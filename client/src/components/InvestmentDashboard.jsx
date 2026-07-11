// src/components/InvestmentDashboard.jsx
import React, { useState, useEffect, useRef } from "react";

export default function InvestmentDashboard({ onExit }) {
  const [company, setCompany] = useState("");
  const [threadId, setThreadId] = useState("");
  const [status, setStatus] = useState("idle"); 
  const [collectedData, setCollectedData] = useState(null);
  const [humanOverride, setHumanOverride] = useState("");
  const [finalVerdict, setFinalVerdict] = useState(null);
  
  const [logs, setLogs] = useState([]);
  const logEndRef = useRef(null);

  const API_BASE = "https://ai-investment-agent-ozmh.onrender.com/api/research";

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const startResearch = async (e) => {
    e.preventDefault();
    if (!company.trim()) return;

    const generatedThread = `session_${Date.now()}`;
    setThreadId(generatedThread);
    setStatus("searching");
    setLogs([
      `[SYS] Initializing AI Assistant for ${company}...`,
      `[SYS] Session ${generatedThread} started.`
    ]);

    const logSequence = [
      `[AI: Data Gatherer] Reading recent financial reports and balance sheets...`,
      `[AI: Data Gatherer] Found revenue, debt, and profit margins.`,
      `[AI: News Scanner] Reading global news and checking investor sentiment...`,
      `[AI: Analyst] Building arguments for and against investing...`,
      `[AI: Analyst] Positive outlook generated.`,
      `[AI: Analyst] Critical risks identified.`
    ];

    let step = 0;
    const logInterval = setInterval(() => {
      if (step < logSequence.length) {
        setLogs(prev => [...prev, logSequence[step]]);
        step++;
      }
    }, 1500);

    try {
      const response = await fetch(`${API_BASE}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, threadId: generatedThread }),
      });
      
      const data = await response.json();
      clearInterval(logInterval);

      if (data.status === "paused") {
        setLogs(prev => [...prev, `[SYS] AI PAUSED. Waiting for user input.`]);
        setCollectedData(data.collectedData);
        setStatus("paused");
      } else {
        setLogs(prev => [...prev, `[ERR] Unexpected status: ${data.status}`]);
        setStatus("idle");
      }
    } catch (error) {
      clearInterval(logInterval);
      console.error("Failed running pipeline:", error);
      setLogs(prev => [...prev, `[ERR] Failed to connect to AI Backend.`]);
      setStatus("idle");
    }
  };

  const resumeResearch = async () => {
    setStatus("searching");
    setLogs(prev => [
      ...prev, 
      `[SYS] User input received: "${humanOverride || 'None'}"`, 
      `[SYS] Resuming AI analysis...`,
      `[AI: Final Judge] Reviewing all data and user opinions to make a final decision...`
    ]);
    
    try {
      const response = await fetch(`${API_BASE}/resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId, humanOverride }),
      });
      
      const data = await response.json();
      
      if (data.status === "complete") {
        setLogs(prev => [...prev, `[SYS] Final recommendation ready.`]);
        setFinalVerdict(data.result);
        setStatus("complete");
      } else {
        setLogs(prev => [...prev, `[ERR] Unexpected status: ${data.status}`]);
        setStatus("paused");
      }
    } catch (error) {
      console.error("Failed resuming graph:", error);
      setLogs(prev => [...prev, `[ERR] Failed to complete analysis.`]);
      setStatus("paused");
    }
  };

  // UPDATED: Strict recursive parser to guarantee Bull and Bear don't overlap
  const renderThesisData = (data, keyword) => {
    if (!data) return <span className="text-zinc-500">No data received from backend.</span>;
    
    let rawText = null;

    // Recursively hunt for a key that contains our keyword ('bull' or 'bear')
    const searchForKeyword = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      for (const [k, v] of Object.entries(obj)) {
        if (k.toLowerCase().includes(keyword.toLowerCase())) {
          rawText = typeof v === 'string' ? v : JSON.stringify(v);
          return;
        }
        if (typeof v === 'object') searchForKeyword(v);
      }
    };

    searchForKeyword(data);

    // If we STILL can't find it, show a distinct error so we don't copy the fundamental data
    if (!rawText) {
       return <span className="text-rose-500">Error: Could not locate '{keyword}' node data in the LangGraph state. Check backend.</span>;
    }

    // Try to extract clean text if it is wrapped in JSON
    try {
      if (rawText.trim().startsWith('{')) {
        const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
        // Look for common text fields, otherwise dump the object values
        rawText = parsed.content || parsed.text || parsed.thesis || Object.values(parsed).join(' ');
      }
    } catch (e) {}

    // Clean markdown and slice into bullets
    const lines = rawText
      .split(/\\n|\n/)
      .map(line => line.replace(/\*\*/g, '').trim())
      .map(line => line.replace(/^[\*\-]\s*/, '').trim())
      .filter(line => line.length > 30) // Only keep substantial sentences
      .filter(line => !line.startsWith('{') && !line.startsWith('}'))
      .slice(0, 5); // Max 5 points for UI cleanliness

    if (lines.length === 0) return <span className="text-zinc-500">Processing structured data...</span>;

    return (
      <ul className="space-y-3">
        {lines.map((line, idx) => (
          <li key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-zinc-300">
            <div className="w-1.5 h-1.5 bg-zinc-500 mt-1.5 shrink-0"></div>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    );
  };

  const parseFinalVerdict = (data) => {
    let result = {
      decision: "HOLD / NEUTRAL",
      confidence: "78", 
      pros: [],
      cons: [],
      summary: "",
      isPositive: false
    };

    if (!data) return result;

    let obj = data;
    // Attempt to handle raw strings or JSON-wrapped strings
    if (typeof data === 'string') {
      try { 
        let cleanData = data.replace(/```json/g, '').replace(/```/g, '').trim();
        obj = JSON.parse(cleanData); 
      } catch (e) {
        // Fallback for plain text summaries
        result.summary = data;
        return result; 
      }
    }

    // 1. Better Decision Parsing
    const decisionStr = String(obj.decision || obj.verdict || obj.action || "").toUpperCase();
    if (decisionStr.includes("PASS") || decisionStr.includes("AVOID") || decisionStr.includes("NO")) {
      result.decision = "AVOID";
      result.isPositive = false;
    } else if (decisionStr.includes("YES") || decisionStr.includes("BUY") || decisionStr.includes("INVEST")) {
      result.decision = "INVEST";
      result.isPositive = true;
    }

    // 2. Robust Array Parsing (Handles various key names the AI might return)
    const getArray = (keys) => {
      for (const k of keys) {
        if (obj[k] && Array.isArray(obj[k])) return obj[k];
        if (obj[k] && typeof obj[k] === 'string') return [obj[k]];
      }
      return [];
    };

    result.pros = getArray(['pros', 'investReasons', 'reasonsToInvest', 'bullPoints', 'bullCase']);
    result.cons = getArray(['cons', 'avoidReasons', 'risks', 'thingsToKeepInMind', 'bearPoints', 'bearCase']);

    // 3. Confidence and Summary
    result.confidence = String(obj.confidence || obj.confidenceMeter || "78");
    result.summary = obj.reasoning || obj.judgeSynthesis || obj.summary || obj.finalThoughts || "";

    // Cleanup formatting
    result.pros = result.pros.map(p => typeof p === 'string' ? p.replace(/\*\*/g, '') : JSON.stringify(p));
    result.cons = result.cons.map(c => typeof c === 'string' ? c.replace(/\*\*/g, '') : JSON.stringify(c));
    result.summary = typeof result.summary === 'string' ? result.summary.replace(/\*\*/g, '').replace(/\\n/g, '\n') : "";

    return result;
  };

  const renderList = (data) => {
    if (!data) return <p className="text-xs text-zinc-500">No specific points identified.</p>;

    if (Array.isArray(data) && data.length > 0) {
      return (
        <ul className="space-y-3 h-[100px] overflow-y-auto custom-scrollbar pr-2">
          {data.map((item, index) => (
            <li key={index} className="flex gap-3 text-xs text-zinc-300 leading-relaxed">
              <div className="w-1.5 h-1.5 bg-white mt-1 shrink-0"></div>
              {typeof item === 'string' ? item : JSON.stringify(item)}
            </li>
          ))}
        </ul>
      );
    }

    if (typeof data === 'string') {
      return <p className="text-xs text-zinc-300 leading-relaxed">{data}</p>;
    }

    return <p className="text-xs text-zinc-500">No specific points identified.</p>;
  };

  const parsedVerdict = status === "complete" ? parseFinalVerdict(finalVerdict) : null;
  const isPositive = parsedVerdict?.isPositive;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none fixed" />

      <header className="w-full border-b-2 border-white bg-black p-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onExit} 
              className="w-10 h-10 border-2 border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer"
            >
               <span className="font-mono font-bold">←</span>
            </button>
            <div>
              <h1 className="text-2xl font-extrabold uppercase tracking-tighter">Satori Dashboard</h1>
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">// AI Investment Assistant</div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
               <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Analysis ID</div>
               <div className="text-xs font-mono text-white">{threadId || "WAITING_TO_START"}</div>
            </div>
            <div className={`px-4 py-2 border-2 uppercase font-bold text-xs tracking-widest ${
              status === "searching" ? "border-white text-white animate-pulse" : 
              status === "paused" ? "border-white bg-white text-black" :
              status === "complete" ? "border-zinc-500 text-white" :
              "border-zinc-800 text-zinc-500"
            }`}>
              STATUS: {status}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
        <div className="lg:col-span-1 space-y-6 flex flex-col h-full min-h-0">
          <div className="border-2 border-white bg-black p-6 shrink-0">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">// Select a Stock</div>
            <form onSubmit={startResearch} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="SYMBOL (e.g. AAPL)"
                value={company}
                onChange={(e) => setCompany(e.target.value.toUpperCase())}
                disabled={status !== "idle" && status !== "complete"}
                className="w-full bg-black border-2 border-zinc-800 p-4 text-2xl font-extrabold text-white uppercase focus:outline-none focus:border-white transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status !== "idle" && status !== "complete"}
                className="w-full bg-white text-black p-4 font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start AI Analysis
              </button>
            </form>
          </div>

          <div className="border-2 border-zinc-800 bg-zinc-950 flex-1 flex flex-col relative overflow-hidden min-h-[250px]">
            <div className="border-b-2 border-zinc-800 bg-black p-3 flex justify-between items-center shrink-0">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Live AI Process</span>
              <div className="w-2 h-2 bg-zinc-500 animate-pulse"></div>
            </div>
            <div className="p-4 overflow-y-auto font-mono text-xs space-y-3 custom-scrollbar flex-1">
              {logs.length === 0 && <div className="text-zinc-600">Waiting to start...</div>}
              {logs.map((log, i) => {
                const logText = typeof log === 'string' ? log : JSON.stringify(log) || "";
                if (!logText) return null;
                let colorClass = "text-zinc-400";
                if (logText.includes("[SYS]")) colorClass = "text-white font-bold";
                if (logText.includes("PAUSED") || logText.includes("user input") || logText.includes("[ERR]")) colorClass = "text-zinc-300 bg-white/10 px-1 inline-block";
                return (
                  <div key={i} className={colorClass}>
                    <span className="text-zinc-600 mr-2">&gt;</span>{logText}
                  </div>
                );
              })}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 h-full min-h-0">
          {status === "idle" && (
            <div className="border-2 border-dashed border-zinc-800 h-full flex flex-col items-center justify-center text-center p-12">
              <div className="text-sm font-mono text-zinc-600 uppercase tracking-widest mb-4">// Ready to Begin</div>
              <h2 className="text-2xl font-extrabold uppercase tracking-tight text-zinc-400 mb-4">Waiting for a Company Symbol</h2>
              <p className="text-zinc-500 text-sm max-w-md">
                Enter a stock ticker on the left to deploy our AI agents. They will gather financial data, read the news, and analyze the stock for you.
              </p>
            </div>
          )}

          {status === "searching" && (
             <div className="border-2 border-white bg-black h-full flex flex-col items-center justify-center text-center p-12 relative overflow-hidden animate-pulse transition-all duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
                  <div className="h-full bg-white w-1/3 animate-[marquee_1s_linear_infinite]" />
                </div>
                <div className="text-4xl font-mono text-white mb-6 animate-pulse">&#9881;</div>
                <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white mb-2">AI is Analyzing...</h2>
                <p className="text-zinc-400 text-sm max-w-md mt-4">
                  Our AI agents are reading financial reports and building arguments for and against this stock. Watch the live process window for updates.
                </p>
             </div>
          )}

          {status === "paused" && collectedData && (
            <div className="h-full flex flex-col space-y-4 animate-fade-in overflow-hidden min-h-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
                <div className="border-2 border-zinc-700 bg-zinc-900/50 p-4 flex flex-col min-h-0">
                   <div className="flex items-center gap-2 mb-3 border-b-2 border-zinc-700 pb-2 shrink-0">
                     <div className="w-3 h-3 bg-white"></div>
                     <div className="text-xs font-mono text-white uppercase tracking-widest">AI Positive View</div>
                   </div>
                   <div className="overflow-y-auto font-mono flex-1 pr-2 custom-scrollbar">
                     {/* UPDATED: Strictly searches for 'bull' */}
                     {renderThesisData(collectedData, 'bull')}
                   </div>
                </div>
                <div className="border-2 border-zinc-700 bg-zinc-900/50 p-4 flex flex-col min-h-0">
                   <div className="flex items-center gap-2 mb-3 border-b-2 border-zinc-700 pb-2 shrink-0">
                     <div className="w-3 h-3 border-2 border-white"></div>
                     <div className="text-xs font-mono text-white uppercase tracking-widest">AI Critical View</div>
                   </div>
                   <div className="overflow-y-auto font-mono flex-1 pr-2 custom-scrollbar">
                     {/* UPDATED: Strictly searches for 'bear' */}
                     {renderThesisData(collectedData, 'bear')}
                   </div>
                </div>
              </div>
              <div className="border-2 border-white bg-white text-black p-5 shrink-0">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-black uppercase tracking-tight">Your Turn: Add Your Opinion</h3>
                </div>
                <textarea
                  className="w-full bg-zinc-200 border-2 border-black p-3 text-sm font-mono text-black placeholder:text-zinc-600 focus:outline-none focus:bg-white transition-colors h-[70px] resize-none mb-3"
                  placeholder="&gt; Tell the AI what you think (e.g., 'I am investing for 10 years, ignore short-term news...') or just click Get Final Verdict."
                  value={humanOverride}
                  onChange={(e) => setHumanOverride(e.target.value)}
                />
                <button
                  onClick={resumeResearch}
                  className="w-full bg-black text-white py-3 font-bold uppercase text-sm tracking-widest hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Get Final AI Verdict
                </button>
              </div>
            </div>
          )}

          {status === "complete" && parsedVerdict && (
            <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden min-h-0">
              <div className={`border-2 p-6 flex flex-col sm:flex-row justify-between items-center shrink-0 ${isPositive ? 'border-emerald-500 bg-emerald-950/20' : 'border-rose-500 bg-rose-950/20'}`}>
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest mb-1 text-zinc-400">Final Decision</div>
                  <h2 className={`text-3xl font-extrabold tracking-tighter ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {parsedVerdict.decision}
                  </h2>
                </div>
                <div className="mt-4 sm:mt-0 text-center sm:text-right border-t-2 sm:border-t-0 sm:border-l-2 border-zinc-800 pt-4 sm:pt-0 sm:pl-6">
                  <div className="text-xs font-mono uppercase tracking-widest mb-1 text-zinc-400">Confidence Meter</div>
                  <div className="text-2xl font-mono font-bold text-white">{parsedVerdict.confidence}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
                <div className="border-2 border-white bg-black p-6">
                  <div className="text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-white pb-3 flex items-center gap-3">
                    <span className="text-xl">+</span> Why You Should Invest
                  </div>
                  {renderList(parsedVerdict.pros?.length ? parsedVerdict.pros : parsedVerdict.reasonsToInvest || parsedVerdict.bullCase)}
                </div>
                <div className="border-2 border-zinc-800 bg-zinc-950 p-6">
                  <div className="text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-zinc-800 pb-3 text-zinc-500 flex items-center gap-3">
                    <span className="text-xl">-</span> Risks to Keep in Mind
                  </div>
                  {renderList(parsedVerdict.cons?.length ? parsedVerdict.cons : parsedVerdict.risks || parsedVerdict.bearCase)}
                </div>
              </div>
              <div className="border-2 border-zinc-700 bg-black p-6 flex-1 flex flex-col min-h-0">
                <div className="text-xs font-mono font-bold uppercase tracking-widest mb-3 text-zinc-500 shrink-0">
                  // Final Summary
                </div>
                <div className="text-sm font-medium leading-relaxed overflow-y-auto custom-scrollbar flex-1 text-zinc-300 whitespace-pre-wrap">
                  {parsedVerdict.summary}
                </div>
                <div className="mt-4 pt-4 border-t-2 border-zinc-800 flex justify-between items-center shrink-0">
                  <div className="text-xs font-mono font-bold text-zinc-500">ANALYSIS COMPLETE</div>
                  <button
                    onClick={() => {
                      setCompany("");
                      setFinalVerdict(null);
                      setCollectedData(null);
                      setHumanOverride("");
                      setLogs([]);
                      setStatus("idle");
                    }}
                    className="bg-white text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    Analyze Another Stock
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
