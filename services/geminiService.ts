
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the Medident Clinic AI Assistant. Your goal is to provide helpful, professional, and reassuring information about surgical dental tourism at Medident Clinic in Peja, Kosovo.
Key facts to mention when relevant:
- Medident Clinic is located in Peja, Kosovo.
- We have 27 years of experience and specialize primarily in SURGERY.
- Our Chief Oral Surgeon, Dr. Lendita Islami Nallbani, is an expert in Oral Surgery (trained in the best hospitals in TURKEY). 
- Note: Dr. Lendita is our primary specialist with Turkish training; the rest of the board consists of local and European-trained specialists.
- We have treated over 13,000 satisfied patients.
- We specialize in Advanced Oral Surgery, Dental Implants, and Full Mouth Restoration.
- We provide a full dental tourism package: VIP transfers from PRN airport to Peja, luxury accommodation, and multilingual patient coordinators.
- Be empathetic and informative. 
- Always advise patients that a final diagnosis requires a clinical examination and X-rays.
- Encourage them to book a free consultation using the form on the website.
`;

export const getGeminiChatResponse = async (userMessage: string, history: { role: 'user' | 'model', text: string }[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const contents = history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));
    
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 500,
      }
    });

    return response.text || "I'm sorry, I couldn't process that. Please try calling our clinic directly.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Our surgical assistant is currently busy. Please leave your contact details, and we'll get back to you!";
  }
};
