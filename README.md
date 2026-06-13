<div align="center">
  <img src="assets/truthlens_banner.jpg" width="100%" alt="TruthLens AI Banner" style="border-radius: 8px;" />

  # 👁️ TruthLens AI – Advanced Forensic Visual Terminal
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Vite](https://img.shields.io/badge/Frontend-Vite%2BReact18-646CFF?style=flat&logo=vite)](https://vite.dev/)
  [![Node.js](https://img.shields.io/badge/Backend-Express.js-339933?style=flat&logo=node.js)](https://nodejs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind--CSS-38BDB8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
  [![Security](https://img.shields.io/badge/Architecture-Resilient--Enterprise-emerald)](https://github.com/)

  **TruthLens AI** is an enterprise-grade, high-fidelity forensics terminal designed to detect synthetic generative media, structural splices, and digital image manipulations. By blending advanced client-side shader simulations with a smart full-stack backend running resilient AI verification pipelines, TruthLens provides researchers with deep media integrity audits.
</div>

---

## ⚡ Core Capabilities

### 🛡️ Cyber-Forensics Scanner Suite
*   **Error Level Analysis (ELA):** Highlights compression ratio disparities within JPEG-encoded frames, exposing non-homogeneous boundaries (e.g., face swaps or AI infills).
*   **Chroma Channel Isolation:** Isolates discrete hue clusters and high-saturation channels to capture localized brush modifications or synthetic smoothing.
*   **Edge Contour Extraction:** Draws high-frequency spatial gradients to analyze shadow continuity, physical light falloff, and edge-blending microstructures.

### 🎛️ Dual-Interferometer Sandbox Viewports
*   **Dynamic Split Slider:** Smoothly glide and wipe between raw input matrices and flagged AI heatmaps in real-time.
*   **Side-by-Side Dual Deck:** Compare the live image analysis directly next to contextual visual anomaly highlights.
*   **Microscopy Target Points:** Clickable high-precision inspection nodes pinpointing specific inconsistencies like:
    *   *Facial Symmetry Incoherency*
    *   *Optical Pupil Light Reflection Mismatches*
    *   *Synthetically Cloned Pixel Blocks (Copy-Move)*
    *   *Geometric Background Grain Distortion*

### 🧠 High-Availability Fail-Safe Resilience (Pro-Grade Tech)
To shield production environments from upstream API downtime and peak-traffic congestion (such as standard OpenAI/Gemini 503 throttling), TruthLens AI operates a **smart fault-tolerant fallback engine**:
*   **Local Heuristic Modeling:** Instantly switches to high-fidelity mathematical pixel-auditing algorithms when Gemini API returns high congestion, providing seamless sandbox workflows.
*   **Adaptive Key Diagnosis:** Smoothly transitions into secure heuristic simulation if the `GEMINI_API_KEY` credential is not configured, complete with localized warning triggers.

---

## 🏗️ System Architecture

```mermaid
graph TD
    A[Client User Upload] -->|Raw Image Base64| B[Express Gatekeeper Server]
    B -->|API Status Probe| C{Gemini Core Available?}
    C -->|Yes: 200 OK| D[Deep Neural Vision Engine]
    C -->|No: 503 Congestion / Missing Key| E[Local Forensic Heuristic Engine]
    D -->|JSON Forensic Report| F[Interactive Matrix UI Overlay]
    E -->|Safe-Net Sandbox Report| F
    F -->|ELA & Chroma Filters| G[End-User Analytics Terminal]
