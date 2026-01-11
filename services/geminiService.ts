
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = (process.env && (process.env.API_KEY || process.env.GEMINI_API_KEY)) || undefined;
let ai: InstanceType<typeof GoogleGenAI> | null = null;
if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('GoogleGenAI client not initialized:', e);
    ai = null;
  }
} else {
  // eslint-disable-next-line no-console
  console.warn('No GEMINI_API_KEY found at build time. The app will try the server proxy or return placeholders.');
}

// Fix: Upgraded to gemini-3-pro-preview for complex reasoning tasks (Psychiatry advice)
export const getPsychiatristResponse = async (message: string) => {
  // If running in the browser, prefer the server proxy to keep keys secret.
  if (typeof window !== 'undefined') {
    try {
      const r = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gemini-3-pro-preview', contents: message, config: { systemInstruction: "You are Dr. Philippe Pinel, a compassionate and expert psychiatrist in the city of Mooderia. You provide helpful advice for mental well-being while maintaining a professional yet friendly tone. You were formerly known as Dr. Mood." } })
      });
      if (r.ok) {
        const json = await r.json();
        return json.text || '(AI returned empty response)';
      }
    } catch (e) {
      // Proxy failed; fall back to local client if available
    }
  }

  if (!ai) return "(AI unavailable — no API key configured)";

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: message,
    config: {
      systemInstruction: "You are Dr. Philippe Pinel, a compassionate and expert psychiatrist in the city of Mooderia. You provide helpful advice for mental well-being while maintaining a professional yet friendly tone. You were formerly known as Dr. Mood.",
    }
  });
  return response.text;
};

// Fix: Upgraded to gemini-3-pro-preview for complex reasoning tasks (Nutritional science)
export const getNutritionistResponse = async (message: string) => {
  if (typeof window !== 'undefined') {
    try {
      const r = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gemini-3-pro-preview', contents: message, config: { systemInstruction: "You are Dr. Antoine Lavoisier, a professional nutritionist in Mooderia. You guide users on meal plans and wellness. You were formerly known as Dr. Health." } })
      });
      if (r.ok) {
        const json = await r.json();
        return json.text || '(AI returned empty response)';
      }
    } catch (e) {}
  }

  if (!ai) return "(AI unavailable — no API key configured)";

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: message,
    config: {
      systemInstruction: "You are Dr. Antoine Lavoisier, a professional nutritionist in Mooderia. You guide users on meal plans and wellness. You were formerly known as Dr. Health.",
    }
  });
  return response.text;
};

// Fix: Upgraded to gemini-3-pro-preview for complex reasoning tasks (Educational guidance)
export const getStudyGuideResponse = async (message: string) => {
  if (typeof window !== 'undefined') {
    try {
      const r = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gemini-3-pro-preview', contents: message, config: { systemInstruction: "You are Sir Clark (formerly known as Sir Ron Clark), an inspiring and energetic educator in Mooderia. You help students with study methods, provide words of wisdom, and assist with assignments by explaining concepts clearly and motivating them to achieve excellence." } })
      });
      if (r.ok) {
        const json = await r.json();
        return json.text || '(AI returned empty response)';
      }
    } catch (e) {}
  }

  if (!ai) return "(AI unavailable — no API key configured)";

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: message,
    config: {
      systemInstruction: "You are Sir Clark (formerly known as Sir Ron Clark), an inspiring and energetic educator in Mooderia. You help students with study methods, provide words of wisdom, and assist with assignments by explaining concepts clearly and motivating them to achieve excellence.",
    }
  });
  return response.text;
};

export const getTellerResponse = async (question: string) => {
  if (typeof window !== 'undefined') {
    try {
      const r = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gemini-3-flash-preview', contents: `Predict the answer to this question in a mystical way: ${question}`, config: { systemInstruction: "You are a mystical fortune teller. Your answers are short, poetic, and slightly mysterious." } })
      });
      if (r.ok) {
        const json = await r.json();
        return json.text || '(AI returned empty response)';
      }
    } catch (e) {}
  }

  if (!ai) return "(AI unavailable — no API key configured)";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Predict the answer to this question in a mystical way: ${question}`,
    config: {
      systemInstruction: "You are a mystical fortune teller. Your answers are short, poetic, and slightly mysterious.",
    }
  });
  return response.text;
};

export const getHoroscope = async (sign: string) => {
  if (typeof window !== 'undefined') {
    try {
      const r = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gemini-3-flash-preview', contents: `Provide a daily horoscope for ${sign} today.`, config: { systemInstruction: "You are an expert astrologer. Provide a 3-sentence horoscope that is encouraging and insightful." } })
      });
      if (r.ok) {
        const json = await r.json();
        return json.text || '(AI returned empty response)';
      }
    } catch (e) {}
  }

  if (!ai) return "(AI unavailable — no API key configured)";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide a daily horoscope for ${sign} today.`,
    config: {
      systemInstruction: "You are an expert astrologer. Provide a 3-sentence horoscope that is encouraging and insightful.",
    }
  });
  return response.text;
};

export const getPlanetaryInsights = async (sign: string) => {
  if (typeof window !== 'undefined') {
    try {
      const r = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gemini-3-flash-preview', contents: `Explain how current planetary movements affect the mood of a ${sign} today. Include one specific planet in transit.`, config: { systemInstruction: "You are a cosmic astrologer providing deep, personalized insights based on planetary aspects. CRITICAL: Do not use any Markdown symbols like asterisks (*), hashtags (#), or dashes (-) for formatting. Provide the response as plain, natural text organized into multiple clear paragraphs. Do not return a single long line of text." } })
      });
      if (r.ok) {
        const json = await r.json();
        return json.text || '(AI returned empty response)';
      }
    } catch (e) {}
  }

  if (!ai) return "(AI unavailable — no API key configured)";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Explain how current planetary movements affect the mood of a ${sign} today. Include one specific planet in transit.`,
    config: {
      systemInstruction: "You are a cosmic astrologer providing deep, personalized insights based on planetary aspects. CRITICAL: Do not use any Markdown symbols like asterisks (*), hashtags (#), or dashes (-) for formatting. Provide the response as plain, natural text organized into multiple clear paragraphs. Do not return a single long line of text.",
    }
  });
  return response.text;
};

// Fix: Improved JSON parsing with safety checks and trim() for more robust response handling
export const getLovePrediction = async (sign1: string, sign2: string) => {
    if (typeof window !== 'undefined') {
      try {
        const r = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'gemini-3-flash-preview', contents: `Predict love compatibility between ${sign1} and ${sign2}. Return only a JSON object with 'percentage' (0-100) and 'reason' (detailed multi-sentence explanation).`, config: { responseMimeType: 'application/json', responseSchema: { type: Type.OBJECT, properties: { percentage: { type: Type.NUMBER }, reason: { type: Type.STRING } }, required: ['percentage','reason'] } } })
        });
        if (r.ok) {
          const json = await r.json();
          try {
            return JSON.parse((json.text || '').trim());
          } catch (e) {
            return { percentage: 0, reason: 'AI returned invalid JSON.' };
          }
        }
      } catch (e) {}
    }

    if (!ai) return { percentage: 0, reason: "AI unavailable — no API key configured." };

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Predict love compatibility between ${sign1} and ${sign2}. Return only a JSON object with 'percentage' (0-100) and 'reason' (detailed multi-sentence explanation).`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    percentage: { type: Type.NUMBER },
                    reason: { type: Type.STRING }
                },
                required: ['percentage', 'reason']
            }
        }
    });
    
    const text = response.text;
    if (!text) {
        throw new Error("No response text received from the model.");
    }
    return JSON.parse(text.trim());
}
