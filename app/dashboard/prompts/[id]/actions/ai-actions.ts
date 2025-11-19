'use server';

import { db } from '@/db';
import { templates } from '@/db/templates';

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

interface MistralMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// ✅ Extraire et valider JSON
function extractAndValidateJSON(text: string): string | null {
  try {
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        return JSON.stringify(parsed);
      } catch {
        return null;
      }
    }
    return null;
  }
}

// ✅ Récupérer les templates comme exemples RAG
async function getTemplateExamples(limit: number = 5) {
  try {
    const templatesList = await db
      .select()
      .from(templates)
      .limit(limit);

    return templatesList.map((t) => ({
      name: t.name,
      json: t.json,
    }));
  } catch {
    return [];
  }
}

export async function generatePromptWithAI(userRequest: string) {
  if (!MISTRAL_API_KEY) {
    return {
      success: false,
      error: 'Mistral API key not configured',
    };
  }

  try {
    // 🎯 Récupérer les templates comme exemples
    const templateExamples = await getTemplateExamples(3);

    // 🎯 Créer le contexte RAG avec les templates
    const examplesContext = templateExamples
      .map((t) => `${t.name}:\n${JSON.stringify(t.json, null, 2)}`)
      .join('\n\n');

    // 🎯 SYSTEM PROMPT - UNIQUEMENT LE JSON DU PROMPT
    const systemPrompt = `You are an expert prompt engineer. Generate ONLY the JSON structure of a prompt. NOTHING ELSE.

⚠️ RULES:
1. RETURN ONLY VALID JSON - NO TEXT BEFORE OR AFTER
2. FIRST CHARACTER MUST BE { - LAST CHARACTER MUST BE }
3. NO MARKDOWN, NO CODE BLOCKS, NO EXPLANATIONS
4. NO BACKTICKS, NO FORMATTING
5. THE JSON IS THE PROMPT ITSELF

Reference templates for structure:
${examplesContext}

Generate ONLY the prompt JSON. Example of valid output format:
{"role": "Expert marketer", "task": "Create email", "rules": [...]}

Remember: RESPOND WITH ONLY JSON.`;

    const messages: MistralMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userRequest,
      },
    ];

    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'open-mistral-7b',
        messages,
        temperature: 0.3,
        max_tokens: 4096,
        top_p: 0.8,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();

    // 🎯 VALIDATION STRICTE
    const validJSON = extractAndValidateJSON(content);

    if (!validJSON) {
      console.error('Invalid JSON response:', content);
      return {
        success: false,
        error: 'Invalid JSON. Please try again.',
      };
    }

    // 🎯 Vérifier que c'est bien du JSON
    JSON.parse(validJSON);

    return {
      success: true,
      content: validJSON,
    };
  } catch (error) {
    console.error('AI generation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate prompt',
    };
  }
}

