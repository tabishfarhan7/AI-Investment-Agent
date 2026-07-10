// src/components/SessionArchive.jsx
import React, { useState, useEffect } from "react";

export default function SessionArchive({ onExit }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ensure this matches your backend URL
  const API_URL = "http://localhost:5000/api/sessions"; 

  const normalizeVerdict = (session) => {
    const verdict = String(session.verdict || "").toUpperCase();
    if (verdict.includes("PASS") || verdict.includes("AVOID") || verdict.includes("NO") || verdict.includes("SELL")) {
      return { label: "AVOID", isPositive: false };
    }
    if (verdict.includes("YES") || verdict.includes("BUY") || verdict.includes("INVEST")) {
      return { label: "INVEST", isPositive: true };
    }
    return { label: session.verdict || "PENDING", isPositive: Boolean(session.is_positive) };
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch database records");
        const data = await response.json();
        setSessions(data);
      } catch (err) {
        console.error(err);
        setError("Failed to connect to PostgreSQL database.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black flex flex-col relative overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none fixed" />

      {/* DASHBOARD HEADER */}
      <header className="w-full border-b-2 border-white bg-black p-6 relative z-10 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onExit} 
              className="w-10 h-10 border-2 border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer shrink-0"
            >
               <span className="font-mono font-bold">←</span>
            </button>
            <div>
              <h1 className="text-2xl font-extrabold uppercase tracking-tighter">PostgreSQL Archive</h1>
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">// LangGraph State Memory</div>
            </div>
          </div>
          
          <div className={`px-4 py-2 border-2 uppercase font-bold text-xs tracking-widest ${error ? 'border-rose-500 text-rose-500' : 'border-white text-white'}`}>
            DB: {error ? "DISCONNECTED" : loading ? "CONNECTING..." : "CONNECTED"}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 relative z-10 flex flex-col gap-6">
        
        <div className="border-2 border-zinc-800 bg-zinc-950 p-8">
          <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">
            // System Architecture Context
          </div>
          <h2 className="text-2xl font-extrabold uppercase tracking-tighter text-white mb-2">
            Why do we need a database?
          </h2>
          <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
            When the Satori AI pauses for the Human-in-the-Loop check, the workflow completely halts. 
            To prevent data loss, the entire neural mesh state is serialized and securely written to a PostgreSQL database using <span className="text-white font-mono bg-zinc-900 px-1">@langchain/langgraph-checkpoint-postgres</span>. 
            This allows seamless resumption of analysis across different browser sessions.
          </p>
        </div>

        <div className="border-2 border-white bg-black flex flex-col overflow-hidden">
          <div className="border-b-2 border-white p-4 bg-zinc-950 flex justify-between items-center">
            <div className="text-xs font-mono font-bold uppercase tracking-widest">SELECT * FROM ai_sessions ORDER BY created_at DESC;</div>
            <div className="flex gap-2">
                 <div className="w-3 h-3 bg-white"></div>
                 <div className="w-3 h-3 border border-white"></div>
            </div>
          </div>
          
          <div className="overflow-x-auto min-h-[200px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-zinc-800 bg-zinc-950/50">
                  <th className="p-4 text-xs font-mono text-zinc-500 uppercase tracking-widest">Date</th>
                  <th className="p-4 text-xs font-mono text-zinc-500 uppercase tracking-widest">Session ID</th>
                  <th className="p-4 text-xs font-mono text-zinc-500 uppercase tracking-widest">Target</th>
                  <th className="p-4 text-xs font-mono text-zinc-500 uppercase tracking-widest">Verdict</th>
                  <th className="p-4 text-xs font-mono text-zinc-500 uppercase tracking-widest">Confidence</th>
                  <th className="p-4 text-xs font-mono text-zinc-500 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm">
                {loading && (
                  <tr><td colSpan="6" className="p-8 text-center text-zinc-500 animate-pulse">Querying PostgreSQL Database...</td></tr>
                )}
                
                {error && (
                  <tr><td colSpan="6" className="p-8 text-center text-rose-500">{error}</td></tr>
                )}

                {!loading && !error && sessions.length === 0 && (
                  <tr><td colSpan="6" className="p-8 text-center text-zinc-500">No past sessions found in database.</td></tr>
                )}

                {!loading && sessions.map((session, i) => {
                  const verdict = normalizeVerdict(session);

                  return (
                    <tr key={session.id || i} className={`border-b border-zinc-800 hover:bg-zinc-900 transition-colors ${i === 0 ? 'bg-zinc-950/30' : ''}`}>
                      {/* Safely format date if coming from DB timestamp */}
                      <td className="p-4 text-zinc-400">{new Date(session.created_at || session.date).toLocaleDateString()}</td>
                      <td className="p-4 text-zinc-500 text-xs">{session.session_id || session.id}</td>
                      <td className="p-4 font-bold text-white">{session.ticker || session.company}</td>
                      <td className={`p-4 font-bold ${verdict.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {verdict.label}
                      </td>
                      <td className="p-4 text-zinc-300">{session.confidence || "--"}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[10px] font-bold tracking-widest uppercase ${
                          session.status === 'COMPLETE' ? 'bg-white text-black' : 'border border-amber-500 text-amber-500'
                        }`}>
                          {session.status || "UNKNOWN"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
