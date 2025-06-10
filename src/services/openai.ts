import { OpenAIImageResponse, AspectRatio, GeneratedImage } from '../types';
import { ASPECT_RATIOS, OPENAI_CONFIG } from '../constants';

class ApiError extends Error {
  constructor(message: string, public code?: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  }

  private checkApiKey(): void {
    if (!this.apiKey) {
      throw new ApiError('OpenAI API key is required. Please set VITE_OPENAI_API_KEY in your environment.');
    }
  }

  async generateImage(prompt: string, aspectRatio: AspectRatio): Promise<GeneratedImage> {
    this.checkApiKey();
    
    try {
      const aspectConfig = ASPECT_RATIOS[aspectRatio];
      
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: OPENAI_CONFIG.model,
          prompt: prompt,
          size: aspectConfig.openaiSize,
          quality: OPENAI_CONFIG.quality,
          style: OPENAI_CONFIG.style,
          n: OPENAI_CONFIG.n,
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

      const data: OpenAIImageResponse = await response.json();
      
      if (!data.data || data.data.length === 0 || !data.data[0].url) {
        throw new ApiError('No image URL returned from OpenAI');
      }

      return {
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        url: data.data[0].url,
        prompt: data.data[0].revised_prompt || prompt,
        aspectRatio,
        createdAt: new Date(),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      console.error('OpenAI API Error:', error);
      throw new ApiError(
        error instanceof Error ? error.message : 'Failed to generate image'
      );
    }
  }

  async generateBatch(prompt: string, aspectRatio: AspectRatio, count: number = 4): Promise<GeneratedImage[]> {
    this.checkApiKey();
    
    try {
      // DALL-E 3 only generates 1 image per request, so we make multiple parallel requests
      const promises = Array.from({ length: count }, () => 
        this.generateImage(prompt, aspectRatio)
      );

      const results = await Promise.allSettled(promises);
      
      const images: GeneratedImage[] = [];
      const errors: string[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          images.push(result.value);
        } else {
          errors.push(`Image ${index + 1}: ${result.reason.message || 'Unknown error'}`);
        }
      });

      if (images.length === 0) {
        throw new ApiError(`All image generations failed: ${errors.join(', ')}`);
      }

      // Log partial failures but return successful images
      if (errors.length > 0) {
        console.warn('Some images failed to generate:', errors);
      }

      return images;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      console.error('Batch generation error:', error);
      throw new ApiError(
        error instanceof Error ? error.message : 'Failed to generate batch images'
      );
    }
  }
}

export const openaiService = new OpenAIService();