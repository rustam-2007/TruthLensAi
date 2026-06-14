import { useState } from "react";
import { motion } from "motion/react";
import { 
  ShieldCheck, Eye, Cpu, FileText, Lock, 
  HelpCircle, ChevronDown, Award, Globe, 
  Zap, Database, BarChart3, ScanFace, Check
} from "lucide-react";
import { DEMO_FILES, DemoImage } from "./DemoData";

interface HomePageProps {
  setCurrentPage: (page: "home" | "analysis") => void;
  setSelectedDemo: (demo: DemoImage) => void;
  theme: "dark" | "light";
}

export default function HomePage({ setCurrentPage, setSelectedDemo, theme }: HomePageProps) {
  // Comparative slider on Hero
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleDemoSelect = (demo: DemoImage) => {
    setSelectedDemo(demo);
    setCurrentPage("analysis");
  };

  const faqs = [
    {
      q: "How does TruthLens AI distinguish between normal filters and generative AI?",
      a: "Our system processes the image across dual pathways: semantic-optical analysis (detecting non-physical lighting and anatomical asymmetries) and discrete pixel-noise analysis (isolating grid-repetition artifacts typical of GANs and diffusion networks)."
    },
    {
      q: "What types of image formats are supported by the forensic terminal?",
      a: "TruthLens supports JPEG, PNG, WebP, and common mirrorless CAMERA raw file representations up to 15MB. All decoding occurs instantaneously."
    },
    {
      q: "Is my uploaded image data private and secure?",
      a: "Absolutely. All analytical streams are processed server-side under full transit encryption and are automatically scrubbed from memory immediately after report delivery. We strictly adhere to corporate compliance and never store your telemetry."
    },
    {
      q: "Can this detect modern deepfakes or face-swap manipulations?",
      a: "Yes. TruthLens executes error level evaluation (ELA) and localized high frequency spectral alignment to target face-swapping boundaries, facial skin-mesh replication indices, and localized focal blur mismatches."
    }
  ];

  return (
    <div className={`font-sans min-h-screen ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
      
      {/* 1. HERO SECTION WITH DEEP SYSTEM FORENSICS BRANDING */}
      <section id="hero-section" className="relative pt-16 pb-24 px-4 overflow-hidden border-b border-dashed border-cyan-500/10">
        {/* Futuristic glowing atmospheric background shapes */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl -z-10 animate-pulse duration-[8s]" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl -z-10 animate-pulse duration-[12s]" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Explainer Column */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              SOLARIS ENTERPRISE LEVEL TRUTH VERIFICATION
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none"
            >
              Expose the unseen {` `}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-cyan-300 to-[#7C3AED]">
                pixel mechanics 
              </span>
              {` `}
              behind digital assets.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-base sm:text-lg max-w-xl ${theme === "dark" ? "text-slate-400" : "text-slate-600"} leading-relaxed`}
            >
              TruthLens AI is an advanced image forensic intelligence platform. Securely audit deepfakes, isolate cloning masks, detect localized visual tuning layers, and visually reconstruct authentic optics on the fly.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <button
                id="hero-primary-btn"
                onClick={() => setCurrentPage("analysis")}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] hover:from-cyan-400 hover:to-violet-500 text-white font-medium text-sm transition-all shadow-lg shadow-cyan-500/10 duration-300 glow-btn"
              >
                Launch Forensic Terminal
              </button>
              <a
                href="#demo-showcase"
                className={`px-6 py-3 rounded-lg border text-sm font-medium transition-colors ${
                  theme === "dark"
                    ? "border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:text-slate-100 text-slate-300"
                    : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                }`}
              >
                Inspect Sample Scanned Cases
              </a>
            </motion.div>

            {/* Micro value badges */}
            <div className={`pt-6 border-t ${theme === "dark" ? "border-slate-800" : "border-slate-200"} grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-left`}>
              <div>
                <span className={`block font-bold text-lg font-display ${theme === "dark" ? "text-slate-50" : "text-slate-900"}`}>&lt; 2.4s</span>
                <span className={theme === "dark" ? "text-slate-500" : "text-slate-500"}>Spectral Scan Latency</span>
              </div>
              <div>
                <span className={`block font-bold text-lg font-display ${theme === "dark" ? "text-slate-50" : "text-slate-900"}`}>99.8%</span>
                <span className={theme === "dark" ? "text-slate-500" : "text-slate-500"}>Artifact Isolation Accuracy</span>
              </div>
              <div>
                <span className={`block font-bold text-lg font-display ${theme === "dark" ? "text-slate-50" : "text-slate-900"}`}>ZeroLog</span>
                <span className={theme === "dark" ? "text-slate-500" : "text-slate-500"}>Full Telemetry Privacy</span>
              </div>
            </div>
          </div>

          {/* 4. HERO RIGHT: INTERACTIVE PRODUCT COMPARATIVE SLIDER PREVIEW */}
          <div className="lg:col-span-5 relative">
            <div className={`p-1.5 rounded-2xl border ${theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"} shadow-2xl`}>
              <div className="relative aspect-square w-full rounded-xl overflow-hidden group select-none">
                
                {/* Left side: Reconstructed appearance */}
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop" 
                  alt="Forensic Restored appearance"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Overlay details indicating restoration info */}
                <div className="absolute top-4 left-4 z-10 font-mono text-[10px] bg-slate-950/70 text-cyan-400 px-2 py-1 rounded">
                  RESTORED ORIGINAL APPEARANCE
                </div>

                {/* Right side: AI Generated appearance with clipped width */}
                <div 
                  className="absolute inset-0 w-full h-full object-cover z-20 overflow-hidden"
                  style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop" 
                    alt="Synthesized AI Face"
                    className="absolute inset-0 w-full h-full object-cover saturate-[1.75] hue-rotate-[300deg] contrast-[1.1] brightness-[1.05]"
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>

                {/* Overlay details indicating modification info */}
                <div className="absolute top-4 right-4 z-30 font-mono text-[10px] bg-slate-950/70 text-[#7C3AED] px-2 py-1 rounded">
                  SYNTHESIZED AI PHENOTYPE
                </div>

                {/* Interactive Slider Input Bar */}
                <div className="absolute inset-y-0 left-0 right-0 z-40 flex items-center justify-center">
                  <input 
                    type="range"
                    min="1"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="absolute inset-x-0 w-full h-full opacity-0 cursor-ew-resize z-50"
                  />
                  {/* Visual slider track lever */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6.5 h-6.5 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-lg">
                      <Eye className="w-3 h-3 text-cyan-400" />
                    </div>
                  </div>
                </div>

                {/* Simulated forensic scan active HUD overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-30 pointer-events-none flex justify-between items-center font-mono text-[9px] text-slate-300 bg-slate-950/50 backdrop-blur-sm p-2 rounded">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    ANALYSIS ENGAGED: SCAN_GRID_82X
                  </span>
                  <span>AI INDEX: 96%</span>
                </div>
              </div>
            </div>

            {/* Decorative layout anchor points */}
            <div className="absolute -bottom-4 -left-4 font-mono text-[10px] text-cyan-400/40 select-none">
              [TRUTHLENS_SYS_PREVIEW]
            </div>
            <div className="absolute -top-4 -right-4 font-mono text-[10px] text-[#7C3AED]/40 select-none">
              COORD_W3_0xFFFF.D
            </div>
          </div>

        </div>
      </section>

      {/* 2. VALUE PROPOSITION: STREAK OF REAL FORENSIC SECURITY CERTIFICATION */}
      <section id="trust-banner" className={`py-8 select-none ${theme === "dark" ? "bg-slate-950/50" : "bg-slate-100/50"} border-b border-white/5 font-mono text-xs`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-8 justify-around items-center text-slate-500">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-500" /> ISO/IEC 27001 COMPLIANT ALGORITHMS
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-500" /> SOC3 TELEMETRY ENCRYPTED PLATFORM
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-500" /> 2026+ NEXT-GEN DEEP SENSOR AUDITING
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE DEMO SELECTOR: DEMO SHOWCASE SECTION */}
      <section id="demo-showcase" className="py-24 px-4 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            Interactive Forensic <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7C3AED]">Showcase</span>
          </h2>
          <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
            Inspect pre-vetted digital evidence cases below. Click on any file to load it immediately into the analysis terminal to verify spectrum grids, difference heatmaps & audit verdicts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DEMO_FILES.map((demo) => {
            const isAI = demo.category === "AI Generation";
            const isSpliced = demo.category === "Spliced Composite";
            return (
              <div 
                key={demo.id} 
                onClick={() => handleDemoSelect(demo)}
                className={`group cursor-pointer p-4 rounded-xl border transition-all duration-300 text-left relative flex flex-col justify-between ${
                  theme === "dark"
                    ? "bg-slate-900/30 border-slate-800/80 hover:border-cyan-500/45 hover:bg-slate-900/60"
                    : "bg-white border-slate-200 hover:border-[#7C3AED]/45 hover:shadow-lg"
                }`}
              >
                <div>
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-slate-950">
                    <img 
                      src={demo.imageUrl} 
                      alt={demo.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span className={`text-[9px] font-mono tracking-wider font-bold uppercase px-2 py-1 rounded-full ${
                        isAI 
                          ? "bg-red-500/15 text-red-400 border border-red-500/20" 
                          : isSpliced 
                          ? "bg-yellow-500/15 text-yellow-500 border border-yellow-500/20" 
                          : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {demo.category}
                      </span>
                    </div>

                    {/* Gradient bottom bar showing core scoring instantly */}
                    <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 p-2 border-t border-white/5 font-mono text-[10px] flex justify-between">
                      <span className="text-slate-400">TRUTHLENS INDEX:</span>
                      <span className={demo.report.isAIGeneratedPercentage > 50 ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                        {demo.report.isAIGeneratedPercentage}% AI Match
                      </span>
                    </div>
                  </div>

                  <h3 className={`font-display font-bold text-base mb-1.5 ${theme === "dark" ? "text-slate-50" : "text-slate-900"}`}>
                    {demo.name}
                  </h3>
                  <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"} line-clamp-2 leading-relaxed mb-4`}>
                    {demo.description}
                  </p>
                </div>

                <div className={`pt-3 border-t ${theme === "dark" ? "border-slate-800" : "border-slate-100"} flex items-center justify-between font-mono text-[10px]`}>
                  <span className="text-cyan-400 group-hover:underline">Simulate Forensic Analysis &rarr;</span>
                  <span className="text-slate-500">{demo.report.metadata.resolution}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. FEATURES BENTO GRID: ENTERPRISE AI CAPABILITIES */}
      <section id="features-section" className={`py-24 ${theme === "dark" ? "bg-slate-900/20 border-y border-dashed border-cyan-500/10" : "bg-[#f2f5f9] border-y border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              A Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7C3AED]">Pixel Forensic Laboratory</span>
            </h2>
            <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
              Analyze pixel-level mechanics, lighting vectors, metadata profiles, and structural symmetries inside an intuitive SaaS workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Bento Block 1: AI Generated Flagging */}
            <div className={`p-6 rounded-2xl border ${theme === "dark" ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"} md:col-span-2 lg:col-span-2 text-left space-y-4 shadow-sm`}>
              <div className="p-3 bg-[#00E5FF]/10 text-[#00E5FF] rounded-lg w-fit">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg">AI Generation Fingerprint Scans</h3>
              <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-600"} leading-relaxed`}>
                Identify procedural traces generated by Midjourney, Stable Diffusion, DALL-E, and GAN networks. Our system targets pixel frequency distributions, repeating wavelets, and asymmetrical pupil refraction markers.
              </p>
              <div className="flex gap-2 font-mono text-[9px] text-[#00E5FF]">
                <span className="px-2 py-0.5 rounded bg-cyan-500/5 border border-cyan-500/10">Diffusion Patterns</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/5 border border-cyan-500/10">Grid Repetition DFT</span>
              </div>
            </div>

            {/* Bento Block 2: Manipulation Isolation */}
            <div className={`p-6 rounded-2xl border ${theme === "dark" ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"} text-left space-y-4 shadow-sm pb-8`}>
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg w-fit">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg">Cloning & Splicing Audit</h3>
              <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-600"} leading-relaxed`}>
                Detect spliced elements, cloned backgrounds, or erase tool actions using Error Level Analysis (ELA) compression scans.
              </p>
            </div>

            {/* Bento Block 3: Dynamic Heatmaps */}
            <div className={`p-6 rounded-2xl border ${theme === "dark" ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"} text-left space-y-4 shadow-sm`}>
              <div className="p-3 bg-pink-500/10 text-pink-400 rounded-lg w-fit">
                <ScanFace className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg">Visual Heatmaps</h3>
              <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-600"} leading-relaxed`}>
                Generate coordinates targeting suspected changes and overlays, and review them directly atop the image frame.
              </p>
            </div>

            {/* Bento Block 4: Original Restoration Projection */}
            <div className={`p-6 rounded-2xl border ${theme === "dark" ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"} text-left space-y-4 shadow-sm`}>
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg w-fit">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg">Original Restoration</h3>
              <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-600"} leading-relaxed`}>
                Symmetric modeling outlines what real lighting and noise structures likely existed before post-production filters.
              </p>
            </div>

            {/* Bento Block 5: Metadata Diagnostics */}
            <div className={`p-6 rounded-2xl border ${theme === "dark" ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"} md:col-span-2 lg:col-span-3 text-left space-y-4 shadow-sm`}>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg w-fit">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg">Metadata Streams & Camera Signature Diagnostics</h3>
              <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-600"} leading-relaxed`}>
                Audit underlying digital EXIF tags, GPS sequences, capture timestamp synchronization, color calibration, software editing flags, and optical focal ranges. Even when stripped, we extract software footprint anomalies left deep in the binary chunk tables.
              </p>
              <div className="flex gap-2 font-mono text-[9px] text-emerald-400">
                <span className="px-2 py-0.5 rounded bg-emerald-500/5 border border-emerald-500/10">EXIF Signature Sync</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/5 border border-emerald-500/10">Quantization Matrices</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/5 border border-emerald-500/10">ICC Profile Validation</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS: SYSTEM DEPLOYMENT MODULES */}
      <section id="how-it-works-section" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            The Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7C3AED]">Forensic Path</span>
          </h2>
          <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
            Execute institutional scans in three immediate, secure, and intuitive operational stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          
          {/* Connector lines between steps (only desktop) */}
          <div className="hidden md:block absolute top-[2.2rem] left-1/4 right-1/4 h-0.5 border-t border-dashed border-cyan-500/10 -z-10" />

          {/* Step 1 */}
          <div className="space-y-4 text-center">
            <div className={`mx-auto w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono font-bold text-sm ${
              theme === "dark" ? "border-cyan-500/30 bg-slate-900 text-cyan-400" : "border-cyan-500/70 bg-white text-cyan-500"
            }`}>
              01
            </div>
            <h3 className="font-display font-bold text-base">Deliver Asset</h3>
            <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-600"} max-w-xs mx-auto leading-relaxed`}>
              Drag and drop any picture file into the secure, fully sandbox-locked forensic terminal.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-4 text-center">
            <div className={`mx-auto w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono font-bold text-sm ${
              theme === "dark" ? "border-purple-500/30 bg-slate-900 text-purple-400" : "border-purple-500/70 bg-white text-purple-500"
            }`}>
              02
            </div>
            <h3 className="font-display font-bold text-base">Analyze Pixels</h3>
            <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-600"} max-w-xs mx-auto leading-relaxed`}>
              Our multi-layered AI parses Fourier transforms, lighting angles, ELA matrices, and metadata markers.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-4 text-center">
            <div className={`mx-auto w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono font-bold text-sm ${
              theme === "dark" ? "border-emerald-500/30 bg-slate-900 text-emerald-400" : "border-emerald-500/70 bg-white text-emerald-500"
            }`}>
              03
            </div>
            <h3 className="font-display font-bold text-base">Review Report & Verdict</h3>
            <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-600"} max-w-xs mx-auto leading-relaxed`}>
              Receive an exportable report displaying authenticity percentages, difference heatmaps, and restored original appearance slider frames.
            </p>
          </div>

        </div>
      </section>

      {/* 7. PRICING SECTION: TRANSPARENT TIERS */}
      <section id="pricing-section" className={`py-24 ${theme === "dark" ? "bg-slate-950/40 border-y border-white/5" : "bg-slate-50 border-y border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              Honest, Volume-Scaled <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7C3AED]">Pricing Plans</span>
            </h2>
            <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
              Unlock institutional digital forensics tools. Pay as you go, with zero hidden setup charges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Tier 1: Sandbox Explorer */}
            <div className={`p-8 rounded-2xl border text-left flex flex-col justify-between ${
              theme === "dark" ? "bg-slate-900/20 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <div>
                <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Sandbox Protocol</span>
                <h3 className="font-display font-medium text-2xl mt-1 mb-4">Explorer</h3>
                <div className="flex items-baseline mb-6">
                  <span className="font-display text-4xl font-extrabold">$0</span>
                  <span className="text-xs text-slate-500 ml-1">/ forever</span>
                </div>
                <ul className="space-y-3.5 text-xs text-slate-500 mb-8">
                  <li className="flex items-center gap-2 text-slate-400">
                    <Check className="w-4 h-4 text-cyan-400" /> Web Upload Forensics Panel
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <Check className="w-4 h-4 text-cyan-400" /> AI Score Verification
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <Check className="w-4 h-4 text-cyan-400" /> Global ELA Estimation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 flex items-center justify-center text-slate-600 font-bold">&times;</span> No Metadata Tag Recovery
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 flex items-center justify-center text-slate-600 font-bold">&times;</span> No High Res Export Sheets
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => setCurrentPage("analysis")}
                className={`w-full py-2.5 rounded-lg font-sans text-xs font-medium border text-center transition-colors ${
                  theme === "dark" 
                    ? "border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:text-white" 
                    : "border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                Launch Simulator
              </button>
            </div>

            {/* Tier 2: Professional Sentinel */}
            <div className="p-8 rounded-2xl border text-left flex flex-col justify-between relative bg-slate-950 border-cyan-500/35 overflow-hidden shadow-xl shadow-cyan-500/5">
              <div className="absolute top-0 right-0 py-1.5 px-4 bg-gradient-to-l from-cyan-500 to-purple-500 rounded-bl text-[8px] font-mono uppercase tracking-wider text-slate-950 font-bold">
                MOST POPULAR TIED
              </div>
              <div>
                <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest">Director Protocol</span>
                <h3 className="font-display font-medium text-2xl mt-1 mb-4 text-white">Forensic Expert</h3>
                <div className="flex items-baseline mb-6 text-white">
                  <span className="font-display text-4xl font-extrabold">$49</span>
                  <span className="text-xs text-slate-400 ml-1">/ month</span>
                </div>
                <ul className="space-y-3.5 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" /> Unlimited Real-Time Image Queries
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" /> In-Depth Difference Heatmaps
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" /> Deep EXIF Hardware & Software Recovery
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" /> Interactive Before/After Compare Sliders
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-400" /> Premium Technical PDF Report Exports
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => setCurrentPage("analysis")}
                className="w-full py-2.5 rounded-lg font-sans text-xs font-medium bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] hover:opacity-95 text-white shadow-md text-center"
              >
                Access Premium Sandbox &rarr;
              </button>
            </div>

            {/* Tier 3: Enterprise Solaris */}
            <div className={`p-8 rounded-2xl border text-left flex flex-col justify-between ${
              theme === "dark" ? "bg-slate-900/20 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <div>
                <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Command Protocol</span>
                <h3 className="font-display font-medium text-2xl mt-1 mb-4">Enterprise</h3>
                <div className="flex items-baseline mb-6">
                  <span className="font-display text-4xl font-extrabold">$249</span>
                  <span className="text-xs text-slate-500 ml-1">/ month</span>
                </div>
                <ul className="space-y-3.5 text-xs text-slate-500 mb-8">
                  <li className="flex items-center gap-2 text-slate-400">
                    <Check className="w-4 h-4 text-cyan-400" /> Dedicated Forensic Flow Node SDKs
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <Check className="w-4 h-4 text-cyan-400" /> Batch-Upload Automation (API)
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <Check className="w-4 h-4 text-cyan-400" /> SOC3 Audit Lock telemetry
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <Check className="w-4 h-4 text-cyan-400" /> SLA Guaranteed Up-Time 99.99%
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <Check className="w-4 h-4 text-cyan-400" /> 24/7 Forensic Engineer Support
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => setCurrentPage("analysis")}
                className={`w-full py-2.5 rounded-lg font-sans text-xs font-medium border text-center transition-colors ${
                  theme === "dark" 
                    ? "border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:text-white" 
                    : "border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                Contact Sovereign Sales
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION: TOGGLE ACCORDIONS */}
      <section id="faq-section" className="py-24 max-w-4xl mx-auto px-4 space-y-12">
        <h2 className="font-display text-3xl font-extrabold text-center">
          Frequently Answered <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7C3AED]">Security Queries</span>
        </h2>
        
        <div className={`rounded-2xl border divide-y overflow-hidden ${
          theme === "dark" ? "bg-slate-900/10 border-slate-800 divide-slate-800" : "bg-white border-slate-200 divide-slate-200"
        }`}>
          {faqs.map((faq, i) => {
            const isOpen = activeFaq === i;
            return (
              <div key={i} className="transition-all duration-300">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : i)}
                  className="w-full py-5 px-6 flex justify-between items-center text-left hover:bg-cyan-500/5 transition-all focus:outline-none"
                >
                  <span className={`font-display text-sm font-semibold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className={`p-6 text-xs leading-relaxed ${theme === "dark" ? "text-slate-400 bg-slate-950/20" : "text-slate-600 bg-slate-50/50"}`}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. SECURE CALL TO ACTION (CTA) SECTION */}
      <section id="cta-section" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden py-16 px-8 text-center bg-gradient-to-b from-[#111827] to-[#0A0F1C] border border-cyan-500/20 shadow-2xl space-y-8">
          <div className="absolute top-0 right-0 p-8 text-[#00E5FF]/5 font-mono text-8xl font-bold select-none">
            SOLARIS
          </div>
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              Ready to verify the origin?
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
              Unlock our sandbox testing environment now. Drag, drop, analyze, and inspect absolute visual authenticity data instantly.
            </p>
          </div>
          <button
            id="cta-primary-btn"
            onClick={() => setCurrentPage("analysis")}
            className="px-8 py-3.5 rounded-xl bg-[#00E5FF] text-slate-950 font-bold hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-400/20 glow-btn"
          >
            Deploy Sandbox Terminal
          </button>
        </div>
      </section>

      {/* 10. PROFESSIONAL CORPORATE FOOTER */}
      <footer id="footer-section" className={`py-12 border-t ${theme === "dark" ? "border-slate-800 bg-[#070b14]" : "border-slate-200 bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-left text-xs text-slate-500 font-mono">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className={`font-display font-bold text-sm tracking-tight ${theme === "dark" ? "text-slate-200" : "text-slate-900"}`}>
                Truth<span className="text-cyan-400">Lens</span> AI
              </span>
            </div>
            <p className="text-[11px] font-sans leading-relaxed">
              Premium visual forensic analytics suite checking digital asset credentials, splicing matrices and generative model signatures.
            </p>
          </div>

          <div>
            <h4 className={`text-[11px] uppercase tracking-wider font-bold mb-4 ${theme === "dark" ? "text-slate-400" : "text-slate-700"}`}>Laboratories</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setCurrentPage("analysis")} className="hover:text-cyan-400">Error Level Analyzer</button></li>
              <li><button onClick={() => setCurrentPage("analysis")} className="hover:text-cyan-400">Chromatic Deviations</button></li>
              <li><button onClick={() => setCurrentPage("analysis")} className="hover:text-cyan-400">Spectral DFT Engine</button></li>
              <li><button onClick={() => setCurrentPage("analysis")} className="hover:text-cyan-400">EXIF Parser v4</button></li>
            </ul>
          </div>

          <div>
            <h4 className={`text-[11px] uppercase tracking-wider font-bold mb-4 ${theme === "dark" ? "text-slate-400" : "text-slate-700"}`}>Protocols</h4>
            <ul className="space-y-2">
              <li><span className="hover:underline">ISO 27001 Validation</span></li>
              <li><span className="hover:underline">ZeroLog Architecture</span></li>
              <li><span className="hover:underline">Transit AES-GCM Encrypt</span></li>
              <li><span className="text-cyan-400 hover:underline">Forensic API Spec</span></li>
            </ul>
          </div>

          <div className="space-y-4 text-[11px]">
            <div>
              <span className={`block font-bold ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>TRUTHLENS COMPLIANCE GATEWAY</span>
              <span>Online Platform State: STABLE_200</span>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span>© 2026 TruthLens Software Inc. All sovereign rights reserved. Designed for digital assurance.</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
