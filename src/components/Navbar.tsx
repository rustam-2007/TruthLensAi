import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, Sun, Moon, Cpu, Menu, X } from "lucide-react";

interface NavbarProps {
  currentPage: "home" | "analysis";
  setCurrentPage: (page: "home" | "analysis") => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

export default function Navbar({ currentPage, setCurrentPage, theme, toggleTheme }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNav = (page: "home" | "analysis") => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      id="main-header"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        theme === "dark" 
          ? "bg-[#0A0F1C]/90 border-b border-white/10" 
          : "bg-[#F8FAFC]/90 border-b border-black/5"
      } backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Branding */}
        <button
          id="nav-logo"
          onClick={() => handleMobileNav("home")}
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

        {/* Navigation Tabs (Desktop only) */}
        <nav id="nav-tabs" className="hidden md:flex items-center gap-8">
          <button
            id="nav-home-btn"
            onClick={() => setCurrentPage("home")}
            className={`font-sans text-sm font-medium transition-colors cursor-pointer ${
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
            className={`relative font-sans text-sm font-medium transition-colors cursor-pointer ${
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
        <div id="nav-actions" className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggler */}
          <button
            id="theme-toggler"
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              theme === "dark"
                ? "border-slate-800 bg-slate-900 text-slate-400 hover:text-yellow-400 hover:bg-slate-800"
                : "border-slate-200 bg-white text-slate-500 hover:text-[#7C3AED] hover:bg-slate-50"
            }`}
            aria-label="Toggle Theme Mode"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Quick Upload CTA (Hidden on small screens to avoid overflow) */}
          <button
            id="nav-cta-btn"
            onClick={() => setCurrentPage("analysis")}
            className={`relative hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-sans text-xs font-medium tracking-tight overflow-hidden transition-all duration-300 glow-btn cursor-pointer ${
              theme === "dark"
                ? "bg-slate-900 text-slate-100 border border-slate-700 hover:border-[#00E5FF]/50"
                : "bg-slate-950 text-white hover:bg-slate-900"
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-[#00E5FF]" />
            Launch Analyzer
          </button>

          {/* Mobile Menu Open Toggle Button */}
          <button
            id="mobile-nav-toggle"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className={`p-2 rounded-lg border md:hidden transition-all cursor-pointer ${
              theme === "dark"
                ? "border-slate-800 bg-slate-900/40 text-slate-400 hover:text-[#00E5FF]"
                : "border-slate-200 bg-white text-slate-500 hover:text-[#7C3AED]"
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel Layer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-overlay-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`md:hidden border-b overflow-hidden ${
              theme === "dark"
                ? "bg-[#0C1224] border-white/10 text-slate-100"
                : "bg-white border-black/5 text-slate-900"
            }`}
          >
            <div className="px-4 pt-2 pb-6 space-y-3 font-sans">
              <button
                onClick={() => handleMobileNav("home")}
                className={`w-full py-3 px-4 rounded-xl text-left text-sm font-medium flex items-center justify-between transition-colors cursor-pointer ${
                  currentPage === "home"
                    ? theme === "dark"
                      ? "bg-cyan-500/10 text-[#00E5FF]"
                      : "bg-[#7C3AED]/10 text-[#7C3AED]"
                    : "hover:bg-slate-500/5"
                }`}
              >
                <span>Digital Overview</span>
                <span className="text-xs opacity-50 font-mono">01</span>
              </button>

              <button
                onClick={() => handleMobileNav("analysis")}
                className={`w-full py-3 px-4 rounded-xl text-left text-sm font-medium flex items-center justify-between transition-colors cursor-pointer ${
                  currentPage === "analysis"
                    ? theme === "dark"
                      ? "bg-cyan-500/10 text-[#00E5FF]"
                      : "bg-[#7C3AED]/10 text-[#7C3AED]"
                    : "hover:bg-slate-500/5"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>Forensic Terminal</span>
                  {currentPage !== "analysis" && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF]"></span>
                    </span>
                  )}
                </span>
                <span className="text-xs opacity-50 font-mono">02</span>
              </button>

              <div className="pt-3 border-t border-white/5 px-4">
                <button
                  onClick={() => handleMobileNav("analysis")}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white text-center font-bold text-sm tracking-tight shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Cpu className="w-4 h-4 text-cyan-200" />
                  Launch Forensic Terminal
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
