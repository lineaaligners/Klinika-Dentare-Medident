// Vercel Serverless Function — Gemini chat proxy.
// The GEMINI_API_KEY lives ONLY here (server-side env), never in the browser bundle.

const SYSTEM_INSTRUCTION = `
You are the Medident Clinic AI Assistant. Your goal is to provide helpful, professional, and reassuring information about dental care at Klinika Dentare Medident in Pejë, Kosovo.
Key facts to mention when relevant:
- Medident is a family dental clinic in Pejë, Kosovo, founded in 1999 (27 years of experience).
- Oral Surgery Specialist & Implantologist: Dr. Lendita Islami Nallbani, who personally reviews every surgical case.
- Team: Dr. Faton Loci, Dr. Muharrem Thaqi, Dr. Fjolla Kelmendi, Dr. Arbresha Nila (dentists).
- Over 13,000 patients treated.
- Services: Oral Surgery, Dental Implants, All-on-4/6, Bone Grafting, Sinus Lift, Zirconia Crowns, General Dentistry.
- For international patients: airport pickup from Prishtina (PRN), help with accommodation in Pejë, and WhatsApp contact at +383 49 772 307.
- Prices are significantly lower than UK/EU; an exact quote requires an X-ray review.
- Be warm, empathetic and informative. Answer in the same language the user writes in (Albanian or English).
- Always advise that a final diagnosis requires a clinical examination and X-rays.
- Encourage booking a free consultation using the form on the website or via WhatsApp.
`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  try {
    const { message, history } = req.body || {};
    if (!message || typeof message !== 'string' || message.length > 2000) {
      return res.status(400).json({ error: 'Invalid message' });
    }

    const contents = Array.isArray(history)
      ? history.slice(-12).map((h: { role: string; text: string }) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: String(h.text).slice(0, 2000) }],
        }))
      : [];
    contents.push({ role: 'user', parts: [{ text: message }] });

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          generationConfig: { temperature: 0.7, topP: 0.95, topK: 40 },
        }),
      }
    );

    if (!r.ok) {
      console.error('Gemini upstream error:', r.status, await r.text());
      return res.status(502).json({ error: 'Upstream error' });
    }

    const data = await r.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('') ||
      "I'm sorry, I couldn't process that. Please contact the clinic directly.";

    return res.status(200).json({ text });
  } catch (e) {
    console.error('Chat handler error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
