/**
 * Debug script to test deployment environment and API connectivity
 * Run this in browser console on medmaster.site to diagnose issues
 */

// Environment check
console.log('🔍 Environment Debug Information:');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('MODE:', import.meta.env.MODE);
console.log('PROD:', import.meta.env.PROD);
console.log('DEV:', import.meta.env.DEV);
console.log('Current URL:', window.location.href);
console.log('Current Origin:', window.location.origin);

// API connectivity test
export async function testApiConnectivity() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3003';
  
  console.log('🌐 Testing API connectivity to:', apiUrl);
  
  try {
    // Test health endpoint
    const healthResponse = await fetch(`${apiUrl}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    console.log('✅ Health check response status:', healthResponse.status);
    console.log('✅ Health check response headers:', Object.fromEntries(healthResponse.headers.entries()));
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check data:', healthData);
    } else {
      console.error('❌ Health check failed:', healthResponse.statusText);
    }
    
  } catch (error) {
    console.error('❌ API connectivity test failed:', error);
    console.error('❌ Error details:', {
      name: (error as Error).name,
      message: (error as Error).message,
      stack: (error as Error).stack
    });
  }
}

// CORS test
export async function testCorsHeaders() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3003';
  
  console.log('🔒 Testing CORS headers for:', apiUrl);
  
  try {
    const response = await fetch(`${apiUrl}/api/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    
    console.log('🔒 CORS preflight status:', response.status);
    console.log('🔒 CORS headers:', Object.fromEntries(response.headers.entries()));
    
  } catch (error) {
    console.error('❌ CORS test failed:', error);
  }
}

// Firebase configuration test
export function testFirebaseConfig() {
  console.log('🔥 Firebase Configuration:');
  console.log('VITE_FIREBASE_API_KEY:', import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('VITE_FIREBASE_AUTH_DOMAIN:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
  console.log('VITE_FIREBASE_PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
}

// Run all tests
export async function runAllTests() {
  console.log('🚀 Starting deployment diagnostics...');
  
  testFirebaseConfig();
  await testApiConnectivity();
  await testCorsHeaders();
  
  console.log('✅ Deployment diagnostics complete!');
}

// Auto-run in development
if (import.meta.env.DEV) {
  console.log('🔧 Development mode detected, running diagnostics...');
  runAllTests();
}

// Make functions available globally for manual testing
if (typeof window !== 'undefined') {
  (window as any).debugDeployment = {
    testApiConnectivity,
    testCorsHeaders,
    testFirebaseConfig,
    runAllTests
  };
  
  console.log('🛠️ Debug functions available at window.debugDeployment');
}