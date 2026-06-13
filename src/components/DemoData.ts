import { ForensicReport } from "../types";

export interface DemoImage {
  id: string;
  name: string;
  category: "AI Generation" | "Spliced Composite" | "Untouched Original";
  imageUrl: string;
  originalUrl: string; // Comparative original reconstructed appearance
  description: string;
  report: ForensicReport;
}

export const DEMO_FILES: DemoImage[] = [
  {
    id: "ai-avatar",
    name: "AI Generated Profile Portrait",
    category: "AI Generation",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    originalUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
    description: "Generative synthesis detection with background symmetry noise anomalies and localized pixel blurs.",
    report: {
      isAIGeneratedPercentage: 96,
      manipulationScore: 42,
      filterScore: 85,
      authenticityScore: 8,
      technicalReport: "The subject demonstrates telltale GAN and Diffusion-based geometric mismatches. Foremost, structural asymmetry is present in the pupil reflection vectors (inter-ocular gradient mismatch) and the lower lobe of the left ear, which exhibits atypical structural blending. Frequency spectral assessment reveals a uniform grid of low-level synthetic noise at 16kHz typical of autoencoder upscaling pathways. Edge detection on the hair strands reveals high frequency transparency blending inconsistencies against the medium frequency background details.",
      featuresDetected: [
        {
          name: "Inter-Ocular Light Refraction Mismatch",
          status: "Detected",
          confidence: 98,
          description: "Reflections in the left and right eyes do not align geometrically with a singular directional light source."
        },
        {
          name: "Local Edge Synthesis Blur",
          status: "Detected",
          confidence: 94,
          description: "Abrupt high-to-low localized sharpness shifts present adjacent to the neck and ears where diffusion layers blended."
        },
        {
          name: "Frequency Spectrum Anomalies",
          status: "Detected",
          confidence: 89,
          description: "Noticeable peak patterns in the 2D discrete Fourier transform, signaling artificial pixel replication."
        },
        {
          name: "Color Channel Chromatic Deviations",
          status: "Suspected",
          confidence: 76,
          description: "Unnatural color noise distribution in blue-green channels typical of procedural post-processing overlays."
        }
      ],
      reconstructedDescription: "Calculated original geometry suggests a slightly asymmetric human model with natural microscopic skin blemishes, textured hair fiber separation, non-linear ambient lighting casting visible shadow definitions on the left jaw side, and standard optical lens focal aberrations instead of procedural depth blurring.",
      metadata: {
        device: "TruthLens Generative Synthesis Engine v4.1",
        software: "StableDiffusionXL / Midjourney Tensor Core",
        colorSpace: "Display P3 (Procedural RGB)",
        resolution: "1024 x 1024 px (Custom Square)",
        creationDate: "Inferred 2026-05-12 14:22:11",
        compressionLevel: "Standard Lossless WebP",
        fileSize: "1.2 MB",
        mimeType: "image/webp"
      },
      heatmaps: [
        { x: 48, y: 35, radius: 10, severity: 95, label: "Eye refraction misalignment" },
        { x: 22, y: 58, radius: 15, severity: 88, label: "Ear lobe blending distortion" },
        { x: 80, y: 25, radius: 18, severity: 72, label: "Synthetic background repetition" },
        { x: 62, y: 78, radius: 12, severity: 80, label: "Artificial shadow transition outline" }
      ]
    }
  },
  {
    id: "spliced-composite",
    name: "Manipulated Press Presentation",
    category: "Spliced Composite",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600&auto=format&fit=crop",
    originalUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
    description: "Spliced high-rise element overlays and cloned foreground crowd to mock higher event attendance.",
    report: {
      isAIGeneratedPercentage: 12,
      manipulationScore: 91,
      filterScore: 68,
      authenticityScore: 19,
      technicalReport: "Rigorous Error Level Analysis (ELA) isolates pronounced compression variance peaks flanking the main conference screen and center figures. Illuminant direction estimation pinpoints a global solar azimuth vector offset by +45° on the background structures compared to the foreground subjects, who appear lit by artificial flashes at neutral angles. Pixel cloning detection correlates repeated high-frequency asphalt details in the lower left section.",
      featuresDetected: [
        {
          name: "Geometric Shadow Mismatch",
          status: "Detected",
          confidence: 96,
          description: "Visual shadow length and angle coordinates of central subjects do not match the backdrop solar lighting vectors."
        },
        {
          name: "Error Level Analysis Boundary Spiking",
          status: "Detected",
          confidence: 92,
          description: "Resaved pixel variance peaks highlight splice outlines along the corporate presentation logo borders."
        },
        {
          name: "Cloned Texture Arrays",
          status: "Detected",
          confidence: 85,
          description: "Identical micro-noise and pixel clusters discovered repeated in the lower foreground quadrant."
        },
        {
          name: "Metadata Stream Invalidation",
          status: "Suspected",
          confidence: 70,
          description: "Missing original EXIF capture headers combined with digital signature remnants of heavy desktop editors."
        }
      ],
      reconstructedDescription: "Reconstructed optical array implies a lower density crowd, a standard glass high-rise background lacking the artificially saturated sunset layers, higher natural shadow gradients on the left plazas, and standard neutral direct overhead solar lighting.",
      metadata: {
        device: "Inferred Canon EOS 5D Mark IV",
        software: "Adobe Photoshop 27.2 (Macintosh)",
        colorSpace: "AdobeRGB (1998)",
        resolution: "1920 x 1280 px (3:2 Landscape)",
        creationDate: "Inferred 2026-03-09 11:45:00",
        compressionLevel: "Saved JPEG Progressive Q72",
        fileSize: "2.8 MB",
        mimeType: "image/jpeg"
      },
      heatmaps: [
        { x: 35, y: 40, radius: 14, severity: 96, label: "Luminance angle mismatch boundary" },
        { x: 75, y: 20, radius: 12, severity: 90, label: "Overlaid building pixels boundary" },
        { x: 15, y: 85, radius: 18, severity: 85, label: "Cloned pavement pattern replication" }
      ]
    }
  },
  {
    id: "untouched-photo",
    name: "DSLR Wildlife Capture",
    category: "Untouched Original",
    imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=600&auto=format&fit=crop",
    originalUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=600&auto=format&fit=crop",
    description: "Fully authentic, unprocessed wilderness snapshot from extreme focal zoom, passing all forensics tests.",
    report: {
      isAIGeneratedPercentage: 2,
      manipulationScore: 4,
      filterScore: 12,
      authenticityScore: 98,
      technicalReport: "No forensic anomalies identified. Global Error Level Analysis displays a consistent, flat compression decay envelope across both high and low frequency zones. Dual-light vector geometry confirms fully synchronous solar casting with physical structures in the canopy depth. Native sensor noise (thermal pixel distribution) is unbroken and tracks uniformly through high-shadow regions without clipping or artificial cleaning traces. Standard camera serial headers match actual raw output.",
      featuresDetected: [
        {
          name: "Uniform Sensor Noise Envelopes",
          status: "Not Detected",
          confidence: 99,
          description: "Naturally occurring thermal CCD pixel noise maintains standard Poisson distribution across the image."
        },
        {
          name: "Chronological Metadata Flags",
          status: "Not Detected",
          confidence: 97,
          description: "Complete camera EXIF structures, including focal ratio, ISO, exposure parameters, and GPS coordinate keys match naturally."
        },
        {
          name: "Continuous Shadow Azimuth Vector",
          status: "Not Detected",
          confidence: 98,
          description: "All illumination vectors sync with natural landscape geometry and true atmospheric occlusion maps."
        }
      ],
      reconstructedDescription: "Visual parameters indicate a pristine, biologically unaltered focus snap matching the original capture file format directly. Absolute authenticity verified.",
      metadata: {
        device: "Sony ILCE-7RM5",
        software: "Sony camera image capture engine v1.0",
        colorSpace: "sRGB IEC61966-2.1",
        resolution: "3840 x 2560 px (4K Portrait-Landscape)",
        creationDate: "Native 2026-06-02 08:34:52",
        compressionLevel: "Prisitic Lossless RAW-to-JPG",
        fileSize: "8.4 MB",
        mimeType: "image/jpeg"
      },
      heatmaps: []
    }
  }
];
