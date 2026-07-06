// src/components/LandingPage.jsx
import React from "react";

export default function LandingPage({ onLaunch }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden font-sans">
      
      {/* 1. THE MASSIVE CENTER GLOW */}
      <div className="absolute top-[-20%] left-1/2 transform -translate-x-1/2 w-[1000px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[-10%] left-1/2 transform -translate-x-1/2 w-[600px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* 2. MINIMALIST NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full relative z-10 border-b border-white/5">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20 transform translate-y-1/2 rotate-45"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Kaizen</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Agents</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex gap-4 items-center">
          <button className="text-sm font-medium text-zinc-400 hover:text-white hidden md:block cursor-pointer">
            Log in
          </button>
          <button 
            onClick={onLaunch}
            className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors cursor-pointer"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <main className="flex-1 flex flex-col items-center text-center px-6 relative z-10 mt-20 md:mt-32">
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-blue-300 mb-8 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"></span>
          Powered by LangGraph & Gemini 2.5
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1] mb-6 text-white">
          Intelligent investment <br /> solutions for your portfolio
        </h1>
        
        <p className="text-lg text-zinc-400 max-w-2xl mb-10 leading-relaxed font-medium">
          Deploy a team of parallel AI agents to analyze asset fundamentals, gauge real-time market sentiment, and synthesize institutional-grade research in seconds.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <button 
            onClick={onLaunch}
            className="bg-white text-black px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] cursor-pointer"
          >
            Start Analyzing
          </button>
          <button className="bg-white/5 border border-white/10 text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-white/10 transition-colors cursor-pointer">
            View Architecture
          </button>
        </div>

        {/* 4. THE FLOATING PRODUCT MOCKUP TEASER (UPDATED) */}
        <div className="w-full max-w-5xl mx-auto relative group">
          <div className="absolute inset-0 bg-blue-500/10 blur-[80px] rounded-3xl transition-opacity duration-700 opacity-50 group-hover:opacity-100" />
          
          <div className="relative rounded-t-2xl border border-white/10 bg-[#0a0a0c]/90 backdrop-blur-xl overflow-hidden shadow-2xl translate-y-4 transform transition-transform duration-700 hover:-translate-y-2">
            
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              <div className="ml-4 flex items-center text-xs text-zinc-500 font-medium font-mono">
                <svg className="w-3.5 h-3.5 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                kaizen-analysis-protocol / dashboard
              </div>
            </div>

            {/* Mockup Window Body */}
            <div 
              className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6 h-[400px] border-b border-white/5 opacity-90"
              style={{ 
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)', 
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)' 
              }}
            >
              {/* Sidebar with actual tool names */}
              <div className="col-span-1 border border-white/5 rounded-xl bg-white/[0.02] p-4 flex flex-col gap-2">
                <div className="h-9 w-full bg-white/10 rounded-lg flex items-center px-3 gap-3">
                  <div className="w-3.5 h-3.5 rounded bg-blue-500/80"></div>
                  <span className="text-xs font-semibold text-white">Active Agents</span>
                </div>
                <div className="h-9 w-full rounded-lg flex items-center px-3 gap-3">
                  <div className="w-3.5 h-3.5 rounded bg-zinc-700"></div>
                  <span className="text-xs font-medium text-zinc-500">Node Checkpoints</span>
                </div>
                <div className="h-9 w-full rounded-lg flex items-center px-3 gap-3">
                  <div className="w-3.5 h-3.5 rounded bg-zinc-700"></div>
                  <span className="text-xs font-medium text-zinc-500">Live Sentiment</span>
                </div>
                <div className="h-9 w-full rounded-lg flex items-center px-3 gap-3">
                  <div className="w-3.5 h-3.5 rounded bg-zinc-700"></div>
                  <span className="text-xs font-medium text-zinc-500">Judge Synthesis</span>
                </div>
              </div>
              
              {/* Main Content Area with Asset Data */}
              <div className="col-span-3 border border-white/5 rounded-xl bg-white/[0.02] p-6 space-y-6">
                
                {/* Header: Asset Profile */}
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Target Asset</div>
                    <div className="text-2xl font-bold text-white flex items-center gap-3">
                      NVDA <span className="text-sm font-medium text-zinc-500 bg-white/5 px-2 py-0.5 rounded-md">NVIDIA Corporation</span>
                    </div>
                  </div>
                  <div className="text-right">
                     <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Current Value</div>
                     <div className="text-xl font-bold text-white flex items-center justify-end gap-2">
                       $124.50 <span className="text-xs text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">+2.4%</span>
                     </div>
                  </div>
                </div>
                
                {/* Fake Chart Area */}
                <div className="h-40 w-full bg-black/40 rounded-lg border border-white/5 relative overflow-hidden">
                   {/* Fake grid lines */}
                   <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
                   
                   {/* SVG Line Chart */}
                   <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                     <defs>
                       <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                         <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                       </linearGradient>
                     </defs>
                     <path d="M0,100 L0,70 L20,75 L40,50 L60,55 L80,30 L100,20 L100,100 Z" fill="url(#chartGradient)"/>
                     <path d="M0,70 L20,75 L40,50 L60,55 L80,30 L100,20" fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                   </svg>
                </div>
                
                {/* Metric Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg border border-white/5 p-4 flex flex-col justify-between">
                     <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">Bull Node</div>
                     <div className="text-sm font-bold text-emerald-400">84% Confidence</div>
                  </div>
                  <div className="bg-white/5 rounded-lg border border-white/5 p-4 flex flex-col justify-between">
                     <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">Market Sentiment</div>
                     <div className="text-sm font-bold text-emerald-400">Highly Bullish</div>
                  </div>
                  <div className="bg-white/5 rounded-lg border border-white/5 p-4 flex flex-col justify-between">
                     <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">Bear Node</div>
                     <div className="text-sm font-bold text-rose-400">Low Probability</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}