const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
const baseURL = import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
const model = import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-v4-flash';

export interface ChatParams {
  systemPrompt: string;
  userMessage: string;
  stream?: boolean;
  temperature?: number;
  maxTokens?: number;
}

async function apiCall(messages: { role: string; content: string }[], stream: boolean, temperature: number, maxTokens: number) {
  const response = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`API error ${response.status}: ${errorText.slice(0, 200)}`);
  }

  return response;
}

export async function chat(params: ChatParams): Promise<string> {
  const response = await apiCall(
    [
      { role: 'system', content: params.systemPrompt },
      { role: 'user', content: params.userMessage },
    ],
    false,
    params.temperature ?? 0.7,
    params.maxTokens ?? 2048
  );

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function chatStream(
  params: ChatParams,
  onToken: (token: string) => void,
  onComplete: (fullText: string) => void,
  onError: (error: Error) => void
): Promise<void> {
  try {
    const response = await apiCall(
      [
        { role: 'system', content: params.systemPrompt },
        { role: 'user', content: params.userMessage },
      ],
      true,
      params.temperature ?? 0.7,
      params.maxTokens ?? 2048
    );

    const reader = response.body?.getReader();
    if (!reader) {
      onError(new Error('No response body'));
      return;
    }

    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));

      for (const line of lines) {
        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            fullText += content;
            onToken(content);
          }
        } catch {
        }
      }
    }

    onComplete(fullText);
  } catch (error) {
    onError(error instanceof Error ? error : new Error(String(error)));
  }
}

export async function chatJSON<T>(params: ChatParams): Promise<T> {
  const text = await chat({
    ...params,
    systemPrompt: params.systemPrompt + '\n\n你必须严格输出JSON格式，不要包含任何其他文字。',
    temperature: 0.5,
  });

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Agent did not return valid JSON: ' + text.slice(0, 200));
  }

  return JSON.parse(jsonMatch[0]) as T;
}

export { model };