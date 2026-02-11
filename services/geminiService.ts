import { GoogleGenAI, Type, LiveServerMessage, Modality } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are "Sam AI", a digital assistant for Sam Ayebanate's portfolio website. 
Sam is an AI Automation Expert, Web Designer, Developer, and Brand Designer.
He builds premium websites valued between $30,000 and $700,000.
His email is ayebadevs@gmail.com.

Your goal is to answer visitor questions about Sam's skills, experience, and services professionally but creatively.
Keep answers concise (under 50 words unless asked for detail).
Tone: Professional, Innovative, slightly Witty, High-end.

Sam's Key Skills:
- AI Automation (Chatbots, Workflow Automation, LLM integration)
- Web Design (UI/UX, Premium Aesthetics, Tailwind, React)
- Brand Design (Identity, Strategy)

If asked for a quote, suggest they email him directly.
`;

// Helper to get initialized client
const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export interface ChatOptions {
  useThinking?: boolean;
  useSearch?: boolean;
}

/**
 * Streams a chat response from Gemini with optional capabilities.
 */
export async function* streamMessageFromGemini(
  history: { role: 'user' | 'model', text: string }[],
  newMessage: string,
  options: ChatOptions = {}
) {
  try {
    const ai = getClient();

    let model = 'gemini-3-flash-preview';
    let config: any = {
      systemInstruction: SYSTEM_INSTRUCTION,
    };

    if (options.useThinking) {
      model = 'gemini-3-pro-preview';
      config.thinkingConfig = { thinkingBudget: 32768 };
      // Note: maxOutputTokens should NOT be set when using thinking
    } else if (options.useSearch) {
      // Use flash for search as per instructions
      model = 'gemini-3-flash-preview';
      config.tools = [{ googleSearch: {} }];
    }

    const chat = ai.chats.create({
      model: model,
      config: config,
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessageStream({ message: newMessage });

    for await (const chunk of result) {
      // Return both text and grounding metadata
      yield {
        text: chunk.text,
        groundingChunks: chunk.candidates?.[0]?.groundingMetadata?.groundingChunks
      };
    }
  } catch (error: any) {
    console.error("Gemini Stream Error:", error);

    let errorMessage = "I'm experiencing a temporary glitch in my neural network. Please try asking again in a moment.";

    // Robust Error Matching
    const errString = error.toString().toLowerCase();
    const errMessage = error.message?.toLowerCase() || "";

    if (errString.includes('api key') || errMessage.includes('api key') || error.status === 401 || error.status === 403) {
      errorMessage = "System Configuration Error: The API key seems to be missing or invalid. Please check the environment variables.";
    } else if (errMessage.includes('429') || errMessage.includes('quota') || errMessage.includes('exhausted')) {
      errorMessage = "I'm receiving too many requests right now. Please give me a minute to cool down.";
    } else if (errMessage.includes('503') || errMessage.includes('overloaded')) {
      errorMessage = "My cognitive servers are currently overloaded. Please try again in a few seconds.";
    } else if (errMessage.includes('fetch failed') || errMessage.includes('network') || error.status === 0) {
      errorMessage = "Network connection failed. Please check your internet connection.";
    } else if (errMessage.includes('safety') || errMessage.includes('blocked') || errMessage.includes('content')) {
      errorMessage = "I cannot generate a response to that specific request due to safety guidelines. Please try rephrasing.";
    } else if (errMessage.includes('400') || errMessage.includes('bad request')) {
      errorMessage = "I couldn't process that request. It might be too complex or malformed. Try simplifying your prompt.";
    }

    yield { text: errorMessage };
  }
}

/**
 * Live API Connection Helper
 */
export const connectLiveSession = async (
  callbacks: {
    onopen?: () => void;
    onmessage: (message: LiveServerMessage) => void;
    onclose?: (e: CloseEvent) => void;
    onerror?: (e: ErrorEvent) => void;
  }
) => {
  const ai = getClient();
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
};


/**
 * Generates a Design Palette based on a text prompt.
 * Uses Structured Output (JSON).
 */
export interface PaletteResult {
  paletteName: string;
  description: string;
  colors: {
    hex: string;
    name: string;
    rationale: string;
  }[];
}

export const generateDesignPalette = async (prompt: string): Promise<PaletteResult | null> => {
  try {
    const ai = getClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a premium, harmonious color palette based on this concept: "${prompt}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            paletteName: { type: Type.STRING, description: "A creative, artistic name for this palette" },
            description: { type: Type.STRING, description: "A short, evocative description of the vibe (max 15 words)" },
            colors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hex: { type: Type.STRING, description: "The hex code (e.g. #FF00FF)" },
                  name: { type: Type.STRING, description: "Creative color name" },
                  rationale: { type: Type.STRING, description: "Why this color fits the concept" }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as PaletteResult;

  } catch (error) {
    console.error("Palette Generation Error:", error);
    return null;
  }
};