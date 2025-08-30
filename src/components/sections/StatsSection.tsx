import React from 'react';
import { Book } from 'lucide-react';

interface Testimonial {
  name: string;
  college: string;
  year: string;
  image: string;
  comment: string;
}

interface StatsSectionProps {
  testimonials: Testimonial[];
  currentTestimonial: number;
  setCurrentTestimonial: (index: number) => void;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  testimonials,
  currentTestimonial,
  setCurrentTestimonial
}) => {
  return (
    <section id="stats" className="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Trusted by Medical Students</h2>
          <p className="text-xl text-gray-300">Join thousands of students mastering microbiology and pharmacology</p>
        </div>

        {/* Student Testimonials Slideshow */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Student Image */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-400 to-purple-400 shadow-lg">
                    <img
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to a default avatar if image fails to load
                        e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                          <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
                            <rect width="128" height="128" fill="#4F46E5"/>
                            <circle cx="64" cy="45" r="20" fill="white"/>
                            <circle cx="64" cy="105" r="35" fill="white"/>
                            <text x="64" y="70" text-anchor="middle" fill="#4F46E5" font-size="16" font-weight="bold">
                              ${testimonials[currentTestimonial].name.split(' ').map(n => n[0]).join('')}
                            </text>
                          </svg>
                        `)}`
                      }}
                    />
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="flex-1 text-center md:text-left">
                  <blockquote className="text-lg md:text-xl text-gray-200 mb-4 italic">
                    "{testimonials[currentTestimonial].comment}"
                  </blockquote>
                  <div className="text-white">
                    <div className="font-bold text-xl">{testimonials[currentTestimonial].name}</div>
                    <div className="text-blue-400 font-medium">{testimonials[currentTestimonial].college}</div>
                    <div className="text-gray-400">{testimonials[currentTestimonial].year}</div>
                  </div>
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-blue-400 scale-125'
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Famous Resources Card */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20"></div>
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <Book className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Questions Based on Famous Resources</h3>
              <p className="text-xl text-blue-100 mb-6">
                Questions pulled from the resources you already know and trust
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-white font-bold text-lg">Sketchy</div>
                  <div className="text-blue-200 text-sm">Visual Learning</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-white font-bold text-lg">Pixorize</div>
                  <div className="text-blue-200 text-sm">Memory Palace</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-white font-bold text-lg">First Aid</div>
                  <div className="text-blue-200 text-sm">USMLE Prep</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-white font-bold text-lg">Anki</div>
                  <div className="text-blue-200 text-sm">Spaced Repetition</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
