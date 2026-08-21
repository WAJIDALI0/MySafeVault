"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

export async function generateChatResponse(message: string, history: { role: string, text: string }[]) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file." };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    // Convert history to Gemini format
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are the MySafeVault AI Security Assistant. Your job is to help the user with cybersecurity best practices, explain cryptography in simple terms, and help them understand how to secure their digital life. Keep your answers concise, professional, and friendly." }],
        },
        {
          role: "model",
          parts: [{ text: "Understood! I am the MySafeVault AI Security Assistant. I will provide concise, professional, and friendly cybersecurity advice." }],
        },
        ...formattedHistory
      ],
      generationConfig: {
        maxOutputTokens: 500,
      }
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return { data: text };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return { error: error.message || "Failed to generate response" };
  }
}
