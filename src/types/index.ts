export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: AspectRatio;
  createdAt: Date;
}

export type AspectRatio = 'square' | 'landscape' | 'portrait' | 'widescreen' | 'tall';

export interface AspectRatioConfig {
  label: string;
  ratio: string;
  width: number;
  height: number;
  openaiSize: '1024x1024' | '1792x1024' | '1024x1792';
}

export interface PromptEnhancementResponse {
  enhanced_prompt: string;
  explanation?: string;
}

export interface OpenAIImageResponse {
  created: number;
  data: Array<{
    url?: string;
    b64_json?: string;
    revised_prompt?: string;
  }>;
}