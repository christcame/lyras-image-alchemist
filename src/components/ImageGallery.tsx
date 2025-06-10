import React, { useState } from 'react';
import { Download, Eye, X, Calendar, Palette } from 'lucide-react';
import { GeneratedImage } from '../types';
import { ASPECT_RATIOS } from '../constants';

interface ImageGalleryProps {
  images: GeneratedImage[];
  className?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  className = '' 
}) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const downloadImage = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `lyra-alchemist-${image.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (images.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Palette className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
        <p className="text-gray-500">
          Create your first masterpiece by entering a prompt above and clicking generate!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={`space-y-6 ${className}`}>
        <h2 className="text-xl font-semibold text-gray-900">
          Generated Images ({images.length})
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => {
            const aspectConfig = ASPECT_RATIOS[image.aspectRatio];
            
            return (
              <div
                key={image.id}
                className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                      <button
                        onClick={() => setSelectedImage(image)}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                        title="View full size"
                      >
                        <Eye size={16} className="text-gray-700" />
                      </button>
                      <button
                        onClick={() => downloadImage(image)}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                        title="Download image"
                      >
                        <Download size={16} className="text-gray-700" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Image info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {aspectConfig.label}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={12} />
                      {formatDate(image.createdAt)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 line-clamp-3" title={image.prompt}>
                    {image.prompt}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full-size image modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
            
            <img
              src={selectedImage.url}
              alt={selectedImage.prompt}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4 rounded-b-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {ASPECT_RATIOS[selectedImage.aspectRatio].label} • {formatDate(selectedImage.createdAt)}
                </span>
                <button
                  onClick={() => downloadImage(selectedImage)}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  <Download size={14} />
                  Download
                </button>
              </div>
              <p className="text-sm text-gray-200">{selectedImage.prompt}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};