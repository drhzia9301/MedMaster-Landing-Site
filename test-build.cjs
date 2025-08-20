/**
 * Node.js Build and Configuration Tests for MedMaster Landing Page
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Starting MedMaster Landing Page Build Tests...\n');

// Test 1: Check if build files exist
function testBuildFiles() {
  console.log('📦 Testing Build Files...');
  
  const distPath = path.join(__dirname, 'dist');
  const requiredFiles = [
    'index.html',
    'assets'
  ];
  
  let passed = 0;
  
  if (!fs.existsSync(distPath)) {
    console.log('❌ dist/ directory not found. Run npm run build first.');
    return false;
  }
  
  requiredFiles.forEach(file => {
    const filePath = path.join(distPath, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} exists`);
      passed++;
    } else {
      console.log(`❌ ${file} missing`);
    }
  });
  
  // Check index.html content
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    if (indexContent.includes('<div id="root">')) {
      console.log('✅ index.html has root div');
      passed++;
    } else {
      console.log('❌ index.html missing root div');
    }
  }
  
  console.log(`📊 Build Files: ${passed}/${requiredFiles.length + 1} passed\n`);
  return passed === requiredFiles.length + 1;
}

// Test 2: Check configuration files
function testConfigFiles() {
  console.log('⚙️ Testing Configuration Files...');
  
  const configFiles = [
    { file: 'package.json', required: true },
    { file: 'vercel.json', required: true },
    { file: 'vite.config.ts', required: true },
    { file: '.env', required: false },
    { file: '.env.production', required: false }
  ];
  
  let passed = 0;
  
  configFiles.forEach(({ file, required }) => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} exists`);
      passed++;
      
      // Check specific content
      if (file === 'package.json') {
        const pkg = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (pkg.dependencies && pkg.dependencies['react-router-dom']) {
          console.log('✅ React Router dependency found');
        } else {
          console.log('❌ React Router dependency missing');
        }
      }
      
      if (file === 'vercel.json') {
        const vercelConfig = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (vercelConfig.rewrites) {
          console.log('✅ Vercel rewrites configured for SPA routing');
        } else {
          console.log('❌ Vercel rewrites missing');
        }
      }
    } else {
      if (required) {
        console.log(`❌ ${file} missing (required)`);
      } else {
        console.log(`⚠️ ${file} missing (optional)`);
        passed++; // Don't fail for optional files
      }
    }
  });
  
  console.log(`📊 Config Files: ${passed}/${configFiles.length} passed\n`);
  return passed === configFiles.length;
}

// Test 3: Check source files structure
function testSourceStructure() {
  console.log('📁 Testing Source Structure...');
  
  const requiredPaths = [
    'src/App.tsx',
    'src/components/AuthModal.tsx',
    'src/components/PricingPage.tsx',
    'src/components/LandingPage.tsx',
    'src/contexts/AuthContext.tsx',
    'src/config/api.ts',
    'src/config/firebase.ts'
  ];
  
  let passed = 0;
  
  requiredPaths.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${filePath} exists`);
      passed++;
      
      // Check for specific content
      if (filePath === 'src/App.tsx') {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('BrowserRouter') || content.includes('Router')) {
          console.log('✅ App.tsx has Router implementation');
        } else {
          console.log('❌ App.tsx missing Router implementation');
        }
      }
      
      if (filePath === 'src/components/AuthModal.tsx') {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('signInWithGoogle')) {
          console.log('✅ AuthModal has Google authentication');
        } else {
          console.log('❌ AuthModal missing Google authentication');
        }
      }
    } else {
      console.log(`❌ ${filePath} missing`);
    }
  });
  
  console.log(`📊 Source Structure: ${passed}/${requiredPaths.length} passed\n`);
  return passed === requiredPaths.length;
}

// Test 4: Check environment variables
function testEnvironmentConfig() {
  console.log('🌍 Testing Environment Configuration...');
  
  const envPath = path.join(__dirname, '.env');
  let passed = 0;
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = [
      'VITE_API_URL',
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID'
    ];
    
    requiredVars.forEach(varName => {
      if (envContent.includes(varName)) {
        console.log(`✅ ${varName} configured`);
        passed++;
      } else {
        console.log(`❌ ${varName} missing`);
      }
    });
    
    console.log(`📊 Environment Variables: ${passed}/${requiredVars.length} passed\n`);
    return passed === requiredVars.length;
  } else {
    console.log('⚠️ .env file not found\n');
    return false;
  }
}

// Test 5: Check TypeScript compilation
function testTypeScriptConfig() {
  console.log('📝 Testing TypeScript Configuration...');
  
  const tsconfigPath = path.join(__dirname, 'tsconfig.json');
  let passed = 0;
  
  if (fs.existsSync(tsconfigPath)) {
    console.log('✅ tsconfig.json exists');
    passed++;
    
    try {
      const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
      // Remove comments and parse JSON
      const cleanJson = tsconfigContent.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
      const tsconfig = JSON.parse(cleanJson);
      
      if (tsconfig.compilerOptions && tsconfig.compilerOptions.jsx) {
        console.log('✅ JSX configuration found');
        passed++;
      } else {
        console.log('❌ JSX configuration missing');
      }
    } catch (error) {
      console.log('⚠️ Could not parse tsconfig.json (may contain comments)');
      // Check for JSX in raw content
      const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
      if (tsconfigContent.includes('"jsx"') || tsconfigContent.includes('jsx')) {
        console.log('✅ JSX configuration found in raw content');
        passed++;
      } else {
        console.log('❌ JSX configuration missing');
      }
    }
  } else {
    console.log('❌ tsconfig.json missing');
  }
  
  console.log(`📊 TypeScript Config: ${passed}/2 passed\n`);
  return passed === 2;
}

// Run all tests
function runAllTests() {
  console.log('🚀 Running All Build Tests...\n');
  
  const results = {
    buildFiles: testBuildFiles(),
    configFiles: testConfigFiles(),
    sourceStructure: testSourceStructure(),
    environmentConfig: testEnvironmentConfig(),
    typeScriptConfig: testTypeScriptConfig()
  };
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log('📊 FINAL BUILD TEST RESULTS:');
  console.log(`✅ Tests Passed: ${passed}/${total}`);
  console.log('📋 Detailed Results:', results);
  
  if (passed === total) {
    console.log('🎉 All build tests passed! Project is properly configured.');
  } else {
    console.log('⚠️ Some build tests failed. Check the issues above.');
  }
  
  console.log('\n💡 Next Steps:');
  console.log('1. Run: npm run build (if not done already)');
  console.log('2. Run: npm run preview (to test locally)');
  console.log('3. Open browser and run the browser tests');
  console.log('4. Deploy with: vercel --prod');
  
  return results;
}

// Run tests
runAllTests();