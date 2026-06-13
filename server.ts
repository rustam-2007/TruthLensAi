import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable larger payloads to accommodate base64 image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy-initialized Gemini AI client
let aiInstance: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in your environment secrets. Please configure it in Settings > Secrets.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Digital Forensics analysis schema for Gemini
const ForensicReportSchema = {
  type: Type.OBJECT,
  properties: {
    isAIGeneratedPercentage: {
      type: Type.INTEGER,
      description: "Probability that the image contains AI generated contents (between 0 and 100). If the image is fully real, this should be close to 0.",
    },
    manipulationScore: {
      type: Type.INTEGER,
      description: "Splicing, cloning, eraser tool modifications, content-aware fills, or other metadata/pixel level editing (between 0 and 100).",
    },
    filterScore: {
      type: Type.INTEGER,
      description: "Presence of digital filters, saturation tuning, HDR highlights, smoothing enhancements or airbrushing (between 0 and 100).",
    },
    authenticityScore: {
      type: Type.INTEGER,
      description: "General baseline optical integrity of the scene (between 0 and 100). Fully untouched camera capture should be near 100.",
    },
    technicalReport: {
      type: Type.STRING,
      description: "A professional forensic report containing specific pixel errors, illumination analysis, lighting direction anomalies, frequency inconsistencies, boundary gradients, and pattern detection notes.",
    },
    featuresDetected: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of rule, e.g., 'Egress Contrast Inconsistency', 'Generative Asymmetric Details', 'Discrete Wavelet Deviations', 'Illumination Angle Gradient'" },
          status: { type: Type.STRING, description: "Must be: 'Detected', 'Not Detected', or 'Suspected'" },
          confidence: { type: Type.INTEGER, description: "Confidence rating percentage of this marker (0 - 100)" },
          description: { type: Type.STRING, description: "Clear explanation detailing what was observed on a pixel or physical level." }
        },
        required: ["name", "status", "confidence", "description"]
      }
    },
    reconstructedDescription: {
      type: Type.STRING,
      description: "Detailed step-by-step description of what the original scene, lightning, skin-texture, background detail or geometry reasonably looked like before AI generation, manipulation, or heavy filtering.",
    },
    metadata: {
      type: Type.OBJECT,
      properties: {
        device: { type: Type.STRING, description: "Model name, or 'Unknown Optical Device' if not clear" },
        software: { type: Type.STRING, description: "Inferred editing software or 'Untouched Metadata Stream'" },
        colorSpace: { type: Type.STRING, description: "Color Space, e.g., sRGB, Adobe RGB, Display P3" },
        resolution: { type: Type.STRING, description: "Approximate resolution profile or aspect standard" },
        creationDate: { type: Type.STRING, description: "Estimated capture time, software output, or epoch" },
        compressionLevel: { type: Type.STRING, description: "Quantization index (e.g. JPEG Q90, WebP, Lossless PNG)" },
        fileSize: { type: Type.STRING, description: "Estimated or visual weight descriptor" },
        mimeType: { type: Type.STRING, description: "Underlying file type category" }
      }
    },
    heatmaps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          x: { type: Type.INTEGER, description: "X percentage coordinate (0-100) marking center of suspected edit/generation" },
          y: { type: Type.INTEGER, description: "Y percentage coordinate (0-100) marking center of suspected edit/generation" },
          radius: { type: Type.INTEGER, description: "Highlight radius of suspicion in % (typically between 5 and 25)" },
          severity: { type: Type.INTEGER, description: "Level of visual trace anomaly found (0 to 100)" },
          label: { type: Type.STRING, description: "The anomaly, e.g., 'Localized blur mismatch', 'Splice border artifacts', 'GAN textures', 'Repeated frequency pattern'" }
        },
        required: ["x", "y", "radius", "severity", "label"]
      }
    }
  },
  required: [
    "isAIGeneratedPercentage",
    "manipulationScore",
    "filterScore",
    "authenticityScore",
    "technicalReport",
    "featuresDetected",
    "reconstructedDescription",
    "metadata",
    "heatmaps"
  ]
};

// API Endpoint for processing forensic reports using Gemini API
app.post("/api/analyze", async (req, res) => {
  try {
    const { image, mimeType } = req.body;
    if (!image) {
      return res.status(400).json({ error: "No image file provided for forensic analysis." });
    }

    // Strip base64 prefix if present
    const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, "");

    const ai = getAI();

    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: cleanBase64,
      },
    };

    const promptText = `
      You are an elite Digital Forensic Examiner system called TruthLens AI specializing in cybersecurity and imaging authenticity. 
      Analyze the attached image and execute an exhaustive digital pixel, lighting, and semantic forensic evaluation.
      Check for:
      1. AI Generation traces: diffusion irregularities, repetition of low-level JPEG frequency bands, face shape asymmetries, eye outline rendering faults, or procedural sky/water textures.
      2. Manipulation: localized compression mismatches, splicing boundaries, shadow misalignments, erase/clone traces.
      3. Enhancement & Filters: airbrushed skin, extreme sharpening artifacts, dynamic range manipulation, extreme saturation layers.
      
      Formulate a rigorous technical verdict in the specified JSON schema. Support your claims with objective geometric, luminance or optical arguments.
    `;

    // Always follow recommended models in SKILL.md. Since we require image tasks and do basic forensic categorization:
    // 'gemini-3.5-flash' is excellent, fast, and highly reliable.
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, promptText],
      config: {
        responseMimeType: "application/json",
        responseSchema: ForensicReportSchema,
        temperature: 0.2, // Keep temperature lower for analytical consistency
      }
    });

    if (!result.text) {
      throw new Error("Gemini AI failed to produce any analytical text content.");
    }

    const reportData = JSON.parse(result.text.trim());
    return res.json(reportData);
  } catch (error: any) {
    console.error("Forensic analysis failed:", error);
    return res.status(500).json({ 
      error: error.message || "An unexpected error occurred during forensic pixel analysis." 
    });
  }
});

// Configure Vite or Static delivery flow
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static assets serving folder configured.");
  }

  // Bind server exclusively to port 3000 on host 0.0.0.0
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TruthLens AI backend listening on port ${PORT}`);
  });
}

startServer();
