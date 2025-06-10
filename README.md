# Lyra's Image Alchemist

A modern, beautiful AI-powered image generation application built with React, TypeScript, and Tailwind CSS. Transform your creative visions into stunning artwork using OpenRouter's AI models and Google's Imagen API.

## Features

### 🎨 Prompt Workshop
- **Smart Prompt Enhancement**: AI-powered prompt improvement using Claude 3.5 Sonnet via OpenRouter
- **Content Refinement**: Automatic sanitization and optimization
- **Interactive Interface**: Real-time editing with auto-resizing textarea

### 🖼️ AI Art Studio
- **Multiple Aspect Ratios**: Square, landscape, portrait, widescreen, and tall portrait
- **Batch Generation**: Create 8 variations simultaneously
- **High-Quality Output**: Up to 1024px resolution images
- **One-Click Download**: Save your favorite creations instantly

### 🎯 Modern Design
- **Responsive Layout**: Perfect on mobile, tablet, and desktop
- **Smooth Animations**: Delightful micro-interactions
- **Accessible**: Keyboard navigation and screen reader friendly
- **Premium Aesthetics**: Apple-inspired design language

## Quick Start

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Set up API Keys**
   ```bash
   cp .env.example .env
   # Add your OpenRouter and Gemini API keys to .env
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

## API Configuration

This application requires two API keys:

### OpenRouter API (for text generation)
- Sign up at [OpenRouter](https://openrouter.ai/)
- Get your API key from the dashboard
- Uses Claude 3.5 Sonnet for prompt enhancement and refinement

### Google Gemini API (for image generation)
- Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Requires access to `imagen-3.0-generate-002` model

Add both keys to your `.env` file:
```
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## Architecture

```
src/
├── components/          # Reusable UI components
├── services/           # API integration layer
├── types/             # TypeScript definitions
├── constants/         # App configuration
└── App.tsx           # Main application
```

## Technologies

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for fast development
- **Lucide React** for icons
- **OpenRouter API** with Claude 3.5 Sonnet for text generation
- **Google Imagen** for image generation

## Production Ready

- ✅ Type-safe with TypeScript
- ✅ Responsive design system
- ✅ Error handling and loading states
- ✅ Optimized build pipeline
- ✅ Accessible components
- ✅ Modern React patterns

## License

MIT License - feel free to use this project for your own creative endeavors!