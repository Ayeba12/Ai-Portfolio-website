

import { GoogleGenAI } from "@google/genai";

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

const getClient = () => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        throw new Error("API Key missing");
    }
    return new GoogleGenAI({ apiKey });
};


export default async (req: Request) => {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const { history, message, options } = await req.json();
        const ai = getClient();

        let model = 'gemini-3-flash-preview'; // Default model
        let config: any = {
            systemInstruction: SYSTEM_INSTRUCTION,
        };

        if (options?.useThinking) {
            model = 'gemini-3-pro-preview'; // Use thinking model
            config.thinkingConfig = { thinkingBudget: 32768 };
        } else if (options?.useSearch) {
            model = 'gemini-3-flash-preview';
            config.tools = [{ googleSearch: {} }];
        }

        const chat = ai.chats.create({
            model: model,
            config: config,
            history: history?.map((h: any) => ({
                role: h.role,
                parts: [{ text: h.text }]
            })) || []
        });

        const result = await chat.sendMessageStream({ message });

        // Create a ReadableStream for the response
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result) {
                        const data = JSON.stringify({
                            text: chunk.text,
                            groundingChunks: chunk.candidates?.[0]?.groundingMetadata?.groundingChunks
                        });
                        controller.enqueue(new TextEncoder().encode(data + "\n"));
                    }
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            }
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "application/x-ndjson",
                "Cache-Control": "no-cache",
            },
        });

    } catch (error: any) {
        console.error("Gemini Function Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
