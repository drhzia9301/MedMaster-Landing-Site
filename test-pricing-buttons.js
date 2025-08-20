/**
 * Test script to debug pricing page button issues
 * Run this in the browser console when on the pricing page
 */

console.log('🧪 Testing Pricing Page Buttons...');

function testPricingButtons() {
  console.log('📍 Current URL:', window.location.href);
  
  // Find all buttons on the page
  const allButtons = document.querySelectorAll('button');
  console.log('🔘 Total buttons found:', allButtons.length);
  
  // Find pricing buttons specifically
  const pricingButtons = Array.from(allButtons).filter(btn => {
    const text = btn.textContent.toLowerCase();
    return text.includes('upgrade') || 
           text.includes('choose') || 
           text.includes('start') || 
           text.includes('try') ||
           text.includes('current plan') ||
           text.includes('active plan');
  });
  
  console.log('💳 Pricing buttons found:', pricingButtons.length);
  
  pricingButtons.forEach((btn, index) => {
    console.log(`Button ${index + 1}:`, {
      text: btn.textContent.trim(),
      disabled: btn.disabled,
      className: btn.className,
      style: btn.style.cssText,
      onclick: !!btn.onclick,
      eventListeners: getEventListeners ? getEventListeners(btn) : 'N/A'
    });
    
    // Test if button is clickable
    const rect = btn.getBoundingClientRect();
    const isVisible = rect.width > 0 && rect.height > 0;
    const computedStyle = window.getComputedStyle(btn);
    const pointerEvents = computedStyle.pointerEvents;
    
    console.log(`Button ${index + 1} clickability:`, {
      visible: isVisible,
      pointerEvents: pointerEvents,
      zIndex: computedStyle.zIndex,
      position: computedStyle.position
    });
  });
  
  // Test clicking the first non-disabled button
  const clickableButton = pricingButtons.find(btn => !btn.disabled);
  if (clickableButton) {
    console.log('🖱️ Testing click on first clickable button...');
    try {
      clickableButton.click();
      console.log('✅ Button click successful');
    } catch (error) {
      console.log('❌ Button click failed:', error);
    }
  } else {
    console.log('⚠️ No clickable buttons found');
  }
}

// Test authentication state
function testAuthState() {
  console.log('🔐 Testing authentication state...');
  
  // Check localStorage for auth tokens
  const tokens = {
    medMasterToken: localStorage.getItem('medMasterToken'),
    medMasterEmail: localStorage.getItem('medMasterEmail'),
    medMasterUsername: localStorage.getItem('medMasterUsername'),
    landingPageToken: localStorage.getItem('landingPageToken')
  };
  
  console.log('🔑 Auth tokens:', Object.keys(tokens).reduce((acc, key) => {
    acc[key] = tokens[key] ? 'Present' : 'Missing';
    return acc;
  }, {}));
  
  // Check React context (if available)
  try {
    const reactFiber = document.querySelector('#root')?._reactInternalFiber ||
                      document.querySelector('#root')?._reactInternals;
    if (reactFiber) {
      console.log('⚛️ React context available');
    } else {
      console.log('⚠️ React context not accessible');
    }
  } catch (error) {
    console.log('❌ Error accessing React context:', error);
  }
}

// Run tests
testPricingButtons();
testAuthState();

// Export for manual use
window.testPricingButtons = testPricingButtons;
window.testAuthState = testAuthState;

console.log('💡 You can run tests manually:');
console.log('   window.testPricingButtons()');
console.log('   window.testAuthState()');