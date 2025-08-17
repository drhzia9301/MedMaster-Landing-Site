import React, { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useLazyLoading';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How does the Spaced Repetition System work?",
    answer: "Our SRS is based on the proven SM2 algorithm used by Anki. It automatically schedules questions based on your performance, showing difficult concepts more frequently and easy ones less often. This scientifically-proven method helps you retain information for the long term."
  },
  {
    question: "What medical subjects are covered?",
    answer: "MedMaster focuses on Microbiology and Pharmacology with over 10,000 questions covering bacteria, viruses, fungi, parasites, and drug mechanisms. We also include 3,000+ clinical cases for practical application."
  },
  {
    question: "Can I use MedMaster offline?",
    answer: "Yes! Our mobile-optimized platform works offline once content is loaded. You can study anywhere, anytime without worrying about internet connectivity."
  },
  {
    question: "How accurate are the questions compared to actual exams?",
    answer: "Our questions are curated from trusted medical resources like Sketchy, Pixorize, and First Aid. Many students report 25-40% improvement in exam scores after using MedMaster for 2-3 months."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes! You can start learning immediately with our free trial. No credit card required. Experience all features including Quick Fire mode, clinical cases, and analytics."
  },
  {
    question: "How does the gamification system work?",
    answer: "Earn XP points for correct answers, unlock achievements, customize avatars, and compete on global leaderboards. Our scoring system includes combo multipliers and daily challenges to keep you motivated."
  },
  {
    question: "What makes MedMaster different from other study apps?",
    answer: "MedMaster combines proven learning science (SRS) with engaging gamification specifically for medical students. Our AI-powered analytics provide personalized insights, and our clinical cases bridge the gap between theory and practice."
  },
  {
    question: "Can I track my progress over time?",
    answer: "Absolutely! Our advanced analytics dashboard shows detailed performance metrics, learning patterns, weak areas, and predictive insights to optimize your study strategy."
  }
];

interface FAQItemProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItemComponent: React.FC<FAQItemProps> = ({ item, isOpen, onToggle }) => {
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:border-blue-500">
      <button
        className="w-full px-6 py-4 text-left bg-gray-800 hover:bg-gray-750 transition-colors duration-200 flex justify-between items-center"
        onClick={onToggle}
      >
        <span className="text-white font-medium pr-4">{item.question}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4 bg-gray-850 text-gray-300 leading-relaxed">
          {item.answer}
        </div>
      </div>
    </div>
  );
};

export const FAQSection: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const { targetRef, hasIntersected } = useIntersectionObserver();

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section ref={targetRef} id="faq" className="py-20 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get answers to common questions about MedMaster
          </p>
        </div>
        
        {hasIntersected && (
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <FAQItemComponent
                key={index}
                item={item}
                isOpen={openItems.has(index)}
                onToggle={() => toggleItem(index)}
              />
            ))}
          </div>
        )}
        

      </div>
    </section>
  );
};

export default FAQSection;