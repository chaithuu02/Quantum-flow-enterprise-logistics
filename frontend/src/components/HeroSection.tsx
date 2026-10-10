import React from 'react';
import { Zap, Atom, TrendingDown, Network, ShieldCheck, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onStartOptimization: () => void;
  onExploreQuantumLab: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartOptimization,
  onExploreQuantumLab
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-gradient-to-b from-[#080B16] via-[#10182A] to-[#080B16]">
      {/* Background ambient lighting glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#32D5F5]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#8B5CF6]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 text-center">
        {/* CENTERED HERO COPY CONTENT */}
        <div className="max-w-4xl mx-auto space-y-6 z-10 relative flex flex-col items-center">
          {/* Small Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#32D5F5]/10 border border-[#32D5F5]/30 text-[#32D5F5] text-xs font-semibold tracking-wider uppercase font-mono shadow-[0_0_20px_rgba(50,213,245,0.25)]">
            <Atom className="w-4 h-4 animate-spin-slow" />
            <span>QUANTUM-POWERED LOGISTICS INTELLIGENCE</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-center">
            Optimize Every Route.{' '}
            <span className="cyan-gradient-text block">
              Minimize Every Cost.
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-[#A8B3C7] leading-relaxed max-w-2xl text-center">
            Transform complex supply chain decisions into intelligent distribution plans. Optimize warehouse allocation, reduce transportation costs, and explore quantum-assisted optimization through one unified platform.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              id="hero-start-optimization-btn"
              onClick={onStartOptimization}
              className="btn-cyan-gradient px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-all"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Start Optimization</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              id="hero-explore-quantum-btn"
              onClick={onExploreQuantumLab}
              className="btn-violet-gradient px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-all"
            >
              <Atom className="w-4 h-4" />
              <span>Explore Quantum Lab</span>
            </button>
          </div>

          {/* Concise Capabilities */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10 w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-left">
              <div className="w-8 h-8 rounded-lg bg-[#32D5F5]/15 flex items-center justify-center text-[#32D5F5] shrink-0">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Cost Optimization</p>
                <p className="text-[10px] text-[#A8B3C7]">LP Simplex & QAOA</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-left">
              <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/15 flex items-center justify-center text-[#8B5CF6] shrink-0">
                <Network className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Intelligent Flow</p>
                <p className="text-[10px] text-[#A8B3C7]">Multi-Hub Allocation</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-left">
              <div className="w-8 h-8 rounded-lg bg-[#32D583]/15 flex items-center justify-center text-[#32D583] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Constraint Proof</p>
                <p className="text-[10px] text-[#A8B3C7]">Feasibility Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* CENTERED NETWORK VISUALIZATION */}
        <div className="max-w-4xl mx-auto relative z-10 w-full">
          <div className="relative w-full rounded-2xl glass-panel-glow p-6 border border-[#32D5F5]/30 overflow-hidden shadow-2xl bg-[#10182A]/90">
            {/* Header overlay */}
            <div className="flex items-center justify-between pb-4 mb-2 border-b border-white/10 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#32D583] animate-ping" />
                <span className="text-xs font-bold text-white tracking-wide">ACTIVE NETWORK VISUALIZATION</span>
              </div>
              <span className="text-[11px] text-[#32D5F5] bg-[#32D5F5]/10 px-2.5 py-1 rounded-full border border-[#32D5F5]/20">
                QAOA Statevector v2
              </span>
            </div>

            {/* SVG Network Graph */}
            <div className="relative w-full h-80 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 600 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Defs for gradients & markers */}
                <defs>
                  <linearGradient id="routeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#32D5F5" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="routeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#32D583" stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Connecting Routes (Curved Path Lines) */}
                <path d="M 80 70 Q 180 90 300 160" stroke="url(#routeGrad1)" strokeWidth="2.5" filter="url(#glow)" />
                <path d="M 80 70 Q 180 90 300 160" stroke="#32D5F5" strokeWidth="2" className="animate-route-flow" />

                <path d="M 80 160 L 300 160" stroke="url(#routeGrad1)" strokeWidth="2.5" filter="url(#glow)" />
                <path d="M 80 160 L 300 160" stroke="#8B5CF6" strokeWidth="2" className="animate-route-flow" />

                <path d="M 80 250 Q 180 230 300 160" stroke="url(#routeGrad1)" strokeWidth="2.5" filter="url(#glow)" />
                <path d="M 80 250 Q 180 230 300 160" stroke="#32D5F5" strokeWidth="2" className="animate-route-flow" />

                <path d="M 300 160 Q 410 90 520 50" stroke="url(#routeGrad2)" strokeWidth="2.5" filter="url(#glow)" />
                <path d="M 300 160 Q 410 90 520 50" stroke="#32D583" strokeWidth="2" className="animate-route-flow" />

                <path d="M 300 160 L 520 120" stroke="url(#routeGrad2)" strokeWidth="2.5" filter="url(#glow)" />
                <path d="M 300 160 L 520 120" stroke="#32D5F5" strokeWidth="2" className="animate-route-flow" />

                <path d="M 300 160 L 520 200" stroke="url(#routeGrad2)" strokeWidth="2.5" filter="url(#glow)" />
                <path d="M 300 160 L 520 200" stroke="#8B5CF6" strokeWidth="2" className="animate-route-flow" />

                <path d="M 300 160 Q 410 230 520 270" stroke="url(#routeGrad2)" strokeWidth="2.5" filter="url(#glow)" />
                <path d="M 300 160 Q 410 230 520 270" stroke="#32D583" strokeWidth="2" className="animate-route-flow" />

                {/* Route Cost Tags */}
                <g transform="translate(160, 95)">
                  <rect x="-24" y="-10" width="48" height="20" rx="6" fill="#141E32" stroke="#32D5F5" strokeWidth="1" />
                  <text x="0" y="4" fill="#32D5F5" fontSize="10" fontWeight="bold" textAnchor="middle">₹12.5/u</text>
                </g>

                <g transform="translate(160, 225)">
                  <rect x="-24" y="-10" width="48" height="20" rx="6" fill="#141E32" stroke="#8B5CF6" strokeWidth="1" />
                  <text x="0" y="4" fill="#8B5CF6" fontSize="10" fontWeight="bold" textAnchor="middle">₹20.0/u</text>
                </g>

                <g transform="translate(420, 85)">
                  <rect x="-22" y="-10" width="44" height="20" rx="6" fill="#141E32" stroke="#32D583" strokeWidth="1" />
                  <text x="0" y="4" fill="#32D583" fontSize="10" fontWeight="bold" textAnchor="middle">₹6.5/u</text>
                </g>

                <g transform="translate(420, 235)">
                  <rect x="-24" y="-10" width="48" height="20" rx="6" fill="#141E32" stroke="#32D5F5" strokeWidth="1" />
                  <text x="0" y="4" fill="#32D5F5" fontSize="10" fontWeight="bold" textAnchor="middle">₹11.0/u</text>
                </g>

                {/* Warehouse Nodes (Left Side) */}
                <g transform="translate(80, 70)">
                  <circle r="18" fill="#141E32" stroke="#32D5F5" strokeWidth="2" filter="url(#glow)" />
                  <text x="0" y="4" fill="#F5F7FF" fontSize="10" fontWeight="bold" textAnchor="middle">HYD</text>
                  <text x="-30" y="-22" fill="#A8B3C7" fontSize="9">Cap: 1200u</text>
                </g>

                <g transform="translate(80, 160)">
                  <circle r="18" fill="#141E32" stroke="#32D5F5" strokeWidth="2" filter="url(#glow)" />
                  <text x="0" y="4" fill="#F5F7FF" fontSize="10" fontWeight="bold" textAnchor="middle">BLR</text>
                  <text x="-30" y="-22" fill="#A8B3C7" fontSize="9">Cap: 1400u</text>
                </g>

                <g transform="translate(80, 250)">
                  <circle r="18" fill="#141E32" stroke="#32D5F5" strokeWidth="2" filter="url(#glow)" />
                  <text x="0" y="4" fill="#F5F7FF" fontSize="10" fontWeight="bold" textAnchor="middle">MAA</text>
                  <text x="-30" y="30" fill="#A8B3C7" fontSize="9">Cap: 950u</text>
                </g>

                {/* Central Quantum Optimizer Core */}
                <g transform="translate(300, 160)">
                  <circle r="36" fill="#10182A" stroke="#8B5CF6" strokeWidth="2" className="animate-pulse-glow" filter="url(#glow)" />
                  <circle r="26" fill="#141E32" stroke="#32D5F5" strokeWidth="1.5" />
                  <Atom className="w-8 h-8 text-[#32D5F5]" x="-16" y="-16" />
                  <text x="0" y="48" fill="#32D5F5" fontSize="11" fontWeight="bold" textAnchor="middle">QUANTUM CORE</text>
                  <text x="0" y="62" fill="#A8B3C7" fontSize="9" textAnchor="middle">24 Qubits | QAOA p=2</text>
                </g>

                {/* Destination Nodes (Right Side) */}
                <g transform="translate(520, 50)">
                  <circle r="16" fill="#141E32" stroke="#32D583" strokeWidth="2" filter="url(#glow)" />
                  <text x="0" y="4" fill="#F5F7FF" fontSize="9" fontWeight="bold" textAnchor="middle">PNQ</text>
                  <text x="24" y="4" fill="#32D583" fontSize="9" fontWeight="semibold">550u Demand</text>
                </g>

                <g transform="translate(520, 120)">
                  <circle r="16" fill="#141E32" stroke="#32D5F5" strokeWidth="2" filter="url(#glow)" />
                  <text x="0" y="4" fill="#F5F7FF" fontSize="9" fontWeight="bold" textAnchor="middle">AMD</text>
                  <text x="24" y="4" fill="#32D5F5" fontSize="9" fontWeight="semibold">400u Demand</text>
                </g>

                <g transform="translate(520, 200)">
                  <circle r="16" fill="#141E32" stroke="#8B5CF6" strokeWidth="2" filter="url(#glow)" />
                  <text x="0" y="4" fill="#F5F7FF" fontSize="9" fontWeight="bold" textAnchor="middle">CCU</text>
                  <text x="24" y="4" fill="#8B5CF6" fontSize="9" fontWeight="semibold">600u Demand</text>
                </g>

                <g transform="translate(520, 270)">
                  <circle r="16" fill="#141E32" stroke="#32D583" strokeWidth="2" filter="url(#glow)" />
                  <text x="0" y="4" fill="#F5F7FF" fontSize="9" fontWeight="bold" textAnchor="middle">COK</text>
                  <text x="24" y="4" fill="#32D583" fontSize="9" fontWeight="semibold">350u Demand</text>
                </g>
              </svg>
            </div>

            {/* Bottom Status Bar */}
            <div className="flex items-center justify-between text-xs pt-3 border-t border-white/10 font-mono">
              <span className="text-[#A8B3C7]">Solver Status: <strong className="text-[#32D583]">OPTIMAL</strong></span>
              <span className="text-[#A8B3C7]">Simplex / QAOA Time: <strong className="text-[#32D5F5]">12.4 ms</strong></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
