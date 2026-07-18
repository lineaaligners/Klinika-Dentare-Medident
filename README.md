# Klinika Dentare Medident

Website for Klinika Dentare Medident — family dental clinic in Pejë, Kosovo, since 1999.

**Live:** https://medident-ks.com

## Stack
- Vite + React + TypeScript + Tailwind
- Vercel (static build + serverless functions in `/api`)

## Environment variables (Vercel)
- `GEMINI_API_KEY` — server-side only, used by `/api/chat` (AI assistant) and `/api/tts` (Academy audio briefing). Never expose in client code.

## Development
```bash
npm install
npm run dev
```
