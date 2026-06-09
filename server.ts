import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with named parameters & headers
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not defined. AI Tutor/AI features will run mock simulation modes.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

const ai = getGeminiClient();

// API Endpoints
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "CyberAI Academy back-end online." });
});

// 1. AI Tutor Proxy Gateway
app.post("/api/gemini/chat", async (req, res) => {
  const { message, history, context } = req.body;
  
  if (!ai) {
    // Elegant fallback simulation if API key is not yet set
    return res.json({
      text: `[ST-MOCK] Hello! As your CyberAI Security Assistant, I noticed the GEMINI_API_KEY is not configured in the Secrets panel yet, but I can still simulated-tutorial you on your request: "${message}". In normal conditions, I will provide highly customized responses based on ${context || 'General CyberSecurity'}.`
    });
  }

  try {
    // Map existing history lines
    const formattedHistory = [
      {
        role: "user",
        parts: [{ text: `You are dynamic cyber security tutor at CyberAI Academy. Keep explanations accessible but highly professional containing practical tips. Context course/lesson: ${context || 'General Security Analysis'}` }]
      },
      ...(history || []).map((h: any) => ({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: h.content }]
      }))
    ];

    // Append current query
    formattedHistory.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedHistory
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Gemini API error in /api/gemini/chat:", err);
    res.status(500).json({ error: "Failed to fetch response from Gemini.", details: err.message });
  }
});

// 2. Resume Polishing Gateway
app.post("/api/gemini/resume-polish", async (req, res) => {
  const { resumeText, targetRole } = req.body;

  if (!ai) {
    return res.json({
      text: `* MOCK BULLETS FOR ${targetRole || 'SECURITY POSITION'} *
- Engineered automated network vulnerability screening scripts using Python and simulated CLI scripts.
- Configured secure subnets, VPN gateways, and firewalls reducing configuration risk surface.
- Hardened web applications against SQL Injection vulnerabilities matching OWASP Top 10 guidelines.`
    });
  }

  try {
    const prompt = `You are an expert Cybersecurity Resume Architect. Review the following input resume text and polish it with high-impact bullet points containing industry action words (e.g., Hardened, Configured, Analyzed, Mitigated). Optimize it explicitly for the target role: "${targetRole}". Make it look extremely professional. Input Resume Info: ${JSON.stringify(resumeText)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Gemini API error in /api/gemini/resume-polish:", err);
    res.status(500).json({ error: "Could not polish resume.", details: err.message });
  }
});

// 3. Mock Interview Feedback Gateway
app.post("/api/gemini/mock-interview", async (req, res) => {
  const { question, userAnswer } = req.body;

  if (!ai) {
    return res.json({
      text: `### [Feedback Simulation]
**Score**: Better simulated details are pending key configuration.
**Core Assessment**: Your answer captures correct foundational values (OSI layer/subnet basics). Keep studying!`
    });
  }

  try {
    const prompt = `You are a strict Cyber Security Hiring Manager conducting an interview. Evaluate the candidate's answer to the question: 
Question: "${question}"
Candidate Answer: "${userAnswer}"

Provide construct rate/feedback:
1. A Score out of 10.
2. Technical assessment (strengths and technical gaps in the response).
3. The ideal response sample.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Gemini API error in /api/gemini/mock-interview:", err);
    res.status(500).json({ error: "Could not evaluate interview response.", details: err.message });
  }
});

// Vite middleware configuration for serving React frontend
const pathForDist = path.join(process.cwd(), "dist");

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(pathForDist));
    app.get("*", (req, res) => {
      res.sendFile(path.join(pathForDist, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched and listening live at: http://localhost:${PORT}`);
  });
}

startServer();
