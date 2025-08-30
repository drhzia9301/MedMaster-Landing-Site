import React from 'react';
import { API_ENDPOINTS } from '../config/api';

interface DebugInfoProps {
  show?: boolean;
}

export const DebugInfo: React.FC<DebugInfoProps> = ({ show = false }) => {
  // Only show in development mode
  if (!show || import.meta.env.MODE === 'production') return null;

  const debugInfo = {
    environment: import.meta.env.MODE,
    apiUrl: import.meta.env.VITE_API_URL,
    firebaseApiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '***SET***' : 'MISSING',
    firebaseAuthDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    currentDomain: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
    currentOrigin: typeof window !== 'undefined' ? window.location.origin : 'unknown',
    googleEndpoint: API_ENDPOINTS.auth.google,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '400px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <h4>🔍 Debug Info</h4>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  );
};

export default DebugInfo;
