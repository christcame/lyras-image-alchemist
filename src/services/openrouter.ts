import { PromptEnhancementResponse } from '../types';
import { OPENROUTER_CONFIG } from '../constants';

class ApiError extends Error {
  constructor(message: string, public code?: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

class OpenRouterService {
  private apiKey: string;
  private baseUrl = OPENROUTER_CONFIG.baseUrl;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';
  }

  private checkApiKey(): void {
    if (!this.apiKey) {
      throw new ApiError('OpenRouter API key is required. Please set VITE_OPENROUTER_API_KEY in your environment.');
    }
  }

  async enhancePrompt(originalPrompt: string): Promise<PromptEnhancementResponse> {
    this.checkApiKey();
    
    try {
      const systemPrompt = `You are an expert AI art prompt engineer. Your task is to enhance and improve prompts for AI image generation to create more detailed, visually compelling, and artistically rich results.

Guidelines for enhancement:
- Add specific artistic styles, techniques, and mediums when appropriate
- Include lighting, composition, and mood details
- Specify camera angles, perspectives, or artistic viewpoints
- Add color palettes or visual aesthetics
- Include quality modifiers like "highly detailed", "photorealistic", "8k resolution"
- Maintain the core concept and intent of the original prompt
- Keep the enhanced prompt under 400 words
- Make it suitable for DALL-E 3

Return your response as a JSON object with this structure:
{
  "enhanced_prompt": "your enhanced prompt here",
  "explanation": "brief explanation of what you enhanced"
}`;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Lyra\'s Image Alchemist',
        },
        body: JSON.stringify({
          model: OPENROUTER_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: `Please enhance this image generation prompt: "${originalPrompt}"`,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
          errorData.error?.code,
          response.status
        );
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new ApiError('No response from OpenRouter');
      }

      const content = data.choices[0].message?.content;
      if (!content) {
        throw new ApiError('Empty response from OpenRouter');
      }

      try {
        // Try to parse as JSON first
        const parsed = JSON.parse(content);
        if (parsed.enhanced_prompt) {
          return parsed;
        }
      } catch {
        // If JSON parsing fails, treat the entire content as the enhanced prompt
      }

      // Fallback: treat the entire response as the enhanced prompt
      return {
        enhanced_prompt: content.trim(),
        explanation: 'Enhanced with AI assistance',
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      console.error('OpenRouter API Error:', error);
      throw new ApiError(
        error instanceof Error ? error.message : 'Failed to enhance prompt'
      );
    }
  }

  async sanitizePrompt(prompt: string): Promise<string> {
    try {
      const systemPrompt = `You are a content moderator for AI image generation. Your task is to sanitize prompts to ensure they are appropriate and safe for image generation.

Guidelines:
- Remove any inappropriate, harmful, or offensive content
- Remove references to copyrighted characters or real people
- Keep the artistic and creative intent intact
- If the prompt is already appropriate, return it unchanged
- If the prompt needs significant changes, provide a clean alternative that maintains the creative spirit

Return only the sanitized prompt text, nothing else.`;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Lyra\'s Image Alchemist',
        },
        body: JSON.stringify({
          model: OPENROUTER_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: `Please sanitize this prompt: "${prompt}"`,
            },
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        // If sanitization fails, return original prompt
        console.warn('Prompt sanitization failed, using original prompt');
        return prompt;
      }

      const data = await response.json();
      const sanitized = data.choices?.[0]?.message?.content?.trim();
      
      return sanitized || prompt;
    } catch (error) {
      console.warn('Prompt sanitization error, using original prompt:', error);
      return prompt;
    }
  }
}

export const openrouterService = new OpenRouterService();