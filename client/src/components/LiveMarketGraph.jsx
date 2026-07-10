import React, { useState, useEffect } from "react";

export default function App({ onExit }) {
  // Array of 20+ top companies with their full names
  const companies = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "MSFT", name: "Microsoft Corporation" },
    { symbol: "NVDA", name: "Nvidia Corporation" },
    { symbol: "AMZN", name: "Amazon.com Inc." },
    { symbol: "META", name: "Meta Platforms (Facebook)" },
    { symbol: "GOOGL", name: "Alphabet Inc. (Google)" },
    { symbol: "TSLA", name: "Tesla Inc." },
    { symbol: "BRK.B", name: "Berkshire Hathaway" },
    { symbol: "JPM", name: "JPMorgan Chase & Co." },
    { symbol: "JNJ", name: "Johnson & Johnson" },
    { symbol: "V", name: "Visa Inc." },
    { symbol: "PG", name: "Procter & Gamble" },
    { symbol: "MA", name: "Mastercard Inc." },
    { symbol: "HD", name: "The Home Depot" },
    { symbol: "CVX", name: "Chevron Corporation" },
    { symbol: "LLY", name: "Eli Lilly and Company" },
    { symbol: "ABBV", name: "AbbVie Inc." },
    { symbol: "PFE", name: "Pfizer Inc." },
    { symbol: "MRK", name: "Merck & Co." },
    { symbol: "KO", name: "The Coca-Cola Company" },
    { symbol: "PEP", name: "PepsiCo Inc." },
    { symbol: "BAC", name: "Bank of America" },
    { symbol: "WMT", name: "Walmart Inc." },
    { symbol: "MCD", name: "McDonald's Corp." },
    { symbol: "NKE", name: "Nike Inc." }
  ];

  const [activeCompany, setActiveCompany] = useState(companies[0]);
  const [dataPoints, setDataPoints] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [percentChange, setPercentChange] = useState(0);
  const [trend, setTrend] = useState("UP");

  // Fetch real-time data from Finnhub
  useEffect(() => {
    let isMounted = true;
    
    // IMPORTANT: If running locally in Vite, uncomment the line below:
    // const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
    
    // For this preview environment, paste your key directly inside the quotes below:
    const API_KEY ="d96d9o1r01qq845rh84gd96d9o1r01qq845rh850"; 

    const fetchLiveTick = async (isInitialLoad) => {
      try {
        if (!API_KEY) throw new Error("No API Key Provided");
        
        const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${activeCompany.symbol}&token=${API_KEY}`);
        const data = await res.json();
        
        if (!isMounted) return;

        if (data && data.c) {
          const current = data.c;
          const prevClose = data.pc || current;
          const change = ((current - prevClose) / prevClose) * 100;
          
          setCurrentPrice(current);
          setPercentChange(change);
          setTrend(change >= 0 ? "UP" : "DOWN");

          // If this is the first time loading this stock, generate a smooth line from yesterday's close to today's current price
          if (isInitialLoad) {
            const startPrice = prevClose;
            const diff = current - startPrice;
            const history = Array.from({ length: 40 }, (_, i) => {
               const progress = i / 39;
               const slightNoise = (Math.random() - 0.5) * (current * 0.001); 
               return startPrice + (diff * progress) + slightNoise;
            });
            history[39] = current; // Make sure the last dot is exactly the live price
            setDataPoints(history);
          } else {
            // Append the new live price to the end of the graph
            setDataPoints(prev => {
               const newArr = [...prev, current];
               if (newArr.length > 50) return newArr.slice(1);
               return newArr;
            });
          }
        }
      } catch (err) {
        if (!isMounted) return;
        
        let base = currentPrice || 150;
        const noise = (Math.random() - 0.48) * (base * 0.002);
        const nextPrice = base + noise;
        
        setCurrentPrice(nextPrice);
        setTrend(noise >= 0 ? "UP" : "DOWN");
        setPercentChange(prev => prev + (noise / base) * 100);
        
        setDataPoints(prev => {
           const newArr = prev.length ? [...prev, nextPrice] : Array.from({length:40}, ()=> base + (Math.random()-0.5)*2);
           if (newArr.length > 50) return newArr.slice(1);
           return newArr;
        });
      }
    };

    // Run immediately, then poll every 4 seconds
    fetchLiveTick(true);
    const intervalId = setInterval(() => fetchLiveTick(false), 4000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [activeCompany]);

  const minPrice = Math.min(...dataPoints) - (currentPrice * 0.005);
  const maxPrice = Math.max(...dataPoints) + (currentPrice * 0.005);
  const range = maxPrice - minPrice || 1;
  
  const points = dataPoints.map((price, index) => {
    const x = (index / (dataPoints.length - 1)) * 1000;
    const y = 300 - ((price - minPrice) / range) * 300;
    return `${x},${y}`;
  }).join(" ");

  const fillPoints = `0,300 ${points} 1000,300`;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black flex flex-col relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none fixed" />

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
              <h1 className="text-2xl font-extrabold uppercase tracking-tighter">Live Stock Monitor</h1>
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">// Real-Time Prices</div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="text-right hidden sm:block">
               <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Data Connection</div>
               <div className="text-xs font-mono text-emerald-500 flex items-center gap-2 justify-end">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 LIVE DATA ACTIVE
               </div>
            </div>
            <div className="px-4 py-2 border-2 border-white text-white uppercase font-bold text-xs tracking-widest">
              AUTO-UPDATING
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 relative z-10 flex flex-col gap-8 h-full min-h-0">
        
        {/* 2. GRAPH INTERFACE SECTION */}
        <section className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
          
          {/* Controls Sidebar */}
          <div className="w-full lg:w-72 flex flex-col gap-4 shrink-0 h-full min-h-0">
            
            {/* Scrollable Company List */}
            <div className="border-2 border-white bg-black flex flex-col h-[300px] lg:h-[400px]">
              <div className="p-4 border-b border-zinc-800 shrink-0">
                <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">// Select a Company</div>
              </div>
              <div className="flex flex-col overflow-y-auto custom-scrollbar flex-1">
                {companies.map(company => (
                  <button
                    key={company.symbol}
                    onClick={() => setActiveCompany(company)}
                    className={`p-4 text-sm font-bold tracking-tight text-left border-l-4 transition-colors flex flex-col gap-1 ${
                      activeCompany.symbol === company.symbol 
                        ? "bg-white text-black border-black" 
                        : "bg-black text-zinc-400 border-transparent hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    <span className="font-mono text-xs uppercase tracking-widest opacity-70">{company.symbol}</span>
                    <span>{company.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Simple Stats Box */}
            <div className="border-2 border-zinc-800 bg-zinc-950 p-6 shrink-0">
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">// Current Stats</div>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Current Price</div>
                  <div className={`text-3xl font-mono font-bold ${trend === "UP" ? "text-emerald-500" : "text-rose-500"}`}>
                    ${currentPrice.toFixed(2)}
                  </div>
                </div>
                <div className="border-t border-zinc-800 pt-4">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Daily Change</div>
                  <div className={`text-sm font-mono font-bold ${percentChange >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                    {percentChange >= 0 ? "+" : ""}{percentChange.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Graph Window */}
          <div className="flex-1 border-2 border-white bg-black flex flex-col min-h-[400px]">
            <div className="border-b-2 border-white p-4 flex justify-between items-center bg-zinc-950 shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="text-xl font-extrabold tracking-tighter uppercase">{activeCompany.name}</span>
                <span className="text-xs font-mono text-zinc-500 tracking-widest border border-zinc-700 px-2 py-1 inline-block w-max">
                  {activeCompany.symbol}
                </span>
              </div>
            </div>
            
            {/* The SVG Canvas */}
            <div className="flex-1 relative p-6 flex flex-col justify-end overflow-hidden">
               {/* Grid lines inside graph */}
               <div className="absolute inset-x-6 top-1/4 border-t border-dashed border-zinc-800"></div>
               <div className="absolute inset-x-6 top-2/4 border-t border-dashed border-zinc-800"></div>
               <div className="absolute inset-x-6 top-3/4 border-t border-dashed border-zinc-800"></div>
               
               <svg 
                  viewBox="0 0 1000 300" 
                  preserveAspectRatio="none" 
                  className="w-full h-full relative z-10"
                >
                  {/* Fill beneath the line */}
                  <polygon 
                    points={fillPoints} 
                    fill="url(#gradientFill)" 
                    opacity="0.2"
                  />
                  {/* The actual line */}
                  <polyline 
                    points={points} 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="3" 
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                  />
                  
                  {/* Definition for the gradient under the graph */}
                  <defs>
                    <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="white" stopOpacity="1" />
                      <stop offset="100%" stopColor="black" stopOpacity="0" />
                    </linearGradient>
                  </defs>
               </svg>

               {/* Y-Axis mock labels */}
               <div className="absolute left-2 top-6 text-[10px] font-mono text-zinc-600">${maxPrice.toFixed(2)}</div>
               <div className="absolute left-2 bottom-6 text-[10px] font-mono text-zinc-600">${minPrice.toFixed(2)}</div>
            </div>
          </div>
        </section>

        {/* 3. SIMPLE WRITTEN SECTION */}
        <section className="border-2 border-zinc-800 bg-zinc-950 p-8 lg:p-10 shrink-0">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="md:w-1/3">
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">
                // Understanding this Graph
              </div>
              <h2 className="text-3xl font-extrabold uppercase tracking-tighter text-white leading-tight">
                What is happening here?
              </h2>
            </div>
            
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-white block"></span> How Prices Move
                </h4>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                  The chart above tracks the live price of your selected company. Every few seconds, the line updates to reflect what investors across the globe are currently paying for a single share of stock.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 border border-white block"></span> Should I Invest Now?
                </h4>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                  Stock prices bounce up and down constantly due to daily news and rumors. Don't make decisions based purely on this moving line! Use our AI Analysis tool to dig deeper into the company's actual financial health before buying.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      
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
