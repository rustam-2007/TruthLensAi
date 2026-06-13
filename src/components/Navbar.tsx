import { Eye, Sun, Moon, ShieldAlert, Cpu } from "lucide-react";

interface NavbarProps {
  currentPage: "home" | "analysis";
  setCurrentPage: (page: "home" | "analysis") => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

export default function Navbar({ currentPage, setCurrentPage, theme, toggleTheme }: NavbarProps) {
  return (
    <header 
      id="main-header"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        theme === "dark" 
          ? "bg-[#0A0F1C]/80 border-b border-white/10" 
          : "bg-[#F8FAFC]/80 border-b border-black/5"
      } backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Branding */}
        <button
          id="nav-logo"
          onClick={() => setCurrentPage("home")}
          className="flex items-center gap-2.5 focus:outline-none group"
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] opacity-75 blur-sm group-hover:opacity-100 transition duration-300" />
            <div className={`relative p-1.5 rounded-lg ${theme === "dark" ? "bg-[#0F172A]" : "bg-white"}`}>
              <Eye className="w-5 h-5 text-[#00E5FF]" />
            </div>
          </div>
          <span className={`font-display font-bold text-lg tracking-tight ${theme === "dark" ? "text-slate-50" : "text-slate-900"}`}>
            Truth<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7C3AED]">Lens</span>
            <span className="text-xs font-mono font-medium ml-1.5 px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">AI</span>
          </span>
        </button>

        {/* Navigation Tabs */}
        <nav id="nav-tabs" className="hidden md:flex items-center gap-8">
          <button
            id="nav-home-btn"
            onClick={() => setCurrentPage("home")}
            className={`font-sans text-sm font-medium transition-colors ${
              currentPage === "home"
                ? "text-[#00E5FF]"
                : theme === "dark"
                ? "text-slate-400 hover:text-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Digital Overview
          </button>
          <button
            id="nav-analysis-btn"
            onClick={() => setCurrentPage("analysis")}
            className={`relative font-sans text-sm font-medium transition-colors ${
              currentPage === "analysis"
                ? "text-[#00E5FF]"
                : theme === "dark"
                ? "text-slate-400 hover:text-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Forensic Terminal
            {currentPage !== "analysis" && (
              <span className="absolute -top-1 -right-4 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF]"></span>
              </span>
            )}
          </button>
        </nav>

        {/* Action Controls */}
        <div id="nav-actions" className="flex items-center gap-4">
          {/* Theme Toggler */}
          <button
            id="theme-toggler"
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-all ${
              theme === "dark"
                ? "border-slate-800 bg-slate-900 text-slate-400 hover:text-yellow-400 hover:bg-slate-800"
                : "border-slate-200 bg-white text-slate-500 hover:text-[#7C3AED] hover:bg-slate-50"
            }`}
            aria-label="Toggle Theme Mode"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Quick Upload CTA */}
          <button
            id="nav-cta-btn"
            onClick={() => setCurrentPage("analysis")}
            className={`relative inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-sans text-xs font-medium tracking-tight overflow-hidden transition-all duration-300 glow-btn ${
              theme === "dark"
                ? "bg-slate-900 text-slate-100 border border-slate-700 hover:border-[#00E5FF]/50"
                : "bg-slate-950 text-white hover:bg-slate-900"
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-[#00E5FF]" />
            Launch Analyzer
          </button>
        </div>
      </div>
    </header>
  );
}
