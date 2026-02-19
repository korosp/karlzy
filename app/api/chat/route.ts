import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured. Please set GROQ_API_KEY in environment variables.' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { messages, model = 'llama-3.3-70b-versatile' } = body;

    const systemPrompt = {
      role: 'system',
      content: `Kamu adalah KarlX–AI, asisten kecerdasan buatan yang cerdas, kreatif, dan membantu. 
Kamu berbicara dalam Bahasa Indonesia yang natural, santai tapi tetap profesional.
Kamu bisa membantu dengan: coding, menulis, analisis, matematika, kreatif, dan banyak lagi.
Ketika menjawab kode, gunakan markdown code blocks dengan syntax highlighting yang benar.
Selalu berikan jawaban yang jelas, terstruktur, dan mudah dipahami.`,
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [systemPrompt, ...messages],
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      return NextResponse.json(
        { error: error?.error?.message ?? 'Groq API error' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
