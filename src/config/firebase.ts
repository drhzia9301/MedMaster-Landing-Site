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

// Your Firebase config (get this from Firebase Console)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Initialize Firebase only if config is available
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let googleProvider: GoogleAuthProvider | undefined;

if (firebaseConfig.apiKey) {
  console.log('🔧 Initializing Firebase with config:', {
    apiKey: firebaseConfig.apiKey ? '***' : 'missing',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId
  });
  
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  
  // Configure the provider with proper redirect handling
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
  
  // Add localhost to authorized domains for development
  googleProvider.addScope('email');
  googleProvider.addScope('profile');
  
  console.log('✅ Firebase initialized successfully');
} else {
  console.error('❌ Firebase configuration missing! Check your .env file');
  console.log('Missing config:', {
    apiKey: !firebaseConfig.apiKey,
    authDomain: !firebaseConfig.authDomain,
    projectId: !firebaseConfig.projectId
  });
}

// Google Sign-In function - use popup with proper error handling
export const signInWithGoogle = async () => {
  if (!auth || !googleProvider) {
    throw new Error('Firebase not configured');
  }
  
  try {
    console.log('🔄 Attempting Google Sign-In with popup method...');
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
      idToken
    };
  } catch (error: any) {
    console.error('❌ Popup sign-in failed:', error);
    
    // If popup fails due to COOP or blocking, try redirect as fallback
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user' || 
        error.message?.includes('Cross-Origin-Opener-Policy')) {
      try {
        console.log('🔄 Popup blocked, trying redirect method...');
        await signInWithRedirect(auth, googleProvider);
        return { pending: true };
      } catch (redirectError: any) {
        console.error('❌ Both popup and redirect failed:', redirectError);
        throw new Error('Google Sign-In failed. Please ensure popups are allowed or try again.');
      }
    }
    
    throw error;
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
    
    // Send email verification
    await sendEmailVerification(user);
    
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
    await sendEmailVerification(auth.currentUser);
  } catch (error) {
    console.error('Error resending verification email:', error);
    throw error;
  }
};

export { auth, googleProvider };