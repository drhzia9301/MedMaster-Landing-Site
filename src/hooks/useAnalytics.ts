import { useCallback } from 'react';

// Analytics tracking hook
export const useAnalytics = () => {
  // Track page views
  const trackPageView = useCallback((page: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: page,
        page_location: window.location.href,
      });
    }
  }, []);

  // Track events
  const trackEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: 'engagement',
        event_label: parameters?.label || '',
        value: parameters?.value || 0,
        ...parameters,
      });
    }
  }, []);

  // Track conversions
  const trackConversion = useCallback((action: string, value?: number) => {
    trackEvent('conversion', {
      action,
      value,
      event_category: 'conversion',
    });
  }, [trackEvent]);

  // Track scroll depth
  const trackScrollDepth = useCallback(() => {
    let maxScroll = 0;
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Track milestone scroll depths
        if ([25, 50, 75, 90].includes(scrollPercent)) {
          trackEvent('scroll_depth', {
            scroll_depth: scrollPercent,
            event_category: 'engagement',
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackEvent]);

  return {
    trackPageView,
    trackEvent,
    trackConversion,
    trackScrollDepth,
  };
};

// Extend window type for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}