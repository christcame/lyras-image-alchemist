import React, { useState } from 'react';
import { Sparkles, Zap, AlertCircle } from 'lucide-react';
import { AspectRatio, GeneratedImage } from '../types';
import { openaiService } from '../services';
import { LoadingSpinner } from './LoadingSpinner';
import { AspectRatioSelector } from './AspectRatioSelector';
import { BATCH_SIZE } from '../constants';

interface ArtStudioProps {
  prompt: string;
  onImagesGenerated: (images: GeneratedImage[]) => void;
  className?: string;
}

export const ArtStudio: React.FC<ArtStudioProps> = ({
  prompt,
  onImagesGenerated,
  className = ''
}) => {
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>('square');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  const generateSingleImage = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const image = await openaiService.generateImage(prompt, selectedAspectRatio);
      onImagesGenerated([image]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBatchImages = async () => {
    if (!prompt.trim() || isBatchGenerating) return;

    setIsBatchGenerating(true);
    setError(null);
    setProgress({ current: 0, total: BATCH_SIZE });

    try {
      // Generate images one by one to show progress
      const images: GeneratedImage[] = [];
      
      for (let i = 0; i < BATCH_SIZE; i++) {
        setProgress({ current: i, total: BATCH_SIZE });
        
        try {
          const image = await openaiService.generateImage(prompt, selectedAspectRatio);
          images.push(image);
        } catch (err) {
          console.warn(`Failed to generate image ${i + 1}:`, err);
          // Continue with other images even if one fails
        }
        
        setProgress({ current: i + 1, total: BATCH_SIZE });
      }

      if (images.length === 0) {
        throw new Error('All image generations failed');
      }

      onImagesGenerated(images);
      
      if (images.length < BATCH_SIZE) {
        setError(`Generated ${images.length} out of ${BATCH_SIZE} images. Some generations failed.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate batch images');
    } finally {
      setIsBatchGenerating(false);
      setProgress(null);
    }
  };

  const isDisabled = !prompt.trim() || isGenerating || isBatchGenerating;

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Art Studio</h2>
        
        <AspectRatioSelector
          selected={selectedAspectRatio}
          onSelect={setSelectedAspectRatio}
          className="mb-6"
        />

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={generateSingleImage}
              disabled={isDisabled}
              className="
                flex-1 flex items-center justify-center gap-2 px-6 py-3 
                bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg
                hover:from-blue-700 hover:to-purple-700 
                disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed
                transition-all duration-200 font-medium
              "
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner size="sm" className="text-white" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Image
                </>
              )}
            </button>

            <button
              onClick={generateBatchImages}
              disabled={isDisabled}
              className="
                flex-1 flex items-center justify-center gap-2 px-6 py-3 
                bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg
                hover:from-purple-700 hover:to-pink-700 
                disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed
                transition-all duration-200 font-medium
              "
            >
              {isBatchGenerating ? (
                <>
                  <LoadingSpinner size="sm" className="text-white" />
                  {progress ? `${progress.current}/${progress.total}` : 'Generating...'}
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Generate {BATCH_SIZE} Images
                </>
              )}
            </button>
          </div>

          {progress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Generating batch images...</span>
                <span>{progress.current}/{progress.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800 mb-1">Generation Error</h4>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!prompt.trim() && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Sparkles size={16} />
                <span>Enter a prompt above to start creating amazing AI art!</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};