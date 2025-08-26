/**
 * Cross-Origin Authentication Utilities
 * Handles authentication token sharing between landing site and main app
 */

export interface AuthData {
  token: string;
  email: string;
  username: string;
  userId: number;
  subscriptionType?: string;
}

export interface CrossOriginConfig {
  landingDomain: string;
  appDomain: string;
  tokenKey: string;
  userKey: string;
}

// Default configuration
const DEFAULT_CONFIG: CrossOriginConfig = {
  landingDomain: 'medmaster.site',
  appDomain: 'app.medmaster.com',
  tokenKey: 'medMasterToken',
  userKey: 'medMasterUser'
};

/**
 * Cross-origin authentication manager
 */
export class CrossOriginAuth {
  private config: CrossOriginConfig;

  constructor(config: Partial<CrossOriginConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Store authentication data for cross-origin access
   */
  storeAuthData(authData: AuthData): void {
    // Store in both landing page keys and main app keys
    localStorage.setItem('landingPageToken', authData.token);
    localStorage.setItem('landingPageUser', JSON.stringify({
      username: authData.username,
      email: authData.email,
      userId: authData.userId,
      subscriptionType: authData.subscriptionType || 'demo'
    }));

    // Also store in main app format for cross-domain compatibility
    localStorage.setItem(this.config.tokenKey, authData.token);
    localStorage.setItem(this.config.userKey, JSON.stringify({
      username: authData.username,
      email: authData.email,
      userId: authData.userId,
      subscriptionType: authData.subscriptionType || 'demo'
    }));
  }

  /**
   * Retrieve authentication data
   */
  getAuthData(): AuthData | null {
    const token = localStorage.getItem('landingPageToken') || localStorage.getItem(this.config.tokenKey);
    const userDataStr = localStorage.getItem('landingPageUser') || localStorage.getItem(this.config.userKey);

    if (!token || !userDataStr) {
      return null;
    }

    try {
      const userData = JSON.parse(userDataStr);
      return {
        token,
        email: userData.email,
        username: userData.username,
        userId: userData.userId || 0,
        subscriptionType: userData.subscriptionType
      };
    } catch (error) {
      console.error('Error parsing stored auth data:', error);
      return null;
    }
  }

  /**
   * Clear authentication data
   */
  clearAuthData(): void {
    // Clear both landing page and main app keys
    localStorage.removeItem('landingPageToken');
    localStorage.removeItem('landingPageUser');
    localStorage.removeItem(this.config.tokenKey);
    localStorage.removeItem(this.config.userKey);
  }

  /**
   * Generate redirect URL to main app with authentication data
   */
  generateAppRedirectUrl(authData: AuthData, redirectPath: string = '/'): string {
    const baseUrl = `https://${this.config.appDomain}`;
    const params = new URLSearchParams({
      token: authData.token,
      email: authData.email,
      username: authData.username,
      subscriptionType: authData.subscriptionType || 'demo',
      redirect: redirectPath
    });

    return `${baseUrl}/auth/callback?${params.toString()}`;
  }

  /**
   * Parse authentication data from URL parameters (for main app)
   */
  parseAuthFromUrl(): AuthData | null {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');
    const username = urlParams.get('username');
    const userId = urlParams.get('userId');
    const subscriptionType = urlParams.get('subscriptionType');

    if (!token || !email || !username) {
      return null;
    }

    return {
      token,
      email,
      username,
      userId: userId ? parseInt(userId, 10) : 0,
      subscriptionType: subscriptionType || 'demo'
    };
  }

  /**
   * Handle successful authentication and redirect to main app
   */
  handleAuthSuccess(authData: AuthData, redirectPath: string = '/'): void {
    // Store authentication data
    this.storeAuthData(authData);

    // Generate redirect URL
    const redirectUrl = this.generateAppRedirectUrl(authData, redirectPath);

    // Redirect to main app
    window.location.href = redirectUrl;
  }

  /**
   * Check if current domain is the landing site
   */
  isLandingSite(): boolean {
    return window.location.hostname.includes(this.config.landingDomain.replace('https://', ''));
  }

  /**
   * Check if current domain is the main app
   */
  isMainApp(): boolean {
    return window.location.hostname.includes(this.config.appDomain.replace('https://', ''));
  }

  /**
   * Post message to parent window (for iframe scenarios)
   */
  postAuthMessage(authData: AuthData): void {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'AUTH_SUCCESS',
        data: authData
      }, '*');
    }
  }

  /**
   * Listen for auth messages from child windows/iframes
   */
  listenForAuthMessages(callback: (authData: AuthData) => void): () => void {
    const messageHandler = (event: MessageEvent) => {
      if (event.data.type === 'AUTH_SUCCESS' && event.data.data) {
        callback(event.data.data);
      }
    };

    window.addEventListener('message', messageHandler);

    // Return cleanup function
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }
}

// Export singleton instance
export const crossOriginAuth = new CrossOriginAuth({
  landingDomain: import.meta.env.VITE_LANDING_DOMAIN || 'medmaster.site',
  appDomain: import.meta.env.VITE_APP_DOMAIN || 'app.medmaster.com'
});