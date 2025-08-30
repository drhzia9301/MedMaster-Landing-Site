// Firebase configuration
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  Auth
} from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';

// Debug environment variables
console.log('🔍 Environment Debug:', {
  NODE_ENV: import.meta.env.MODE,
  API_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? 'LOADED' : 'MISSING',
  AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'MISSING',
  PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'MISSING',
  STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'MISSING',
  MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'MISSING',
  APP_ID: import.meta.env.VITE_FIREBASE_APP_ID || 'MISSING',
  MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'MISSING'
});

// Production Firebase config fallback
const productionConfig = {
  apiKey: 'AIzaSyCsy00m3pl76bitsNcffnGpm9DObgKELcM',
  authDomain: 'medmaster-auth.firebaseapp.com',
  projectId: 'medmaster-auth',
  storageBucket: 'medmaster-auth.firebasestorage.app',
  messagingSenderId: '1073454322288',
  appId: '1:1073454322288:web:2dd42bd0d731d6c2bb5ab5',
  measurementId: 'G-6V494YYG8Z'
};

// Your Firebase config (get this from Firebase Console)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || productionConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || productionConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || productionConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || productionConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || productionConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || productionConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || productionConfig.measurementId
};

// Log the current domain for debugging
console.log('🌐 Current domain:', window.location.hostname);
console.log('🔧 Auth domain configured:', firebaseConfig.authDomain);

console.log('🔧 Final Firebase config:', {
  apiKey: firebaseConfig.apiKey ? '***' : 'missing',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  source: import.meta.env.VITE_FIREBASE_API_KEY ? 'environment' : 'fallback'
});

// Initialize Firebase only if config is available
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let googleProvider: GoogleAuthProvider | undefined;

if (firebaseConfig.apiKey) {
  console.log('🔧 Initializing Firebase with config:', {
    apiKey: firebaseConfig.apiKey ? '***' : 'missing',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    environment: import.meta.env.MODE,
    domain: typeof window !== 'undefined' ? window.location.hostname : 'server'
  });

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  
  // Configure the provider to minimize double prompts
  googleProvider.setCustomParameters({
    prompt: 'select_account' // Keep select_account but handle better in popup
  });

  // Add required scopes
  googleProvider.addScope('email');
  googleProvider.addScope('profile');
  
  console.log('✅ Firebase initialized successfully');
} else {
  console.error('❌ Firebase configuration missing! Check your .env file');
  console.log('Missing config:', {
    apiKey: !firebaseConfig.apiKey,
    authDomain: !firebaseConfig.authDomain,
    projectId: !firebaseConfig.projectId,
    storageBucket: !firebaseConfig.storageBucket,
    messagingSenderId: !firebaseConfig.messagingSenderId,
    appId: !firebaseConfig.appId
  });
  console.log('Current environment mode:', import.meta.env.MODE);
  console.log('All environment variables:', import.meta.env);
}

// Google Sign-In function - use popup with improved error handling
export const signInWithGoogle = async () => {
  if (!auth || !googleProvider) {
    console.error('❌ Firebase not configured properly');
    throw new Error('Firebase not configured');
  }

  console.log('🔄 Starting Google Sign-In process...');
  console.log('🌐 Current domain:', window.location.hostname);
  console.log('🔧 Auth domain:', auth.app.options.authDomain);

  try {
    console.log('🔄 Attempting Google Sign-In with popup method...');

    // Try popup first with shorter timeout
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    console.log('✅ Popup sign-in successful:', user.email);

    // Get the ID token
    const idToken = await user.getIdToken();

    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      },
      idToken,
      method: 'popup'
    };
  } catch (error: any) {
    console.error('❌ Popup sign-in failed:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });

    // Handle popup blocked errors
    const isPopupBlocked = error.code === 'auth/popup-blocked' ||
                          error.code === 'auth/popup-closed-by-user' ||
                          error.code === 'auth/cancelled-popup-request' ||
                          error.message?.includes('popup') ||
                          error.message?.includes('blocked') ||
                          error.message?.includes('Cross-Origin-Opener-Policy') ||
                          error.message?.includes('timeout');

    if (isPopupBlocked) {
      console.log('🔄 Popup blocked, closed, or timed out. Trying redirect method...');

      try {
        await signInWithRedirect(auth, googleProvider);
        return {
          pending: true,
          method: 'redirect',
          message: 'Popup was blocked. Redirecting to Google Sign-In...'
        };
      } catch (redirectError: any) {
        console.error('❌ Both popup and redirect failed:', redirectError);
        throw new Error('Google Sign-In failed. Please ensure popups are allowed or try refreshing the page.');
      }
    }

    // Handle network errors
    if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection and try again.');
    }

    if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many sign-in attempts. Please wait a moment and try again.');
    }

    // Generic error
    throw new Error(`Google Sign-In failed: ${error.message || 'Unknown error'}`);
  }
};

// Function to handle redirect result
export const handleRedirectResult = async () => {
  if (!auth) {
    throw new Error('Firebase not configured');
  }
  
  try {
    console.log('🔍 Checking for Google Sign-In redirect result...');
    const result = await getRedirectResult(auth);
    
    if (result) {
      console.log('✅ Google Sign-In redirect result found:', {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName
      });
      
      const user = result.user;
      const idToken = await user.getIdToken();
      
      console.log('🔑 Firebase ID token obtained, length:', idToken.length);
      
      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        },
        idToken
      };
    } else {
      console.log('ℹ️ No Google Sign-In redirect result found');
    }
    return null;
  } catch (error) {
    console.error('❌ Error handling redirect result:', error);
    throw error;
  }
};

// Sign out function
export const signOutFromGoogle = async () => {
  if (!auth) {
    throw new Error('Firebase not configured');
  }
  
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Email/Password Sign-Up function
export const signUpWithEmailAndPassword = async (email: string, password: string, displayName?: string) => {
  if (!auth) {
    throw new Error('Firebase not configured');
  }
  
  try {
    // Create user with email and password
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Send email verification with custom action URL and continue URL
    const actionCodeSettings = {
      url: `https://medmaster.site/auth/action?continueUrl=${encodeURIComponent('https://medmaster.site/login')}`,
      handleCodeInApp: true
    };
    await sendEmailVerification(user, actionCodeSettings);
    
    // Get the ID token
    const idToken = await user.getIdToken();
    
    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      },
      idToken,
      needsVerification: !user.emailVerified
    };
  } catch (error) {
    console.error('Error signing up with email and password:', error);
    throw error;
  }
};

// Email/Password Sign-In function
export const signInWithEmailAndPasswordFirebase = async (email: string, password: string) => {
  if (!auth) {
    throw new Error('Firebase not configured');
  }
  
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Check if email is verified
    if (!user.emailVerified) {
      // Sign out the user and throw an error
      await signOut(auth);
      throw new Error('EMAIL_NOT_VERIFIED');
    }
    
    // Get the ID token
    const idToken = await user.getIdToken();
    
    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      },
      idToken
    };
  } catch (error) {
    console.error('Error signing in with email and password:', error);
    throw error;
  }
};

// Resend verification email
export const resendVerificationEmail = async () => {
  if (!auth || !auth.currentUser) {
    throw new Error('No authenticated user');
  }
  
  try {
    // Send email verification with custom action URL and continue URL
    const actionCodeSettings = {
      url: `https://medmaster.site/auth/action?continueUrl=${encodeURIComponent('https://medmaster.site/login')}`,
      handleCodeInApp: true
    };
    await sendEmailVerification(auth.currentUser, actionCodeSettings);
  } catch (error) {
    console.error('Error resending verification email:', error);
    throw error;
  }
};

export { auth, googleProvider };