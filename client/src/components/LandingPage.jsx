import React, { useState, useEffect } from "react";

export default function LandingPage({ onLaunch, onOpenGraph, onOpenArchive }) {
 
  const [stocks, setStocks] = useState([
    { sym: "NVDA", price: "124.50", change: "+2.4%", up: true },
    { sym: "AAPL", price: "173.20", change: "-1.2%", up: false },
    { sym: "TSLA", price: "202.10", change: "+4.1%", up: true },
    { sym: "AMZN", price: "145.90", change: "-0.5%", up: false },
    { sym: "MSFT", price: "410.00", change: "+1.1%", up: true },
    { sym: "META", price: "485.30", change: "+3.2%", up: true },
  ]);
  const [isOpen, setIsOpen] = useState(false);
 const logos = [
  { name: "Apple", url: "/logos/apple.svg" },
  { name: "BMW", url: "/logos/bmw.svg" },
  { name: "Comma", url: "/logos/comma.svg" },
  { name: "Dotnet", url: "/logos/dotnet.svg" },
  { name: "Google", url: "/logos/google.svg" },
  { name: "Gradle", url: "/logos/gradle.svg" },
  { name: "Hostinger", url: "/logos/hostinger.svg" },
  { name: "Jamstack", url: "/logos/jamstack.svg" },
  { name: "Mealie", url: "/logos/mealie.svg" },
  { name: "Meta", url: "/logos/meta.svg" },
  { name: "Metafilter", url: "/logos/metafilter.svg" },
  { name: "Meteor", url: "/logos/meteor.svg" },
  { name: "Netflix", url: "/logos/netflix.svg" },
  { name: "Netlify", url: "/logos/netlify.svg" },
  { name: "Notion", url: "/logos/notion.svg" },
  { name: "Nvidia", url: "/logos/nvidia.svg" },
  { name: "Porsche", url: "/logos/porsche.svg" },
  // { name: "Rocket", url: "/logos/rocket.svg" },
  { name: "Spinnaker", url: "/logos/spinnaker.svg" },
  { name: "Spotify", url: "/logos/spotify.svg" },
  { name: "Stellar", url: "/logos/stellar.svg" },
  { name: "Tesla", url: "/logos/tesla.svg" },
  { name: "Vespa", url: "/logos/vespa.svg" }
];
  // 2. Fetch Live Data

  useEffect(() => {
    const fetchLiveStocks = async () => {
      const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY; 
      
      if (!API_KEY) {
        console.warn("No Finnhub API Key found. Using mock data.");
        return;
      }

      try {
        const symbols = ["NVDA", "AAPL", "TSLA", "AMZN", "MSFT", "META"];
        
        // Fetch all quotes simultaneously
        const promises = symbols.map(sym => 
          fetch(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${API_KEY}`)
            .then(res => res.json())
        );
        
        const results = await Promise.all(promises);
        
        // Format the API response for our UI
        const formattedStocks = results.map((data, index) => {
          const currentPrice = data.c || 0;
          const prevClose = data.pc || 1; // Avoid division by zero
          const priceChange = currentPrice - prevClose; 
          const isUp = priceChange >= 0;
          const percentChange = ((priceChange / prevClose) * 100).toFixed(2);
          
          return {
            sym: symbols[index],
            price: currentPrice.toFixed(2),
            change: `${isUp ? '+' : ''}${percentChange}%`,
            up: isUp
          };
        });

        if (formattedStocks[0].price !== "0.00") {
          setStocks(formattedStocks);
        }
      } catch (error) {
        console.error("Failed to fetch live stock data:", error);
      }
    };

    fetchLiveStocks(); 
    const intervalId = setInterval(fetchLiveStocks, 60000); 

    return () => clearInterval(intervalId); 
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative font-sans selection:bg-white selection:text-black">
      
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* 1. NAVBAR */}
      <nav className="max-w-7xl mx-auto w-full relative z-10 px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-6 h-6 bg-white flex items-center justify-center transition-transform group-hover:rotate-90">
               <div className="w-2 h-2 bg-black"></div>
            </div>
            <span className="text-xl font-extrabold tracking-tighter uppercase">SATORI_</span>
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-bold text-zinc-500 uppercase tracking-widest">
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            
            <button onClick={onOpenGraph} className="hover:text-white transition-colors cursor-pointer uppercase">
              Live Market
            </button>
            <button onClick={onOpenArchive} className="hover:text-white transition-colors cursor-pointer uppercase">Archive</button>
          </div>

          <button 
            onClick={onLaunch}
            className="hidden md:block bg-white text-black px-6 py-2.5 rounded-none text-sm font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            Initialize
          </button>

          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col space-y-4 pb-4 text-sm font-bold text-zinc-500 uppercase tracking-widest">
            <a href="#architecture" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Architecture</a>
            <button onClick={() => { setIsOpen(false); onOpenGraph(); }} className="text-left hover:text-white transition-colors cursor-pointer uppercase">
              Live Market
            </button>
            <button onClick={() => { setIsOpen(false); onOpenArchive(); }} className="text-left hover:text-white transition-colors cursor-pointer uppercase">Archive</button>
          </div>
        </div>
      </nav>

      {/* 2. MAIN HERO BLOCK */}
      <main className="flex flex-col items-center justify-center text-center px-6 relative z-10 mt-16 md:mt-24">
        <div className="border-4 border-white bg-black p-10 md:p-16 max-w-5xl shadow-[15px_15px_0px_0px_rgba(255,255,255,1)] relative">
          
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-3 h-3 bg-white -translate-x-1.5 -translate-y-1.5"></div>
          <div className="absolute top-0 right-0 w-3 h-3 bg-white translate-x-1.5 -translate-y-1.5"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 bg-white -translate-x-1.5 translate-y-1.5"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-white translate-x-1.5 translate-y-1.5"></div>

          <div className="inline-block px-4 py-1.5 border border-zinc-600 text-xs font-bold uppercase tracking-widest text-zinc-400 mb-8">
            Protocol Version 2.5 // LangGraph
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter uppercase leading-[1.1] mb-6">
            Absolute clarity in <br />
            <span className="text-zinc-500">financial chaos.</span>
          </h1>
          
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 font-medium">
            Deploy autonomous agents to strip away market noise. Extract fundamental truths, gauge live sentiment, and execute institutional-grade thesis validation.
          </p>
          
          <button 
            onClick={onLaunch}
            className="group relative bg-white text-black px-10 py-4 text-lg font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors cursor-pointer overflow-hidden inline-flex items-center gap-3"
          >
            <span>Run Analysis</span>
            <span className="block transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </main>

      {/* 3. LIVE STOCK TICKER (MARQUEE) */}
      <div className="w-full border-y-2 border-white bg-black py-4 mt-24 relative z-10 overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee flex gap-12 px-6 items-center min-w-full shrink-0">
          {stocks.map((stock, idx) => (
            <div key={`primary-${idx}`} className="flex items-center gap-3 font-mono text-lg font-bold">
              <span className="text-white">{stock.sym}</span>
              <span className="text-zinc-500">${stock.price}</span>
              <span className={`flex items-center ${stock.up ? "text-emerald-500" : "text-rose-500"}`}>
                {stock.up ? "▲" : "▼"} {stock.change}
              </span>
            </div>
          ))}
        </div>
        <div className="animate-marquee flex gap-12 px-6 items-center min-w-full shrink-0" aria-hidden="true">
          {stocks.map((stock, idx) => (
            <div key={`secondary-${idx}`} className="flex items-center gap-3 font-mono text-lg font-bold">
              <span className="text-white">{stock.sym}</span>
              <span className="text-zinc-500">${stock.price}</span>
              <span className={`flex items-center ${stock.up ? "text-emerald-500" : "text-rose-500"}`}>
                {stock.up ? "▲" : "▼"} {stock.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. STRUCTURAL MOCKUP PEEK */}
      <div className="w-full max-w-5xl mx-auto relative mt-16 px-6 pb-0">
        <div className="relative border-x-2 border-t-2 border-white bg-black overflow-hidden h-[300px]">
          <div className="flex items-center px-4 py-3 border-b-2 border-white bg-zinc-950">
            <div className="flex gap-2 mr-4">
              <div className="w-3 h-3 bg-white"></div>
              <div className="w-3 h-3 bg-white"></div>
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-mono">
              /satori/dashboard/live
            </div>
          </div>

          <div 
            className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 h-full"
            style={{ maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)' }}
          >
            <div className="col-span-1 border-r-2 border-dashed border-zinc-800 pr-6 flex flex-col gap-4">
              <div className="h-8 w-full border border-zinc-800 flex items-center px-3 gap-3">
                <div className="w-3 h-3 bg-white"></div>
                <div className="h-2 w-16 bg-zinc-700"></div>
              </div>
              <div className="h-8 w-full flex items-center px-3 gap-3">
                <div className="w-3 h-3 border border-zinc-600"></div>
                <div className="h-2 w-20 bg-zinc-800"></div>
              </div>
            </div>
            <div className="col-span-3 space-y-6">
              <div className="flex justify-between items-end border-b border-dashed border-zinc-800 pb-4">
                <div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Target</div>
                  <div className="text-2xl font-extrabold text-white uppercase tracking-tighter">NVDA_Corp</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-zinc-800 p-4">
                   <div className="h-2 w-1/2 bg-zinc-800 mb-4"></div>
                   <div className="h-4 w-full bg-zinc-900"></div>
                </div>
                <div className="border border-zinc-800 p-4">
                   <div className="h-2 w-1/3 bg-zinc-800 mb-4"></div>
                   <div className="h-4 w-full bg-zinc-900"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     {/* 5. NEW: ARCHITECTURE SHOWCASE SECTION */}
      <section id="architecture" className="w-full bg-black py-32 relative z-10 border-t-2 border-white mt-10">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="text-zinc-500 font-mono text-xs font-bold uppercase tracking-widest mb-4">
                // Core Infrastructure
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white uppercase tracking-tighter leading-none">
                Multi-Agent <br/> Neural Swarm
              </h2>
            </div>
            <p className="text-zinc-400 font-medium max-w-md text-base leading-relaxed">
              We abandoned single-prompt AI. Kaizen utilizes a LangGraph state machine to orchestrate specialized micro-agents that debate, verify, and formulate institutional-grade logic.
            </p>
          </div>

          {/* Grid of Agent Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            
            {/* Feature 1 */}
            <div className="border-2 border-zinc-800 p-8 hover:border-white transition-colors duration-300 group">
              <div className="w-12 h-12 bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center mb-6 group-hover:bg-white group-hover:border-white transition-colors">
                 <span className="text-zinc-500 font-bold group-hover:text-black">01</span>
              </div>
              <h3 className="text-xl font-extrabold text-white uppercase tracking-tight mb-3">Fundamental Extractor</h3>
              <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                Bypasses standard APIs to scrape raw financial statements, SEC filings, and real-time P/E metrics using Tavily search algorithms.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border-2 border-zinc-800 p-8 hover:border-white transition-colors duration-300 group">
              <div className="w-12 h-12 bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center mb-6 group-hover:bg-white group-hover:border-white transition-colors">
                 <span className="text-zinc-500 font-bold group-hover:text-black">02</span>
              </div>
              <h3 className="text-xl font-extrabold text-white uppercase tracking-tight mb-3">Sentiment & Velocity</h3>
              <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                Aggregates global news headlines, social velocity, and consumer perception to weigh immediate market reaction against intrinsic value.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border-2 border-zinc-800 p-8 hover:border-white transition-colors duration-300 group">
              <div className="w-12 h-12 bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center mb-6 group-hover:bg-white group-hover:border-white transition-colors">
                 <span className="text-zinc-500 font-bold group-hover:text-black">03</span>
              </div>
              <h3 className="text-xl font-extrabold text-white uppercase tracking-tight mb-3">Adversarial Debate</h3>
              <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                Two opposing LLM nodes (Bull vs. Bear) process the exact same data to build conflicting investment theses, eliminating LLM confirmation bias.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="border-2 border-zinc-800 p-8 hover:border-white transition-colors duration-300 group">
              <div className="w-12 h-12 bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center mb-6 group-hover:bg-white group-hover:border-white transition-colors">
                 <span className="text-zinc-500 font-bold group-hover:text-black">04</span>
              </div>
              <h3 className="text-xl font-extrabold text-white uppercase tracking-tight mb-3">Judicial Synthesis</h3>
              <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                The final node acts as the judge, consuming the debate and outputting a Zod-validated, deterministic JSON payload representing the final verdict.
              </p>
            </div>

          </div>

          {/* Human-in-the-Loop Teaser Banner */}
          <div className="w-full border-2 border-white bg-white text-black p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
             {/* Abstract tech pattern */}
             <div className="absolute right-0 top-0 w-64 h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
             
             <div className="relative z-10">
               <h3 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight mb-2">Human-in-the-Loop Protocol</h3>
               <p className="font-medium max-w-xl text-zinc-800">
                 The graph halts execution pre-synthesis, allowing human operators to inject dynamic operational constraints into the final model.
               </p>
             </div>
             
             <button 
                onClick={onLaunch}
                className="relative z-10 bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors whitespace-nowrap cursor-pointer"
             >
               Test Protocol
             </button>
          </div>

        </div>
      </section>

     {/* NEW SECTION 1: COVERAGE MARQUEE WITH LOGOS & TAGLINE */}
      <section id="coverage" className="w-full bg-black py-20 relative z-10 border-t-2 border-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-white mb-2">
            WE TELL YOU WHERE TO INVEST
          </h2>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
            Tracking global enterprise equities and data aggregates
          </p>
        </div>

       {/* Endless Logo Marquee */}
<div className="w-full bg-zinc-950 py-10 border-y border-zinc-800 flex whitespace-nowrap overflow-hidden">
  <div className="animate-marquee flex gap-20 px-10 items-center min-w-full shrink-0">
    {logos.map((logo, idx) => (
      <div
        key={`primary-logo-${idx}`}
        className="w-36 h-14 flex items-center justify-center flex-shrink-0"
      >
        <img
          src={logo.url}
          alt={logo.name}
          title={logo.name}
          className="max-h-10 max-w-full object-contain brightness-0 invert opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-110"
        />
      </div>
    ))}
  </div>

  <div
    className="animate-marquee flex gap-20 px-10 items-center min-w-full shrink-0"
    aria-hidden="true"
  >
    {logos.map((logo, idx) => (
      <div
        key={`secondary-logo-${idx}`}
        className="w-36 h-14 flex items-center justify-center flex-shrink-0"
      >
        <img
          src={logo.url}
          alt={logo.name}
          title={logo.name}
          className="max-h-10 max-w-full object-contain brightness-0 invert opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-110"
        />
      </div>
    ))}
  </div>
</div>
      </section>

      {/* NEW SECTION 2: WORKFLOW / HOW THE DASHBOARD WORKS */}
      <section id="workflow" className="w-full bg-black py-24 relative z-10 border-t-2 border-white">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="mb-16 border-b border-zinc-800 pb-8">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">// OPERATIONAL EXECUTION</div>
            <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tighter">How the Satori Dashboard Works</h2>
          </div>

          {/* Workflow Sequence Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="border border-zinc-800 p-6 relative bg-zinc-950/40">
              <div className="absolute top-4 right-4 text-3xl font-mono font-bold text-zinc-800">01</div>
              <h4 className="text-lg font-bold text-white uppercase tracking-tight mb-3 mt-4">Payload Target Selection</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                The operator inputs an asset symbol into the client viewport dashboard terminal. This creates a secure, dedicated execution thread linked to a PostgreSQL instance.
              </p>
            </div>

            {/* Step 2 */}
            <div className="border border-zinc-800 p-6 relative bg-zinc-950/40">
              <div className="absolute top-4 right-4 text-3xl font-mono font-bold text-zinc-800">02</div>
              <h4 className="text-lg font-bold text-white uppercase tracking-tight mb-3 mt-4">Graph Interruption & Hold</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                As the worker nodes evaluate targets, the graph deliberately pauses operations before compiling its final response, feeding the real-time extracted data segments straight to your UI screen.
              </p>
            </div>

            {/* Step 3 */}
            <div className="border border-zinc-800 p-6 relative bg-zinc-950/40">
              <div className="absolute top-4 right-4 text-3xl font-mono font-bold text-zinc-800">03</div>
              <h4 className="text-lg font-bold text-white uppercase tracking-tight mb-3 mt-4">Manual Clearance & Release</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                You step into the loop. The dashboard unlocks a text window where you can adjust node data bias weights or add market overrides before clicking authorize to compile the finalized JSON report.
              </p>
            </div>

          </div>

          {/* Call To Action Block inside Workflow */}
          <div className="mt-16 border-2 border-white bg-white text-black p-8 md:p-12 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">Ready to assume command?</h3>
              <p className="text-zinc-700 text-sm font-medium mt-1">Boot up the main multi-agent dashboard stack immediately.</p>
            </div>
            <button 
              onClick={onLaunch}
              className="bg-black text-white px-8 py-3 font-bold uppercase text-xs tracking-widest hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
            >
              Launch Dashboard
            </button>
          </div>

        </div>
      </section>

    {/* NEW FOOTER */}
<footer className="w-full bg-zinc-950 border-t-2 border-white py-14 relative z-10 mt-auto">
  <div className="max-w-7xl mx-auto px-8">

    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-zinc-800">

      {/* Brand */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-4 h-4 bg-white"></div>
          <span className="font-black font-mono text-sm uppercase tracking-wider text-white">
            SATORI_LABS
          </span>
        </div>

        <p className="text-zinc-500 text-sm leading-7 max-w-xs">
          Institutional-grade market intelligence engineered for traders,
          investors, and analysts. Transforming financial data into actionable
          insights through AI-powered analytics.
        </p>
      </div>

      {/* Platform */}
      <div>
        <h4 className="font-mono text-white text-xs tracking-[0.25em] uppercase mb-5">
          Platform
        </h4>

        <ul className="space-y-3 text-sm text-zinc-500">
          <li className="hover:text-white transition-colors cursor-pointer">Dashboard</li>
          <li className="hover:text-white transition-colors cursor-pointer">Market Analytics</li>
          <li className="hover:text-white transition-colors cursor-pointer">AI Predictions</li>
          <li className="hover:text-white transition-colors cursor-pointer">Portfolio</li>
        </ul>
      </div>

      {/* Resources */}
      <div>
        <h4 className="font-mono text-white text-xs tracking-[0.25em] uppercase mb-5">
          Resources
        </h4>

        <ul className="space-y-3 text-sm text-zinc-500">
          <li className="hover:text-white transition-colors cursor-pointer">Documentation</li>
          <li className="hover:text-white transition-colors cursor-pointer">API Access</li>
          <li className="hover:text-white transition-colors cursor-pointer">Research Reports</li>
          <li className="hover:text-white transition-colors cursor-pointer">Support</li>
        </ul>
      </div>

      {/* Connect */}
      <div>
        <h4 className="font-mono text-white text-xs tracking-[0.25em] uppercase mb-5">
          Connect
        </h4>

        <div className="space-y-3 text-sm text-zinc-500">
          <p className="hover:text-white transition-colors cursor-pointer">
            hello@satorilabs.ai
          </p>
          <p className="hover:text-white transition-colors cursor-pointer">
            LinkedIn
          </p>
          <p className="hover:text-white transition-colors cursor-pointer">
            GitHub
          </p>
          <p className="hover:text-white transition-colors cursor-pointer">
            X (Twitter)
          </p>
        </div>
      </div>

    </div>

    <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8">

      <div className="text-zinc-600 font-mono text-[10px] tracking-[0.3em] uppercase">
        System Protocol © 2026 // Real-time Analytical Orchestration
      </div>

      <div className="flex gap-8 text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-600">
        <span className="hover:text-white transition-colors cursor-pointer">
          Privacy
        </span>
        <span className="hover:text-white transition-colors cursor-pointer">
          Terms
        </span>
        <span className="hover:text-white transition-colors cursor-pointer">
          Security
        </span>
        <span className="hover:text-white transition-colors cursor-pointer">
          Status
        </span>
      </div>

    </div>
  </div>
</footer>
    </div>
  );
}
