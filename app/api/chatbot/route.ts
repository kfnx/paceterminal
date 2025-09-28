import { openai } from '@ai-sdk/openai';
import { createClient } from '@supabase/supabase-js';
import { convertToCoreMessages, streamText } from 'ai';

import type { Database } from '@/lib/database.types';

export const dynamic = 'force-dynamic';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Helper function to get recent token data for context
async function getRecentTokens() {
  try {
    const { data, error } = await supabase
      .from('tokens')
      .select('name, address, tier, description_en, label');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return [];
  }
}

// System prompt with PACETERMINAL knowledge
const systemPrompt = `You are PACETERMINAL AI, a helpful assistant specialized in cryptocurrency, memecoins, and the PACETERMINAL platform.

PACETERMINAL is a cryptocurrency token research and analysis platform focused on Solana blockchain tokens. Key features:

PLATFORM OVERVIEW:
- Curated database for evaluating emerging crypto projects
- Comprehensive team analysis, business metrics, and technical data
- Token tier classifications (S, A, B, C tiers based on quality and fundamentals)
- Subscription-based access ($20/month, $200/year in USDC)
- Integration with Solana wallets (Phantom)
- USDC payment system for memberships

KEY ENTITIES:
- Tokens: Solana token data with tier classifications and comprehensive analysis
- Teams: Team member profiles, backgrounds, and social links
- Flywheels: Business model visualizations showing value creation loops
- Members: Subscription-based access control system
- Technical Analysis: Chart analysis and trading insights
- Metrics: Both static and dynamic performance tracking

CRYPTO EXPERTISE:
- Focus on Solana ecosystem and SPL tokens
- Memecoin analysis and evaluation
- Token fundamentals and team assessment
- Market metrics and performance tracking
- Risk assessment and tier classifications
- DeFi protocols and trading strategies

RESPONSE GUIDELINES:
- Be helpful, knowledgeable, and concise
- Explain complex crypto concepts in simple terms
- Reference PACETERMINAL features when relevant
- Provide educational crypto content
- Suggest using PACETERMINAL for deeper analysis when appropriate
- Maintain a professional but friendly tone
- Use emojis sparingly and only when they add value
- Focus on factual information and avoid speculation

TIER SYSTEM DETAILS:
• S Tier: Highest quality projects with exceptional teams, proven track records, and strong fundamentals
• A Tier: Solid projects with experienced teams and good potential for growth
• B Tier: Average projects with some merit but notable risks or limitations
• C Tier: Lower quality or higher risk projects requiring extreme caution

MEMBERSHIP BENEFITS:
- Full access to detailed token analysis and metrics
- Team background research and due diligence
- Business model flywheels and tokenomics analysis
- Technical analysis charts and trading signals
- Priority customer support
- Early access to new features and research

Remember: Always prioritize user education and safety in crypto investments. Acknowledge the high-risk nature of cryptocurrency investments.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages || [];

    // Validate messages array
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid request',
          message: 'Messages must be an array.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Get recent tokens for additional context
    const recentTokens = await getRecentTokens();
    const tokenContext =
      recentTokens.length > 0
        ? `\n\nCurrent tokens in PACETERMINAL database (for reference): ${recentTokens.map((t) => `${t.name} (Tier ${t.tier || 'N/A'})`).join(', ')}`
        : '';

    // Convert messages to the correct format
    const coreMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt + tokenContext,
      messages: coreMessages,
      maxOutputTokens: 1000,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chatbot API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: 'Sorry, I encountered an error. Please try again.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
