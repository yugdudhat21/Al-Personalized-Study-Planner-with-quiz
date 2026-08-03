/**
 * Helper utility for generating AI content using Google Gemini API with fallback to local Ollama.
 */
export async function generateAiContent(prompt, expectJson = true) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  const model = process.env.GEMINI_MODEL || 'gemini-flash-latest';

  if (apiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
      };

      if (expectJson) {
        payload.generationConfig = {
          responseMimeType: 'application/json',
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } else {
        const errText = await res.text();
        console.warn('Gemini API Response Error:', res.status, errText);
      }
    } catch (err) {
      console.warn('Gemini API Fetch Error:', err.message);
    }
  }

  // Fallback to Ollama if configured & reachable
  const ollamaUrl = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434';
  try {
    const aiRes = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5:7b',
        prompt,
        stream: false,
      }),
    });

    if (aiRes.ok) {
      const aiData = await aiRes.json();
      return aiData.response;
    }
  } catch (err) {
    console.warn('Ollama API Fallback Error:', err.message);
  }

  return null;
}
