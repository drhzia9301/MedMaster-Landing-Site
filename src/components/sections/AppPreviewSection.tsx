import React from 'react';
import LazyImage from '../LazyImage';

interface AppPreviewSectionProps {
  currentSlide: number;
  screenshots: Array<{ src: string; alt: string; title: string }>;
  trackEvent: (event: string, data?: any) => void;
}

const AppPreviewSection: React.FC<AppPreviewSectionProps> = ({
  currentSlide,
  screenshots,
  trackEvent
}) => {
  return (
    <section id="preview" className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">See MedMaster in Action</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Experience our intuitive interface and powerful features designed for medical students
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gray-900 rounded-2xl p-8 shadow-2xl">
            <div className="relative overflow-hidden rounded-xl">
              <div className="flex transition-transform duration-500 ease-in-out" 
                   style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {screenshots.map((screenshot, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <LazyImage 
                      src={screenshot.src} 
                      alt={screenshot.alt}
                      className="w-full h-auto rounded-lg shadow-lg"
                      onLoad={() => trackEvent('screenshot_loaded', { slide: index })}
                    />
                  </div>
                ))}
              </div>
              
              {/* Navigation dots */}
              <div className="flex justify-center mt-6 space-x-2">
                {screenshots.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-blue-500 scale-125' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    onClick={() => trackEvent('screenshot_navigation', { slide: index })}
                  />
                ))}
              </div>
              
              {/* Screenshot Title */}
              <div className="text-center mt-4">
                <h3 className="text-xl font-semibold text-white">
                  {screenshots[currentSlide].title}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPreviewSection;
