/**
 * Helper utility for generating AI content using Google Gemini API with fallback to local Ollama.
 */
export async function generateAiContent(prompt, expectJson = true) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  const configuredModel = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';

  // Candidate models to try in sequence if one experiences 503 high demand or 404
  const candidateModels = Array.from(new Set([
    configuredModel,
    'gemini-3-flash-preview',
    'gemini-flash-lite-latest',
    'gemini-3.8-flash',
  ]));

  if (apiKey) {
    for (const model of candidateModels) {
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
          signal: AbortSignal.timeout(15000), // 15s timeout
        });

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
        } else {
          const errText = await res.text();
          console.warn(`Gemini API Error with model [${model}]: ${res.status}`, errText.substring(0, 150));
          // Continue to next candidate model if 503 or 404
          continue;
        }
      } catch (err) {
        console.warn(`Gemini API Fetch Error with model [${model}]:`, err.message);
      }
    }
  }

  // Fallback to Ollama if configured & reachable (with 2s quick timeout)
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
      signal: AbortSignal.timeout(2000),
    });

    if (aiRes.ok) {
      const aiData = await aiRes.json();
      return aiData.response;
    }
  } catch (err) {
    // Ollama not running - silent ignore
  }

  return null;
}

