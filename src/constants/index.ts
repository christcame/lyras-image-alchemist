import { AspectRatioConfig } from '../types';

export const ASPECT_RATIOS: Record<string, AspectRatioConfig> = {
  square: {
    label: 'Square',
    ratio: '1:1',
    width: 1024,
    height: 1024,
    openaiSize: '1024x1024'
  },
  landscape: {
    label: 'Landscape',
    ratio: '16:9',
    width: 1792,
    height: 1024,
    openaiSize: '1792x1024'
  },
  portrait: {
    label: 'Portrait',
    ratio: '9:16',
    width: 1024,
    height: 1792,
    openaiSize: '1024x1792'
  },
  widescreen: {
    label: 'Widescreen',
    ratio: '21:9',
    width: 1792,
    height: 1024,
    openaiSize: '1792x1024'
  },
  tall: {
    label: 'Tall Portrait',
    ratio: '2:3',
    width: 1024,
    height: 1792,
    openaiSize: '1024x1792'
  }
};

export const OPENAI_CONFIG = {
  model: 'dall-e-3',
  quality: 'standard' as const,
  style: 'natural' as const,
  n: 1
};

export const OPENROUTER_CONFIG = {
  model: 'anthropic/claude-3.5-sonnet',
  baseUrl: 'https://openrouter.ai/api/v1'
};

export const MAX_PROMPT_LENGTH = 4000;
export const BATCH_SIZE = 4; // OpenAI DALL-E 3 generates 1 image per request, so we'll make 4 requests for batch