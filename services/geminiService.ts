// Client-side wrapper — calls our serverless proxy. No API keys in the browser.

export const getGeminiChatResponse = async (
  userMessage: string,
  history: { role: 'user' | 'model'; text: string }[]
) => {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, history }),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    return data.text || "I'm sorry, I couldn't process that. Please contact the clinic directly.";
  } catch (error) {
    console.error('Chat API error:', error);
    return "Our dental assistant is currently busy. Please leave your contact details, and we'll get back to you!";
  }
};
