import React, { useState, useRef, useEffect } from 'react';
import { Wand2, RefreshCw, AlertCircle } from 'lucide-react';
import { openrouterService } from '../services';
import { LoadingSpinner } from './LoadingSpinner';
import { MAX_PROMPT_LENGTH } from '../constants';

interface PromptWorkshopProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  className?: string;
}

export const PromptWorkshop: React.FC<PromptWorkshopProps> = ({
  prompt,
  onPromptChange,
  className = ''
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastEnhancement, setLastEnhancement] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [prompt]);

  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing) return;

    setIsEnhancing(true);
    setError(null);

    try {
      const response = await openrouterService.enhancePrompt(prompt);
      onPromptChange(response.enhanced_prompt);
      setLastEnhancement(response.explanation || 'Enhanced with AI assistance');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enhance prompt');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSanitizePrompt = async () => {
    if (!prompt.trim() || isEnhancing) return;

    setIsEnhancing(true);
    setError(null);

    try {
      const sanitized = await openrouterService.sanitizePrompt(prompt);
      if (sanitized !== prompt) {
        onPromptChange(sanitized);
        setLastEnhancement('Prompt sanitized for safety');
      } else {
        setLastEnhancement('Prompt is already appropriate');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sanitize prompt');
    } finally {
      setIsEnhancing(false);
    }
  };

  const isPromptTooLong = prompt.length > MAX_PROMPT_LENGTH;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
          Describe your vision
        </label>
        <div className="relative">
          <textarea
            ref={textareaRef}
            id="prompt"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="A majestic dragon soaring through clouds at sunset, digital art style..."
            className={`
              w-full px-4 py-3 border rounded-lg resize-none transition-colors duration-200
              min-h-[100px] max-h-[300px] overflow-y-auto
              ${isPromptTooLong 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
              focus:ring-2 focus:ring-opacity-50
            `}
            rows={3}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            <span className={isPromptTooLong ? 'text-red-500' : ''}>
              {prompt.length}
            </span>
            /{MAX_PROMPT_LENGTH}
          </div>
        </div>
        
        {isPromptTooLong && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle size={16} />
            <span>Prompt is too long. Please shorten it to {MAX_PROMPT_LENGTH} characters or less.</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleEnhancePrompt}
          disabled={!prompt.trim() || isEnhancing || isPromptTooLong}
          className="
            flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg
            hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
            transition-colors duration-200
          "
        >
          {isEnhancing ? (
            <LoadingSpinner size="sm" className="text-white" />
          ) : (
            <Wand2 size={16} />
          )}
          Enhance with AI
        </button>

        <button
          onClick={handleSanitizePrompt}
          disabled={!prompt.trim() || isEnhancing}
          className="
            flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg
            hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed
            transition-colors duration-200
          "
        >
          {isEnhancing ? (
            <LoadingSpinner size="sm" className="text-white" />
          ) : (
            <RefreshCw size={16} />
          )}
          Sanitize
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-red-700">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {lastEnhancement && !error && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-700">
            ✨ {lastEnhancement}
          </div>
        </div>
      )}
    </div>
  );
};