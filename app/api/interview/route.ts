import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

interface InterviewRequest {
  domain: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic?: string;
  userAnswer?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: InterviewRequest = await request.json();

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an expert technical interviewer for ${body.domain} interviews. 
Your role is to:
1. Ask relevant technical questions based on the difficulty level: ${body.difficulty}
2. Evaluate user answers and provide constructive feedback
3. Follow up with deeper questions based on answers
4. Rate the response quality (1-10)
5. Suggest improvements

Keep responses concise and professional. For each interaction:
- Acknowledge the answer
- Rate it (1-10)
- Provide feedback
- Ask the next question
- Keep track of topics covered`;

    let messages = body.conversationHistory || [];

    if (messages.length === 0) {
      // Initial question
      const initialPrompt = `Start an ${body.difficulty} level interview for ${body.domain}${body.topic ? ` focusing on ${body.topic}` : ''}. Ask the first technical question.`;
      messages.push({ role: 'user', content: initialPrompt });
    } else if (body.userAnswer) {
      // User provided an answer
      messages.push({ role: 'user', content: body.userAnswer });
    }

    const response = await axios.post(
      ANTHROPIC_API_URL,
      {
        model: 'claude-opus-4-6',
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
      },
      {
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    const assistantMessage = response.data.content[0]?.text || '';

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      conversationHistory: [
        ...messages,
        {
          role: 'assistant',
          content: assistantMessage
        }
      ]
    });
  } catch (error) {
    console.error('Interview API error:', error);
    return NextResponse.json(
      { error: 'Failed to process interview request' },
      { status: 500 }
    );
  }
}
