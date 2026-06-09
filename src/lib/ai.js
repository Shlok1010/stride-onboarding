const MODEL = 'llama-3.3-70b-versatile';

export async function streamAI({
  systemPrompt = '',
  userMessage = '',
  conversationHistory = null,
  onToken,
  onDone,
}) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    onToken?.('⚠️ AI features require a Groq API key. Add VITE_GROQ_API_KEY to .env.local');
    onDone?.();
    return;
  }

  // Build messages array (OpenAI-compatible format)
  const messages = [];

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }

  if (conversationHistory && conversationHistory.length > 0) {
    for (const m of conversationHistory) {
      messages.push({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content });
    }
  } else if (userMessage) {
    messages.push({ role: 'user', content: userMessage });
  }

  const body = {
    model: MODEL,
    messages,
    stream: true,
    max_tokens: 1024,
    temperature: 0.7,
  };

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      onToken?.(`⚠️ Groq API error (${response.status}). Check your API key.`);
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
          const token = JSON.parse(raw)?.choices?.[0]?.delta?.content;
          if (token) onToken?.(token);
        } catch {
          // ignore incomplete SSE frames
        }
      }
    }
  } catch (err) {
    onToken?.('⚠️ Network error. Please check your connection and API key.');
  }

  onDone?.();
}
