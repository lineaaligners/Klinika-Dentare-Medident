// Vercel Serverless Function — Gemini TTS proxy for the Academy audio briefing.
// Fixed script server-side (no user input), key never reaches the browser.

const BRIEFING = `Dr. Lendita Islami Nallbani: Welcome to the Medident Academy in Peja. Our hands-on courses in implantology, sinus lift and zirconia crowns are built on 27 years of clinical experience in our family clinic. Join us, and let's grow together.`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: BRIEFING }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
            },
          },
        }),
      }
    );

    if (!r.ok) {
      console.error('Gemini TTS upstream error:', r.status, await r.text());
      return res.status(502).json({ error: 'Upstream error' });
    }

    const data = await r.json();
    const audio = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audio) return res.status(502).json({ error: 'No audio returned' });

    return res.status(200).json({ audio });
  } catch (e) {
    console.error('TTS handler error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
