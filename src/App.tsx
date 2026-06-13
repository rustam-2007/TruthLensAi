import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import AnalysisPage from "./components/AnalysisPage";
import { DemoImage } from "./components/DemoData";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "analysis">("home");
  const [selectedDemo, setSelectedDemo] = useState<DemoImage | null>(null);
  
  // Set default theme to 'dark' as requested
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  // Keep HTML root class aligned with dark/light themes for standard compliance
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Clean comparative routes on direct pages click
  const handlePageChange = (page: "home" | "analysis") => {
    if (page === "home") {
      // Retain or null selected demo so home-page is untouched
      setSelectedDemo(null);
    }
    setCurrentPage(page);
  };

  return (
    <div 
      id="app-root-container"
      className={`min-h-screen transition-colors duration-300 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 ${
        theme === "dark" 
          ? "bg-[#0A0F1C] text-slate-100" 
          : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      {/* Navigation Layer */}
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={handlePageChange} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      {/* Structured Content Views Router */}
      <main id="main-content-viewport" className="flex-grow">
        {currentPage === "home" ? (
          <HomePage 
            setCurrentPage={handlePageChange} 
            setSelectedDemo={setSelectedDemo}
            theme={theme} 
          />
        ) : (
          <AnalysisPage 
            selectedDemo={selectedDemo} 
            setSelectedDemo={setSelectedDemo}
            theme={theme} 
          />
        )}
      </main>
    </div>
  );
}
