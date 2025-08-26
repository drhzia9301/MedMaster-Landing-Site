// Global Trusted Types policy setup
// This should be imported early in the application to set up trusted types

let globalTrustedHTMLPolicy: any = null;

// Initialize global trusted types policy
export const initializeTrustedTypes = () => {
  if (typeof window !== 'undefined' && window.trustedTypes) {
    try {
      // Check if default policy already exists
      if (window.trustedTypes.defaultPolicy) {
        globalTrustedHTMLPolicy = window.trustedTypes.defaultPolicy;
        return globalTrustedHTMLPolicy;
      }

      // Try to create a default policy
      globalTrustedHTMLPolicy = window.trustedTypes.createPolicy('default', {
        createHTML: (string: string) => {
          // Basic sanitization to prevent XSS
          return string
            .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
            .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
            .replace(/javascript:/gi, '') // Remove javascript: URLs
            .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '') // Remove iframes
            .replace(/<object[^>]*>.*?<\/object>/gi, '') // Remove objects
            .replace(/<embed[^>]*>/gi, ''); // Remove embeds
        },
        createScript: (string: string) => {
          // Allow scripts but log them for debugging
          console.log('Creating trusted script:', string);
          return string;
        },
        createScriptURL: (string: string) => {
          // Allow script URLs but validate they're from trusted sources
          const allowedDomains = [
            'https://apis.google.com',
            'https://accounts.google.com',
            'https://www.gstatic.com',
            'https://cdn.tailwindcss.com',
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
          ];
          
          const isAllowed = allowedDomains.some(domain => string.startsWith(domain));
          if (!isAllowed && !string.startsWith('/') && !string.startsWith('./')) {
            console.warn('Potentially unsafe script URL:', string);
          }
          
          return string;
        }
      });
      
      console.log('Global Trusted Types policy created successfully');
      return globalTrustedHTMLPolicy;
    } catch (error) {
      console.warn('Failed to create global Trusted Types policy:', error);
      
      // Fallback: try to create a named policy
      try {
        globalTrustedHTMLPolicy = window.trustedTypes.createPolicy('medmaster-global', {
          createHTML: (string: string) => {
            return string
              .replace(/<script[^>]*>.*?<\/script>/gi, '')
              .replace(/on\w+="[^"]*"/gi, '')
              .replace(/javascript:/gi, '');
          }
        });
        console.log('Named Trusted Types policy created as fallback');
        return globalTrustedHTMLPolicy;
      } catch (fallbackError) {
        console.warn('Failed to create fallback Trusted Types policy:', fallbackError);
        return null;
      }
    }
  }
  
  return null;
};

// Get the global policy (initialize if needed)
export const getTrustedHTMLPolicy = () => {
  if (!globalTrustedHTMLPolicy) {
    globalTrustedHTMLPolicy = initializeTrustedTypes();
  }
  return globalTrustedHTMLPolicy;
};

// Helper function to create trusted HTML
export const createTrustedHTML = (htmlString: string): string | TrustedHTML => {
  const policy = getTrustedHTMLPolicy();
  
  if (policy && policy.createHTML) {
    try {
      return policy.createHTML(htmlString);
    } catch (error) {
      console.warn('Failed to create trusted HTML with policy:', error);
      return htmlString;
    }
  }
  
  return htmlString;
};

// Helper function to safely set innerHTML
export const safeSetInnerHTML = (element: Element, htmlString: string) => {
  try {
    const trustedHTML = createTrustedHTML(htmlString);
    element.innerHTML = trustedHTML as string;
  } catch (error) {
    console.warn('Failed to safely set innerHTML:', error);
    // Fallback: set as text content to avoid security issues
    element.textContent = htmlString;
  }
};

// Initialize on import
if (typeof window !== 'undefined') {
  // Initialize immediately when the module is loaded
  initializeTrustedTypes();
}