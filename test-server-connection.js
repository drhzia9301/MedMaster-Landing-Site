/**
 * Test server connection from browser console
 * Run this in browser console to test API connectivity
 */

console.log('🔌 Testing Server Connection...');

// Test API endpoints
async function testServerConnection() {
  const API_BASE = 'http://localhost:3002'; // Adjust port if different
  
  const endpoints = [
    { name: 'Health Check', url: `${API_BASE}/health` },
    { name: 'Auth Login', url: `${API_BASE}/api/auth/login`, method: 'POST' },
    { name: 'Auth Register', url: `${API_BASE}/api/auth/register`, method: 'POST' }
  ];
  
  console.log('Testing endpoints...\n');
  
  for (const endpoint of endpoints) {
    try {
      const options = {
        method: endpoint.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      };
      
      // For POST requests, add empty body to test if endpoint exists
      if (endpoint.method === 'POST') {
        options.body = JSON.stringify({});
      }
      
      const response = await fetch(endpoint.url, options);
      
      if (response.ok || response.status === 400 || response.status === 422) {
        // 400/422 means endpoint exists but needs proper data
        console.log(`✅ ${endpoint.name}: Server responding (${response.status})`);
      } else {
        console.log(`⚠️ ${endpoint.name}: Unexpected status (${response.status})`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: Connection failed - ${error.message}`);
    }
  }
  
  console.log('\n🔌 Server connection test complete!');
}

// Test CORS
async function testCORS() {
  console.log('🌐 Testing CORS configuration...');
  
  try {
    const response = await fetch('http://localhost:3002/health', {
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:3001'
      }
    });
    
    console.log('✅ CORS: No CORS errors detected');
  } catch (error) {
    if (error.message.includes('CORS')) {
      console.log('❌ CORS: CORS policy blocking requests');
      console.log('💡 Fix: Ensure server allows origin http://localhost:3001');
    } else {
      console.log(`⚠️ CORS: Other error - ${error.message}`);
    }
  }
}

// Run tests
testServerConnection();
testCORS();

// Export for manual use
window.serverTests = {
  testServerConnection,
  testCORS
};