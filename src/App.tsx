import React, { useState, useEffect } from 'react';
import { Palette, Github, Heart } from 'lucide-react';
import { GeneratedImage } from './types';
import { PromptWorkshop } from './components/PromptWorkshop';
import { ArtStudio } from './components/ArtStudio';
import { ImageGallery } from './components/ImageGallery';

function App() {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<GeneratedImage[]>([]);

  // Load images from localStorage on mount
  useEffect(() => {
    const savedImages = localStorage.getItem('lyra-alchemist-images');
    if (savedImages) {
      try {
        const parsed = JSON.parse(savedImages);
        // Convert date strings back to Date objects
        const imagesWithDates = parsed.map((img: any) => ({
          ...img,
          createdAt: new Date(img.createdAt)
        }));
        setImages(imagesWithDates);
      } catch (error) {
        console.error('Failed to load saved images:', error);
      }
    }
  }, []);

  // Save images to localStorage whenever images change
  useEffect(() => {
    if (images.length > 0) {
      localStorage.setItem('lyra-alchemist-images', JSON.stringify(images));
    }
  }, [images]);

  const handleImagesGenerated = (newImages: GeneratedImage[]) => {
    setImages(prev => [...newImages, ...prev]);
  };

  const clearAllImages = () => {
    setImages([]);
    localStorage.removeItem('lyra-alchemist-images');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lyra's Image Alchemist</h1>
                <p className="text-sm text-gray-600">Transform words into stunning AI art</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {images.length > 0 && (
                <button
                  onClick={clearAllImages}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear Gallery
                </button>
              )}
              <a
                href="https://github.com/christcame/lyras-image-alchemist"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                title="View on GitHub"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Prompt Workshop */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Prompt Workshop</h2>
            <PromptWorkshop
              prompt={prompt}
              onPromptChange={setPrompt}
            />
          </div>

          {/* Art Studio */}
          <ArtStudio
            prompt={prompt}
            onImagesGenerated={handleImagesGenerated}
          />

          {/* Image Gallery */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <ImageGallery images={images} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
              <span>Made with</span>
              <Heart size={16} className="text-red-500" />
              <span>using OpenAI DALL-E 3 and OpenRouter</span>
            </div>
            <div className="text-sm text-gray-500 space-y-2">
              <p>
                Powered by{' '}
                <a href="https://openai.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                  OpenAI DALL-E 3
                </a>
                {' '}for image generation and{' '}
                <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                  OpenRouter
                </a>
                {' '}for prompt enhancement
              </p>
              <p>
                Built with React, TypeScript, and Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;