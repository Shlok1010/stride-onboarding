export async function streamAI({
  systemPrompt = '',
  userMessage = '',
  conversationHistory = null,
  onToken,
  onDone,
}) {
  const apiKey = import.meta.env.VITE_AI_API_KEY;

  if (!apiKey) {
    onToken?.('⚠️ AI features require a Gemini API key. Add VITE_AI_API_KEY to .env.local');
    onDone?.();
    return;
  }

  let contents;
  if (conversationHistory && conversationHistory.length > 0) {
    contents = conversationHistory.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
  } else {
    contents = [{ role: 'user', parts: [{ text: userMessage }] }];
  }

  const body = {
    contents,
    generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
  };

  if (systemPrompt) {
    body.system_instruction = { parts: [{ text: systemPrompt }] };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      onToken?.(`⚠️ AI unavailable (${response.status}). Check your API key.`);
      onDone?.();
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split('\n').filter((l) => l.startsWith('data: '))) {
        const raw = line.slice(6).trim();
        if (!raw || raw === '[DONE]') continue;
        try {
          const token = JSON.parse(raw)?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (token) onToken?.(token);
        } catch {
          // ignore parse errors on incomplete SSE frames
        }
      }
    }
  } catch (err) {
    onToken?.('⚠️ Network error. Please check your connection and API key.');
  }

  onDone?.();
}
