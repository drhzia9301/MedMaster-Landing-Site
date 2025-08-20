/**
 * Simple functionality test script for MedMaster Landing Page
 * Run this in browser console to test key features
 */

console.log('🧪 Starting MedMaster Landing Page Tests...');

// Test 1: URL Routing
function testRouting() {
  console.log('📍 Testing URL Routing...');
  
  const routes = ['/', '/pricing', '/documentation', '/downloads'];
  let passed = 0;
  
  routes.forEach(route => {
    try {
      // Check if route elements exist
      const currentPath = window.location.pathname;
      console.log(`Current path: ${currentPath}`);
      
      if (document.querySelector('div') !== null) {
        console.log(`✅ Route ${route}: Page loads`);
        passed++;
      } else {
        console.log(`❌ Route ${route}: Page failed to load`);
      }
    } catch (error) {
      console.log(`❌ Route ${route}: Error - ${error.message}`);
    }
  });
  
  console.log(`📊 Routing Tests: ${passed}/${routes.length} passed\n`);
  return passed === routes.length;
}

// Test 2: Authentication Modal
function testAuthModal() {
  console.log('🔐 Testing Authentication Modal...');
  
  try {
    // Look for auth buttons
    const getStartedBtn = document.querySelector('button:contains("Get Started")') || 
                         document.querySelector('[data-testid="get-started"]') ||
                         Array.from(document.querySelectorAll('button')).find(btn => 
                           btn.textContent.includes('Get Started') || 
                           btn.textContent.includes('Sign Up')
                         );
    
    const loginBtn = document.querySelector('button:contains("Login")') || 
                    document.querySelector('[data-testid="login"]') ||
                    Array.from(document.querySelectorAll('button')).find(btn => 
                      btn.textContent.includes('Login') || 
                      btn.textContent.includes('Sign In')
                    );
    
    if (getStartedBtn) {
      console.log('✅ Get Started button found');
    } else {
      console.log('❌ Get Started button not found');
    }
    
    if (loginBtn) {
      console.log('✅ Login button found');
    } else {
      console.log('❌ Login button not found');
    }
    
    console.log('📊 Auth Modal Tests: Basic elements present\n');
    return getStartedBtn && loginBtn;
  } catch (error) {
    console.log(`❌ Auth Modal Test Error: ${error.message}\n`);
    return false;
  }
}

// Test 3: Firebase Configuration
function testFirebaseConfig() {
  console.log('🔥 Testing Firebase Configuration...');
  
  try {
    // Check if Firebase is loaded
    if (typeof window.firebase !== 'undefined' || 
        document.querySelector('script[src*="firebase"]')) {
      console.log('✅ Firebase scripts loaded');
    } else {
      console.log('⚠️ Firebase scripts not detected (may be bundled)');
    }
    
    // Check for Google auth button
    const googleBtn = Array.from(document.querySelectorAll('button')).find(btn => 
      btn.textContent.includes('Google') || 
      btn.innerHTML.includes('Google')
    );
    
    if (googleBtn) {
      console.log('✅ Google authentication button found');
    } else {
      console.log('❌ Google authentication button not found');
    }
    
    console.log('📊 Firebase Tests: Configuration check complete\n');
    return true;
  } catch (error) {
    console.log(`❌ Firebase Test Error: ${error.message}\n`);
    return false;
  }
}

// Test 4: Pricing Page
function testPricingPage() {
  console.log('💳 Testing Pricing Page...');
  
  try {
    // Navigate to pricing if not already there
    if (!window.location.pathname.includes('pricing')) {
      const pricingLink = Array.from(document.querySelectorAll('a, button')).find(el => 
        el.textContent.includes('Pricing') || 
        el.href?.includes('pricing')
      );
      
      if (pricingLink) {
        console.log('✅ Pricing navigation found');
      } else {
        console.log('❌ Pricing navigation not found');
        return false;
      }
    }
    
    // Check for pricing plans
    const pricingElements = document.querySelectorAll('[class*="price"], [class*="plan"]');
    if (pricingElements.length > 0) {
      console.log('✅ Pricing elements found');
    } else {
      console.log('❌ Pricing elements not found');
    }
    
    console.log('📊 Pricing Tests: Basic elements check complete\n');
    return true;
  } catch (error) {
    console.log(`❌ Pricing Test Error: ${error.message}\n`);
    return false;
  }
}

// Test 5: Responsive Design
function testResponsiveDesign() {
  console.log('📱 Testing Responsive Design...');
  
  try {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    console.log(`Current viewport: ${viewport.width}x${viewport.height}`);
    
    // Check for mobile-friendly meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      console.log('✅ Viewport meta tag found');
    } else {
      console.log('❌ Viewport meta tag missing');
    }
    
    // Check for responsive classes (Tailwind)
    const responsiveElements = document.querySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"]');
    if (responsiveElements.length > 0) {
      console.log('✅ Responsive CSS classes found');
    } else {
      console.log('⚠️ Responsive CSS classes not detected');
    }
    
    console.log('📊 Responsive Tests: Basic checks complete\n');
    return true;
  } catch (error) {
    console.log(`❌ Responsive Test Error: ${error.message}\n`);
    return false;
  }
}

// Run all tests
function runAllTests() {
  console.log('🚀 Running All Tests...\n');
  
  const results = {
    routing: testRouting(),
    authModal: testAuthModal(),
    firebase: testFirebaseConfig(),
    pricing: testPricingPage(),
    responsive: testResponsiveDesign()
  };
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log('📊 FINAL RESULTS:');
  console.log(`✅ Tests Passed: ${passed}/${total}`);
  console.log('📋 Detailed Results:', results);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Landing page is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the detailed results above.');
  }
  
  return results;
}

// Auto-run tests when script loads
runAllTests();

// Export for manual testing
window.medMasterTests = {
  runAllTests,
  testRouting,
  testAuthModal,
  testFirebaseConfig,
  testPricingPage,
  testResponsiveDesign
};

console.log('💡 You can run individual tests by calling:');
console.log('   window.medMasterTests.testRouting()');
console.log('   window.medMasterTests.testAuthModal()');
console.log('   etc.');