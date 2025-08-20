/**
 * Improved functionality tests with better selectors
 */

console.log('🧪 Running Improved MedMaster Tests...');

// Test Auth Modal with better selectors
function testAuthModalImproved() {
  console.log('🔐 Testing Authentication Modal (Improved)...');
  
  // Look for common button text patterns
  const allButtons = Array.from(document.querySelectorAll('button'));
  console.log(`Found ${allButtons.length} buttons total`);
  
  // Check for auth-related buttons
  const authButtons = allButtons.filter(btn => {
    const text = btn.textContent.toLowerCase();
    return text.includes('get started') || 
           text.includes('sign up') || 
           text.includes('sign in') || 
           text.includes('login') ||
           text.includes('start learning');
  });
  
  console.log(`✅ Found ${authButtons.length} auth-related buttons:`);
  authButtons.forEach(btn => console.log(`  - "${btn.textContent.trim()}"`));
  
  // Check for Google auth button
  const googleButtons = allButtons.filter(btn => {
    const text = btn.textContent.toLowerCase();
    const html = btn.innerHTML.toLowerCase();
    return text.includes('google') || html.includes('google');
  });
  
  if (googleButtons.length > 0) {
    console.log(`✅ Found ${googleButtons.length} Google auth buttons`);
  } else {
    console.log('⚠️ No Google auth buttons found (may appear after clicking auth button)');
  }
  
  return authButtons.length > 0;
}

// Test pricing page elements
function testPricingImproved() {
  console.log('💳 Testing Pricing Page (Improved)...');
  
  // Check current page
  const currentPath = window.location.pathname;
  console.log(`Current path: ${currentPath}`);
  
  // Look for pricing-related elements
  const pricingElements = document.querySelectorAll('*');
  let pricingFound = 0;
  
  // Check for price indicators
  const pricePatterns = ['₨', '$', 'price', 'plan', 'month', 'popular', 'starter', 'premium'];
  
  Array.from(pricingElements).forEach(el => {
    const text = el.textContent.toLowerCase();
    pricePatterns.forEach(pattern => {
      if (text.includes(pattern)) {
        pricingFound++;
      }
    });
  });
  
  console.log(`✅ Found ${pricingFound} pricing-related elements`);
  
  // Look for specific pricing plans
  const planElements = Array.from(document.querySelectorAll('*')).filter(el => {
    const text = el.textContent.toLowerCase();
    return text.includes('starter') || text.includes('premium') || text.includes('popular');
  });
  
  console.log(`✅ Found ${planElements.length} plan elements`);
  
  return pricingFound > 0 || planElements.length > 0;
}

// Test form functionality
function testFormFunctionality() {
  console.log('📝 Testing Form Functionality...');
  
  const forms = document.querySelectorAll('form');
  const inputs = document.querySelectorAll('input');
  
  console.log(`✅ Found ${forms.length} forms`);
  console.log(`✅ Found ${inputs.length} input fields`);
  
  // Check input types
  const inputTypes = Array.from(inputs).map(input => input.type);
  const uniqueTypes = [...new Set(inputTypes)];
  console.log(`✅ Input types found: ${uniqueTypes.join(', ')}`);
  
  return forms.length > 0 || inputs.length > 0;
}

// Test navigation
function testNavigation() {
  console.log('🧭 Testing Navigation...');
  
  const links = document.querySelectorAll('a, button[onclick], [role="button"]');
  console.log(`✅ Found ${links.length} clickable elements`);
  
  // Check for navigation items
  const navItems = Array.from(links).filter(link => {
    const text = link.textContent.toLowerCase();
    return text.includes('pricing') || 
           text.includes('documentation') || 
           text.includes('download') ||
           text.includes('home');
  });
  
  console.log(`✅ Found ${navItems.length} navigation items:`);
  navItems.forEach(item => console.log(`  - "${item.textContent.trim()}"`));
  
  return navItems.length > 0;
}

// Test API connectivity
async function testAPIConnectivity() {
  console.log('🔌 Testing API Connectivity...');
  
  const apiUrl = 'http://localhost:3002';
  
  try {
    const response = await fetch(`${apiUrl}/health`);
    console.log(`✅ Server responding with status: ${response.status}`);
    return true;
  } catch (error) {
    console.log(`❌ Server connection failed: ${error.message}`);
    return false;
  }
}

// Run all improved tests
async function runImprovedTests() {
  console.log('🚀 Running All Improved Tests...\n');
  
  const results = {
    authModal: testAuthModalImproved(),
    pricing: testPricingImproved(),
    forms: testFormFunctionality(),
    navigation: testNavigation(),
    apiConnectivity: await testAPIConnectivity()
  };
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log('\n📊 IMPROVED TEST RESULTS:');
  console.log(`✅ Tests Passed: ${passed}/${total}`);
  console.log('📋 Detailed Results:', results);
  
  if (passed === total) {
    console.log('🎉 All improved tests passed!');
  } else {
    console.log('⚠️ Some tests need attention.');
  }
  
  return results;
}

// Manual test instructions
function showManualTests() {
  console.log('\n📋 MANUAL TESTS TO PERFORM:');
  console.log('1. Click any "Get Started" or "Sign Up" button');
  console.log('2. Check if modal opens');
  console.log('3. Try filling the form');
  console.log('4. Look for Google sign-in button in modal');
  console.log('5. Navigate to /pricing and check plans');
  console.log('6. Test form validation with invalid data');
}

// Run tests
runImprovedTests().then(() => {
  showManualTests();
});

// Export for manual use
window.improvedTests = {
  runImprovedTests,
  testAuthModalImproved,
  testPricingImproved,
  testFormFunctionality,
  testNavigation,
  testAPIConnectivity
};