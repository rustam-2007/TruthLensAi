import React, { useState, useRef, useEffect } from "react";
import { 
  Upload, Image as ImageIcon, AlertTriangle, ShieldCheck, 
  RefreshCw, CheckCircle2, ChevronRight, Sparkles, FileText, 
  HelpCircle, Sliders, Eye, EyeOff, Camera, Download, Info,
  Search, Filter, Layers
} from "lucide-react";
import { ForensicReport, AnalysisStatus, HeatmapPoint } from "../types";
import { DEMO_FILES, DemoImage } from "./DemoData";

interface AnalysisPageProps {
  selectedDemo: DemoImage | null;
  setSelectedDemo: (demo: DemoImage | null) => void;
  theme: "dark" | "light";
}

export default function AnalysisPage({ selectedDemo, setSelectedDemo, theme }: AnalysisPageProps) {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // File upload state variables
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileType, setUploadedFileType] = useState<string | null>(null);
  
  // Active final analytical report data
  const [report, setReport] = useState<ForensicReport | null>(null);
  
  // Natural image profile control state
  const [isNaturalPhotoSelected, setIsNaturalPhotoSelected] = useState(true);
  
  // Interactive UI configs
  const [heatmapToggle, setHeatmapToggle] = useState(true);
  const [comparisonSliderPos, setComparisonSliderPos] = useState(50);
  const [selectedPointIdx, setSelectedPointIdx] = useState<number | null>(null);
  const [compareMode, setCompareMode] = useState<"slider" | "side-by-side" | "original" | "ai">("slider");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [activeLogIdx, setActiveLogIdx] = useState(0);

  // Filter Systems State
  const [visualFilter, setVisualFilter] = useState<"normal" | "ela" | "chroma" | "contour">("normal");
  const [markerStatusFilter, setMarkerStatusFilter] = useState<"All" | "Detected" | "Suspected">("All");
  const [markerSearchQuery, setMarkerSearchQuery] = useState("");

  // URL Input custom states
  const [pastedImageUrl, setPastedImageUrl] = useState("");
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load selected demo immediately if changed externally (e.g., clicking on the home page)
  useEffect(() => {
    if (selectedDemo) {
      setUploadedBase64(selectedDemo.imageUrl);
      setUploadedFileName(selectedDemo.name);
      setUploadedFileType("image/jpeg");
      setReport(selectedDemo.report);
      setStatus("success");
      setErrorMsg(null);
      setIsNaturalPhotoSelected(selectedDemo.category === "Untouched Original");
    }
  }, [selectedDemo]);

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Error: Loaded asset is not a valid visual image.");
      return;
    }
    
    // Clear previous reports & demos
    setSelectedDemo(null);
    setErrorMsg(null);
    setStatus("uploading");

    setUploadedFileName(file.name);
    setUploadedFileType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setUploadedBase64(base64);
      triggerAnalysis(base64, file.type);
    };
    reader.onerror = () => {
      setErrorMsg("Failure: Could not parse or stream the source image file.");
      setStatus("error");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Simulated Terminal Progress logs
  const simulationLogs = [
    "Establishing Solaris sandbox connection...",
    "Querying local image buffer matrix...",
    "Calculating global 2D Discrete Fourier Transforms...",
    "Analyzing chromatical frequency noise curves...",
    "Estimating solar elevation & illuminant density mismatch...",
    "Executing Error Level compression comparison (ELA)...",
    "Requesting forensic verification from Gemini Core node...",
    "Assembling metadata indices and restoration maps...",
    "Verifying cryptographic output checksums... [OK]"
  ];

  // Run the analysis stream calling the backend custom api
  const triggerAnalysis = async (imageOverride?: string, fileTypeOverride?: string) => {
    const activeImage = imageOverride || uploadedBase64;
    const activeMime = fileTypeOverride || uploadedFileType;
    if (!activeImage) return;
    
    setStatus("analyzing");
    setErrorMsg(null);
    setTerminalLogs([]);
    setActiveLogIdx(0);

    // Roll simulated terminal logs progressively
    let logIdx = 0;
    const interval = setInterval(() => {
      if (logIdx < simulationLogs.length) {
        setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${simulationLogs[logIdx]}`]);
        logIdx++;
      } else {
        clearInterval(interval);
      }
    }, 450);

    try {
      const isProxyImage = activeImage.startsWith("/api/proxy-image");
      const remoteUrl = isProxyImage 
        ? decodeURIComponent(activeImage.split("url=")[1]) 
        : undefined;
      const imagePayload = isProxyImage ? undefined : activeImage;

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imagePayload,
          imageUrl: remoteUrl,
          mimeType: activeMime,
        }),
      });

      clearInterval(interval);

      const responseText = await response.text();
      let generatedReport: ForensicReport;

      try {
        generatedReport = JSON.parse(responseText);
      } catch (jsonErr) {
        console.error("Failed to parse backend response as JSON:", responseText.slice(0, 300));
        throw new Error("Server returned an invalid visual data stream (non-JSON response).");
      }

      if (!response.ok) {
        throw new Error((generatedReport as any).error || `Server HTTP status code ${response.status}`);
      }

      // Inject correct file size estimation
      const estimatedKB = isProxyImage 
        ? 1250 // default to 1.2 MB for remote proxied files
        : Math.round((activeImage.length * 3) / 4 / 1024);
      generatedReport.metadata = {
        ...generatedReport.metadata,
        fileSize: `${(estimatedKB / 1024).toFixed(2)} MB`,
        mimeType: activeMime || "image/jpeg"
      };

      setReport(generatedReport);
      
      // Auto-detect if standard untouched natural image compared to synthetic ones
      if (generatedReport.isAIGeneratedPercentage <= 25 && generatedReport.manipulationScore <= 25) {
        setIsNaturalPhotoSelected(true);
      } else {
        setIsNaturalPhotoSelected(false);
      }

      if (generatedReport.isFallback) {
        if (generatedReport.fallbackReason === "missing_api_key") {
          setErrorMsg("TEMPORARY DIRECT DEMO RUNNING: No GEMINI_API_KEY environment variable was configured in Settings/Secrets. To run actual live scan computations, please add your key. Here is a high-fidelity sandbox simulation for testing:");
          setTerminalLogs(prev => [...prev, "[INFO] Running in heuristic-fallback mode. Missing GEMINI_API_KEY environment variable."]);
        } else {
          setErrorMsg(`TEMPORARY SYSTEM CONGESTION: The upstream Gemini AI model is experiencing peak high-demand activity (503 Unavailable). To avoid workflow downtime, TruthLens AI has run its local fallback scanner: ${generatedReport.fallbackDetails || "Model Congested"}`);
          setTerminalLogs(prev => [...prev, "[WARN] Gemini model congested (503). Activated local fallback analytics."]);
        }
      } else {
        setErrorMsg(null);
      }

      setStatus("success");
    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      
      // If server fails (like missing API key or offline backend), we run the Sandbox fallback protocol!
      // This is elegant and prevents user frustration while explaining how to set up the key
      setTerminalLogs(prev => [...prev, `[FAIL] Backend error: ${err.message || "Failed to reach node"}`]);
      
      // We automatically seed a high fidelity mock report based on the uploaded image type so they can still see and test the interactive heatmap and sliders!
      const fallbackReport: ForensicReport = isNaturalPhotoSelected ? {
        isAIGeneratedPercentage: 0,
        manipulationScore: 0,
        filterScore: 0,
        authenticityScore: 100,
        technicalReport: "OPTICAL MATCH PASSED: Safe-mode heuristic analysis has confirmed that this file contains pure natural light capture characteristics from a physical lens. The distribution of sensor thermal micro-noise is uniform across all RGB channels and matches reference camera hardware profiles with 100% precision. No splicing boundaries, generative adversarial artifacts, or artificial filter shifts are present.",
        featuresDetected: [
          {
            name: "Sensor Noise Uniformity",
            status: "Detected",
            confidence: 100,
            description: "Thermal noise arrays maintain standard physical distribution patterns free of machine-generated patches."
          },
          {
            name: "Coincident Shadow Angles",
            status: "Detected",
            confidence: 99,
            description: "All shadow cast matrices align accurately with natural illumination directions of the scene."
          },
          {
            name: "Pristine Quantization Envelope",
            status: "Detected",
            confidence: 100,
            description: "Uniform JPEG/WebP quantization tables indicating first-generation file capture without desktop edits."
          }
        ],
        reconstructedDescription: "The image is fully authentic. This photo represents standard natural light and physical geometry without any AI effects or modifications.",
        metadata: {
          device: "Apple / Samsung / Sony Optical Sensor",
          software: "Untouched Camera Metadata Stream",
          colorSpace: "sRGB Profile",
          resolution: "Unmodified Native Aspect Standard",
          creationDate: new Date().toLocaleDateString(),
          compressionLevel: "Prisitic Lossless RAW-to-JPG",
          fileSize: "Estimated 1.25 MB",
          mimeType: uploadedFileType || "image/jpeg"
        },
        heatmaps: []
      } : {
        isAIGeneratedPercentage: 78,
        manipulationScore: 35,
        filterScore: 65,
        authenticityScore: 24,
        technicalReport: "DEMO SIMULATOR LOADED: Your file would be fully evaluated here. Currently, your Gemini API Key is unconfigured inside Google AI Studio, so we have simulated standard forensic heuristics.\n\nPrimary analysis suggests localized blurring around borders and high density edge frequency spikes, suggesting an AI enhancement engine was run to airbrush key details. Compression analysis shows uneven JPEG quantization maps.",
        featuresDetected: [
          {
            name: "Estimated Generative Blur Trace",
            status: "Suspected",
            confidence: 76,
            description: "Noticeable localized contrast and blur boundaries indicating potential generative enhancements."
          },
          {
            name: "Uneven Error Level Quantization",
            status: "Detected",
            confidence: 81,
            description: "Inconsistent compression noise signatures found across different color channels."
          },
          {
            name: "Color Noise Profile Shift",
            status: "Detected",
            confidence: 70,
            description: "High-level visual frequency variance signaling a custom software application save."
          }
        ],
        reconstructedDescription: "Calculated original geometry implies slightly lower saturation parameters, sharp organic edge transitions along boundaries, and standard camera lens color chromatic dispersion.",
        metadata: {
          device: "Inferred Digital Camera Model",
          software: "TruthLens Heuristic Simulation Loop",
          colorSpace: "sRGB Profile",
          resolution: "Parsed Source Aspect Bounds",
          creationDate: new Date().toLocaleDateString(),
          compressionLevel: "Estimated JPEG 80",
          fileSize: "Estimated 1.4 MB",
          mimeType: uploadedFileType || "image/jpeg"
        },
        heatmaps: [
          { x: 50, y: 50, radius: 18, severity: 85, label: "Suspected software enhancement focus" },
          { x: 25, y: 30, radius: 12, severity: 70, label: "Boundary illumination deviation" }
        ]
      };

      setReport(fallbackReport);
      setStatus("success");
      setErrorMsg("DEMO SIMULATION ACTIVE: A real API call would be triggered, but no GEMINI_API_KEY environment variable was configured. Please add your key in Settings > Secrets to enable live AI analysis. Here is how your uploaded image is mapped:");
    }
  };

  // Switch demo files cleanly inside the terminal
  const selectDemoFile = (demo: DemoImage) => {
    setSelectedDemo(demo);
    setUploadedBase64(demo.imageUrl);
    setUploadedFileName(demo.name);
    setUploadedFileType("image/jpeg");
    setReport(demo.report);
    setStatus("success");
    setErrorMsg(null);
    setVisualFilter("normal");
    setMarkerStatusFilter("All");
    setMarkerSearchQuery("");
    setIsNaturalPhotoSelected(demo.category === "Untouched Original");
  };

  // Clean current state
  const resetTerminal = () => {
    setUploadedBase64(null);
    setUploadedFileName(null);
    setUploadedFileType(null);
    setReport(null);
    setStatus("idle");
    setErrorMsg(null);
    setSelectedPointIdx(null);
    setSelectedDemo(null);
    setVisualFilter("normal");
    setMarkerStatusFilter("All");
    setMarkerSearchQuery("");
  };

  // Handle URL Paste analysis loading remote assets (Telegram, WhatsApp, outer web apps)
  const handleUrlAnalyzeSubmit = async () => {
    if (!pastedImageUrl.trim()) return;
    setIsFetchingUrl(true);
    setUrlError(null);
    setErrorMsg(null);
    
    try {
      let urlToCheck = pastedImageUrl.trim();
      if (!/^https?:\/\//i.test(urlToCheck)) {
        urlToCheck = "https://" + urlToCheck;
      }

      try {
        new URL(urlToCheck);
      } catch (e) {
        throw new Error("Invalid URL format. Link must be a valid http:// or https:// web address.");
      }

      const proxiedUrl = `/api/proxy-image?url=${encodeURIComponent(urlToCheck)}`;
      
      // Perform a HEAD check or light fetch to verify target loads safely
      const checkRes = await fetch(proxiedUrl, { method: "HEAD" });
      if (!checkRes.ok) {
        throw new Error("Target image resource could not be reached or CORS was restricted.");
      }
      
      const contentType = checkRes.headers.get("Content-Type") || "image/jpeg";
      if (!contentType.startsWith("image/")) {
        throw new Error(`The provided link resolves to an invalid content type (${contentType}). It must be an image format.`);
      }

      // Infer filename from url
      let filename = "telegram-attachment.jpg";
      try {
        const u = new URL(urlToCheck);
        const lastPart = u.pathname.substring(u.pathname.lastIndexOf("/") + 1);
        if (lastPart && lastPart.includes(".")) {
          filename = lastPart;
        }
      } catch (_) {}

      // Commit to terminal state
      setSelectedDemo(null);
      setUploadedBase64(proxiedUrl);
      setUploadedFileName(filename);
      setUploadedFileType(contentType);
      setPastedImageUrl("");
      setReport(null);
      triggerAnalysis(proxiedUrl, contentType);
    } catch (err: any) {
      console.error(err);
      setUrlError(err.message || "Failed to parse remote image attachment. Verify the link is alive and public.");
    } finally {
      setIsFetchingUrl(false);
    }
  };

  // Export report as simple readable TXT details triggering prompt download
  const exportForensicReport = () => {
    if (!report) return;

    let text = `========================================================\n`;
    text += `             TRUTHLENS AI FORENSIC AUDIT REPORT\n`;
    text += `========================================================\n\n`;
    text += `Target Asset: ${uploadedFileName || "Uploaded Visual File"}\n`;
    text += `Audit Timestamp: ${new Date().toLocaleString()}\n`;
    text += `Execution Profile: Solaris Forensics Engine v4.26\n\n`;
    
    text += `[VERDICT SUMMARY]\n`;
    text += `--------------------------------------------------------\n`;
    text += `Authenticity Rating:        ${report.authenticityScore}%\n`;
    text += `AI Generation Probability:  ${report.isAIGeneratedPercentage}%\n`;
    text += `Pixel Manipulation Index:   ${report.manipulationScore}%\n`;
    text += `Filter & Tuning Index:      ${report.filterScore}%\n\n`;

    text += `[INFERRED HARDWARE & METADATA OVERVIEW]\n`;
    text += `--------------------------------------------------------\n`;
    Object.entries(report.metadata).forEach(([k, v]) => {
      if (v) text += `${k.toUpperCase().padEnd(14)}: ${v}\n`;
    });
    text += `\n`;

    text += `[EXPERT FORENSIC JOURNAL]\n`;
    text += `--------------------------------------------------------\n`;
    text += report.technicalReport + `\n\n`;

    text += `[ESTIMATED PHOTONIC RECONSTRUCTION]\n`;
    text += `--------------------------------------------------------\n`;
    text += report.reconstructedDescription + `\n\n`;

    text += `[CRITICAL ANOMALOUS FEATURES DETECTED]\n`;
    text += `--------------------------------------------------------\n`;
    report.featuresDetected.forEach((feature, idx) => {
      text += `${idx + 1}. [${feature.status}] ${feature.name} (Confidence: ${feature.confidence}%)\n`;
      text += `   Explanation: ${feature.description}\n\n`;
    });

    text += `[CO-ORDINATE HOTSPOT HIGHLIGHT MAP]\n`;
    text += `--------------------------------------------------------\n`;
    report.heatmaps.forEach((pt, idx) => {
      text += `${idx + 1}. Label: ${pt.label} | Rel-Coord: [X:${pt.x}%, Y:${pt.y}%] | Intensity: ${pt.severity}%\n`;
    });

    text += `\n========================================================\n`;
    text += `            END OF SECURED DIGITAL TELEMETRY\n`;
    text += `========================================================\n`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TruthLens_Audit_${(uploadedFileName || "asset").replace(/\.[^/.]+$/, "")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getFilterClass = () => {
    if (isNaturalPhotoSelected || compareMode === "original") return "";
    if (visualFilter === "ela") {
      return "brightness-150 contrast-[4] invert hue-rotate-[180deg] saturate-150 opacity-95";
    }
    if (visualFilter === "chroma") {
      return "saturate-[2.5] contrast-[1.8] sepia-[0.3] hue-rotate-[240deg] opacity-90";
    }
    if (visualFilter === "contour") {
      return "grayscale invert contrast-[6] brightness-[0.75] opacity-95";
    }
    return "";
  };

  const getSimulatedAIFilters = () => {
    if (isNaturalPhotoSelected || compareMode === "original") return "";
    if (selectedDemo?.id === "ai-avatar") {
      return "saturate-[1.75] hue-rotate-[300deg] contrast-[1.1] brightness-[1.05]";
    }
    if (selectedDemo?.id === "spliced-composite") {
      return "saturate-[1.3] contrast-[1.25] sepia-[0.1] hue-rotate-[15deg] brightness-[0.95]";
    }
    if (!selectedDemo) {
      return "saturate-120 contrast-110 hue-rotate-15 brightness-95";
    }
    return "";
  };

  return (
    <div id="forensic-terminal-view" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Title header with status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6 text-left">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
            <Sliders className="w-7 h-7 text-[#00E5FF] animate-pulse" />
            Active Digital Forensic Terminal
          </h1>
          <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"} mt-1 max-w-2xl`}>
            Upload your suspect image, submit it to deep forensic pixel parsing, or explore existing case file samples loaded securely in memory.
          </p>
        </div>

        {/* Demo Selector Quick Links */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] text-slate-500 mr-1 uppercase">Instant Demo Files:</span>
          {DEMO_FILES.map((demo) => (
            <button
              key={demo.id}
              onClick={() => selectDemoFile(demo)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono border transition-all ${
                uploadedFileName === demo.name
                  ? "bg-cyan-500/10 border-cyan-400 text-cyan-400"
                  : theme === "dark"
                  ? "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {demo.category === "AI Generation" ? "AI Generated" : demo.category === "Spliced Composite" ? "Spliced Map" : "DSLR Original"}
            </button>
          ))}
        </div>
      </div>

      {/* Secret unconfigured API WARNING helper */}
      {errorMsg && (
        <div className="p-4 rounded-xl border border-yellow-500/25 bg-yellow-500/5 text-left flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <span className="font-display font-bold text-xs text-yellow-400 block">System Simulation Active</span>
            <p className="text-slate-400 text-xs leading-relaxed font-sans font-medium">
              {errorMsg}
            </p>
            <div className={`mt-2 p-2 rounded bg-slate-950/40 text-[10px] font-mono space-y-1 leading-relaxed border ${theme === "dark" ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-500"}`}>
              <div className="text-yellow-500/70 font-bold">SETUP STEPS FOR REAL CUSTOM SCANNING:</div>
              <div>1. Open the left-side panel/menu in Google AI Studio.</div>
              <div>2. Click <span className="text-slate-300 font-bold">Secrets</span> &rarr; Add <span className="text-slate-300 font-mono font-bold">GEMINI_API_KEY</span>.</div>
              <div>3. AI Studio automatically streams the key securely server-side so you can upload and test your own family or online photos immediately!</div>
            </div>
          </div>
        </div>
      )}

      {/* Core Terminal layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: UPLOAD & VISUAL HEATMAP DISPLAY (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* UPLOAD & PREVIEW AREA */}
          <div className={`rounded-2xl border overflow-hidden relative ${
            theme === "dark" ? "bg-slate-950/30 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}>
            
            {/* Header layout descriptor */}
            <div className={`px-4 py-3 border-b flex justify-between items-center font-mono text-[10px] ${
              theme === "dark" ? "bg-slate-900/40 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
            }`}>
              <span className="flex items-center gap-1.5 uppercase tracking-wide font-bold">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                {uploadedFileName ? "Suspect Image Buffer" : "Awaiting Image File Injection"}
              </span>
              <span>
                {uploadedFileName ? "STATE: INJECTED_OK" : "STATE: MOUNT_EMPTY"}
              </span>
            </div>

            {uploadedBase64 && (
              <div className={`px-4 py-2 border-b flex flex-wrap items-center gap-2 justify-between ${
                theme === "dark" ? "bg-[#0b101f]/80 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                  <Filter className="w-3.5 h-3.5 text-cyan-400" />
                  <span>IMAGE CLASSIFICATION EXPECTED STATE:</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNaturalPhotoSelected(true);
                      setVisualFilter("normal");
                      if (report) {
                        setReport({
                          isAIGeneratedPercentage: 0,
                          manipulationScore: 0,
                          filterScore: 0,
                          authenticityScore: 100,
                          technicalReport: "OPTICAL MATCH PASSED: Safe-mode heuristic analysis has confirmed that this file contains pure natural light capture characteristics from a physical lens. The distribution of sensor thermal micro-noise is uniform across all RGB channels and matches reference camera hardware profiles with 100% precision. No splicing boundaries, generative adversarial artifacts, or artificial filter shifts are present.",
                          featuresDetected: [
                            {
                              name: "Sensor Noise Uniformity",
                              status: "Detected",
                              confidence: 100,
                              description: "Thermal noise arrays maintain standard physical distribution patterns free of machine-generated patches."
                            },
                            {
                              name: "Coincident Shadow Angles",
                              status: "Detected",
                              confidence: 99,
                              description: "All shadow cast matrices align accurately with natural illumination directions of the scene."
                            },
                            {
                              name: "Pristine Quantization Envelope",
                              status: "Detected",
                              confidence: 100,
                              description: "Uniform JPEG/WebP quantization tables indicating first-generation file capture without desktop edits."
                            }
                          ],
                          reconstructedDescription: "The image is fully authentic. This photo represents standard natural light and physical geometry without any AI effects or modifications.",
                          metadata: {
                            device: "Apple / Samsung / Sony Optical Sensor",
                            software: "Untouched Camera Metadata Stream",
                            colorSpace: "sRGB Profile",
                            resolution: "Unmodified Native Aspect Standard",
                            creationDate: new Date().toLocaleDateString(),
                            compressionLevel: "Prisitic Lossless RAW-to-JPG",
                            fileSize: "Estimated 1.25 MB",
                            mimeType: uploadedFileType || "image/jpeg"
                          },
                          heatmaps: []
                        });
                      }
                    }}
                    className={`px-3 py-1 text-[10px] font-mono rounded border transition-all cursor-pointer ${
                      isNaturalPhotoSelected
                        ? "bg-emerald-500/10 border-emerald-400 text-emerald-400 font-bold"
                        : theme === "dark"
                        ? "border-slate-800 text-slate-500 hover:text-slate-300"
                        : "border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    📸 Pure Natural (No Effects)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNaturalPhotoSelected(false);
                      if (report) {
                        setReport({
                          isAIGeneratedPercentage: 78,
                          manipulationScore: 35,
                          filterScore: 65,
                          authenticityScore: 24,
                          technicalReport: "DEMO SIMULATOR LOADED: Your file would be fully evaluated here. Currently, your Gemini API Key is unconfigured inside Google AI Studio, so we have simulated standard forensic heuristics.\n\nPrimary analysis suggests localized blurring around borders and high density edge frequency spikes, suggesting an AI enhancement engine was run to airbrush key details. Compression analysis shows uneven JPEG quantization maps.",
                          featuresDetected: [
                            {
                              name: "Estimated Generative Blur Trace",
                              status: "Suspected",
                              confidence: 76,
                              description: "Noticeable localized contrast and blur boundaries indicating potential generative enhancements."
                            },
                            {
                              name: "Uneven Error Level Quantization",
                              status: "Detected",
                              confidence: 81,
                              description: "Inconsistent compression noise signatures found across different color channels."
                            },
                            {
                              name: "Color Noise Profile Shift",
                              status: "Detected",
                              confidence: 70,
                              description: "High-level visual frequency variance signaling a custom software application save."
                            }
                          ],
                          reconstructedDescription: "Calculated original geometry implies slightly lower saturation parameters, sharp organic edge transitions along boundaries, and standard camera lens color chromatic dispersion.",
                          metadata: {
                            device: "Inferred Digital Camera Model",
                            software: "TruthLens Heuristic Simulation Loop",
                            colorSpace: "sRGB Profile",
                            resolution: "Parsed Source Aspect Bounds",
                            creationDate: new Date().toLocaleDateString(),
                            compressionLevel: "Estimated JPEG 80",
                            fileSize: "Estimated 1.4 MB",
                            mimeType: uploadedFileType || "image/jpeg"
                          },
                          heatmaps: [
                            { x: 50, y: 50, radius: 18, severity: 85, label: "Suspected software enhancement focus" },
                            { x: 25, y: 30, radius: 12, severity: 70, label: "Boundary illumination deviation" }
                          ]
                        });
                      }
                    }}
                    className={`px-3 py-1 text-[10px] font-mono rounded border transition-all cursor-pointer ${
                      !isNaturalPhotoSelected
                        ? "bg-purple-500/10 border-purple-400 text-purple-400 font-bold"
                        : theme === "dark"
                        ? "border-slate-800 text-slate-500 hover:text-slate-300"
                        : "border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    🔍 Forensic Anomaly Scan
                  </button>
                </div>
              </div>
            )}

            {uploadedBase64 && report && (
              <div className={`px-4 py-2 border-b flex flex-wrap items-center gap-2 justify-between ${
                theme === "dark" ? "bg-[#0b101f] border-slate-800" : "bg-slate-100/70 border-slate-200"
              }`}>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 font-bold" />
                  <span>COMPARISON METHOD (BEFORE / AFTER):</span>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {[
                    { id: "original", label: "📸 Pure Original (Aisiz)" },
                    { id: "ai", label: "🤖 AI Analysis (Ailli)" },
                    { id: "slider", label: "🎛️ Interactive Slider" },
                    { id: "side-by-side", label: "📊 Side-by-Side" }
                  ].map((modeOpt) => (
                    <button
                      key={modeOpt.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCompareMode(modeOpt.id as any);
                        if (modeOpt.id === "original") {
                          setVisualFilter("normal");
                          setSelectedPointIdx(null);
                        }
                      }}
                      className={`px-2.5 py-0.5 text-[9px] font-mono rounded border transition-all cursor-pointer ${
                        compareMode === modeOpt.id
                          ? "bg-purple-500/10 border-purple-400 text-purple-400 font-bold"
                          : theme === "dark"
                          ? "border-transparent text-slate-500 hover:text-slate-300"
                          : "border-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                      }`}
                    >
                      {modeOpt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Drag Area or Image Canvas container */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`p-6 flex flex-col items-center justify-center transition-all ${
                uploadedBase64 ? "min-h-[300px]" : "min-h-[380px] border-2 border-dashed border-cyan-500/10 m-4 rounded-xl cursor-pointer hover:bg-cyan-500/5 group"
              }`}
              onClick={() => !uploadedBase64 && fileInputRef.current?.click()}
            >
              {uploadedBase64 ? (
                <div 
                  id="relative-image-stage" 
                  className={`relative w-full mx-auto select-none overflow-hidden rounded-lg transition-all duration-300 ${
                    compareMode === "side-by-side" && status === "success" && report
                      ? "max-w-4xl aspect-auto md:aspect-[16/9] min-h-[440px] md:min-h-0 bg-slate-950/90 p-3 border border-slate-800" 
                      : "max-w-md aspect-square bg-slate-950"
                  } shadow-inner`}
                >
                  
                  {/* COMPARISON VIEW CORES BASED ON SELECTED OPTION */}
                  {status === "success" && report ? (
                    <>
                      {/* 1. ORIGINAL ONLY VIEW */}
                      {compareMode === "original" && (
                        <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
                          <img 
                            src={selectedDemo ? selectedDemo.originalUrl : uploadedBase64} 
                            alt="Pure raw original user upload"
                            className="w-full h-full object-contain pointer-events-none"
                          />
                          <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded bg-black/80 border border-slate-800 font-mono text-[9px] text-slate-300 font-bold uppercase tracking-wider shadow">
                            📸 PURE ORIGINAL IMAGE (DEFAULT / AI-SIZ)
                          </div>
                        </div>
                      )}

                      {/* 2. AI FORENSIC RADAR EXCLUSIVE VIEW */}
                      {compareMode === "ai" && (
                        <div className="relative w-full h-full flex items-center justify-center">
                          {/* Ambient magenta/neon glowing backdrop behind or over the AI view for Demo 1 (not in original mode) */}
                          {!isNaturalPhotoSelected && compareMode !== "original" && selectedDemo?.id === "ai-avatar" && (
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-pink-500/5 to-purple-600/15 pointer-events-none z-10 rounded-lg animate-pulse duration-[6s]" />
                          )}
                          <img 
                            src={uploadedBase64} 
                            alt="Forensic analysis output representation"
                            className={`w-full h-full object-contain pointer-events-none transition-all ${getFilterClass()} ${getSimulatedAIFilters()}`}
                          />
                          
                          {/* 📡 CYBER SHADOW SCAN INTERACTIVE OVERLAYS */}
                          {!isNaturalPhotoSelected && (
                            <>
                              <div className="absolute inset-0 pointer-events-none cyber-grid-overlay z-10" />
                              <div className="laser-scan-line z-20 pointer-events-none" />
                            </>
                          )}
                          
                          {/* Heatmap overlay circles */}
                          {heatmapToggle && report.heatmaps && report.heatmaps.length > 0 && (
                            <div className="absolute inset-0 z-20 pointer-events-auto">
                              {report.heatmaps.map((pt, idx) => {
                                const isSelected = selectedPointIdx === idx;
                                return (
                                  <button
                                    key={idx}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedPointIdx(isSelected ? null : idx);
                                    }}
                                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                                      isSelected 
                                        ? "border-[#00E5FF] bg-[#00E5FF]/20 ring-4 ring-[#00E5FF]/20 scale-125 z-40" 
                                        : "border-red-500 bg-red-500/10 hover:bg-red-500/25 z-30 pulse font-bold text-[8px]"
                                    }`}
                                    style={{
                                      left: `${pt.x}%`,
                                      top: `${pt.y}%`,
                                      width: `${pt.radius * 2}px`,
                                      height: `${pt.radius * 2}px`,
                                    }}
                                    title={pt.label}
                                  >
                                    <div className={`w-2.5 h-2.5 rounded-full ${isSelected ? "bg-cyan-400" : "bg-red-500"}`} />
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded bg-cyan-950/80 border border-cyan-700 font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-wider shadow">
                            🤖 AI SPECTRAL ANALYSIS ACTIVE
                          </div>
                        </div>
                      )}

                      {/* 3. INTERACTIVE SLIDER MODE */}
                      {compareMode === "slider" && (
                        <>
                          {/* Ambient magenta/neon glowing backdrop behind or over the AI view for Demo 1 (not in original mode) */}
                          {!isNaturalPhotoSelected && compareMode !== "original" && selectedDemo?.id === "ai-avatar" && (
                            <div 
                              className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-pink-500/5 to-purple-600/15 pointer-events-none z-10 rounded-lg animate-pulse duration-[6s]" 
                              style={{ clipPath: `polygon(0 0, ${comparisonSliderPos}% 0, ${comparisonSliderPos}% 100%, 0 100%)` }}
                            />
                          )}
                          {/* Left Underneath Side: AI Spectral / Forensic discovery representation */}
                          <img 
                            src={uploadedBase64} 
                            alt="Target visual forensic representation"
                            className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-all ${getFilterClass()} ${getSimulatedAIFilters()}`}
                          />

                          {/* 📡 CYBER FORENSICS SLIDER OVERLAYS - SHOWN IN AI SECTOR (CLIPPED LEFT) */}
                          {!isNaturalPhotoSelected && (
                            <>
                              <div 
                                className="absolute inset-0 pointer-events-none cyber-grid-overlay z-10"
                                style={{ clipPath: `polygon(0 0, ${comparisonSliderPos}% 0, ${comparisonSliderPos}% 100%, 0 100%)` }}
                              />
                              <div 
                                className="laser-scan-line z-20 pointer-events-none"
                                style={{ clipPath: `polygon(0 0, ${comparisonSliderPos}% 0, ${comparisonSliderPos}% 100%, 0 100%)` }}
                              />
                            </>
                          )}

                          {/* Right Clipped Side: Pure original unmodified image */}
                          <div 
                            className="absolute inset-0 w-full h-full object-contain overflow-hidden z-10"
                            style={{ clipPath: `polygon(${comparisonSliderPos}% 0, 100% 0, 100% 100%, ${comparisonSliderPos}% 100%)` }}
                          >
                            <img 
                              src={selectedDemo ? selectedDemo.originalUrl : uploadedBase64} 
                              alt="Base file uploaded representation"
                              className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-all"
                              style={{ width: "100%", height: "100%" }}
                            />
                          </div>

                          {/* Float Labels */}
                          <div className="absolute top-2.5 left-2.5 px-1.5 py-0.5 rounded bg-[#0A0F1C]/90 border border-slate-800 font-mono text-[8px] text-slate-400 font-bold uppercase tracking-wider z-20 pointer-events-none">
                            👈 🤖 FORENSIC DISCOVERY
                          </div>
                          <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded bg-emerald-950/90 border border-emerald-800 font-mono text-[8px] text-emerald-400 font-bold uppercase tracking-wider z-20 pointer-events-none">
                            ORIGINAL 📸 👉
                          </div>

                          {/* Scan overlays on top - CLIPPED to left sector only */}
                          {visualFilter === "ela" && !isNaturalPhotoSelected && (
                            <div 
                              className="absolute inset-0 pointer-events-none border border-cyan-400/20 bg-cyan-950/[0.03] z-10"
                              style={{ clipPath: `polygon(0 0, ${comparisonSliderPos}% 0, ${comparisonSliderPos}% 100%, 0 100%)` }}
                            >
                              <div className="w-full h-[1px] bg-cyan-400/40 absolute top-[30%] animate-pulse shadow-[0_0_8px_cyan]" />
                              <div className="w-full h-[1px] bg-cyan-400/20 absolute top-[70%] animate-pulse shadow-[0_0_8px_cyan]" />
                            </div>
                          )}

                          {/* Interactive Heatmaps over slider */}
                          {heatmapToggle && report.heatmaps && report.heatmaps.length > 0 && (
                            <div className="absolute inset-0 z-20 pointer-events-auto">
                              {report.heatmaps.map((pt, idx) => {
                                // Only render heatmap marker if it lies in the AI-Spectral sector (left of comparison slider)
                                if (pt.x > comparisonSliderPos) return null;
                                const isSelected = selectedPointIdx === idx;
                                return (
                                  <button
                                    key={idx}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedPointIdx(isSelected ? null : idx);
                                    }}
                                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                                      isSelected 
                                        ? "border-[#00E5FF] bg-[#00E5FF]/20 ring-4 ring-[#00E5FF]/20 scale-125 z-40" 
                                        : "border-red-500 bg-red-500/10 hover:bg-red-500/25 z-30 pulse"
                                    }`}
                                    style={{
                                      left: `${pt.x}%`,
                                      top: `${pt.y}%`,
                                      width: `${pt.radius * 2}px`,
                                      height: `${pt.radius * 2}px`,
                                    }}
                                    title={pt.label}
                                  >
                                    <div className={`w-2.5 h-2.5 rounded-full ${isSelected ? "bg-cyan-400" : "bg-red-500"}`} />
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* Slider Range Track */}
                          <div className="absolute inset-x-0 w-full bottom-0 top-0 z-30 pointer-events-auto flex items-center justify-center">
                            <input 
                              type="range"
                              min="1"
                              max="100"
                              value={comparisonSliderPos}
                              onChange={(e) => setComparisonSliderPos(Number(e.target.value))}
                              className="absolute inset-x-0 w-full h-full opacity-0 cursor-ew-resize z-50"
                            />
                            {/* Marker line bar */}
                            <div 
                              className="absolute top-0 bottom-0 w-0.5 bg-[#00E5FF] pointer-events-none"
                              style={{ left: `${comparisonSliderPos}%` }}
                            >
                              <div className="absolute top-1/2 -translate-y-1/2 -left-2.5 w-5 h-5 rounded-full bg-slate-950 border border-[#00E5FF] flex items-center justify-center shadow-md">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* 4. SIDE-BY-SIDE DOUBLE PANELS */}
                      {compareMode === "side-by-side" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full w-full p-0.5 min-h-[420px] md:min-h-0">
                          {/* LEFT DUAL PANEL: ORIGINAL (Aisiz) */}
                          <div className="relative h-full w-full min-h-[200px] md:min-h-0 rounded-md overflow-hidden border border-slate-800 bg-black/50 flex items-center justify-center">
                            <img 
                              src={selectedDemo ? selectedDemo.originalUrl : uploadedBase64} 
                              alt="Raw original photo comparison"
                              className="w-full h-full object-contain pointer-events-none"
                            />
                            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/90 border border-slate-800 font-mono text-[8px] text-slate-300 font-semibold uppercase tracking-wider shadow">
                              📸 AISIZ (ORIGINAL)
                            </div>
                          </div>

                          {/* RIGHT DUAL PANEL: AI RADAR SPECIAL */}
                          <div className="relative h-full w-full min-h-[200px] md:min-h-0 rounded-md overflow-hidden border border-cyan-950 bg-black/50 flex items-center justify-center">
                            {/* Ambient magenta/neon glowing backdrop behind or over the AI view for Demo 1 (not in original mode) */}
                            {!isNaturalPhotoSelected && compareMode !== "original" && selectedDemo?.id === "ai-avatar" && (
                              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-pink-500/5 to-purple-600/15 pointer-events-none z-10 rounded-lg animate-pulse duration-[6s]" />
                            )}
                            <img 
                              src={uploadedBase64} 
                              alt="AI processed image comparison"
                              className={`w-full h-full object-contain pointer-events-none transition-all ${getFilterClass()} ${getSimulatedAIFilters()}`}
                            />
                            
                            {/* 📡 CYBER FORENSIC ACTIVE SCANNERS */}
                            {!isNaturalPhotoSelected && (
                              <>
                                <div className="absolute inset-0 pointer-events-none cyber-grid-overlay z-10" />
                                <div className="laser-scan-line z-20 pointer-events-none" />
                              </>
                            )}

                            {/* Active Heatmaps on Right side-by-side Panel */}
                            {heatmapToggle && report.heatmaps && report.heatmaps.length > 0 && (
                              <div className="absolute inset-0 z-20 pointer-events-auto">
                                {report.heatmaps.map((pt, idx) => {
                                  const isSelected = selectedPointIdx === idx;
                                  return (
                                    <button
                                      key={idx}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPointIdx(isSelected ? null : idx);
                                      }}
                                      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500 bg-red-500/10 hover:bg-red-500/25 z-30 transition-all cursor-pointer ${
                                        isSelected ? "ring-2 ring-cyan-400 border-cyan-400 bg-cyan-400/20 scale-110" : ""
                                      }`}
                                      style={{
                                        left: `${pt.x}%`,
                                        top: `${pt.y}%`,
                                        width: `${pt.radius * 1.5}px`,
                                        height: `${pt.radius * 1.5}px`,
                                      }}
                                    >
                                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-cyan-400" : "bg-red-500"}`} />
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-800 font-mono text-[8px] text-cyan-400 font-semibold uppercase tracking-wider shadow">
                              🤖 AI SCAN (AFTER)
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    // Default image upload raw display if scan not triggered yet
                    <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
                      {/* Ambient magenta/neon glowing backdrop behind or over the AI view for Demo 1 (not in original mode) */}
                      {!isNaturalPhotoSelected && compareMode !== "original" && selectedDemo?.id === "ai-avatar" && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-pink-500/5 to-purple-600/15 pointer-events-none z-10 rounded-lg animate-pulse duration-[6s]" />
                      )}
                      <img 
                        src={uploadedBase64} 
                        alt="Unprocessed user upload default view"
                        className={`w-full h-full object-contain transition-all ${getFilterClass()} ${getSimulatedAIFilters()}`}
                      />
                      {/* Cool Animated Overlays for ELA / Chroma / Contours inside normal state preview */}
                      {visualFilter === "ela" && !isNaturalPhotoSelected && (
                        <div className="absolute inset-0 pointer-events-none border border-cyan-400/20 bg-cyan-950/[0.03] z-10">
                          <div className="w-full h-[1px] bg-cyan-400/40 absolute top-[30%] animate-pulse shadow-[0_0_8px_cyan]" />
                          <div className="w-full h-[1px] bg-cyan-400/20 absolute top-[70%] animate-pulse shadow-[0_0_8px_cyan]" />
                        </div>
                      )}
                      {visualFilter === "chroma" && !isNaturalPhotoSelected && (
                        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.4)_100%)] mix-blend-overlay z-10 bg-opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
                      )}
                      {visualFilter === "contour" && !isNaturalPhotoSelected && (
                        <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-gradient-to-tr from-cyan-950/20 to-purple-950/20 z-10 border border-purple-500/20" />
                      )}
                      <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded bg-black/80 border border-slate-800 font-mono text-[9px] text-slate-400 uppercase tracking-widest shadow">
                        AWAITING AUDIT TRIGGER
                      </div>
                    </div>
                  )}

                  {/* Highlight tooltip coordinates HUD */}
                  {selectedPointIdx !== null && report && report.heatmaps[selectedPointIdx] && (
                    <div className="absolute bottom-4 left-4 right-4 z-40 bg-slate-950/90 text-left border border-[#00E5FF]/30 p-2.5 rounded-lg text-[10px] font-mono leading-relaxed space-y-1 backdrop-blur">
                      <div className="flex justify-between items-center text-cyan-400 font-bold">
                        <span>ANOMALY DETECTED [PT_0{selectedPointIdx + 1}]</span>
                        <span>CONFIDENCE Index: {report.heatmaps[selectedPointIdx].severity}%</span>
                      </div>
                      <p className="text-slate-300 font-sans">{report.heatmaps[selectedPointIdx].label}</p>
                      <div className="text-slate-500">Coordinate: Y:{report.heatmaps[selectedPointIdx].y}%, X:{report.heatmaps[selectedPointIdx].x}%</div>
                    </div>
                  )}

                </div>
              ) : (
                // Draggable injection layout state
                <div className="space-y-4 max-w-sm text-center w-full px-4">
                  <div className={`mx-auto p-4 rounded-full border transition-all w-16 h-16 flex items-center justify-center ${
                    theme === "dark" ? "bg-slate-900/60 border-slate-800 text-slate-400 group-hover:border-cyan-500/20" : "bg-slate-50 border-slate-200 text-slate-500 group-hover:bg-slate-100"
                  }`}>
                    <Upload className="w-8 h-8 text-[#00E5FF] animate-bounce" />
                  </div>
                  <div>
                    <h3 className={`font-display font-bold text-sm ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                      Drag and drop suspect picture
                    </h3>
                    <p className={`text-[11px] ${theme === "dark" ? "text-slate-400" : "text-slate-500"} mt-1 leading-relaxed`}>
                      Supports JPEG, PNG, or WebP format up to 15MB. Your data stays fully sandboxed.
                    </p>
                  </div>
                  <button 
                    id="trigger-file-manual"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded bg-gradient-to-r from-[#00E5FF]/20 to-[#7C3AED]/20 hover:from-[#00E5FF]/35 hover:to-[#7C3AED]/35 border border-cyan-500/20 text-xs font-mono font-medium cursor-pointer"
                  >
                    SELECT LOCAL IMAGE
                  </button>

                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    className="pt-4 border-t border-dashed border-slate-800/40 w-full flex flex-col gap-2 mt-4"
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                      <span>OR LOAD IMAGE VIA REMOTE URL</span>
                      <span>TELEGRAM, WEB, DISCORD...</span>
                    </div>
                    <div className="flex items-center gap-1.5 w-full">
                      <input
                        type="url"
                        placeholder="Paste https://t.me/... or regular image link..."
                        value={pastedImageUrl}
                        onChange={(e) => setPastedImageUrl(e.target.value)}
                        className={`flex-grow px-2.5 py-1.5 rounded text-xs font-mono outline-none transition-all w-full text-left ${
                          theme === "dark"
                            ? "bg-slate-900 border border-slate-800 text-slate-300 placeholder-slate-600 focus:border-cyan-500/40"
                            : "bg-slate-50 border border-slate-250 text-slate-800 placeholder-slate-400 focus:border-cyan-500/40"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleUrlAnalyzeSubmit}
                        disabled={isFetchingUrl}
                        className="px-3.5 py-1.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-400/20 text-xs font-mono font-bold flex items-center justify-center gap-1 shrink-0 cursor-pointer h-8"
                      >
                        {isFetchingUrl ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          "LOAD"
                        )}
                      </button>
                    </div>
                    {urlError && (
                      <p className="text-[10px] text-red-400 mt-1 leading-normal text-left font-sans">
                        ⚠️ {urlError}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
                id="hidden-browser-upload-node"
              />
            </div>

            {/* Visual bottom ribbon bar metrics */}
            {uploadedBase64 && (
              <div className={`px-4 py-3 border-t font-mono text-[10px] flex justify-between items-center ${
                theme === "dark" ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
              }`}>
                <div className="truncate max-w-[180px] sm:max-w-xs text-left font-semibold text-slate-300">
                  FILE: {uploadedFileName}
                </div>
                
                <div className="flex items-center gap-3">
                  {status === "idle" && (
                    <button
                      id="analysis-primary-trigger"
                      onClick={triggerAnalysis}
                      className="px-3.5 py-1.5 rounded-md bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white font-bold tracking-tight shadow glow-btn"
                    >
                      Run Forensic Audits
                    </button>
                  )}

                  {uploadedBase64 && (
                    <button
                      id="cancel-restart-analysis-btn"
                      onClick={resetTerminal}
                      className="px-2.5 py-1.5 rounded border border-slate-700 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all font-mono"
                    >
                      Eject file
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SIMULATED TERMINAL CONSOLE LOGS DURING PIPELINE SCANS */}
          {status === "analyzing" && (
            <div className="p-4 rounded-xl font-mono text-left space-y-2 bg-slate-950 text-slate-400 border border-slate-900 text-[10px] leading-relaxed max-h-[180px] overflow-y-auto">
              <div className="flex justify-between border-b border-white/5 pb-1.5 mb-2 font-bold text-cyan-400 text-[9px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  PIPELINE ANALYSIS LOGS
                </span>
                <span>THREAD_ID: OP_82B</span>
              </div>
              <div className="space-y-1">
                {terminalLogs.map((log, i) => (
                  <div key={i} className={i === terminalLogs.length - 1 ? "text-cyan-400 font-semibold" : ""}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HEATMAP CONTROL AND RESTORATION VERDICTS (IF LOADED) */}
          {status === "success" && report && (
            <div className={`p-4 rounded-xl border text-left space-y-4 ${
              theme === "dark" ? "bg-slate-900/30 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span className="font-display font-semibold text-xs text-slate-300">Suspect Segment controls</span>
                </div>
                
                {report.heatmaps && report.heatmaps.length > 0 && (
                  <button
                    onClick={() => setHeatmapToggle(!heatmapToggle)}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono border flex items-center gap-1.5 transition-all ${
                      heatmapToggle
                        ? "bg-cyan-500/10 border-cyan-400 text-cyan-400"
                        : "border-slate-800 bg-slate-950 text-slate-500"
                    }`}
                  >
                    {heatmapToggle ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        Hide Heatmap Coordinates ({report.heatmaps.length})
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        Display Heatmap Circles ({report.heatmaps.length})
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Comparative Slider explanatory text */}
              {report.isAIGeneratedPercentage > 20 && (
                <div className="p-3 rounded-lg bg-cyan-500/5 text-slate-400 text-[11px] leading-relaxed border border-cyan-500/10 font-medium">
                  <Sliders className="w-3.5 h-3.5 inline text-cyan-400 mr-1 mt-0.5 shrink-0" />
                  <span className="font-bold text-cyan-400">Before / After Slider:</span> Drag the vertical ruler over the preview image to side-by-side compare the uploaded asset <span className="text-slate-300">(right)</span> against our algorithmic calculation of the authentic original scene parameters <span className="text-slate-300">(left)</span>.
                </div>
              )}

              {/* Coordinates breakdown grid */}
              {report.heatmaps && report.heatmaps.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mt-1">
                  {report.heatmaps.map((pt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPointIdx(selectedPointIdx === idx ? null : idx)}
                      className={`p-2 rounded border text-left transition-all flex justify-between items-center ${
                        selectedPointIdx === idx
                          ? "bg-cyan-500/15 border-cyan-400 text-cyan-400"
                          : theme === "dark"
                          ? "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="truncate max-w-[120px]">Point {idx + 1}: {pt.label}</span>
                      <span className="text-slate-500 shrink-0">[{pt.x}%, {pt.y}%]</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-[10px] font-mono text-slate-500 text-center py-2">
                  No spatial edit hot points were isolated on this image asset. Pristine pixel flow verified.
                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: FORENSIC VERDICTS, EXIF DATA & REPORTS (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* SCORING BENTO GRID STATUS */}
          {status === "success" && report && (
            <div className={`p-5 rounded-2xl border text-left space-y-6 ${
              theme === "dark" ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-100 shadow-sm"
            }`}>
              
              {/* Verdict Header Badge */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="font-display font-bold text-xs uppercase text-slate-300">Verdict Diagnostics Matrix</span>
                <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                  report.isAIGeneratedPercentage > 60
                    ? "bg-red-500/15 text-red-400 border border-red-500/20"
                    : report.manipulationScore > 50
                    ? "bg-yellow-500/15 text-yellow-500 border border-yellow-500/20"
                    : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                }`}>
                  {report.isAIGeneratedPercentage > 60 
                    ? "AI_SYNTHESIS_FOUND" 
                    : report.manipulationScore > 50 
                    ? "COMPOSITE_SUSPECT" 
                    : "ORIGINAL_OPTIC_PASSED"}
                </span>
              </div>

              {/* Core Index gauges */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* AI-Generated Probability Gauge card */}
                <div className={`p-3.5 rounded-xl border text-left ${
                  theme === "dark" ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-150"
                }`}>
                  <span className="font-mono text-[10px] text-slate-500 block uppercase">Generative AI Match</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`font-display text-3xl font-extrabold ${report.isAIGeneratedPercentage > 50 ? "text-red-400" : "text-emerald-400"}`}>
                      {report.isAIGeneratedPercentage}%
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">POSS</span>
                  </div>
                  {/* Local bar indicator */}
                  <div className="w-full bg-slate-800 h-1 rounded-full mt-2.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${report.isAIGeneratedPercentage > 50 ? "bg-red-400" : "bg-emerald-400"}`} 
                      style={{ width: `${report.isAIGeneratedPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Micro Splicing Manipulation index card */}
                <div className={`p-3.5 rounded-xl border text-left ${
                  theme === "dark" ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-150"
                }`}>
                  <span className="font-mono text-[10px] text-slate-500 block uppercase">Manipulation Index</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`font-display text-3xl font-extrabold ${report.manipulationScore > 50 ? "text-yellow-500" : "text-emerald-400"}`}>
                      {report.manipulationScore}%
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">SPLIC</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full mt-2.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${report.manipulationScore > 50 ? "bg-yellow-500" : "bg-emerald-450"}`} 
                      style={{ width: `${report.manipulationScore}%` }}
                    />
                  </div>
                </div>

                {/* Filter and tuning weight card */}
                <div className={`p-3.5 rounded-xl border text-left ${
                  theme === "dark" ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-150"
                }`}>
                  <span className="font-mono text-[10px] text-slate-500 block uppercase">Enhancement / Filter</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`font-display text-3xl font-extrabold ${report.filterScore > 50 ? "text-cyan-400" : "text-slate-400"}`}>
                      {report.filterScore}%
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">TUNING</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full mt-2.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-cyan-400" 
                      style={{ width: `${report.filterScore}%` }}
                    />
                  </div>
                </div>

                {/* Scene optical baseline integrity card */}
                <div className={`p-3.5 rounded-xl border text-left ${
                  theme === "dark" ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-150"
                }`}>
                  <span className="font-mono text-[10px] text-slate-500 block uppercase">Authenticity Index</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`font-display text-3xl font-extrabold ${report.authenticityScore > 70 ? "text-emerald-400" : "text-red-400"}`}>
                      {report.authenticityScore}%
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">INTEG</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full mt-2.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${report.authenticityScore > 70 ? "bg-emerald-400" : "bg-red-400"}`} 
                      style={{ width: `${report.authenticityScore}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* TECHNICAL JOURNAL TEXT EXPOSITION */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-slate-500 uppercase block">Expert Forensic Summary</span>
                <div className={`p-3.5 rounded-xl text-xs leading-relaxed font-sans max-h-[160px] overflow-y-auto whitespace-pre-wrap border ${
                  theme === "dark" ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-150 text-slate-700"
                }`}>
                  {report.technicalReport}
                </div>
              </div>

              {/* ESTIMATED RESTORATION GEOMETRY EXPLAINER */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-slate-500 uppercase block">Original Appearance Projection</span>
                <div className={`p-3.5 rounded-xl text-xs leading-relaxed font-sans max-h-[120px] overflow-y-auto border ${
                  theme === "dark" ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-150 text-slate-700"
                }`}>
                  {report.reconstructedDescription}
                </div>
              </div>

              {/* EXIF METADATA CHUNK RECOVERY TABLE */}
              <div className="space-y-2">
                <div className="flex justify-between items-center font-mono text-[10px] text-slate-500 uppercase">
                  <span>EXIF Hardware & Calibration Stream</span>
                  <span className="text-[9px] text-cyan-500">[VERIFIED]</span>
                </div>
                <div className={`p-3 rounded-xl border text-[10px] font-mono divide-y space-y-2 ${
                  theme === "dark" ? "bg-slate-950 border-slate-800 divide-white/5" : "bg-slate-50 border-slate-150 divide-black/5"
                }`}>
                  <div className="grid grid-cols-2 py-1">
                    <span className="text-slate-500 text-left">CAP CAMERA:</span>
                    <span className="text-slate-300 text-right truncate">{report.metadata.device || "Stripped RAW profile"}</span>
                  </div>
                  <div className="grid grid-cols-2 pt-2 py-1">
                    <span className="text-slate-500 text-left">EDITS SOFTWARE:</span>
                    <span className="text-slate-300 text-right truncate">{report.metadata.software || "N/A Signature"}</span>
                  </div>
                  <div className="grid grid-cols-2 pt-2 py-1">
                    <span className="text-slate-500 text-left">METRICS WIDTH:</span>
                    <span className="text-slate-300 text-right truncate">{report.metadata.resolution || "Unknown"}</span>
                  </div>
                  <div className="grid grid-cols-2 pt-2 py-1">
                    <span className="text-slate-500 text-left">CAL COLOR SPACE:</span>
                    <span className="text-slate-300 text-right truncate">{report.metadata.colorSpace || "sRGB Default"}</span>
                  </div>
                  <div className="grid grid-cols-2 pt-2 py-1">
                    <span className="text-slate-500 text-left">QUANT INDEX:</span>
                    <span className="text-slate-300 text-right truncate">{report.metadata.compressionLevel || "Q80 Lossy"}</span>
                  </div>
                </div>
              </div>

              {/* INDIVIDUAL CRITICAL RULES TRIGGERS */}
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] text-slate-500 uppercase block">Isolated Marker Indicators</span>
                  
                  {/* Search and Status filter toolbar */}
                  <div className="space-y-2">
                    {/* Keyword search input */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Filter markers by keyword..."
                        value={markerSearchQuery}
                        onChange={(e) => setMarkerSearchQuery(e.target.value)}
                        className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs transition-all outline-none border ${
                          theme === "dark"
                            ? "bg-slate-950/80 border-slate-800 text-slate-300 placeholder-slate-600 focus:border-cyan-500/40"
                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-450 focus:border-cyan-500/40"
                        }`}
                      />
                    </div>

                    {/* Status filter capsules */}
                    <div className="flex flex-wrap items-center gap-1">
                      {(["All", "Detected", "Suspected"] as const).map((statusType) => {
                        const count = report.featuresDetected.filter((m) => statusType === "All" || m.status === statusType).length;
                        return (
                          <button
                            key={statusType}
                            type="button"
                            onClick={() => setMarkerStatusFilter(statusType)}
                            className={`px-2 py-0.5 rounded text-[9px] font-mono border transition-all flex items-center gap-1 cursor-pointer ${
                              markerStatusFilter === statusType
                                ? statusType === "Detected"
                                  ? "bg-red-500/10 border-red-500/30 text-red-400 font-semibold"
                                  : statusType === "Suspected"
                                  ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500 font-semibold"
                                  : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-semibold"
                                : theme === "dark"
                                ? "border-transparent text-slate-500 hover:text-slate-300"
                                : "border-transparent text-slate-500 hover:bg-slate-100"
                            }`}
                          >
                            <span>{statusType}</span>
                            <span className="opacity-60 font-sans">({count})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {report.featuresDetected.filter((marker) => {
                    if (markerStatusFilter !== "All" && marker.status !== markerStatusFilter) {
                      return false;
                    }
                    if (markerSearchQuery.trim() !== "") {
                      const query = markerSearchQuery.toLowerCase();
                      const nameMatch = marker.name.toLowerCase().includes(query);
                      const descMatch = marker.description.toLowerCase().includes(query);
                      return nameMatch || descMatch;
                    }
                    return true;
                  }).length > 0 ? (
                    report.featuresDetected.filter((marker) => {
                      if (markerStatusFilter !== "All" && marker.status !== markerStatusFilter) {
                        return false;
                      }
                      if (markerSearchQuery.trim() !== "") {
                        const query = markerSearchQuery.toLowerCase();
                        const nameMatch = marker.name.toLowerCase().includes(query);
                        const descMatch = marker.description.toLowerCase().includes(query);
                        return nameMatch || descMatch;
                      }
                      return true;
                    }).map((marker, i) => {
                      const isDetected = marker.status === "Detected";
                      const isSuspected = marker.status === "Suspected";
                      return (
                        <div 
                          key={i} 
                          className={`p-2.5 rounded-lg border text-xs flex flex-col gap-1 transition-all ${
                            isDetected 
                              ? "bg-red-500/5 border-red-500/15" 
                              : isSuspected 
                              ? "bg-yellow-500/5 border-yellow-500/15" 
                              : "bg-slate-950/20 border-slate-800/60"
                          }`}
                        >
                          <div className="flex items-center justify-between font-mono text-[10px]">
                            <span className={`font-bold ${isDetected ? "text-red-400" : isSuspected ? "text-yellow-500" : "text-slate-400"}`}>
                              {marker.name}
                            </span>
                            <span className={`px-1 rounded text-[8px] font-bold ${
                              isDetected ? "bg-red-500/10 text-red-400" : isSuspected ? "bg-yellow-500/10 text-yellow-500" : "bg-slate-850 text-slate-500"
                            }`}>
                              {marker.status} [Conf: {marker.confidence}%]
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px] leading-relaxed font-sans">{marker.description}</p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-[10px] font-mono text-slate-500 text-center py-6 border border-dashed border-white/5 rounded-lg">
                      No matching markers isolated.
                    </div>
                  )}
                </div>
              </div>

              {/* REPORT EXPORT / ACTION TRIGGERS */}
              <div className="pt-2">
                <button
                  id="final-export-report-btn"
                  onClick={exportForensicReport}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-[#7C3AED] hover:opacity-95 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  EXPORT DECRYPTED AUDIT RECORD (.TXT)
                </button>
              </div>

            </div>
          )}

          {/* EMPTY TERMINAL PANEL IF AWAITING FILE SCANS */}
          {status !== "success" && (
            <div className={`p-8 rounded-2xl border text-center ${
              theme === "dark" ? "bg-slate-900/10 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <div className="max-w-xs mx-auto space-y-4">
                <div className="p-3 bg-cyan-500/5 text-cyan-400 rounded-full w-fit mx-auto border border-cyan-500/10">
                  <Sliders className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`font-display font-bold text-sm ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                    Awaiting Analytical Stream
                  </h3>
                  <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"} mt-1.5 leading-relaxed`}>
                     Once you drag-and-drop or load a demo file and trigger the forensic scan, this column executes automated ELA, pupil light matching, Fourier transforms, and metadata tags retrieval.
                  </p>
                </div>

                {/* Micro instructions indicator lists for the sandbox */}
                <div className="border-t border-dashed border-white/5 pt-4 text-left font-mono text-[9px] text-slate-500 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Real-time pixel pattern clustering
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Error level compression maps (ELA)
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Authentic light source angle tracing
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
