import React, { useState } from 'react';
import { useLazyImage } from '../hooks/useLazyLoading';
import LoadingSpinner from './LoadingSpinner';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder,
  fallbackSrc,
  onLoad,
  onError,
}) => {
  const [hasErrored, setHasErrored] = useState(false);
  const { targetRef, imageSrc, isLoaded, isError } = useLazyImage(
    src,
    placeholder || `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#374151"/>
        <text x="200" y="150" text-anchor="middle" fill="#9CA3AF" font-size="16" font-family="Arial">Loading...</text>
      </svg>
    `)}`
  );

  const handleImageError = () => {
    setHasErrored(true);
    onError?.();
  };

  const handleImageLoad = () => {
    onLoad?.();
  };

  const getFinalSrc = () => {
    if (isError || hasErrored) {
      return fallbackSrc || `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
          <rect width="400" height="300" fill="#374151"/>
          <circle cx="200" cy="130" r="20" fill="#6B7280"/>
          <path d="M180 150 L220 150 M190 160 L210 160" stroke="#6B7280" stroke-width="2" fill="none"/>
          <text x="200" y="190" text-anchor="middle" fill="#9CA3AF" font-size="14" font-family="Arial">Image not available</text>
        </svg>
      `)}`;
    }
    return imageSrc;
  };

  return (
    <div ref={targetRef as React.RefObject<HTMLDivElement>} className={`relative overflow-hidden ${className}`}>
      <img
        src={getFinalSrc()}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded && !isError && !hasErrored ? 'opacity-100' : 'opacity-75'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
      
      {/* Loading overlay */}
      {!isLoaded && !isError && !hasErrored && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <LoadingSpinner size="md" color="white" />
        </div>
      )}
      
      {/* Error overlay */}
      {(isError || hasErrored) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="text-center text-gray-300">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;