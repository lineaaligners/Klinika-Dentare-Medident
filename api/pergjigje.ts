// Vercel Serverless Function — staff WhatsApp reply drafts (/pergjigje).
// Uses the existing GEMINI_API_KEY. No login (by owner's choice).

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'no_api_key' });
  const origin = String(req.headers.origin || req.headers.referer || '');
  if (origin && !/medident-ks\.com|vercel\.app|localhost/.test(origin)) return res.status(403).json({ error: 'forbidden' });

  const { message, tone, note, info, variant } = req.body || {};
  if (!message || typeof message !== 'string' || message.length > 4000) return res.status(400).json({ error: 'bad_message' });

  const system = `Je recepsioniste e Klinikës Dentare Medident në Pejë. Shkruaj përgjigjen në WhatsApp për pacientin.
RREGULLA:
- Përgjigju në GJUHËN e pacientit (shqip, boshnjakisht/serbisht, gjermanisht, anglisht…). Nëse shkruan shqip, përdor shqipe standarde, natyrale e miqësore.
- Toni: ${String(tone || 'ngrohtë dhe profesional').slice(0, 100)}.
- Përdor VETËM çmimet dhe faktet nga INFO. Mos shpik çmime. Nëse diçka nuk është në INFO ose varet nga gjendja e pacientit, thuaj se përcaktohet në konsultën falas.
- Mos jep diagnoza. Fto pacientin për konsultë falas dhe pyete për ditën/orën që i përshtatet.
- Formatim i thjeshtë WhatsApp: pa tituj markdown, pa **. Maksimum 1-2 emoji, ose asnjë.
- Kthe VETËM tekstin e mesazhit, pa shpjegime.
${note ? '- Udhëzim shtesë nga stafi: ' + String(note).slice(0, 500) : ''}
${variant ? '- Shkruaje ndryshe nga varianti i mëparshëm (fjali dhe strukturë tjetër).' : ''}

INFO E KLINIKËS:
${String(info || '').slice(0, 6000)}`;

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'MESAZHI I PACIENTIT:\n' + message }] }],
          systemInstruction: { parts: [{ text: system }] },
          generationConfig: { temperature: variant ? 1 : 0.7 },
        }) });
    if (!r.ok) { console.error('Gemini', r.status, await r.text()); return res.status(502).json({ error: 'upstream' }); }
    const d = await r.json();
    const text = (d?.candidates?.[0]?.content?.parts || []).map((p: any) => p.text || '').join('').trim();
    return res.status(200).json({ text });
  } catch (e) { console.error(e); return res.status(500).json({ error: 'upstream' }); }
}
